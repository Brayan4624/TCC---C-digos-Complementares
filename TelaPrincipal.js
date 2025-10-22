// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    SUCCESS_REDIRECT_DELAY: 2000
};

// ===== GERENCIAMENTO DE TELAS =====
const DOM = {
    loginScreen: document.getElementById('loginScreen'),
    createAccountScreen: document.getElementById('createAccountScreen'),
    showCreateAccount: document.getElementById('showCreateAccount'),
    showLogin: document.getElementById('showLogin'),
    backToLogin: document.getElementById('backToLogin'),
    brandTag: document.getElementById('brandTag'),
    accountOptions: document.querySelectorAll('.account-option'),
    continueBtn: document.getElementById('continueBtn'),
    radioInputs: document.querySelectorAll('input[name="accountType"]'),
    ssoBtn: document.querySelector('.sso-btn')
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupAnimations();
});

function setupEventListeners() {
    // Navegação entre telas
    DOM.showCreateAccount.addEventListener('click', showCreateAccountScreen);
    DOM.showLogin.addEventListener('click', showLoginScreen);
    DOM.backToLogin.addEventListener('click', showLoginScreen);
    
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
    
    DOM.ssoBtn.addEventListener('click', handleSSOLogin);
    
    // Teclas de atalho
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function setupAnimations() {
    const elements = [DOM.brandTag, DOM.ssoBtn];
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

// ===== NAVEGAÇÃO =====
function showCreateAccountScreen() {
    DOM.loginScreen.classList.remove('active-screen');
    DOM.createAccountScreen.classList.add('active-screen');
    DOM.brandTag.textContent = 'Instagram: legal@nexus.com';
    animateScreenTransition(DOM.createAccountScreen);
}

function showLoginScreen() {
    DOM.createAccountScreen.classList.remove('active-screen');
    DOM.loginScreen.classList.add('active-screen');
    DOM.brandTag.textContent = 'Conectando talentos e oportunidades';
    animateScreenTransition(DOM.loginScreen);
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

// ===== SELEÇÃO DE TIPO DE CONTA =====
function handleAccountTypeSelection(event) {
    const selectedOption = event.currentTarget;
    const accountType = selectedOption.id.replace('option', '').toLowerCase();
    const radioId = `radio${selectedOption.id.replace('option', '')}`;
    const radioInput = document.getElementById(radioId);
    
    radioInput.checked = true;
    DOM.accountOptions.forEach(opt => opt.classList.remove('selected'));
    selectedOption.classList.add('selected');
    DOM.continueBtn.disabled = false;
    DOM.continueBtn.textContent = `Continuar como ${accountType === 'estudante' ? 'Estudante' : 'Empresa'}`;
    showVisualFeedback(selectedOption);
}

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

// ===== REDIRECIONAMENTO PARA CADASTRO =====
function handleContinueToSignup() {
    const selectedOption = document.querySelector('.account-option.selected');
    
    if (!selectedOption) {
        showError('Por favor, selecione um tipo de conta.');
        return;
    }

    const accountType = selectedOption.id.replace('option', '').toLowerCase();
    
    // Redireciona para a página de cadastro específica
    if (accountType === 'estudante') {
        window.location.href = 'perfil-estudante.html';
    } else {
        window.location.href = 'perfil-empresa.html';
    }
}

// ===== SSO =====
function handleSSOLogin() {
    showFeedback('Iniciando autenticação SSO...');
    DOM.ssoBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        DOM.ssoBtn.style.transform = 'scale(1)';
    }, 150);
    
    setTimeout(() => {
        showInfo('Sistema SSO em desenvolvimento');
    }, 1000);
}

// ===== UTILITÁRIOS =====
function showVisualFeedback(element) {
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
    setTimeout(() => ripple.remove(), 600);
}

function handleKeyboardShortcuts(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        DOM.continueBtn.click();
    }
    
    if (event.key === 'Escape') {
        DOM.accountOptions.forEach(opt => opt.classList.remove('selected'));
        DOM.continueBtn.disabled = true;
        DOM.continueBtn.textContent = 'Continuar';
        DOM.radioInputs.forEach(radio => radio.checked = false);
    }
    
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

// ===== SISTEMA DE MENSAGENS =====
function showMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.message-overlay');
    if (existingMessage) existingMessage.remove();

    const messageConfig = {
        success: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', icon: '✅' },
        error: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', icon: '❌' },
        info: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', icon: 'ℹ️' },
        feedback: { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)', icon: '💡' }
    };

    const config = messageConfig[type] || messageConfig.info;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-overlay message-${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${config.icon}</span>
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

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
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => messageDiv.parentElement && messageDiv.remove(), 400);
        }
    }, 5000);
}

function showSuccess(message) { showMessage(message, 'success'); }
function showError(message) { showMessage(message, 'error'); }
function showInfo(message) { showMessage(message, 'info'); }
function showFeedback(message) { showMessage(message, 'feedback'); }

// ===== INJEÇÃO DE ESTILOS DINÂMICOS =====
function injectDynamicStyles() {
    const styles = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes ripple {
            to { width: 200px; height: 200px; opacity: 0; }
        }
        .message-content { display: flex; align-items: center; gap: 10px; }
        .message-close { 
            background: none; border: none; color: currentColor; 
            font-size: 18px; cursor: pointer; padding: 0; margin-left: 10px; 
            opacity: 0.7; transition: opacity 0.2s ease; 
        }
        .message-close:hover { opacity: 1; }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

injectDynamicStyles();
console.log('✅ NEXUS - Script principal carregado');