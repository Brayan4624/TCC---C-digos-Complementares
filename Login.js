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
 * Feedback de força da senha
 */
function showPasswordFeedback(feedback) {
    let feedbackDiv = document.querySelector('.password-feedback');
    
    if (!feedbackDiv) {
        feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'password-feedback';
        DOM.passwordInput.parentNode.appendChild(feedbackDiv);
    }
    
    feedbackDiv.innerHTML = feedback.map(item => 
        `<div class="feedback-item">• ${item}</div>`
    ).join('');
    
    feedbackDiv.style.cssText = `
        margin-top: 8px;
        padding: 12px;
        background: rgba(236, 72, 153, 0.05);
        border: 1px solid rgba(236, 72, 153, 0.2);
        border-radius: 8px;
        font-size: 0.8rem;
        color: #a3a3a3;
    `;
}

function clearPasswordFeedback() {
    const feedbackDiv = document.querySelector('.password-feedback');
    if (feedbackDiv) {
        feedbackDiv.remove();
    }
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

function showConfettiEffect() {
    const confettiCount = 30;
    const container = document.querySelector('.container');
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(container);
    }
}

function createConfetti(container) {
    const confetti = document.createElement('div');
    confetti.innerHTML = ['🎉', '✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 5)];
    confetti.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: confetti 1.5s ease-out forwards;
    `;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2;
    const rotation = Math.random() * 360;
    
    confetti.style.setProperty('--angle', `${angle}rad`);
    confetti.style.setProperty('--velocity', velocity);
    confetti.style.setProperty('--rotation', `${rotation}deg`);
    
    container.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 1500);
}

/**
 * Sistema de áudio
 */
function playSelectionSound() {
    // Simula som de seleção (em produção, usar Audio API)
    console.log('🔊 Play selection sound');
}

function playSuccessSound() {
    console.log('🔊 Play success sound');
}

function playErrorSound() {
    console.log('🔊 Play error sound');
}

function playClickSound() {
    console.log('🔊 Play click sound');
}

/**
 * Gerenciamento de sessão
 */
function saveSession(userData) {
    const sessionData = {
        user: userData.user,
        token: userData.token,
        permissions: userData.permissions,
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
 * Tooltips
 */
function initializeTooltips() {
    const tooltips = {
        empresa: 'Para empresas que buscam talentos',
        estudantil: 'Para estudantes em busca de oportunidades',
        email: 'Use o email cadastrado no NEXUS',
        password: 'Sua senha deve ter pelo menos 8 caracteres',
        sso: 'Autenticação segura com Single Sign-On'
    };
    
    // Adiciona tooltips aos elementos
    Object.keys(tooltips).forEach(key => {
        const element = document.querySelector(`[data-tooltip="${key}"]`);
        if (element) {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        }
    });
}

function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = getTooltipContent(tooltipText);
    
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        transform: translateY(-100%) translateX(-50%);
        left: 50%;
        top: -8px;
    `;
    
    event.target.style.position = 'relative';
    event.target.appendChild(tooltip);
}

function hideTooltip(event) {
    const tooltip = event.target.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function getTooltipContent(key) {
    const contents = {
        empresa: 'Para empresas que buscam talentos',
        estudantil: 'Para estudantes em busca de oportunidades',
        email: 'Use o email cadastrado no NEXUS',
        password: 'Sua senha deve ter pelo menos 8 caracteres',
        sso: 'Autenticação segura com Single Sign-On'
    };
    
    return contents[key] || 'Informação adicional';
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
        
        @keyframes confetti {
            0% {
                transform: translate(-50%, -50%) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: 
                    translate(
                        calc(-50% + cos(var(--angle)) * var(--velocity) * 100px),
                        calc(-50% + sin(var(--angle)) * var(--velocity) * 100px)
                    )
                    rotate(var(--rotation));
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
    validateForm: validateForm,
    getProfileDisplayName,
    showSuccess,
    showError,
    showInfo
};

console.log('✅ NEXUS - Script carregado com sucesso');
console.log('🎨 Design: Preto, Cinza e Rosa Moderno');
console.log('🚀 Versão: 1.0.0');

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
 * Feedback de força da senha
 */
function showPasswordFeedback(feedback) {
    let feedbackDiv = document.querySelector('.password-feedback');
    
    if (!feedbackDiv) {
        feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'password-feedback';
        DOM.passwordInput.parentNode.appendChild(feedbackDiv);
    }
    
    feedbackDiv.innerHTML = feedback.map(item => 
        `<div class="feedback-item">• ${item}</div>`
    ).join('');
    
    feedbackDiv.style.cssText = `
        margin-top: 8px;
        padding: 12px;
        background: rgba(236, 72, 153, 0.05);
        border: 1px solid rgba(236, 72, 153, 0.2);
        border-radius: 8px;
        font-size: 0.8rem;
        color: #a3a3a3;
    `;
}

function clearPasswordFeedback() {
    const feedbackDiv = document.querySelector('.password-feedback');
    if (feedbackDiv) {
        feedbackDiv.remove();
    }
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

function showConfettiEffect() {
    const confettiCount = 30;
    const container = document.querySelector('.container');
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(container);
    }
}

function createConfetti(container) {
    const confetti = document.createElement('div');
    confetti.innerHTML = ['🎉', '✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 5)];
    confetti.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: confetti 1.5s ease-out forwards;
    `;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2;
    const rotation = Math.random() * 360;
    
    confetti.style.setProperty('--angle', `${angle}rad`);
    confetti.style.setProperty('--velocity', velocity);
    confetti.style.setProperty('--rotation', `${rotation}deg`);
    
    container.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 1500);
}

/**
 * Sistema de áudio
 */
function playSelectionSound() {
    // Simula som de seleção (em produção, usar Audio API)
    console.log('🔊 Play selection sound');
}

function playSuccessSound() {
    console.log('🔊 Play success sound');
}

function playErrorSound() {
    console.log('🔊 Play error sound');
}

function playClickSound() {
    console.log('🔊 Play click sound');
}

/**
 * Gerenciamento de sessão
 */
function saveSession(userData) {
    const sessionData = {
        user: userData.user,
        token: userData.token,
        permissions: userData.permissions,
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
 * Tooltips
 */
function initializeTooltips() {
    const tooltips = {
        empresa: 'Para empresas que buscam talentos',
        estudantil: 'Para estudantes em busca de oportunidades',
        email: 'Use o email cadastrado no NEXUS',
        password: 'Sua senha deve ter pelo menos 8 caracteres',
        sso: 'Autenticação segura com Single Sign-On'
    };
    
    // Adiciona tooltips aos elementos
    Object.keys(tooltips).forEach(key => {
        const element = document.querySelector(`[data-tooltip="${key}"]`);
        if (element) {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        }
    });
}

function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = getTooltipContent(tooltipText);
    
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        transform: translateY(-100%) translateX(-50%);
        left: 50%;
        top: -8px;
    `;
    
    event.target.style.position = 'relative';
    event.target.appendChild(tooltip);
}

function hideTooltip(event) {
    const tooltip = event.target.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function getTooltipContent(key) {
    const contents = {
        empresa: 'Para empresas que buscam talentos',
        estudantil: 'Para estudantes em busca de oportunidades',
        email: 'Use o email cadastrado no NEXUS',
        password: 'Sua senha deve ter pelo menos 8 caracteres',
        sso: 'Autenticação segura com Single Sign-On'
    };
    
    return contents[key] || 'Informação adicional';
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
        
        @keyframes confetti {
            0% {
                transform: translate(-50%, -50%) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: 
                    translate(
                        calc(-50% + cos(var(--angle)) * var(--velocity) * 100px),
                        calc(-50% + sin(var(--angle)) * var(--velocity) * 100px)
                    )
                    rotate(var(--rotation));
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
    validateForm: validateForm,
    getProfileDisplayName,
    showSuccess,
    showError,
    showInfo
};

console.log('✅ NEXUS - Script carregado com sucesso');
console.log('🎨 Design: Preto, Cinza e Rosa Moderno');
console.log('🚀 Versão: 1.0.0');