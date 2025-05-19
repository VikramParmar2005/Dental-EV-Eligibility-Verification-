// Reports Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set default dates (current month)
    setDefaultDates();
    
    // Attach event listeners
    attachEventListeners();
    
    // Initialize charts library placeholder (would use actual chart library in production)
    initializePlaceholderCharts();
    
    // Sample data for demonstration
    const sampleData = {
        financial: generateFinancialData(),
        'insurance-verification': generateVerificationData(),
        'denial-analysis': generateDenialData()
    };
    
    // Store current state
    const state = {
        currentReportType: null,
        currentPage: 1,
        itemsPerPage: 5,
        filteredData: [],
        rawData: sampleData
    };
    
    // Handle report type selection
    document.querySelectorAll('.view-report-btn').forEach(button => {
        button.addEventListener('click', function() {
            const reportType = this.getAttribute('data-type');
            displayReport(reportType, state);
        });
    });
    
    // Generate Report button handler
    document.getElementById('generate-report').addEventListener('click', function() {
        if (state.currentReportType) {
            // Simulate loading
            showLoading();
            
            // Regenerate the report after "loading" data
            setTimeout(() => {
                const freshData = regenerateData(state.currentReportType);
                state.rawData[state.currentReportType] = freshData;
                applyFilters(state);
                updateChart(state.currentReportType, state.filteredData);
                hideLoading();
                showToast('Report generated successfully!');
            }, 800);
        } else {
            showToast('Please select a report type first', 'error');
        }
    });
    
    // Export buttons handlers
    document.getElementById('export-pdf').addEventListener('click', function() {
        if (state.currentReportType) {
            simulateExport('PDF');
        } else {
            showToast('Please select a report type first', 'error');
        }
    });
    
    document.getElementById('export-csv').addEventListener('click', function() {
        if (state.currentReportType) {
            simulateExport('CSV');
        } else {
            showToast('Please select a report type first', 'error');
        }
    });
    
    document.getElementById('export-excel').addEventListener('click', function() {
        if (state.currentReportType) {
            simulateExport('Excel');
        } else {
            showToast('Please select a report type first', 'error');
        }
    });
    
    // Filter handlers
    document.getElementById('provider-filter').addEventListener('change', function() {
        applyFilters(state);
        updateChart(state.currentReportType, state.filteredData);
    });
    
    document.getElementById('status-filter').addEventListener('change', function() {
        applyFilters(state);
        updateChart(state.currentReportType, state.filteredData);
    });
    
    // Pagination handlers
    document.getElementById('prev-page').addEventListener('click', function() {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderTableData(state);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        const maxPages = Math.ceil(state.filteredData.length / state.itemsPerPage);
        if (state.currentPage < maxPages) {
            state.currentPage++;
            renderTableData(state);
        }
    });
    
    // Add click handler for table action buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-eye') || e.target.parentElement.classList.contains('btn-icon')) {
            const row = e.target.closest('tr');
            if (row) {
                const patientId = row.cells[0].textContent;
                const patientName = row.cells[1].textContent;
                showDetailModal(patientId, patientName, state);
            }
        }
    });
    
    // Close modal when clicking close button or outside the modal
    window.onclick = function(event) {
        const modal = document.getElementById('detail-modal');
        if (modal && (event.target === modal || event.target.classList.contains('close-modal'))) {
            modal.style.display = 'none';
        }
    };
    
    // Logout button handler
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        showToast('Logging out...', 'info');
        setTimeout(() => {
            showToast('You have been logged out successfully');
        }, 1000);
    });
});

// Set default date range to current month
function setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');
    
    startInput.value = formatDate(firstDay);
    endInput.value = formatDate(lastDay);
}

// Format date as YYYY-MM-DD for input fields
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Attach event listeners for various interactions
function attachEventListeners() {
    // Add date change handlers
    document.getElementById('start-date').addEventListener('change', function() {
        const startDate = new Date(this.value);
        const endDate = new Date(document.getElementById('end-date').value);
        
        if (startDate > endDate) {
            showToast('Start date cannot be after end date', 'error');
            this.value = formatDate(new Date(endDate));
        }
    });
    
    document.getElementById('end-date').addEventListener('change', function() {
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(this.value);
        
        if (endDate < startDate) {
            showToast('End date cannot be before start date', 'error');
            this.value = formatDate(new Date(startDate));
        }
    });
    
    // Create modal if it doesn't exist
    if (!document.getElementById('detail-modal')) {
        createDetailModal();
    }
    
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
        createToastContainer();
    }
}

