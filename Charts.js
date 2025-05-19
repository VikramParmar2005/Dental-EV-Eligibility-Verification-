{ id: 'P1004', name: 'Emily Davis', provider: 'MetLife', code: 'D3310', status: 'Denied', amount: '$725.00', date: '2025-04-05' },
          { id: 'P1005', name: 'Robert Wilson', provider: 'Delta Dental', code: 'D4341', status: 'Approved', amount: '$320.00', date: '2025-04-07' },
        ];
        break;
      case 'insurance-verification':
        sampleData = [
          { id: 'P2001', name: 'Lisa Martinez', provider: 'Delta Dental', code: 'N/A', status: 'Verified', amount: 'N/A', date: '2025-04-10' },
          { id: 'P2002', name: 'David Thomas', provider: 'Cigna', code: 'N/A', status: 'Pending', amount: 'N/A', date: '2025-04-11' },
          { id: 'P2003', name: 'Jennifer White', provider: 'Aetna', code: 'N/A', status: 'Verified', amount: 'N/A', date: '2025-04-11' },
          { id: 'P2004', name: 'Kevin Harris', provider: 'MetLife', code: 'N/A', status: 'Failed', amount: 'N/A', date: '2025-04-12' },
          { id: 'P2005', name: 'Amanda Lewis', provider: 'UnitedHealthcare', code: 'N/A', status: 'Verified', amount: 'N/A', date: '2025-04-13' },
        ];
        break;
      case 'denial-analysis':
        sampleData = [
          { id: 'P3001', name: 'Christopher Adams', provider: 'Delta Dental', code: 'D2950', status: 'Denied', amount: '$180.00', date: '2025-04-02' },
          { id: 'P3002', name: 'Jessica Scott', provider: 'Cigna', code: 'D4910', status: 'Denied', amount: '$120.00', date: '2025-04-03' },
          { id: 'P3003', name: 'Brian Moore', provider: 'Aetna', code: 'D2392', status: 'Resubmitted', amount: '$175.00', date: '2025-04-05' },
          { id: 'P3004', name: 'Stephanie King', provider: 'MetLife', code: 'D4341', status: 'Denied', amount: '$320.00', date: '2025-04-08' },
          { id: 'P3005', name: 'Daniel Wright', provider: 'Guardian', code: 'D2750', status: 'Appealed', amount: '$950.00', date: '2025-04-09' },
        ];
        break;
      default:
        sampleData = [];
    }
    
    // Populate table with sample data
    sampleData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.provider}</td>
        <td>${item.code}</td>
        <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
        <td>${item.amount}</td>
        <td>${item.date}</td>
        <td>
          <button class="action-btn" title="View Details"><i class="fas fa-eye"></i></button>
          <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // Update pagination indicator
    const pageIndicator = document.getElementById('page-indicator');
    if (pageIndicator) {
      pageIndicator.textContent = 'Page 1 of 1';
    }
  }

  // Helper function to update stat placeholders
  function updateStatPlaceholders(reportType) {
    const totalClaimsElement = document.getElementById('total-claims');
    const approvalRateElement = document.getElementById('approval-rate');
    const avgProcessingElement = document.getElementById('avg-processing');
    
    if (!totalClaimsElement || !approvalRateElement || !avgProcessingElement) return;
    
    let stats = {};
    
    switch(reportType) {
      case 'financial':
        stats = {
          totalClaims: 127,
          approvalRate: '84%',
          avgProcessing: '5.2 days'
        };
        break;
      case 'insurance-verification':
        stats = {
          totalClaims: 215,
          approvalRate: '76%',
          avgProcessing: '2.8 days'
        };
        break;
      case 'denial-analysis':
        stats = {
          totalClaims: 102,
          approvalRate: '58%',
          avgProcessing: '7.5 days'
        };
        break;
      default:
        stats = {
          totalClaims: '--',
          approvalRate: '--',
          avgProcessing: '--'
        };
    }
    
    // Update the stats
    totalClaimsElement.textContent = stats.totalClaims;
    approvalRateElement.textContent = stats.approvalRate;
    avgProcessingElement.textContent = stats.avgProcessing;
  }
});