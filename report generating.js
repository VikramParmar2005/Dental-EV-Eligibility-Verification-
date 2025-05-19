// Reports.js - Smile Guard Reports functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date inputs with current month's range
    initializeDateRange();
    
    // Add event listeners to buttons
    document.getElementById('generate-report').addEventListener('click', generateReport);
    document.getElementById('export-pdf').addEventListener('click', () => exportReport('pdf'));
    document.getElementById('export-csv').addEventListener('click', () => exportReport('csv'));
    document.getElementById('export-excel').addEventListener('click', () => exportReport('excel'));
    
    // Add event listeners to report type buttons
    const reportTypeButtons = document.querySelectorAll('.view-report-btn');
    reportTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reportType = this.getAttribute('data-type');
            showReportSection(reportType);
        });
    });
    
    // Add event listeners for filters
    document.getElementById('provider-filter').addEventListener('change', filterReportData);
    document.getElementById('status-filter').addEventListener('change', filterReportData);
    
    // Add event listeners for pagination
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
});

// Current state variables
let currentReportType = null;
let currentPage = 1;
let itemsPerPage = 10;
let filteredData = [];
let originalData = [];

// Initialize date range to current month
function initializeDateRange() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    document.getElementById('start-date').value = formatDate(firstDay);
    document.getElementById('end-date').value = formatDate(lastDay);
}

// Generate report based on selected criteria
function generateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }
    
    if (!currentReportType) {
        alert('Please select a report type first.');
        return;
    }
    
    // Show loading state
    document.getElementById('report-content').classList.remove('hidden');
    document.getElementById('report-data').innerHTML = '<tr><td colspan="8" class="loading-data">Loading report data...</td></tr>';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        // Get demo data based on report type
        originalData = getDemoData(currentReportType, startDate, endDate);
        filteredData = [...originalData];
        
        // Reset filters and pagination
        document.getElementById('provider-filter').value = '';
        document.getElementById('status-filter').value = '';
        currentPage = 1;
        
        // Update the UI
        updateReportUI();
        updateSummaryStats();
        renderChart();
    }, 800);
}

// Show report section based on selected type
function showReportSection(reportType) {
    currentReportType = reportType;
    
    // Update report title
    let reportTitle;
    switch (reportType) {
        case 'financial':
            reportTitle = 'Financial Reports';
            break;
        case 'insurance-verification':
            reportTitle = 'Insurance Verification Reports';
            break;
        case 'denial-analysis':
            reportTitle = 'Denial Analysis Reports';
            break;
        default:
            reportTitle = 'Report';
    }
    
    document.getElementById('selected-report-title').textContent = reportTitle;
    document.getElementById('report-content').classList.remove('hidden');
    
    // Reset data and request new report generation
    originalData = [];
    filteredData = [];
    document.getElementById('report-data').innerHTML = '<tr><td colspan="8">No data available. Please click "Generate Report" to fetch data.</td></tr>';
    
    // Update summary stats and chart placeholders
    document.getElementById('total-claims').textContent = '--';
    document.getElementById('approval-rate').textContent = '--';
    document.getElementById('avg-processing').textContent = '--';
    
    // Clear chart
    const chartContainer = document.getElementById('report-chart');
    chartContainer.innerHTML = '<div class="chart-placeholder">Select date range and generate report to view chart</div>';
}

// Update the report UI with current data
function updateReportUI() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    const tableBody = document.getElementById('report-data');
    tableBody.innerHTML = '';
    
    if (pageData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">No data available for the selected filters.</td></tr>';
        return;
    }
    
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.patientId}</td>
            <td>${item.patientName}</td>
            <td>${item.insuranceProvider}</td>
            <td>${item.procedureCode}</td>
            <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>$${item.amount.toFixed(2)}</td>
            <td>${formatDate(item.date)}</td>
            <td>
                <button class="action-btn view-btn" data-id="${item.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewRecord(id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editRecord(id);
        });
    });
    
    // Update pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    document.getElementById('page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Enable/disable pagination buttons
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Change page in pagination
function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updateReportUI();
    }
}