// Display the selected report
function displayReport(reportType, state) {
    // Update state
    state.currentReportType = reportType;
    state.currentPage = 1;
    
    // Show the report content section
    const reportContent = document.getElementById('report-content');
    reportContent.classList.remove('hidden');
    
    // Update report title
    const reportTitle = document.getElementById('selected-report-title');
    if (reportType === 'financial') {
        reportTitle.textContent = 'Financial Reports';
    } else if (reportType === 'insurance-verification') {
        reportTitle.textContent = 'Insurance Verification Reports';
    } else if (reportType === 'denial-analysis') {
        reportTitle.textContent = 'Denial Analysis Reports';
    }
    
    // Reset filters
    document.getElementById('provider-filter').value = '';
    document.getElementById('status-filter').value = '';
    
    // Apply filters and render data
    applyFilters(state);
    
    // Update chart
    updateChart(reportType, state.filteredData);
    
    // Highlight the selected report card
    document.querySelectorAll('.report-card').forEach(card => {
        if (card.getAttribute('data-report-type') === reportType) {
            card.classList.add('selected-report');
        } else {
            card.classList.remove('selected-report');
        }
    });
    
    // Scroll to the report content
    reportContent.scrollIntoView({behavior: 'smooth'});
}

// Apply filters to the data
function applyFilters(state) {
    const providerFilter = document.getElementById('provider-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let filteredData = state.rawData[state.currentReportType];
    
    if (providerFilter) {
        filteredData = filteredData.filter(item => {
            return item.provider.toLowerCase().includes(providerFilter.toLowerCase());
        });
    }
    
    if (statusFilter) {
        filteredData = filteredData.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    state.filteredData = filteredData;
    
    // Update stats
    updateStats(filteredData);
    
    // Render the table data
    renderTableData(state);
}

// Render table data with pagination
function renderTableData(state) {
    const tableBody = document.getElementById('report-data');
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedData = state.filteredData.slice(startIndex, endIndex);
    
    // Render rows
    if (paginatedData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="no-results">No results found. Try adjusting your filters.</td>`;
        tableBody.appendChild(row);
    } else {
        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.patientId}</td>
                <td>${item.patientName}</td>
                <td>${item.provider}</td>
                <td>${item.procedureCode}</td>
                <td class="status-cell status-${item.status.toLowerCase()}">${capitalizeFirstLetter(item.status)}</td>
                <td>$${item.amount.toFixed(2)}</td>
                <td>${item.date}</td>
                <td><button class="btn-icon"><i class="fas fa-eye action-icon"></i></button></td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Update pagination indicator
    const maxPages = Math.ceil(state.filteredData.length / state.itemsPerPage);
    document.getElementById('page-indicator').textContent = `Page ${state.currentPage} of ${maxPages || 1}`;
    
    // Update pagination button states
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage >= maxPages;
    
    prevBtn.classList.toggle('disabled', state.currentPage === 1);
    nextBtn.classList.toggle('disabled', state.currentPage >= maxPages);
}

// Update stats based on filtered data
function updateStats(data) {
    const totalClaims = data.length;
    const approvedClaims = data.filter(item => item.status.toLowerCase() === 'approved').length;
    const approvalRate = totalClaims > 0 ? (approvedClaims / totalClaims * 100).toFixed(1) : 0;
    
    // Calculate average processing time
    const avgDays = data.reduce((sum, item) => sum + item.processingDays, 0) / (totalClaims || 1);
    
    // Apply animations to the changing values
    animateValue('total-claims', document.getElementById('total-claims').textContent, totalClaims, 800);
    animateValue('approval-rate', parseFloat(document.getElementById('approval-rate').textContent), approvalRate, 800, '%');
    animateValue('avg-processing', parseFloat(document.getElementById('avg-processing').textContent), avgDays.toFixed(1), 800, ' days');
}

// Animate value changes for statistics
function animateValue(id, start, end, duration, suffix = '') {
    const obj = document.getElementById(id);
    start = parseFloat(start) || 0;
    end = parseFloat(end);
    
    if (start === end) return;
    
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(function() {
        current += increment;
        obj.textContent = current.toFixed(1) + suffix;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            clearInterval(timer);
            obj.textContent = end.toFixed(1) + suffix;
        }
    }, stepTime);
}

// Show loading state
function showLoading() {
    const btn = document.getElementById('generate-report');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Add loading overlay to chart
    const chartContainer = document.getElementById('report-chart');
    chartContainer.classList.add('chart-loading');
}

// Hide loading state
function hideLoading() {
    const btn = document.getElementById('generate-report');
    btn.innerHTML = '<i class="fas fa-file-alt"></i> Generate Report';
    btn.classList.remove('loading');
    btn.disabled = false;
    
    // Remove loading overlay from chart
    const chartContainer = document.getElementById('report-chart');
    chartContainer.classList.remove('chart-loading');
}

// Simulate export functionality
function simulateExport(format) {
    showToast(`Preparing ${format} export...`, 'info');
    
    setTimeout(() => {
        showToast(`${format} export completed successfully!`);
        
        // Create a fake download
        const link = document.createElement('a');
        link.href = 'javascript:void(0);';
        link.download = `smile_guard_report_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
        link.click();
    }, 1500);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Generate sample financial data
function generateFinancialData() {
    const providers = ['Delta Dental', 'Cigna', 'Aetna', 'MetLife'];
    const procedures = ['D2750', 'D2950', 'D1110', 'D2740', 'D2160', 'D2391'];
    const statuses = ['approved', 'pending', 'denied'];
    const statusWeights = [0.65, 0.25, 0.1]; // More approvals than denials for realistic data
    
    return Array.from({length: 25}, (_, i) => {
        const statusIndex = weightedRandomIndex(statusWeights);
        const status = statuses[statusIndex];
        const provider = providers[Math.floor(Math.random() * providers.length)];
        return {
            patientId: `PT-${1000 + i}`,
            patientName: generateRandomName(),
            provider: provider,
            procedureCode: procedures[Math.floor(Math.random() * procedures.length)],
            status: status,
            amount: Math.floor(Math.random() * 800) + 100,
            date: generateRandomDate(),
            processingDays: Math.floor(Math.random() * 10) + 1,
            details: {
                insuredId: `INS-${Math.floor(Math.random() * 9000) + 1000}`,
                policyNumber: `POL-${Math.floor(Math.random() * 900000) + 100000}`,
                submissionDate: generateRandomDate(new Date(2025, 0, 1), new Date(2025, 2, 1)),
                notes: getRandomNote(status)
            }
        };
    });
}

// Generate sample verification data
function generateVerificationData() {
    const providers = ['Delta Dental', 'Cigna', 'Aetna', 'MetLife'];
    const statuses = ['verified', 'pending', 'expired', 'issues'];
    const statusWeights = [0.6, 0.2, 0.1, 0.1];
    
    return Array.from({length: 25}, (_, i) => {
        const statusIndex = weightedRandomIndex(statusWeights);
        const status = statuses[statusIndex];
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const verificationStatus = status === 'verified' ? 'approved' : (status === 'issues' ? 'denied' : 'pending');
        
        return {
            patientId: `PT-${2000 + i}`,
            patientName: generateRandomName(),
            provider: provider,
            procedureCode: 'N/A',
            status: verificationStatus,
            amount: 0,
            date: generateRandomDate(),
            processingDays: Math.floor(Math.random() * 5) + 1,
            details: {
                verificationDate: generateRandomDate(new Date(2025, 0, 1), new Date(2025, 2, 1)),
                coverageStart: generateRandomDate(new Date(2024, 0, 1), new Date(2024, 6, 1)),
                coverageEnd: generateRandomDate(new Date(2025, 6, 1), new Date(2025, 11, 31)),
                verificationMethod: ['Electronic', 'Phone', 'Portal'][Math.floor(Math.random() * 3)],
                notes: getRandomVerificationNote(verificationStatus)
            }
        };
    });
}

// Generate sample denial data
function generateDenialData() {
    const providers = ['Delta Dental', 'Cigna', 'Aetna', 'MetLife'];
    const procedures = ['D2750', 'D2950', 'D1110', 'D2740', 'D2160', 'D2391'];
    const denialReasons = [
        'Service not covered',
        'Missing information',
        'Pre-authorization required',
        'Coverage expired',
        'Duplicate claim'
    ];
    
    return Array.from({length: 25}, (_, i) => {
        const reason = denialReasons[Math.floor(Math.random() * denialReasons.length)];
        return {
            patientId: `PT-${3000 + i}`,
            patientName: generateRandomName(),
            provider: providers[Math.floor(Math.random() * providers.length)],
            procedureCode: procedures[Math.floor(Math.random() * procedures.length)],
            status: 'denied',
            amount: Math.floor(Math.random() * 1000) + 200,
            date: generateRandomDate(),
            processingDays: Math.floor(Math.random() * 14) + 3,
            denialReason: reason,
            details: {
                denialCode: `DN-${Math.floor(Math.random() * 900) + 100}`,
                submissionDate: generateRandomDate(new Date(2025, 0, 1), new Date(2025, 2, 1)),
                denialDate: generateRandomDate(new Date(2025, 2, 1), new Date(2025, 3, 14)),
                appealStatus: ['Not appealed', 'Appeal pending', 'Appeal submitted'][Math.floor(Math.random() * 3)],
                notes: `Denial reason: ${reason}. ${Math.random() > 0.5 ? 'Contact insurance provider for clarification.' : 'Review claim documentation.'}`
            }
        };
    });
}

// Regenerate data for a specific report type
function regenerateData(reportType) {
    switch(reportType) {
        case 'financial':
            return generateFinancialData();
        case 'insurance-verification':
            return generateVerificationData();
        case 'denial-analysis':
            return generateDenialData();
        default:
            return [];
    }
}

// Generate a random name
function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'Thomas', 'Rebecca', 
                        'Maria', 'Carlos', 'Emma', 'James', 'Sophia', 'William', 'Olivia', 'Daniel', 'Isabella'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                      'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Moore'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
}

// Generate a random date in MM/DD/YYYY format
function generateRandomDate(start = new Date(2025, 0, 1), end = new Date(2025, 3, 14)) {
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');
    const year = randomDate.getFullYear();
    
    return `${month}/${day}/${year}`;
}

// Helper for weighted random selection
function weightedRandomIndex(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    const r = Math.random() * sum;
    let total = 0;
    
    for (let i = 0; i < weights.length; i++) {
        total += weights[i];
        if (r <= total) return i;
    }
    
    return weights.length - 1;
}

// Initialize placeholder charts
function initializePlaceholderCharts() {
    // In a real implementation, this would initialize Chart.js or another charting library
    // For now we just create a placeholder
}

// Update chart for report visualizations
function updateChart(reportType, data) {
    const chartContainer = document.getElementById('report-chart');
    chartContainer.innerHTML = '';
    
    // In a real implementation, this would use a charting library like Chart.js
    // For now, we'll create a simple visual representation
    
    if (reportType === 'financial') {
        const approvedCount = data.filter(item => item.status === 'approved').length;
        const pendingCount = data.filter(item => item.status === 'pending').length;
        const deniedCount = data.filter(item => item.status === 'denied').length;
        
        createSimpleBarChart(chartContainer, [
            { label: 'Approved', value: approvedCount, color: '#4ad991' },
            { label: 'Pending', value: pendingCount, color: '#f9cf58' },
            { label: 'Denied', value: deniedCount, color: '#f87171' }
        ], 'Claims by Status');
        
    } else if (reportType === 'insurance-verification') {
        const providers = [...new Set(data.map(item => item.provider))];
        const dataByProvider = providers.map(provider => {
            const items = data.filter(item => item.provider === provider);
            return {
                label: provider, 
                value: items.length, 
                color: getProviderColor(provider)
            };
        });
        
        createSimpleBarChart(chartContainer, dataByProvider, 'Verifications by Provider');
        
    } else if (reportType === 'denial-analysis') {
        // Group by denial reason
        const denialReasons = {};
        data.forEach(item => {
            if (!denialReasons[item.denialReason]) {
                denialReasons[item.denialReason] = 0;
            }
            denialReasons[item.denialReason]++;
        });
        
        const chartData = Object.entries(denialReasons).map(([reason, count], index) => {
            return { 
                label: reason, 
                value: count, 
                color: getColorByIndex(index)
            };
        });
        
        createSimpleBarChart(chartContainer, chartData, 'Claims by Denial Reason');
    }
}

// Create a simple bar chart visualization
function createSimpleBarChart(container, data, title) {
    container.style.padding = '20px';
    container.style.backgroundColor = '#f7f9fc';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    
    // Create chart title
    const chartTitle = document.createElement('h3');
    chartTitle.textContent = title;
    chartTitle.style.textAlign = 'center';
    chartTitle.style.marginBottom = '20px';
    chartTitle.style.color = '#333';
    container.appendChild(chartTitle);
    
    // Create chart container
    const chartArea = document.createElement('div');
    chartArea.style.display = 'flex';
    chartArea.style.alignItems = 'flex-end';
    chartArea.style.justifyContent = 'space-around';
    chartArea.style.height = '280px';
    chartArea.style.borderBottom = '2px solid #ddd';
    chartArea.style.padding = '0 10px';
    container.appendChild(chartArea);
    
    // Find max value for scaling
    const maxValue = Math.max(...data.map(item => item.value));
    
    // Create bars
    data.forEach(item => {
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.style.width = `${100 / data.length}%`;
        
        const heightPercentage = item.value / maxValue * 100;
        
        const bar = document.createElement('div');
        bar.style.width = '70%';
        bar.style.height = `${heightPercentage}%`;
        bar.style.backgroundColor = item.color;
        bar.style.borderTopLeftRadius = '4px';
        bar.style.borderTopRightRadius = '4px';
        bar.style.transition = 'all 0.5s ease';
        
        const value = document.createElement('div');
        value.textContent = item.value;
        value.style.padding = '5px 0';
        value.style.fontWeight = 'bold';
        
        const label = document.createElement('div');
        label.textContent = item.label;
        label.style.textAlign = 'center';
        label.style.fontSize = '12px';
        label.style.padding = '10px 5px';
        label.style.wordBreak = 'break-word';
        
        barContainer.appendChild(value);
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartArea.appendChild(barContainer);
    });
    
    // Add legend
    const legend = document.createElement('div');
    legend.style.display = 'flex';
    legend.style.justifyContent = 'center';
    legend.style.flexWrap = 'wrap';
    legend.style.gap = '10px';
    legend.style.marginTop = '15px';
    
    data.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '5px';
        legendItem.style.fontSize = '12px';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '12px';
        colorBox.style.height = '12px';
        colorBox.style.backgroundColor = item.color;
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelSpan);
        legend.appendChild(legendItem);
    });
    
    container.appendChild(legend);
}

