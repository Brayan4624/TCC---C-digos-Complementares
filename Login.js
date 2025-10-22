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

// Continuação do script.js

/**
 * Sistema de mensagens e feedback
 */
function showMessage(message, type = 'info') {
    // Remove mensagens existentes
    const existingMessage = document.querySelector('.message-overlay');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Cores e ícones para cada tipo
    const messageConfig = {
        success: {
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            icon: '✅'
        },
        error: {
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            icon: '❌'
        },
        info: {
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            icon: 'ℹ️'
        },
        feedback: {
            color: '#ec4899',
            bgColor: 'rgba(236, 72, 153, 0.1)',
            borderColor: 'rgba(236, 72, 153, 0.3)',
            icon: '💡'
        }
    };

    const config = messageConfig[type] || messageConfig.info;

    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-overlay message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${config.icon}</span>
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Estilos da mensagem
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${config.bgColor};
        color: ${config.color};
        border: 1px solid ${config.borderColor};
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(10px);
        max-width: 400px;
        font-size: 0.9rem;
        font-weight: 500;
    `;

    document.body.appendChild(messageDiv);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 400);
        }
    }, 5000);
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showInfo(message) {
    showMessage(message, 'info');
}

function showFeedback(message) {
    showMessage(message, 'feedback');
}

/**
 * Mostra erro em campo específico
 */
function showFieldError(input, message) {
    clearFieldError(input);
    
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 8px;
        padding: 4px 8px;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 4px;
        border-left: 3px solid #ef4444;
    `;
    
    input.parentNode.appendChild(errorDiv);
}

/**
 * Limpa erro do campo
 */
function clearFieldError(input) {
    input.classList.remove('error');
    
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Limpa todos os erros dos campos
 */
function clearFieldErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

/**
 * Efeitos visuais
 */
function showVisualFeedback(element) {
    // Efeito de ripple
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(236, 72, 153, 0.3);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Define estado de carregamento
 */
function setLoadingState(loading) {
    appState.isLoading = loading;
    
    if (loading) {
        DOM.loginBtn.classList.add('loading');
        DOM.loginBtn.disabled = true;
        DOM.loginBtn.innerHTML = '<div class="loading-spinner"></div> Entrando...';
        
        // Desabilita interações
        DOM.profileOptions.forEach(opt => {
            opt.style.pointerEvents = 'none';
            opt.style.opacity = '0.6';
        });
        
        DOM.ssoBtn.disabled = true;
        DOM.emailInput.disabled = true;
        DOM.passwordInput.disabled = true;
    } else {
        DOM.loginBtn.classList.remove('loading');
        DOM.loginBtn.disabled = false;
        DOM.loginBtn.textContent = 'Entrar';
        
        // Reabilita interações
        DOM.profileOptions.forEach(opt => {
            opt.style.pointerEvents = 'auto';
            opt.style.opacity = '1';
        });
        
        DOM.ssoBtn.disabled = false;
        DOM.emailInput.disabled = false;
        DOM.passwordInput.disabled = false;
    }
}

/**
 * Mostra loading no botão continuar
 */
function showLoading(message) {
    const originalText = DOM.continueBtn.textContent;
    
    DOM.continueBtn.disabled = true;
    DOM.continueBtn.innerHTML = `<div class="loading-spinner"></div> ${message}`;
    
    return {
        hide: function() {
            DOM.continueBtn.disabled = false;
            DOM.continueBtn.textContent = originalText;
        }
    };
}

/**
 * Gerenciamento de sessão
 */
function saveSession(userData) {
    const sessionData = {
        user: userData.user,
        token: userData.token,
        expires: Date.now() + userData.expiresIn,
        lastActivity: Date.now()
    };
    
    try {
        localStorage.setItem('nexus_session', JSON.stringify(sessionData));
        console.log('💾 Sessão salva com sucesso');
    } catch (error) {
        console.error('❌ Erro ao salvar sessão:', error);
    }
}

function checkExistingSession() {
    try {
        const sessionData = localStorage.getItem('nexus_session');
        
        if (sessionData) {
            const session = JSON.parse(sessionData);
            
            if (session.expires > Date.now()) {
                // Sessão válida
                appState.isAuthenticated = true;
                appState.userData = { user: session.user, token: session.token };
                startSessionTimer();
                console.log('🔑 Sessão recuperada:', session.user.name);
                
                // Mostra indicador de sessão ativa
                showSessionIndicator();
            } else {
                // Sessão expirada
                localStorage.removeItem('nexus_session');
                console.log('⏰ Sessão expirada');
            }
        }
    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        localStorage.removeItem('nexus_session');
    }
}

function showSessionIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'session-indicator';
    indicator.innerHTML = '🔒 Sessão Ativa';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        border: 1px solid rgba(34, 197, 94, 0.3);
        z-index: 9999;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(indicator);
}

function startSessionTimer() {
    if (appState.sessionTimer) {
        clearTimeout(appState.sessionTimer);
    }
    
    appState.sessionTimer = setTimeout(() => {
        showInfo('Sua sessão expirou por inatividade. Faça login novamente.');
        logout();
    }, CONFIG.SESSION_TIMEOUT);
}

function logout() {
    appState.isAuthenticated = false;
    appState.userData = null;
    
    try {
        localStorage.removeItem('nexus_session');
    } catch (error) {
        console.error('❌ Erro ao remover sessão:', error);
    }
    
    if (appState.sessionTimer) {
        clearTimeout(appState.sessionTimer);
        appState.sessionTimer = null;
    }
    
    // Remove indicador de sessão
    const indicator = document.querySelector('.session-indicator');
    if (indicator) {
        indicator.remove();
    }
    
    console.log('👋 Usuário deslogado');
}

/**
 * Redirecionamento
 */
function redirectToDashboard() {
    const profile = appState.currentProfile;
    const dashboardUrls = {
        empresa: '/empresa/dashboard',
        estudantil: '/estudante/dashboard'
    };
    
    const url = dashboardUrls[profile] || '/dashboard';
    
    // Em um ambiente real:
    // window.location.href = url;
    
    // Simulação para demonstração
    showSuccess(`Redirecionando para o dashboard ${getProfileDisplayName(profile)}...`);
    console.log(`🔄 Redirecionando para: ${url}`);
    
    // Simula o redirecionamento
    setTimeout(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            alert(`🎯 Redirecionado para: ${url}\n\n(Em produção, isso levaria para o dashboard real)`);
            document.body.style.opacity = '1';
        }, 500);
    }, 1000);
}

/**
 * Utilitários
 */
function getProfileDisplayName(profileType) {
    const names = {
        empresa: 'Empresa',
        estudantil: 'Estudantil'
    };
    
    return names[profileType] || 'Desconhecido';
}

function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Adiciona estilos CSS dinâmicos
 */
function injectDynamicStyles() {
    const styles = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes ripple {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        .form-group.focused label {
            color: #ec4899;
        }
        
        .form-group.focused input {
            border-color: #ec4899;
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }
        
        .message-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .message-close {
            background: none;
            border: none;
            color: currentColor;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .message-close:hover {
            opacity: 1;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Injeta os estilos dinâmicos
injectDynamicStyles();

// Exporta funções para uso global (se necessário)
window.NEXUS = {
    appState,
    logout,
    showLoginScreen,
    showCreateAccountScreen,
    validateLoginForm,
    getProfileDisplayName
};

console.log('✅ NEXUS - Script carregado com sucesso');
console.log('🎨 Design: Preto, Cinza e Rosa Moderno');
console.log('🚀 Versão: 2.0.0');
console.log('📱 Telas: Login & Criar Conta');