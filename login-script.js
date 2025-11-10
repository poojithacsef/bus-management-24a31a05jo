// Login Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }

    // Get form elements
    const loginForm = document.getElementById('login-form');
    const otpForm = document.getElementById('otp-form');
    const userLoginBtn = document.getElementById('user-login-btn');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle between Admin and User login
    userLoginBtn.addEventListener('click', function() {
        switchForm(loginForm, otpForm);
    });

    adminLoginBtn.addEventListener('click', function() {
        switchForm(otpForm, loginForm);
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // Handle Admin Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (you can add more complex validation)
        if (username && password) {
            handleLogin('admin', username);
        } else {
            showError(loginForm, 'Please enter username and password');
        }
    });

    // Handle User Login with OTP
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phone').value;
        const otp = document.getElementById('otp').value;
        
        // Simple validation
        if (phone && otp) {
            if (otp.length === 6) {
                handleLogin('user', phone);
            } else {
                showError(otpForm, 'OTP must be 6 digits');
            }
        } else {
            showError(otpForm, 'Please enter phone number and OTP');
        }
    });

    // Switch between forms
    function switchForm(hideForm, showForm) {
        hideForm.classList.add('form-fade-out');
        
        setTimeout(() => {
            hideForm.style.display = 'none';
            hideForm.classList.remove('form-fade-out');
            
            showForm.style.display = 'flex';
            showForm.classList.add('form-fade-in');
            
            setTimeout(() => {
                showForm.classList.remove('form-fade-in');
            }, 300);
        }, 300);
    }

    // Handle login
    function handleLogin(type, identifier) {
        const submitBtn = type === 'admin' ? 
            loginForm.querySelector('.login-btn') : 
            otpForm.querySelector('.login-btn');
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Store login info
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginType', type);
            localStorage.setItem('userIdentifier', identifier);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // Show success message
            showSuccess(type === 'admin' ? loginForm : otpForm, 'Login successful! Redirecting...');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    }

    // Show error message
    function showError(form, message) {
        // Remove existing messages
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Insert at the beginning of form
        form.insertBefore(errorDiv, form.firstChild);
        
        // Remove after 4 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 4000);
    }

    // Show success message
    function showSuccess(form, message) {
        // Remove existing messages
        const existingSuccess = form.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Insert at the beginning of form
        form.insertBefore(successDiv, form.firstChild);
    }

    // Handle "Forgot password" link
    document.querySelector('.forgot-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality will be implemented soon!');
    });

    // Handle "Sign Up" link
    document.querySelector('.signup-link').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Sign up functionality will be implemented soon!');
    });
});