// Get color based on provider name
function getProviderColor(provider) {
    const colorMap = {
        'Delta Dental': '#3b82f6',
        'Cigna': '#8b5cf6',
        'Aetna': '#ec4899',
        'MetLife': '#f97316'
    };
    
    return colorMap[provider] || '#6b7280';
}

// Show detail modal for a patient
function showDetailModal(patientId, patientName, state) {
    // Find patient data
    const patientData = state.filteredData.find(item => item.patientId === patientId);
    
    if (!patientData) return;
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('modal-content');
    
    // Update modal title
    document.getElementById('modal-title').textContent = `Patient Details: ${patientName}`;
    
    // Clear previous content
    const detailsContainer = document.getElementById('patient-details');
    detailsContainer.innerHTML = '';
    
    // Create details table
    const table = document.createElement('table');
    table.className = 'details-table';
    
    // Add base details
    const baseDetails = [
        { label: 'Patient ID', value: patientData.patientId },
        { label: 'Insurance Provider', value: patientData.provider },
        { label: 'Procedure Code', value: patientData.procedureCode },
        { label: 'Status', value: capitalizeFirstLetter(patientData.status) },
        { label: 'Amount', value: `$${patientData.amount.toFixed(2)}` },
        { label: 'Date', value: patientData.date },
        { label: 'Processing Days', value: patientData.processingDays }
    ];
    
    // Add type-specific details
    if (patientData.denialReason) {
        baseDetails.push({ label: 'Denial Reason', value: patientData.denialReason });
    }
    
    // Add rows to table
    baseDetails.forEach(detail => {
        const row = document.createElement('tr');
        
        const labelCell = document.createElement('th');
        labelCell.textContent = detail.label;
        
        const valueCell = document.createElement('td');
        valueCell.textContent = detail.value;
        
        if (detail.label === 'Status') {
            valueCell.classList.add(`status-${patientData.status.toLowerCase()}`);
            valueCell.style.fontWeight = 'bold';
        }
        
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        table.appendChild(row);
    });
    
    detailsContainer.appendChild(table);
    
    // Add additional details section if available
    if (patientData.details) {
        const additionalTitle = document.createElement('h4');
        additionalTitle.textContent = 'Additional Details';
        additionalTitle.className = 'modal-subtitle';
        detailsContainer.appendChild(additionalTitle);
        
        const additionalTable = document.createElement('table');
        additionalTable.className = 'details-table';
        
        // Add all details from the details object
        Object.entries(patientData.details).forEach(([key, value]) => {
            const row = document.createElement('tr');
            
            const labelCell = document.createElement('th');
            labelCell.textContent = formatDetailLabel(key);
            
            const valueCell = document.createElement('td');
            valueCell.textContent = value;
            
            row.appendChild(labelCell);
            row.appendChild(valueCell);
            additionalTable.appendChild(row);
        });
        
        detailsContainer.appendChild(additionalTable);
    }
    
    // Add actions section
    const actionsSection = document.createElement('div');
    actionsSection.className = 'modal-actions';
    
    const actionButtons = [
        { text: 'Print Details', icon: 'print', class: 'btn-primary' },
        { text: 'Contact Provider', icon: 'phone', class: 'btn-secondary' },
        { text: 'Update Status', icon: 'edit', class: 'btn-accent' }
    ];
    
    actionButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = `btn ${button.class}`;
        btn.innerHTML = `<i class="fas fa-${button.icon}"></i> ${button.text}`;
        
        btn.addEventListener('click', function() {
            showToast(`"${button.text}" action simulated for patient ${patientId}`);
            modal.style.display = 'none';
        });
        
        actionsSection.appendChild(btn);
    });
    
    detailsContainer.appendChild(actionsSection);
    
    // Show the modal
    modal.style.display = 'block';
}

