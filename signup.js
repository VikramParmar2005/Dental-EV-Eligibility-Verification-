function validateForm() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const insuranceType = document.getElementById('insuranceType').value;
    const state = document.getElementById('state').value;
    const terms = document.getElementById('terms').checked;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
    }

    // Phone validation (US format)
    const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phonePattern.test(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }

    // Check if insurance type is selected
    if (!insuranceType) {
        alert('Please select an insurance type');
        return false;
    }
    
    // Check if state is selected
    if (!state) {
        alert('Please select your state');
        return false;
    }
    
    // Check if terms are checked
    if (!terms) {
        alert('You must agree to the Terms of Service and Privacy Policy');
        return false;
    }

    // If all validations pass, create account object
    const accountData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        insuranceType,
        state
    };

    // Log data for debugging
    console.log('Account data:', accountData);
    
    // Allow the form to submit to the server for PHP processing
    return true;
}

// Real-time password strength indicator
document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    let strength = 0;
    
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.length >= 8) strength++;

    const strengthColors = ['#ff4444', '#ffbb33', '#00C851', '#007E33'];
    
    if (password.length > 0) {
        e.target.style.borderColor = strengthColors[strength - 1];
        
        // Add visual strength indicator
        let strengthText = '';
        switch(strength) {
            case 1: strengthText = 'Weak'; break;
            case 2: strengthText = 'Medium'; break;
            case 3: strengthText = 'Strong'; break;
            case 4: strengthText = 'Very Strong'; break;
        }
        
        // Get or create strength indicator element
        let indicator = document.getElementById('password-strength');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'password-strength';
            indicator.style.fontSize = '12px';
            indicator.style.marginTop = '5px';
            e.target.parentNode.appendChild(indicator);
        }
        
        indicator.textContent = 'Strength: ' + strengthText;
        indicator.style.color = strengthColors[strength - 1];
    } else {
        e.target.style.borderColor = '#ddd';
        const indicator = document.getElementById('password-strength');
        if (indicator) indicator.textContent = '';
    }
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            e.target.value = value;
        } else if (value.length <= 6) {
            e.target.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            e.target.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
});

// Add form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Add visual labels for filled inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
});