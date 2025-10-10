// State management
let isLogin = true;
let profileType = 'student'; // 'student' or 'company'

// DOM elements
const mainForm = document.getElementById('mainForm');
const cardTitle = document.getElementById('cardTitle');
const cardDescription = document.getElementById('cardDescription');
const submitButton = document.getElementById('submitButton');
const toggleButton = document.getElementById('toggleButton');
const footerText = document.getElementById('footerText');

const nameField = document.getElementById('nameField');
const confirmPasswordField = document.getElementById('confirmPasswordField');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

const companyButton = document.getElementById('companyButton');
const studentButton = document.getElementById('studentButton');

// Update UI based on state
function updateUI() {
    if (isLogin) {
        cardTitle.textContent = 'Entrar na sua conta';
        cardDescription.textContent = 'Entre para acessar suas oportunidades';
        submitButton.textContent = 'Entrar';
        footerText.textContent = 'Ainda não tem uma conta?';
        toggleButton.textContent = 'Criar conta gratuita';
        
        nameField.style.display = 'none';
        confirmPasswordField.style.display = 'none';
    } else {
        cardTitle.textContent = 'Criar sua conta';
        cardDescription.textContent = 'Cadastre-se e comece sua jornada';
        submitButton.textContent = 'Criar conta';
        footerText.textContent = 'Já tem uma conta?';
        toggleButton.textContent = 'Fazer login';
        
        nameField.style.display = 'flex';
        confirmPasswordField.style.display = 'flex';
    }
    
    // Clear all errors
    clearErrors();
    
    // Clear all inputs
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
}

// Clear all error messages
function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    
    nameInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    confirmPasswordInput.classList.remove('input-error');
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    clearErrors();
    
    let hasErrors = false;
    
    // Validate name (only for registration)
    if (!isLogin) {
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Nome é obrigatório';
            nameInput.classList.add('input-error');
            hasErrors = true;
        }
    }
    
    // Validate email
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Email é obrigatório';
        emailInput.classList.add('input-error');
        hasErrors = true;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent = 'Email inválido';
        emailInput.classList.add('input-error');
        hasErrors = true;
    }
    
    // Validate password
    if (!passwordInput.value) {
        passwordError.textContent = 'Senha é obrigatória';
        passwordInput.classList.add('input-error');
        hasErrors = true;
    } else if (!isLogin && passwordInput.value.length < 6) {
        passwordError.textContent = 'Senha deve ter pelo menos 6 caracteres';
        passwordInput.classList.add('input-error');
        hasErrors = true;
    }
    
    // Validate confirm password (only for registration)
    if (!isLogin) {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'As senhas não coincidem';
            confirmPasswordInput.classList.add('input-error');
            hasErrors = true;
        }
    }
    
    if (!hasErrors) {
        const action = isLogin ? 'Login' : 'Cadastro';
        const profileTypeText = profileType === 'company' ? 'Empresa' : 'Estudante';
        alert(`${action} realizado com sucesso!\nPerfil: ${profileTypeText}\nEmail: ${emailInput.value}`);
        
        // Reset form
        mainForm.reset();
    }
}

// Handle profile type selection
function handleProfileSelection(type) {
    profileType = type;
    
    if (type === 'company') {
        companyButton.classList.add('profile-button-active');
        studentButton.classList.remove('profile-button-active');
    } else {
        studentButton.classList.add('profile-button-active');
        companyButton.classList.remove('profile-button-active');
    }
}

// Toggle between login and registration
function toggleMode() {
    isLogin = !isLogin;
    updateUI();
}

// Event listeners
mainForm.addEventListener('submit', handleSubmit);
toggleButton.addEventListener('click', toggleMode);
companyButton.addEventListener('click', () => handleProfileSelection('company'));
studentButton.addEventListener('click', () => handleProfileSelection('student'));

// Clear error on input
nameInput.addEventListener('input', () => {
    nameError.textContent = '';
    nameInput.classList.remove('input-error');
});

emailInput.addEventListener('input', () => {
    emailError.textContent = '';
    emailInput.classList.remove('input-error');
});

passwordInput.addEventListener('input', () => {
    passwordError.textContent = '';
    passwordInput.classList.remove('input-error');
});

confirmPasswordInput.addEventListener('input', () => {
    confirmPasswordError.textContent = '';
    confirmPasswordInput.classList.remove('input-error');
});

// Initialize
updateUI();