// Format detail label from camelCase or kebab-case to Title Case
function formatDetailLabel(key) {
    // Replace dashes with spaces
    key = key.replace(/-/g, ' ');
    
    // Split by capital letters and join with spaces
    key = key.replace(/([A-Z])/g, ' $1').trim();
    
    // Capitalize first letter of each word
    return key.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Create the details modal structure
function createDetailModal() {
    const modal = document.createElement('div');
    modal.id = 'detail-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div id="modal-content" class="modal-content">
            <div class="modal-header">
                <h3 id="modal-title">Patient Details</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div id="patient-details" class="modal-body"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Create toast container
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
}

// Show toast message
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set appropriate icon based on toast type
    let icon;
    switch (type) {
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'info':
            icon = 'info-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        default:
            icon = 'check-circle';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show the toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-dismiss after a delay
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 4000);
}

// Generate random notes based on status
function getRandomNote(status) {
    if (status === 'approved') {
        const approvedNotes = [
            'Claim approved in full. Payment processed.',
            'Procedure covered under patient policy. No further action needed.',
            'Standard approval, patient benefits verified.',
            'Coverage confirmed. Payment processed on schedule.',
            'Claim processed without adjustments.'
        ];
        return approvedNotes[Math.floor(Math.random() * approvedNotes.length)];
    } else if (status === 'pending') {
        const pendingNotes = [
            'Waiting for additional documentation from provider.',
            'Under standard review process, expected completion within 5 business days.',
            'Awaiting eligibility verification from secondary insurance.',
            'In processing queue, no issues identified yet.',
            'Additional X-rays requested from provider.'
        ];
        return pendingNotes[Math.floor(Math.random() * pendingNotes.length)];
    } else { // denied
        const deniedNotes = [
            'Procedure not covered under current plan.',
            'Missing pre-authorization for this procedure.',
            'Documentation incomplete, resubmission recommended.',
            'Claim submitted after coverage period ended.',
            'Duplicate claim detected in system.'
        ];
        return deniedNotes[Math.floor(Math.random() * deniedNotes.length)];
    }
}

