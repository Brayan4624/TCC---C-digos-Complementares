// script.js - NEXUS - Sistema de Autenticação

// Configurações e constantes
const CONFIG = {
    API_BASE_URL: 'https://api.nexus.com/v1',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    SUCCESS_REDIRECT_DELAY: 2000,
    ANIMATION_DURATION: 300
};

// Estado da aplicação
const appState = {
    currentProfile: 'empresa',
    currentScreen: 'login',
    isAuthenticated: false,
    userData: null,
    sessionTimer: null,
    isLoading: false
};

// Elementos DOM
const DOM = {
    // Telas
    loginScreen: document.getElementById('loginScreen'),
    createAccountScreen: document.getElementById('createAccountScreen'),
    
    // Navegação
    showCreateAccount: document.getElementById('showCreateAccount'),
    showLogin: document.getElementById('showLogin'),
    backToLogin: document.getElementById('backToLogin'),
    
    // Brand
    brandTag: document.getElementById('brandTag'),
    
    // Login Screen
    profileOptions: document.querySelectorAll('.profile-option'),
    loginForm: document.getElementById('loginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.querySelector('.login-btn'),
    ssoBtn: document.querySelector('.sso-btn'),
    
    // Create Account Screen
    accountOptions: document.querySelectorAll('.account-option'),
    continueBtn: document.getElementById('continueBtn'),
    radioInputs: document.querySelectorAll('input[name="accountType"]')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkExistingSession();
    setupAnimations();
});

/**
 * Inicializa a aplicação
 */
function initializeApp() {
    console.log('🚀 NEXUS - Sistema de autenticação inicializado');
    
    // Verifica se todos os elementos necessários estão presentes
    if (!DOM.loginForm || !DOM.emailInput || !DOM.passwordInput) {
        console.error('❌ Elementos do formulário não encontrados');
        showError('Erro na inicialização do sistema. Recarregue a página.');
        return;
    }
    
    // Configura placeholders dinâmicos baseados no perfil
    updatePlaceholders();
    
    // Aplica máscara de email se houver um valor padrão
    if (DOM.emailInput.value) {
        formatEmailInput(DOM.emailInput);
    }
    
    console.log('✅ Aplicação inicializada com sucesso');
}

/**
 * Configura os event listeners
 */
function setupEventListeners() {
    // Navegação entre telas
    DOM.showCreateAccount.addEventListener('click', showCreateAccountScreen);
    DOM.showLogin.addEventListener('click', showLoginScreen);
    DOM.backToLogin.addEventListener('click', showLoginScreen);
    
    // Tela de Login
    DOM.profileOptions.forEach(option => {
        option.addEventListener('click', handleProfileSelection);
        option.addEventListener('mouseenter', handleProfileHover);
        option.addEventListener('mouseleave', handleProfileHoverOut);
    });
    
    DOM.loginForm.addEventListener('submit', handleLoginSubmit);
    DOM.emailInput.addEventListener('input', debounce(handleEmailInput, 300));
    DOM.emailInput.addEventListener('blur', validateEmail);
    DOM.emailInput.addEventListener('focus', handleInputFocus);
    DOM.passwordInput.addEventListener('input', debounce(handlePasswordInput, 300));
    DOM.passwordInput.addEventListener('blur', validatePassword);
    DOM.passwordInput.addEventListener('focus', handleInputFocus);
    DOM.ssoBtn.addEventListener('click', handleSSOLogin);
    
    // Tela de Criar Conta
    DOM.accountOptions.forEach(option => {
        option.addEventListener('click', handleAccountTypeSelection);
        option.addEventListener('mouseenter', handleAccountOptionHover);
        option.addEventListener('mouseleave', handleAccountOptionHoverOut);
    });
    
    DOM.continueBtn.addEventListener('click', handleContinueToSignup);
    DOM.radioInputs.forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });
    
    // Teclas de atalho
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Configura animações iniciais
 */
function setupAnimations() {
    // Animação de entrada dos elementos
    const elements = [
        DOM.brandTag,
        ...DOM.profileOptions,
        DOM.emailInput,
        DOM.passwordInput,
        DOM.loginBtn,
        DOM.ssoBtn
    ];
    
    elements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = `all 0.6s ease ${index * 0.1}s`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }
    });
}

/**
 * Navegação entre telas
 */
function showCreateAccountScreen() {
    DOM.loginScreen.classList.remove('active-screen');
    DOM.createAccountScreen.classList.add('active-screen');
    DOM.brandTag.textContent = 'Instagram: legal@nexus.com';
    appState.currentScreen = 'create-account';
    
    // Animação de entrada
    animateScreenTransition(DOM.createAccountScreen);
    
    console.log('📝 Mudando para tela de criar conta');
}

