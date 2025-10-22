// script.js

// Configurações e constantes
const CONFIG = {
    API_BASE_URL: 'https://api.nexus.com/v1',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    SUCCESS_REDIRECT_DELAY: 2000
};

// Estado da aplicação
let appState = {
    currentProfile: 'empresa',
    isAuthenticated: false,
    userData: null,
    sessionTimer: null
};

// Elementos DOM
const DOM = {
    profileOptions: document.querySelectorAll('.profile-option'),
    loginForm: document.getElementById('loginForm'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.querySelector('.login-btn'),
    ssoBtn: document.querySelector('.sso-btn'),
    signupLink: document.querySelector('.signup-link a'),
    container: document.querySelector('.container')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkExistingSession();
});

/**
 * Inicializa a aplicação
 */
function initializeApp() {
    console.log('🚀 NEXUS - Inicializando aplicação');
    
    // Verifica se todos os elementos necessários estão presentes
    if (!DOM.loginForm || !DOM.emailInput || !DOM.passwordInput) {
        console.error('❌ Elementos do formulário não encontrados');
        showError('Erro na inicialização da aplicação. Recarregue a página.');
        return;
    }
    
    // Configura placeholder dinâmico baseado no perfil
    updatePlaceholders();
    
    // Aplica máscara de email se houver um valor padrão
    if (DOM.emailInput.value) {
        formatEmailInput(DOM.emailInput);
    }
}

/**
 * Configura os event listeners
 */
function setupEventListeners() {
    // Seleção de perfil
    DOM.profileOptions.forEach(option => {
        option.addEventListener('click', handleProfileSelection);
    });
    
    // Formulário de login
    DOM.loginForm.addEventListener('submit', handleLoginSubmit);
    
    // Validação em tempo real
    DOM.emailInput.addEventListener('input', handleEmailInput);
    DOM.emailInput.addEventListener('blur', validateEmail);
    DOM.passwordInput.addEventListener('input', handlePasswordInput);
    DOM.passwordInput.addEventListener('blur', validatePassword);
    
    // Botão SSO
    DOM.ssoBtn.addEventListener('click', handleSSOLogin);
    
    // Link de cadastro
    DOM.signupLink.addEventListener('click', handleSignupRedirect);
    
    // Teclas de atalho
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Prevenção de copiar/colar na senha (opcional)
    DOM.passwordInput.addEventListener('paste', preventPasswordPaste);
}

/**
 * Manipula a seleção de perfil
 */
function handleProfileSelection(event) {
    const selectedOption = event.currentTarget;
    const profileType = selectedOption.id;
    
    // Remove a classe active de todos
    DOM.profileOptions.forEach(opt => {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
    });
    
    // Adiciona a classe active apenas ao clicado
    selectedOption.classList.add('active');
    selectedOption.setAttribute('aria-selected', 'true');
    
    // Atualiza o estado
    appState.currentProfile = profileType;
    
    // Atualiza placeholders e textos
    updatePlaceholders();
    
    // Feedback visual
    showFeedback(`Perfil ${getProfileDisplayName(profileType)} selecionado`);
    
    console.log(`👤 Perfil alterado para: ${profileType}`);
}

/**
 * Manipula o envio do formulário de login
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    // Validação dos campos
    if (!validateForm()) {
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
        handleLoginError('Erro de conexão. Tente novamente.');
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
            error: 'Formato de email inválido'
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
        'empresa': ['empresa@nexus.com', 'empresa123'],
        'estudantil': ['estudante@nexus.com', 'estudante123']
    };
    
    const [validEmail, validPassword] = validCredentials[formData.profileType] || [];
    
    if (formData.email === validEmail && formData.password === validPassword) {
        return {
            success: true,
            data: {
                user: {
                    id: Math.random().toString(36).substr(2, 9),
                    email: formData.email,
                    name: formData.profileType === 'empresa' ? 'Empresa Nexus' : 'Estudante Nexus',
                    profile: formData.profileType,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.profileType === 'empresa' ? 'Empresa' : 'Estudante')}&background=1a2a6c&color=fff`
                },
                token: 'nexus_token_' + Math.random().toString(36).substr(2),
                expiresIn: CONFIG.SESSION_TIMEOUT
            }
        };
    }
    
    return {
        success: false,
        error: 'Email ou senha incorretos'
    };
}

/**
 * Manipula login bem-sucedido
 */
async function handleSuccessfulLogin(userData) {
    // Atualiza estado da aplicação
    appState.isAuthenticated = true;
    appState.userData = userData;
    
    // Salva sessão
    saveSession(userData);
    
    // Inicia timer de sessão
    startSessionTimer();
    
    // Mostra mensagem de sucesso
    showSuccess(`Bem-vindo(a) de volta, ${userData.user.name}!`);
    
    // Log para debug
    console.log('✅ Login realizado com sucesso:', userData);
    
    // Redireciona após delay
    setTimeout(() => {
        redirectToDashboard();
    }, CONFIG.SUCCESS_REDIRECT_DELAY);
}

/**
 * Manipula erro no login
 */
