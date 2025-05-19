// SmileGuardReports.jsx - Integration of React Charts with Smile Guard HTML structure
import React, { useState, useEffect } from 'react';
import { 
  Bar, 
  Line, 
  Pie, 
  Doughnut,
  PolarArea,
  Radar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

// Register all necessary ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Filler
);

const SmileGuardReports = () => {
  // State management
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [providerFilter, setProviderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for different report types
  const sampleData = {
    financial: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 14500, 13800, 15200, 16800, 18000],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
        {
          label: 'Accounts Receivable',
          data: [5600, 6200, 5800, 6500, 7200, 6800],
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2,
        }
      ],
      tableData: [
        { patientId: 'P1001', name: 'John Smith', provider: 'Delta Dental', code: 'D0120', status: 'Approved', amount: '$125.00', date: '2025-04-01' },
        { patientId: 'P1002', name: 'Sarah Johnson', provider: 'Cigna', code: 'D2160', status: 'Pending', amount: '$245.00', date: '2025-04-02' },
        { patientId: 'P1003', name: 'Michael Brown', provider: 'Aetna', code: 'D2740', status: 'Approved', amount: '$850.00', date: '2025-04-03' },
        { patientId: 'P1004', name: 'Emily Davis', provider: 'MetLife', code: 'D3310', status: 'Denied', amount: '$725.00', date: '2025-04-05' },
        { patientId: 'P1005', name: 'Robert Wilson', provider: 'Delta Dental', code: 'D4341', status: 'Approved', amount: '$320.00', date: '2025-04-07' },
      ],
      stats: {
        totalClaims: 127,
        approvalRate: '84%',
        avgProcessing: '5.2 days'
      }
    },
    'insurance-verification': {
      labels: ['Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian', 'UnitedHealthcare'],
      datasets: [
        {
          label: 'Verified',
          data: [85, 72, 68, 75, 62, 70],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
        {
          label: 'Pending',
          data: [10, 20, 15, 12, 18, 16],
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
        },
        {
          label: 'Failed',
          data: [5, 8, 17, 13, 20, 14],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
        }
      ],
      tableData: [
        { patientId: 'P2001', name: 'Lisa Martinez', provider: 'Delta Dental', code: 'N/A', status: 'Verified', amount: 'N/A', date: '2025-04-10' },
        { patientId: 'P2002', name: 'David Thomas', provider: 'Cigna', code: 'N/A', status: 'Pending', amount: 'N/A', date: '2025-04-11' },
        { patientId: 'P2003', name: 'Jennifer White', provider: 'Aetna', code: 'N/A', status: 'Verified', amount: 'N/A', date: '2025-04-11' },
        { patientId: 'P2004', name: 'Kevin Harris', provider: 'MetLife', code: 'N/A', status: 'Failed', amount: 'N/A', date: '2025-04-12' },
        { patientId: 'P2005', name: 'Amanda Lewis', provider: 'UnitedHealthcare', code: 'N/A', status: 'Verified', amount: 'N/A', date: '2025-04-13' },
      ],
      stats: {
        totalClaims: 215,
        approvalRate: '76%',
        avgProcessing: '2.8 days'
      }
    },
    'denial-analysis': {
      labels: ['Missing Information', 'Non-Covered Service', 'Out of Network', 'Frequency Limitation', 'Prior Authorization', 'Other'],
      datasets: [
        {
          label: 'Denial Reasons',
          data: [32, 24, 18, 15, 8, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          hoverOffset: 15
        }
      ],
      tableData: [
        { patientId: 'P3001', name: 'Christopher Adams', provider: 'Delta Dental', code: 'D2950', status: 'Denied', amount: '$180.00', date: '2025-04-02' },
        { patientId: 'P3002', name: 'Jessica Scott', provider: 'Cigna', code: 'D4910', status: 'Denied', amount: '$120.00', date: '2025-04-03' },
        { patientId: 'P3003', name: 'Brian Moore', provider: 'Aetna', code: 'D2392', status: 'Resubmitted', amount: '$175.00', date: '2025-04-05' },
        { patientId: 'P3004', name: 'Stephanie King', provider: 'MetLife', code: 'D4341', status: 'Denied', amount: '$320.00', date: '2025-04-08' },
        { patientId: 'P3005', name: 'Daniel Wright', provider: 'Guardian', code: 'D2750', status: 'Appealed', amount: '$950.00', date: '2025-04-09' },
      ],
      stats: {
        totalClaims: 102,
        approvalRate: '58%',
        avgProcessing: '7.5 days'
      }
    }
  };

  // Effect to simulate loading report data when type changes
  useEffect(() => {
    if (reportType) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReportData(sampleData[reportType]);
        setIsLoading(false);
      }, 800);
    }
  }, [reportType]);

  // Chart configurations based on report type
  const getChartComponent = () => {
    switch(reportType) {
      case 'financial':
        return <Line data={{
          labels: reportData?.labels,
          datasets: reportData?.datasets
        }} options={chartOptions} />;
      
      case 'insurance-verification':
        return <Bar data={{
          labels: reportData?.labels,
          datasets: reportData?.datasets
        }} options={chartOptions} />;
      
      case 'denial-analysis':
        return <Pie data={{
          labels: reportData?.labels,
          datasets: reportData?.datasets
        }} options={chartOptions} />;
      
      default:
        return <div className="no-data">Select a report type</div>;
    }
  };

  // Chart global options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 6
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  // Handle date range changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  // Handle report type selection
  const handleReportTypeSelect = (type) => {
    setReportType(type);
    document.getElementById('report-content').classList.remove('hidden');
    
    // Update the report title in the HTML
    const reportTitleElement = document.getElementById('selected-report-title');
    if (reportTitleElement) {
      const titles = {
        'financial': 'Financial Reports',
        'insurance-verification': 'Insurance Verification Reports',
        'denial-analysis': 'Denial Analysis Reports'
      };
      reportTitleElement.textContent = titles[type] || 'Report';
    }

    // Scroll to report content
    document.getElementById('report-content').scrollIntoView({ behavior: 'smooth' });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    if (id === 'provider-filter') {
      setProviderFilter(value);
    } else if (id === 'status-filter') {
      setStatusFilter(value);
    }
  };

  // Export handlers
  const handleExport = (format) => {
    alert(`Exporting report in ${format} format...`);
    // This would connect to your export functionality
  };

  // Filter table data based on selected filters
  const getFilteredTableData = () => {
    if (!reportData || !reportData.tableData) return [];
    
    return reportData.tableData.filter(row => {
      const matchesProvider = !providerFilter || row.provider.toLowerCase().includes(providerFilter.toLowerCase());
      const matchesStatus = !statusFilter || row.status.toLowerCase().includes(statusFilter.toLowerCase());
      return matchesProvider && matchesStatus;
    });
  };

  // Initialize component
  useEffect(() => {
    // Connect event listeners to existing HTML buttons
    const viewButtons = document.querySelectorAll('.view-report-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const reportType = button.getAttribute('data-type');
        handleReportTypeSelect(reportType);
      });
    });

    // Connect export buttons
    document.getElementById('export-pdf')?.addEventListener('click', () => handleExport('PDF'));
    document.getElementById('export-csv')?.addEventListener('click', () => handleExport('CSV'));
    document.getElementById('export-excel')?.addEventListener('click', () => handleExport('Excel'));

    // Connect generate report button
    document.getElementById('generate-report')?.addEventListener('click', () => {
      setIsLoading(true);
      setTimeout(() => {
        setReportData({...sampleData[reportType]});
        setIsLoading(false);
      }, 800);
    });

    // Connect filter change events
    document.getElementById('provider-filter')?.addEventListener('change', handleFilterChange);
    document.getElementById('status-filter')?.addEventListener('change', handleFilterChange);

    // Connect date inputs
    document.getElementById('start-date')?.addEventListener('change', handleDateChange);
    document.getElementById('end-date')?.addEventListener('change', handleDateChange);

    // Initialize with financial reports
    setTimeout(() => {
      setReportData(sampleData.financial);
    }, 500);

    // Cleanup event listeners on unmount
    return () => {
      viewButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
      document.getElementById('export-pdf')?.removeEventListener('click', () => {});
      document.getElementById('export-csv')?.removeEventListener('click', () => {});
      document.getElementById('export-excel')?.removeEventListener('click', () => {});
      document.getElementById('generate-report')?.removeEventListener('click', () => {});
      document.getElementById('provider-filter')?.removeEventListener('change', () => {});
      document.getElementById('status-filter')?.removeEventListener('change', () => {});
      document.getElementById('start-date')?.removeEventListener('change', () => {});
      document.getElementById('end-date')?.removeEventListener('change', () => {});
    };
  }, []);

  // Update stats when report data changes
  useEffect(() => {
    if (reportData && reportData.stats) {
      document.getElementById('total-claims').textContent = reportData.stats.totalClaims;
      document.getElementById('approval-rate').textContent = reportData.stats.approvalRate;
      document.getElementById('avg-processing').textContent = reportData.stats.avgProcessing;
    }
  }, [reportData]);

  // Populate table data when report data changes
  useEffect(() => {
    if (reportData && reportData.tableData) {
      const tableBody = document.getElementById('report-data');
      if (tableBody) {
        tableBody.innerHTML = '';
        
        const filteredData = getFilteredTableData();
        filteredData.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.patientId}</td>
            <td>${row.name}</td>
            <td>${row.provider}</td>
            <td>${row.code}</td>
            <td><span class="status-badge ${row.status.toLowerCase()}">${row.status}</span></td>
            <td>${row.amount}</td>
            <td>${row.date}</td>
            <td>
              <button class="action-btn" title="View Details"><i class="fas fa-eye"></i></button>
              <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
            </td>
          `;
          tableBody.appendChild(tr);
        });
        
        // Update pagination info
        document.getElementById('page-indicator').textContent = `Page ${currentPage} of 1`;
      }
    }
  }, [reportData, providerFilter, statusFilter]);

  // Render the chart into the chart container
  useEffect(() => {
    // This is where we would normally mount our React component
    // But since we're integrating with existing HTML, we'll use a different approach
    const chartContainer = document.getElementById('report-chart');
    if (chartContainer && reportData) {
      // In a real implementation, we would render the React component here
      // For now, we'll just indicate where the chart would go
      chartContainer.innerHTML = '';
      chartContainer.classList.add('chart-ready');
      
      // In a full implementation, we would use ReactDOM.render() or similar here
      // For demonstration purposes, we'll use this placeholder
      if (isLoading) {
        chartContainer.innerHTML = '<div class="loading-spinner"></div>';
      } else {
        // This is where the actual chart would be rendered
        // Since we can't actually render React components directly in this code sample
        // We'll create a placeholder that indicates what would be rendered
        const chartType = reportType === 'financial' ? 'Line Chart' :
                         reportType === 'insurance-verification' ? 'Bar Chart' :
                         reportType === 'denial-analysis' ? 'Pie Chart' : 'Chart';
        
        chartContainer.innerHTML = `
          <div class="chart-placeholder">
            <div class="chart-header">${chartType} for ${reportType} data</div>
            <div class="chart-body">
              <div class="chart-canvas"></div>
            </div>
            <div class="chart-footer">Interactive chart will be rendered here</div>
          </div>
        `;
      }
    }
  }, [reportData, isLoading]);

  // This component doesn't render anything, it just connects to the existing HTML
  return null;
};

// This is how you would mount this in your application
// ReactDOM.render(<SmileGuardReports />, document.getElementById('report-chart-container'));

export default SmileGuardReports;