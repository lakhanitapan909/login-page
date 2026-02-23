// Password Validation Module

function validatePassword(password) {
    const validationRules = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    return validationRules;
}

function isPasswordValid(password) {
    const rules = validatePassword(password);
    return Object.values(rules).every(rule => rule === true);
}

function getPasswordStrength(password) {
    const rules = validatePassword(password);
    const passedRules = Object.values(rules).filter(rule => rule === true).length;

    if (passedRules <= 2) return 'Weak';
    if (passedRules <= 4) return 'Medium';
    return 'Strong';
}

function displayValidationFeedback(password, feedbackElementId) {
    const feedbackElement = document.getElementById(feedbackElementId);
    if (!feedbackElement) return;

    const rules = validatePassword(password);
    let feedback = '<ul>';

    feedback += `<li style="${rules.minLength ? 'color: green;' : 'color: red;'}">
        ${rules.minLength ? '✓' : '✗'} At least 8 characters
    </li>`;

    feedback += `<li style="${rules.hasUpperCase ? 'color: green;' : 'color: red;'}">
        ${rules.hasUpperCase ? '✓' : '✗'} At least one uppercase letter
    </li>`;

    feedback += `<li style="${rules.hasLowerCase ? 'color: green;' : 'color: red;'}">
        ${rules.hasLowerCase ? '✓' : '✗'} At least one lowercase letter
    </li>`;

    feedback += `<li style="${rules.hasNumbers ? 'color: green;' : 'color: red;'}">
        ${rules.hasNumbers ? '✓' : '✗'} At least one number
    </li>`;

    feedback += `<li style="${rules.hasSpecialChar ? 'color: green;' : 'color: red;'}">
        ${rules.hasSpecialChar ? '✓' : '✗'} At least one special character
    </li>`;

    feedback += '</ul>';
    feedbackElement.innerHTML = feedback;
}

// Email Validation Module

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isEmailValid(email) {
    return validateEmail(email) && email.length > 0;
}

function getEmailStatus(email) {
    if (email.length === 0) return 'empty';
    if (!email.includes('@')) return 'invalid';
    if (!email.includes('.')) return 'invalid';
    if (validateEmail(email)) return 'valid';
    return 'invalid';
}

function displayEmailValidation(email, feedbackElementId) {
    const feedbackElement = document.getElementById(feedbackElementId);
    if (!feedbackElement) return;

    const status = getEmailStatus(email);
    let feedback = '';

    if (status === 'empty') {
        feedback = '<p style="color: #999;">Enter your email</p>';
    } else if (status === 'valid') {
        feedback = '<p style="color: green;">✓ Valid email</p>';
    } else {
        feedback = '<p style="color: red;">✗ Invalid email format</p>';
    }

    feedbackElement.innerHTML = feedback;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailValid = isEmailValid(emailInput.value);
    const passwordValid = isPasswordValid(passwordInput.value);

    if (!emailValid) {
        emailInput.style.borderColor = '#e74c3c';
        displayEmailValidation(emailInput.value, 'email-feedback');
        return;
    } else {
        emailInput.style.borderColor = '#27ae60';
    }

    if (!passwordValid) {
        passwordInput.style.borderColor = '#e74c3c';
        displayValidationFeedback(passwordInput.value, 'password-feedback');
        return;
    } else {
        passwordInput.style.borderColor = '#27ae60';
    }

    const rememberCheckbox = document.getElementById('remember');
    if (rememberCheckbox && rememberCheckbox.checked) {
        try {
            localStorage.setItem('rememberedEmail', emailInput.value);
        } catch (e) {
            // ignore storage errors
        }
    } else {
        try {
            localStorage.removeItem('rememberedEmail');
        } catch (e) {
            // ignore
        }
    }

    alert(`Login successful!\nEmail: ${emailInput.value}\nPassword Strength: ${getPasswordStrength(passwordInput.value)}`);
}

// Prefill email if remembered and set checkbox state
document.addEventListener('DOMContentLoaded', function () {
    const remembered = (function () {
        try { return localStorage.getItem('rememberedEmail'); } catch (e) { return null; }
    })();
    if (remembered) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        if (emailInput) emailInput.value = remembered;
        if (rememberCheckbox) rememberCheckbox.checked = true;
        displayEmailValidation(remembered, 'email-feedback');
    }
});