function handleLoginError(errorMessage) {
    showError(errorMessage);
    
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
 * Manipula login SSO
 */
function handleSSOLogin() {
    showFeedback('Redirecionando para autenticação SSO...');
    
    // Simula redirecionamento SSO
    setTimeout(() => {
        // Em um ambiente real, isso redirecionaria para o provedor SSO
        showInfo('Funcionalidade SSO em desenvolvimento');
        console.log('🔐 Redirecionando para SSO...');
    }, 1000);
}

/**
 * Manipula redirecionamento para cadastro
 */
function handleSignupRedirect(event) {
    event.preventDefault();
    
    showFeedback('Redirecionando para criação de conta...');
    
    // Simula redirecionamento para página de cadastro
    setTimeout(() => {
        // Em um ambiente real, isso redirecionaria para a página de cadastro
        window.location.href = '/signup?profile=' + appState.currentProfile;
    }, 500);
}

/**
 * Validação do formulário
 */
function validateForm() {
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
        showFieldError(DOM.emailInput, 'Formato de email inválido');
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
}

/**
 * Manipula input de senha
 */
function handlePasswordInput(event) {
    updatePasswordStrength(event.target.value);
    clearFieldError(DOM.passwordInput);
}

/**
 * Formata input de email
 */
function formatEmailInput(input) {
    // Remove espaços e converte para minúsculas
    input.value = input.value.trim().toLowerCase();
}

/**
 * Atualiza força da senha (visual)
 */
function updatePasswordStrength(password) {
    // Implementação básica de força de senha
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Atualiza visualmente (poderia ser implementado com uma barra de progresso)
    DOM.passwordInput.style.borderColor = 
        strength === 0 ? '#e0e0e0' :
        strength <= 2 ? '#ff6b6b' :
        strength <= 3 ? '#fdbb2d' : '#51cf66';
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
    const hintElement = document.querySelector('.login-section p');
    if (hintElement) {
        hintElement.textContent = current.hint;
    }
}

/**
 * Retorna nome display do perfil
 */
function getProfileDisplayName(profileType) {
    const names = {
        empresa: 'Empresa',
        estudantil: 'Estudantil'
    };
    
    return names[profileType] || 'Desconhecido';
}

/**
 * Manipula atalhos de teclado
 */
function handleKeyboardShortcuts(event) {
    // Ctrl + Enter para submeter formulário
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        DOM.loginForm.dispatchEvent(new Event('submit'));
    }
    
    // Alt + 1 para perfil empresa
    if (event.altKey && event.key === '1') {
        event.preventDefault();
        document.getElementById('empresa').click();
    }
    
    // Alt + 2 para perfil estudantil
    if (event.altKey && event.key === '2') {
        event.preventDefault();
        document.getElementById('estudantil').click();
    }
}

/**
 * Previne colar na senha (opcional)
 */
function preventPasswordPaste(event) {
    // event.preventDefault(); // Descomente se quiser prevenir colar
    showFeedback('Colar na senha não é permitido por segurança');
}

/**
 * Define estado de carregamento
 */
function setLoadingState(loading) {
    if (loading) {
        DOM.loginBtn.classList.add('loading');
        DOM.loginBtn.disabled = true;
        DOM.loginBtn.innerHTML = '<span class="loading-spinner"></span> Entrando...';
    } else {
        DOM.loginBtn.classList.remove('loading');
        DOM.loginBtn.disabled = false;
        DOM.loginBtn.textContent = 'Entrar';
    }
    
    // Desabilita outros controles durante o loading
    DOM.profileOptions.forEach(opt => {
        opt.style.pointerEvents = loading ? 'none' : 'auto';
    });
    
    DOM.ssoBtn.disabled = loading;
    DOM.signupLink.style.pointerEvents = loading ? 'none' : 'auto';
}

/**
 * Sistema de mensagens
 */
function showMessage(message, type = 'info') {
    // Remove mensagens existentes
    const existingMessage = document.querySelector('.message-overlay');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-overlay message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${getMessageIcon(type)}</span>
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Adiciona estilos
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getMessageColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
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

function getMessageIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        feedback: '💡'
    };
    return icons[type] || '💡';
}

function getMessageColor(type) {
    const colors = {
        success: '#51cf66',
        error: '#ff6b6b',
        info: '#339af0',
        feedback: '#fdbb2d'
    };
    return colors[type] || '#339af0';
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
        color: #ff6b6b;
        font-size: 0.8rem;
        margin-top: 5px;
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
 * Gerenciamento de sessão
 */
function saveSession(userData) {
    const sessionData = {
        user: userData.user,
        token: userData.token,
        expires: Date.now() + userData.expiresIn
    };
    
    localStorage.setItem('nexus_session', JSON.stringify(sessionData));
}

function checkExistingSession() {
    const sessionData = localStorage.getItem('nexus_session');
    
    if (sessionData) {
        const session = JSON.parse(sessionData);
        
        if (session.expires > Date.now()) {
            // Sessão válida
            appState.isAuthenticated = true;
            appState.userData = { user: session.user, token: session.token };
            startSessionTimer();
            console.log('🔑 Sessão recuperada:', session.user.name);
        } else {
            // Sessão expirada
            localStorage.removeItem('nexus_session');
            console.log('⏰ Sessão expirada');
        }
    }
}

function startSessionTimer() {
    if (appState.sessionTimer) {
        clearTimeout(appState.sessionTimer);
    }
    
    appState.sessionTimer = setTimeout(() => {
        showInfo('Sua sessão expirou. Faça login novamente.');
        logout();
    }, CONFIG.SESSION_TIMEOUT);
}

function logout() {
    appState.isAuthenticated = false;
    appState.userData = null;
    
    localStorage.removeItem('nexus_session');
    
    if (appState.sessionTimer) {
        clearTimeout(appState.sessionTimer);
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
    
    // Simulação
    showSuccess(`Redirecionando para o dashboard ${getProfileDisplayName(profile)}...`);
    console.log(`🔄 Redirecionando para: ${url}`);
}

/**
 * Utilitários
 */
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

// Exporta funções para uso global (se necessário)
window.NEXUS = {
    appState,
    logout,
    validateForm,
    getProfileDisplayName
};

// Adiciona estilos para animações
const style = document.createElement('style');
style.textContent = `
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
    
    input.error {
        border-color: #ff6b6b !important;
        background-color: #fff5f5;
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .message-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

console.log('✅ NEXUS - Script carregado com sucesso');