// Generate verification notes
function getRandomVerificationNote(status) {
    if (status === 'approved') {
        const verifiedNotes = [
            'Coverage verified electronically. Patient eligible for all standard benefits.',
            'Confirmed active coverage with provider portal.',
            'Coverage verified via phone. All information matches system records.',
            'Policy active and in good standing. Annual maximum available: $1,500.',
            'Patient eligible for preventive care at 100%, basic procedures at 80%.'
        ];
        return verifiedNotes[Math.floor(Math.random() * verifiedNotes.length)];
    } else if (status === 'pending') {
        const pendingNotes = [
            'Awaiting confirmation from insurance provider.',
            'Verification request submitted. Expected response within 24-48 hours.',
            'Policy number requires manual verification. In progress.',
            'System showing possible policy update. Contacting provider for clarification.',
            'Patient has recent plan changes. Verifying current benefits structure.'
        ];
        return pendingNotes[Math.floor(Math.random() * pendingNotes.length)];
    } else { // denied
        const deniedNotes = [
            'Coverage could not be verified. Policy not found in provider system.',
            'Patient ID and insurance record do not match. Request for correct information sent.',
            'Policy terminated as of previous month. Patient needs to be informed.',
            'Insurance provider reports plan is inactive due to non-payment.',
            'Verification failed. Coverage ID invalid or expired.'
        ];
        return deniedNotes[Math.floor(Math.random() * deniedNotes.length)];
    }
}