// Filter report data based on selected filters
function filterReportData() {
    const providerFilter = document.getElementById('provider-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredData = originalData.filter(item => {
        const matchProvider = !providerFilter || item.insuranceProvider.toLowerCase().includes(providerFilter.toLowerCase());
        const matchStatus = !statusFilter || item.status.toLowerCase() === statusFilter.toLowerCase();
        return matchProvider && matchStatus;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Update UI
    updateReportUI();
    updateSummaryStats();
    renderChart();
}

// Update summary statistics
function updateSummaryStats() {
    if (filteredData.length === 0) {
        document.getElementById('total-claims').textContent = '0';
        document.getElementById('approval-rate').textContent = '0%';
        document.getElementById('avg-processing').textContent = '0 days';
        return;
    }
    
    // Calculate stats
    const totalClaims = filteredData.length;
    
    const approvedClaims = filteredData.filter(item => item.status === 'Approved').length;
    const approvalRate = (approvedClaims / totalClaims * 100).toFixed(1);
    
    // Calculate average processing time (random for demo)
    const avgProcessing = Math.floor(Math.random() * 10) + 3;
    
    // Update UI
    document.getElementById('total-claims').textContent = totalClaims;
    document.getElementById('approval-rate').textContent = `${approvalRate}%`;
    document.getElementById('avg-processing').textContent = `${avgProcessing} days`;
}

// Render chart based on current report type and data
function renderChart() {
    const chartContainer = document.getElementById('report-chart');
    
    if (filteredData.length === 0) {
        chartContainer.innerHTML = '<div class="chart-placeholder">No data available for chart</div>';
        return;
    }
    
    // Create canvas for chart
    chartContainer.innerHTML = '<canvas id="chart-canvas"></canvas>';
    
    // Different chart types based on report type
    switch (currentReportType) {
        case 'financial':
            renderFinancialChart();
            break;
        case 'insurance-verification':
            renderVerificationChart();
            break;
        case 'denial-analysis':
            renderDenialChart();
            break;
        default:
            chartContainer.innerHTML = '<div class="chart-placeholder">Select a report type</div>';
    }
}

// Render financial chart (placeholder)
function renderFinancialChart() {
    const chartPlaceholder = document.getElementById('chart-canvas');
    chartPlaceholder.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-bar" style="height: 75%"><span>$23,450</span></div>
            <div class="chart-bar" style="height: 60%"><span>$18,720</span></div>
            <div class="chart-bar" style="height: 85%"><span>$26,150</span></div>
            <div class="chart-bar" style="height: 55%"><span>$17,200</span></div>
            <div class="chart-bar" style="height: 70%"><span>$21,890</span></div>
        </div>
        <div class="chart-labels">
            <span>Delta</span>
            <span>Cigna</span>
            <span>Aetna</span>
            <span>MetLife</span>
            <span>Other</span>
        </div>
    `;
}

// Render verification chart (placeholder)
function renderVerificationChart() {
    const chartPlaceholder = document.getElementById('chart-canvas');
    chartPlaceholder.innerHTML = `
        <div class="chart-pie">
            <div class="pie-slice verified" style="--percentage: 65%"><span>Verified (65%)</span></div>
            <div class="pie-slice pending" style="--percentage: 25%"><span>Pending (25%)</span></div>
            <div class="pie-slice expired" style="--percentage: 10%"><span>Expired (10%)</span></div>
        </div>
    `;
}

// Render denial chart (placeholder)
function renderDenialChart() {
    const chartPlaceholder = document.getElementById('chart-canvas');
    chartPlaceholder.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-bar denied" style="height: 25%"><span>25%</span></div>
            <div class="chart-bar denied" style="height: 15%"><span>15%</span></div>
            <div class="chart-bar denied" style="height: 35%"><span>35%</span></div>
            <div class="chart-bar denied" style="height: 10%"><span>10%</span></div>
            <div class="chart-bar denied" style="height: 15%"><span>15%</span></div>
        </div>
        <div class="chart-labels">
            <span>Invalid<br>Code</span>
            <span>Missing<br>Info</span>
            <span>Not<br>Covered</span>
            <span>Duplicate<br>Claim</span>
            <span>Other<br>Reasons</span>
        </div>
    `;
}

// Format date string
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// View record (placeholder function)
function viewRecord(id) {
    const record = originalData.find(item => item.id === id);
    if (record) {
        alert(`Viewing details for claim ID: ${id}\nPatient: ${record.patientName}\nAmount: $${record.amount}`);
    }
}

// Edit record (placeholder function)
function editRecord(id) {
    const record = originalData.find(item => item.id === id);
    if (record) {
        alert(`Edit functionality would open a modal for claim ID: ${id}\nPatient: ${record.patientName}`);
    }
}

// Export report to specified format
function exportReport(format) {
    if (filteredData.length === 0) {
        alert('No data to export. Please generate a report first.');
        return;
    }
    
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const reportType = currentReportType ? currentReportType.replace('-', ' ') : '';
    
    let formatName;
    switch (format) {
        case 'pdf':
            formatName = 'PDF';
            break;
        case 'csv':
            formatName = 'CSV';
            break;
        case 'excel':
            formatName = 'Excel';
            break;
        default:
            formatName = 'Unknown';
    }
    
    // Simulate download
    const filename = `SmileGuard_${reportType}_${startDate}_to_${endDate}.${format}`;
    simulateDownload(filename, formatName);
}

// Simulate file download
function simulateDownload(filename, formatName) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-download"></i>
        <span>Downloading ${filename}...</span>
    `;
    document.body.appendChild(notification);
    
    // Display notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove notification after a delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
    
    console.log(`Exporting to ${formatName}: ${filename}`);
}

// Generate demo data for reports
function getDemoData(reportType, startDate, endDate) {
    const data = [];
    const insuranceProviders = ['Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian', 'United Healthcare'];
    const statuses = ['Pending', 'Approved', 'Denied'];
    const procedureCodes = ['D0120', 'D0150', 'D0210', 'D0220', 'D0230', 'D0270', 'D0272', 'D0274', 'D0330', 'D1110', 'D2140', 'D2150', 'D2160', 'D2161', 'D2330'];
    
    // Generate random distribution based on report type
    let statusDistribution;
    if (reportType === 'financial') {
        statusDistribution = { 'Approved': 0.7, 'Pending': 0.2, 'Denied': 0.1 };
    } else if (reportType === 'insurance-verification') {
        statusDistribution = { 'Approved': 0.65, 'Pending': 0.25, 'Denied': 0.1 };
    } else if (reportType === 'denial-analysis') {
        statusDistribution = { 'Approved': 0.5, 'Pending': 0.2, 'Denied': 0.3 };
    } else {
        statusDistribution = { 'Approved': 0.6, 'Pending': 0.3, 'Denied': 0.1 };
    }
    
    // Generate records
    const numRecords = 50 + Math.floor(Math.random() * 50); // Between 50-100 records
    
    for (let i = 0; i < numRecords; i++) {
        // Generate a random date within the selected range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        
        // Determine status based on distribution
        const randValue = Math.random();
        let status;
        let cumProb = 0;
        for (const [stat, prob] of Object.entries(statusDistribution)) {
            cumProb += prob;
            if (randValue <= cumProb) {
                status = stat;
                break;
            }
        }
        
        data.push({
            id: `CLM${10000 + i}`,
            patientId: `PT${1000 + Math.floor(Math.random() * 500)}`,
            patientName: generatePatientName(),
            insuranceProvider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
            procedureCode: procedureCodes[Math.floor(Math.random() * procedureCodes.length)],
            status: status,
            amount: Math.floor(Math.random() * 150000) / 100, // Random amount between $0 and $1500
            date: randomDate.toISOString().split('T')[0]
        });
    }
    
    return data;
}

// Generate random patient name
function generatePatientName() {
    const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Jessica', 'James', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Ashley', 'Christopher', 'Stephanie'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
}