function showLoginScreen() {
    DOM.createAccountScreen.classList.remove('active-screen');
    DOM.loginScreen.classList.add('active-screen');
    DOM.brandTag.textContent = 'Investigação de talentos gerais';
    appState.currentScreen = 'login';
    
    // Animação de entrada
    animateScreenTransition(DOM.loginScreen);
    
    console.log('🔐 Mudando para tela de login');
}

function animateScreenTransition(screen) {
    screen.style.opacity = '0';
    screen.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        screen.style.transition = 'all 0.4s ease';
        screen.style.opacity = '1';
        screen.style.transform = 'translateX(0)';
    }, 50);
}

/**
 * Manipula a seleção de perfil
 */
function handleProfileSelection(event) {
    if (appState.isLoading) return;
    
    const selectedOption = event.currentTarget;
    const profileType = selectedOption.id;
    
    // Animação de seleção
    DOM.profileOptions.forEach(opt => {
        opt.style.transform = 'scale(0.95)';
        setTimeout(() => {
            opt.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Remove a classe active de todos
    DOM.profileOptions.forEach(opt => {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
    });
    
    // Adiciona a classe active apenas ao clicado
    selectedOption.classList.add('active');
    selectedOption.setAttribute('aria-selected', 'true');
    
    // Efeito visual de confirmação
    selectedOption.style.transform = 'scale(1.05)';
    setTimeout(() => {
        selectedOption.style.transform = 'scale(1)';
    }, 200);
    
    // Atualiza o estado
    appState.currentProfile = profileType;
    
    // Atualiza placeholders e textos
    updatePlaceholders();
    
    // Feedback visual
    showVisualFeedback(selectedOption);
    
    console.log(`👤 Perfil alterado para: ${profileType}`);
}

/**
 * Efeitos hover no perfil
 */
function handleProfileHover(event) {
    if (appState.isLoading) return;
    
    const option = event.currentTarget;
    if (!option.classList.contains('active')) {
        option.style.transform = 'translateY(-5px) scale(1.02)';
        option.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.2)';
    }
}

function handleProfileHoverOut(event) {
    const option = event.currentTarget;
    if (!option.classList.contains('active')) {
        option.style.transform = 'translateY(0) scale(1)';
        option.style.boxShadow = '';
    }
}

/**
 * Manipula o envio do formulário de login
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    if (appState.isLoading) return;
    
    // Validação dos campos
    if (!validateLoginForm()) {
        shakeForm();
        return;
    }
    
    // Prepara dados do formulário
    const formData = {
        email: DOM.emailInput.value.trim(),
        password: DOM.passwordInput.value,
        profileType: appState.currentProfile,
        timestamp: new Date().toISOString()
    };
    
    // Mostra estado de carregamento
    setLoadingState(true);
    
    try {
        // Simula uma requisição de API
        const response = await simulateLoginAPI(formData);
        
        if (response.success) {
            await handleSuccessfulLogin(response.data);
        } else {
            handleLoginError(response.error);
        }
    } catch (error) {
        handleLoginError('Erro de conexão. Verifique sua internet e tente novamente.');
        console.error('❌ Erro no login:', error);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Simula uma chamada de API de login
 */
async function simulateLoginAPI(formData) {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Validações simuladas
    if (!CONFIG.EMAIL_REGEX.test(formData.email)) {
        return {
            success: false,
            error: 'Formato de email inválido. Use: usuario@exemplo.com'
        };
    }
    
    if (formData.password.length < CONFIG.PASSWORD_MIN_LENGTH) {
        return {
            success: false,
            error: `A senha deve ter pelo menos ${CONFIG.PASSWORD_MIN_LENGTH} caracteres`
        };
    }
    
    // Simula credenciais válidas
    const validCredentials = {
        'empresa': ['empresa@nexus.com', 'contato@empresa.com'],
        'estudantil': ['estudante@nexus.com', 'aluno@universidade.edu']
    };
    
    const validEmails = validCredentials[formData.profileType] || [];
    const isValidEmail = validEmails.some(validEmail => 
        formData.email.toLowerCase() === validEmail.toLowerCase()
    );
    
    const isValidPassword = formData.password === 'nexus123';
    
    if (isValidEmail && isValidPassword) {
        return {
            success: true,
            data: {
                user: {
                    id: generateId(),
                    email: formData.email,
                    name: formData.profileType === 'empresa' ? 'Empresa Nexus' : 'Estudante Nexus',
                    profile: formData.profileType,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.profileType === 'empresa' ? 'Empresa' : 'Estudante')}&background=ec4899&color=fff&bold=true`
                },
                token: 'nexus_token_' + generateId(),
                expiresIn: CONFIG.SESSION_TIMEOUT
            }
        };
    }
    
    return {
        success: false,
        error: 'Email ou senha incorretos. Verifique suas credenciais.'
    };
}

/**
 * Manipula login bem-sucedido
 */
async function handleSuccessfulLogin(userData) {
    // Efeito visual de sucesso
    showSuccess(`Bem-vindo(a) de volta, ${userData.user.name}!`);
    
    // Atualiza estado da aplicação
    appState.isAuthenticated = true;
    appState.userData = userData;
    
    // Salva sessão
    saveSession(userData);
    
    // Inicia timer de sessão
    startSessionTimer();
    
    // Animação de transição
    await animateSuccessTransition();
    
    console.log('✅ Login realizado com sucesso:', userData);
    
    // Redireciona após delay
    setTimeout(() => {
        redirectToDashboard();
    }, CONFIG.SUCCESS_REDIRECT_DELAY);
}

/**
 * Animação de transição de sucesso
 */
async function animateSuccessTransition() {
    const container = document.querySelector('.container');
    container.style.transform = 'scale(0.95)';
    container.style.opacity = '0.8';
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    container.style.transition = 'all 0.5s ease';
    container.style.transform = 'scale(1)';
    container.style.opacity = '1';
}

/**
 * Manipula erro no login
 */
function handleLoginError(errorMessage) {
    showError(errorMessage);
    
    // Efeito de shake no formulário
    shakeForm();
    
    // Adiciona classe de erro aos inputs
    DOM.emailInput.classList.add('error');
    DOM.passwordInput.classList.add('error');
    
    // Remove classes de erro após 3 segundos
    setTimeout(() => {
        DOM.emailInput.classList.remove('error');
        DOM.passwordInput.classList.remove('error');
    }, 3000);
    
    // Foca no campo de email para correção
    DOM.emailInput.focus();
}

/**
 * Efeito de shake no formulário
 */
function shakeForm() {
    DOM.loginForm.style.transform = 'translateX(10px)';
    
    setTimeout(() => {
        DOM.loginForm.style.transform = 'translateX(-10px)';
    }, 100);
    
    setTimeout(() => {
        DOM.loginForm.style.transform = 'translateX(5px)';
    }, 200);
    
    setTimeout(() => {
        DOM.loginForm.style.transform = 'translateX(0)';
    }, 300);
}

/**
 * Manipula login SSO
 */
function handleSSOLogin() {
    if (appState.isLoading) return;
    
    showFeedback('Iniciando autenticação SSO...');
    
    // Efeito visual no botão SSO
    DOM.ssoBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        DOM.ssoBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Simula redirecionamento SSO
    setTimeout(() => {
        showInfo('Sistema SSO em desenvolvimento');
        console.log('🔐 Iniciando fluxo SSO...');
    }, 1000);
}

/**
 * Manipula seleção de tipo de conta
 */
function handleAccountTypeSelection(event) {
    const selectedOption = event.currentTarget;
    const accountType = selectedOption.id.replace('option', '').toLowerCase();
    const radioId = `radio${selectedOption.id.replace('option', '')}`;
    const radioInput = document.getElementById(radioId);
    
    // Marca o radio button
    radioInput.checked = true;
    
    // Atualiza visualmente
    DOM.accountOptions.forEach(opt => opt.classList.remove('selected'));
    selectedOption.classList.add('selected');
    
    // Habilita o botão continuar
    DOM.continueBtn.disabled = false;
    DOM.continueBtn.textContent = `Continuar como ${accountType === 'estudante' ? 'Estudante' : 'Empresa'}`;
    
    // Feedback visual
    showVisualFeedback(selectedOption);
    
    console.log(`📝 Tipo de conta selecionado: ${accountType}`);
}

/**
 * Manipula mudança no radio button
 */
function handleRadioChange(event) {
    const radioId = event.target.id;
    const accountType = radioId.replace('radio', '').toLowerCase();
    const accountOption = document.getElementById(`option${radioId.replace('radio', '')}`);
    
    if (accountOption) {
        DOM.accountOptions.forEach(opt => opt.classList.remove('selected'));
        accountOption.classList.add('selected');
        DOM.continueBtn.disabled = false;
        DOM.continueBtn.textContent = `Continuar como ${accountType === 'estudante' ? 'Estudante' : 'Empresa'}`;
    }
}

/**
 * Efeitos hover nas opções de conta
 */
function handleAccountOptionHover(event) {
    const option = event.currentTarget;
    if (!option.classList.contains('selected')) {
        option.style.transform = 'translateY(-2px)';
        option.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.15)';
    }
}

function handleAccountOptionHoverOut(event) {
    const option = event.currentTarget;
    if (!option.classList.contains('selected')) {
        option.style.transform = 'translateY(0)';
        option.style.boxShadow = '';
    }
}

/**
 * Manipula continuar para cadastro
 */
function handleContinueToSignup() {
    const selectedOption = document.querySelector('.account-option.selected');
    
    if (!selectedOption) {
        showError('Por favor, selecione um tipo de conta.');
        return;
    }

    const accountType = selectedOption.id.replace('option', '').toLowerCase();
    const accountTypeName = accountType === 'estudante' ? 'Estudante' : 'Empresa';
    
    // Simula o processo de criação de conta
    const loading = showLoading('Criando sua conta...');
    
    setTimeout(() => {
        loading.hide();
        showSuccess(`Conta ${accountTypeName} criada com sucesso!`);
        
        // Em produção, redirecionaria para a próxima etapa
        setTimeout(() => {
            alert(`🎉 Conta ${accountTypeName} criada com sucesso!\n\nRedirecionando para completar seu perfil...`);
            // window.location.href = `completar-perfil.html?type=${accountType}`;
        }, 1000);
    }, 2000);
}

/**
 * Validação do formulário de login
 */
function validateLoginForm() {
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    
    return emailValid && passwordValid;
}

/**
 * Validação de email
 */
function validateEmail() {
    const email = DOM.emailInput.value.trim();
    
    if (!email) {
        showFieldError(DOM.emailInput, 'Email é obrigatório');
        return false;
    }
    
    if (!CONFIG.EMAIL_REGEX.test(email)) {
        showFieldError(DOM.emailInput, 'Formato de email inválido. Use: usuario@exemplo.com');
        return false;
    }
    
    clearFieldError(DOM.emailInput);
    return true;
}

/**
 * Validação de senha
 */
function validatePassword() {
    const password = DOM.passwordInput.value;
    
    if (!password) {
        showFieldError(DOM.passwordInput, 'Senha é obrigatória');
        return false;
    }
    
    if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
        showFieldError(DOM.passwordInput, `A senha deve ter pelo menos ${CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
        return false;
    }
    
    clearFieldError(DOM.passwordInput);
    return true;
}

/**
 * Manipula input de email
 */
function handleEmailInput(event) {
    formatEmailInput(event.target);
    clearFieldError(DOM.emailInput);
    validateEmailStrength(event.target.value);
}

/**
 * Manipula input de senha
 */
function handlePasswordInput(event) {
    clearFieldError(DOM.passwordInput);
    updatePasswordStrength(event.target.value);
}

/**
 * Manipula foco nos inputs
 */
function handleInputFocus(event) {
    const input = event.target;
    input.parentElement.classList.add('focused');
    
    input.addEventListener('blur', function() {
        input.parentElement.classList.remove('focused');
    });
}

/**
 * Formata input de email
 */
function formatEmailInput(input) {
    input.value = input.value.trim().toLowerCase();
}

/**
 * Valida força do email
 */
function validateEmailStrength(email) {
    const isValid = CONFIG.EMAIL_REGEX.test(email);
    DOM.emailInput.style.borderColor = isValid ? '#22c55e' : '#e5e5e5';
}

/**
 * Atualiza força da senha
 */
function updatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Atualiza visualmente
    const colors = {
        0: '#ef4444',
        1: '#ef4444',
        2: '#f59e0b',
        3: '#84cc16',
        4: '#22c55e'
    };
    
    DOM.passwordInput.style.borderColor = colors[strength] || '#e5e5e5';
}

/**
 * Atualiza placeholders baseados no perfil
 */
function updatePlaceholders() {
    const profile = appState.currentProfile;
    
    const placeholders = {
        empresa: {
            email: 'contato@empresa.com',
            hint: 'Entre para gerenciar suas vagas e talentos'
        },
        estudantil: {
            email: 'aluno@universidade.edu',
            hint: 'Entre para encontrar oportunidades incríveis'
        }
    };
    
    const current = placeholders[profile] || placeholders.empresa;
    
    DOM.emailInput.placeholder = current.email;
    
    // Atualiza hint se existir no DOM
    const hintElement = document.querySelector('.login-header p');
    if (hintElement) {
        hintElement.textContent = current.hint;
    }
}

/**
 * Manipula atalhos de teclado
 */
function handleKeyboardShortcuts(event) {
    // Ctrl + Enter para submeter formulário
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (appState.currentScreen === 'login') {
            DOM.loginForm.dispatchEvent(new Event('submit'));
        } else {
            DOM.continueBtn.click();
        }
    }
    
    // Escape para limpar formulário
    if (event.key === 'Escape') {
        if (appState.currentScreen === 'login') {
            DOM.loginForm.reset();
            clearFieldErrors();
        } else {
            DOM.accountOptions.forEach(opt => opt.classList.remove('selected'));
            DOM.continueBtn.disabled = true;
            DOM.continueBtn.textContent = 'Continuar';
            DOM.radioInputs.forEach(radio => radio.checked = false);
        }
    }
    
    // Navegação entre telas
    if (event.altKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                showLoginScreen();
                break;
            case '2':
                event.preventDefault();
                showCreateAccountScreen();
                break;
        }
    }
}

// Continua no próximo comentário...