// Add event listeners for table sorting
function setupTableSorting() {
    document.querySelectorAll('th.sortable').forEach(headerCell => {
        headerCell.addEventListener('click', function() {
            const table = this.closest('table');
            const index = Array.from(this.parentElement.children).indexOf(this);
            const isAscending = !this.classList.contains('sort-asc');
            
            // Reset all headers
            table.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });
            
            // Set new sort direction
            this.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
            
            // Sort the rows
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            rows.sort((a, b) => {
                const aValue = a.cells[index].textContent;
                const bValue = b.cells[index].textContent;
                
                // Handle numeric sorting
                if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
                    return isAscending 
                        ? parseFloat(aValue) - parseFloat(bValue) 
                        : parseFloat(bValue) - parseFloat(aValue);
                }
                
                // Handle currency sorting
                if (aValue.startsWith('$') && bValue.startsWith('$')) {
                    const aNum = parseFloat(aValue.replace(/[$,]/g, ''));
                    const bNum = parseFloat(bValue.replace(/[$,]/g, ''));
                    return isAscending ? aNum - bNum : bNum - aNum;
                }
                
                // Handle date sorting in MM/DD/YYYY format
                if (aValue.match(/^\d{2}\/\d{2}\/\d{4}$/) && bValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                    const aParts = aValue.split('/');
                    const bParts = bValue.split('/');
                    const aDate = new Date(aParts[2], aParts[0] - 1, aParts[1]);
                    const bDate = new Date(bParts[2], bParts[0] - 1, bParts[1]);
                    return isAscending ? aDate - bDate : bDate - aDate;
                }
                
                // Default string comparison
                return isAscending 
                    ? aValue.localeCompare(bValue) 
                    : bValue.localeCompare(aValue);
            });
            
            // Rearrange table rows
            const tbody = table.querySelector('tbody');
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// Quick filter functionality for search box
function setupQuickFilter() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('#report-data tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
        
        // Show no results message if needed
        const visibleRows = document.querySelectorAll('#report-data tr:not([style*="display: none"])');
        const tableBody = document.getElementById('report-data');
        
        if (visibleRows.length === 0 && query !== '') {
            if (!document.getElementById('no-filter-results')) {
                const noResultsRow = document.createElement('tr');
                noResultsRow.id = 'no-filter-results';
                noResultsRow.innerHTML = `<td colspan="8" class="no-results">No results found for "${query}"</td>`;
                tableBody.appendChild(noResultsRow);
            }
        } else {
            const noResultsRow = document.getElementById('no-filter-results');
            if (noResultsRow) {
                tableBody.removeChild(noResultsRow);
            }
        }
    });
    
    // Add clear button functionality
    const clearButton = document.getElementById('clear-search');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
    }
}

