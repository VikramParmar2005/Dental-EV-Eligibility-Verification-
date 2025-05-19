// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables for DOM elements
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const eligibilityForm = document.getElementById('eligibilityForm');
    const dashboardSection = document.getElementById('dashboard');
    const patientsSection = document.getElementById('patients');
    const eligibilitySection = document.getElementById('eligibility');
    const elegibilityResults = document.querySelector('.eligibility-results');

    // Hide dashboard sections initially (they should only be visible after login)
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (patientsSection) patientsSection.style.display = 'none';
    if (eligibilitySection) eligibilitySection.style.display = 'none';

    // Check if user is already logged in (from localStorage)
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // Show dashboard sections
            if (dashboardSection) dashboardSection.style.display = 'block';
            if (patientsSection) patientsSection.style.display = 'block';
            if (eligibilitySection) eligibilitySection.style.display = 'block';
            
            // Hide login form
            if (document.querySelector('.form-container')) {
                document.querySelector('.form-container').style.display = 'none';
            }
            if (document.querySelector('.hero')) {
                document.querySelector('.hero').style.display = 'none';
            }
        }
    }

    // Call on page load
    checkLoginStatus();

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading indicator
            loginBtn.classList.add('loading');
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const enable2FA = document.getElementById('enable2FA').checked;
            
            // Simulate API call with timeout
            setTimeout(() => {
                // For demo purposes, accept any login
                console.log('Login attempt:', { username, password, rememberMe, enable2FA });
                
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // Hide login form & show dashboard
                if (document.querySelector('.form-container')) {
                    document.querySelector('.form-container').style.display = 'none';
                }
                if (document.querySelector('.hero')) {
                    document.querySelector('.hero').style.display = 'none';
                }
                
                // Show dashboard sections
                if (dashboardSection) dashboardSection.style.display = 'block';
                if (patientsSection) patientsSection.style.display = 'block';
                if (eligibilitySection) eligibilitySection.style.display = 'block';
                
                // Remove loading state
                loginBtn.classList.remove('loading');
                
                // Show success message (optional)
                showNotification('Login successful!', 'success');
            }, 1500); // Simulate network delay
        });
    }

    // Handle social login buttons
    const socialButtons = document.querySelectorAll('.social-login button');
    if (socialButtons) {
        socialButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const provider = this.className.split('-')[0]; // Extract provider name
                console.log(`Attempting to login with ${provider}`);
                // Implement social login logic here
                showNotification(`${provider} login coming soon!`, 'info');
            });
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login state
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            
            // Reload page to show login form
            window.location.reload();
        });
    }

    // Handle eligibility check form
    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const patientId = eligibilityForm.querySelector('input').value;
            
            // Add loading state
            eligibilityForm.querySelector('button').classList.add('loading');
            
            // Simulate API call
            setTimeout(() => {
                // For demo, randomly determine eligibility
                const isEligible = Math.random() > 0.3;
                
                // Display results
                if (elegibilityResults) {
                    elegibilityResults.innerHTML = `
                        <div class="eligibility-result ${isEligible ? 'eligible' : 'not-eligible'}">
                            <h3>Patient ID: ${patientId}</h3>
                            <p>Status: <strong>${isEligible ? 'Eligible' : 'Not Eligible'}</strong></p>
                            <p>Plan: ${isEligible ? 'Dental Premium Plus' : 'N/A'}</p>
                            ${isEligible ? '<p>Coverage: 80% for standard procedures, 50% for major procedures</p>' : ''}
                            <p>Last checked: ${new Date().toLocaleString()}</p>
                        </div>
                    `;
                    
                    // Add styling to results
                    const resultElement = elegibilityResults.querySelector('.eligibility-result');
                    if (resultElement) {
                        if (isEligible) {
                            resultElement.style.borderLeft = '4px solid var(--success)';
                            resultElement.style.background = 'rgba(40, 167, 69, 0.1)';
                        } else {
                            resultElement.style.borderLeft = '4px solid var(--danger)';
                            resultElement.style.background = 'rgba(220, 53, 69, 0.1)';
                        }
                    }
                }
                
                // Remove loading state
                eligibilityForm.querySelector('button').classList.remove('loading');
            }, 1200);
        });
    }

    // Patient card click handlers
    const patientCards = document.querySelectorAll('.patient-card .btn');
    if (patientCards) {
        patientCards.forEach(button => {
            button.addEventListener('click', function() {
                const patientName = this.parentElement.querySelector('h3').textContent;
                showNotification(`Viewing details for ${patientName}`, 'info');
                // Here you would typically navigate to a patient detail page
                // window.location.href = `/patient-details.html?name=${encodeURIComponent(patientName)}`;
            });
        });
    }

    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Style the notification
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '12px 20px';
            notification.style.borderRadius = '8px';
            notification.style.color = 'white';
            notification.style.zIndex = '9999';
            notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }
        
        // Set type-specific styling
        switch(type) {
            case 'success':
                notification.style.background = 'var(--success)';
                break;
            case 'error':
                notification.style.background = 'var(--danger)';
                break;
            case 'warning':
                notification.style.background = 'var(--warning)';
                notification.style.color = 'var(--dark)';
                break;
            default:
                notification.style.background = 'var(--secondary)';
        }
        
        // Set content and show
        notification.textContent = message;
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        // Hide after timeout
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove from DOM after fade out
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Enhance the patient list with simulated data (optional)
    function enhancePatientList() {
        const patientList = document.querySelector('.patient-list');
        if (patientList && patientList.childElementCount <= 2) {
            // Sample data
            const samplePatients = [
                { name: 'Robert Johnson', lastVisit: '03/12/2025' },
                { name: 'Sarah Williams', lastVisit: '03/28/2025' },
                { name: 'Michael Thomas', lastVisit: '04/02/2025' },
                { name: 'Emily Davis', lastVisit: '04/08/2025' }
            ];
            
            // Add sample patients
            samplePatients.forEach(patient => {
                const card = document.createElement('div');
                card.className = 'patient-card';
                card.innerHTML = `
                    <h3>${patient.name}</h3>
                    <p>Last Visit: ${patient.lastVisit}</p>
                    <button class="btn">View Details</button>
                `;
                patientList.appendChild(card);
                
                // Add event listener to the new button
                card.querySelector('.btn').addEventListener('click', function() {
                    showNotification(`Viewing details for ${patient.name}`, 'info');
                });
            });
        }
    }
    
    // Call to enhance patient list
    setTimeout(enhancePatientList, 500);
});