// Setup date range picker functionality
function setupDateRangePicker() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const applyDates = document.getElementById('apply-date-filter');
    
    if (!startDate || !endDate || !applyDates) return;
    
    applyDates.addEventListener('click', function() {
        // In a real implementation, this would filter data by date
        // For this demo, we'll just show a toast
        const start = startDate.value;
        const end = endDate.value;
        
        showToast(`Date filter applied: ${start} to ${end}`);
    });
    
    // Add preset date ranges
    const presetRanges = document.querySelectorAll('.date-preset');
    presetRanges.forEach(preset => {
        preset.addEventListener('click', function() {
            const range = this.getAttribute('data-range');
            const today = new Date();
            let newStartDate, newEndDate;
            
            switch(range) {
                case 'today':
                    newStartDate = new Date(today);
                    newEndDate = new Date(today);
                    break;
                case 'yesterday':
                    newStartDate = new Date(today);
                    newStartDate.setDate(today.getDate() - 1);
                    newEndDate = new Date(newStartDate);
                    break;
                case 'last7':
                    newStartDate = new Date(today);
                    newStartDate.setDate(today.getDate() - 6);
                    newEndDate = new Date(today);
                    break;
                case 'last30':
                    newStartDate = new Date(today);
                    newStartDate.setDate(today.getDate() - 29);
                    newEndDate = new Date(today);
                    break;
                case 'thisMonth':
                    newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    newEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    break;
                case 'lastMonth':
                    newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
                    break;
                default:
                    return;
            }
            
            startDate.value = formatDate(newStartDate);
            endDate.value = formatDate(newEndDate);
            
            // Visually mark the selected preset
            presetRanges.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Function to print the current report
function printReport() {
    showToast('Preparing report for printing...', 'info');
    
    setTimeout(() => {
        window.print();
        showToast('Print dialog opened');
    }, 500);
}

// Function to apply dashboard theme preferences
function applyThemePreference() {
    const savedTheme = localStorage.getItem('smileGuardTheme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
        
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.body.classList.toggle('dark-theme', this.checked);
            localStorage.setItem('smileGuardTheme', newTheme);
            showToast(`${capitalizeFirstLetter(newTheme)} theme applied`);
        });
    }
}

// Function to handle report scheduling
function handleReportScheduling() {
    const scheduleBtn = document.getElementById('schedule-report');
    
    if (!scheduleBtn) return;
    
    scheduleBtn.addEventListener('click', function() {
        if (!document.getElementById('schedule-modal')) {
            createScheduleModal();
        }
        
        document.getElementById('schedule-modal').style.display = 'block';
    });
}

// Create schedule modal
function createScheduleModal() {
    const modal = document.createElement('div');
    modal.id = 'schedule-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Report</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="schedule-form">
                    <div class="form-group">
                        <label for="report-name">Report Name</label>
                        <input type="text" id="report-name" class="form-control" placeholder="Enter a name for this scheduled report">
                    </div>
                    <div class="form-group">
                        <label>Frequency</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="frequency" value="daily" checked> Daily
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="frequency" value="weekly"> Weekly
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="frequency" value="monthly"> Monthly
                            </label>
                        </div>
                    </div>
                    <div class="form-group" id="weekly-options" style="display: none;">
                        <label>Day of Week</label>
                        <select class="form-control">
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                            <option value="0">Sunday</option>
                        </select>
                    </div>
                    <div class="form-group" id="monthly-options" style="display: none;">
                        <label>Day of Month</label>
                        <select class="form-control">
                            ${Array.from({length: 31}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Delivery Method</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="delivery" value="email" checked> Email
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="delivery" value="dashboard"> Dashboard
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="delivery" value="api"> API Endpoint
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email-recipients">Email Recipients</label>
                        <input type="text" id="email-recipients" class="form-control" placeholder="Enter email addresses (comma separated)">
                    </div>
                    <div class="form-group">
                        <label>Export Format</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="format" value="pdf" checked> PDF
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="format" value="excel"> Excel
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="format" value="csv"> CSV
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-light cancel-schedule">Cancel</button>
                <button class="btn btn-primary save-schedule">Save Schedule</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add frequency selection logic
    const frequencyOptions = modal.querySelectorAll('input[name="frequency"]');
    frequencyOptions.forEach(option => {
        option.addEventListener('change', function() {
            document.getElementById('weekly-options').style.display = this.value === 'weekly' ? 'block' : 'none';
            document.getElementById('monthly-options').style.display = this.value === 'monthly' ? 'block' : 'none';
        });
    });
    
    // Add form submission handler
    modal.querySelector('.save-schedule').addEventListener('click', function() {
        const reportName = document.getElementById('report-name').value.trim();
        if (!reportName) {
            showToast('Please enter a report name', 'error');
            return;
        }
        
        const emailRecipients = document.getElementById('email-recipients').value.trim();
        if (modal.querySelector('input[name="delivery"][value="email"]').checked && !emailRecipients) {
            showToast('Please enter email recipients', 'error');
            return;
        }
        
        showToast('Report scheduled successfully!');
        modal.style.display = 'none';
    });
    
    // Add cancel handler
    modal.querySelector('.cancel-schedule').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking X or outside
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize additional functionality after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupTableSorting();
    setupQuickFilter();
    setupDateRangePicker();
    applyThemePreference();
    handleReportScheduling();
    
    // Add print button functionality
    const printButton = document.getElementById('print-report');
    if (printButton) {
        printButton.addEventListener('click', printReport);
    }
    
    // Tooltip initialization (would use a library like tippy.js in production)
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            // Position the tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 10 + 'px';
            
            document.body.appendChild(tooltip);
            
            // Show with animation
            setTimeout(() => tooltip.classList.add('show'), 10);
            
            // Store reference to tooltip
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.classList.remove('show');
                
                // Remove after animation completes
                setTimeout(() => {
                    if (this.tooltip && this.tooltip.parentNode) {
                        document.body.removeChild(this.tooltip);
                    }
                    this.tooltip = null;
                }, 300);
            }
        });
    });
    
    // Initialize collapsible sections
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', function() {
            const section = this.parentElement;
            section.classList.toggle('collapsed');
            
            const icon = this.querySelector('.collapse-icon');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    });
    
    // Demo notification functionality
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = Math.floor(Math.random() * 5) + 1;
    }
});