document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade para os botões de demo
    const demoStudentBtn = document.querySelector('.demo-buttons .btn-secondary:first-child');
    const demoCompanyBtn = document.querySelector('.demo-buttons .btn-secondary:last-child');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    demoStudentBtn.addEventListener('click', function() {
        emailInput.value = 'estudante@demo.com';
        passwordInput.value = 'demo123';
        showMessage('Dados de demo do estudante carregados!');
    });
    
    demoCompanyBtn.addEventListener('click', function() {
        emailInput.value = 'empresa@demo.com';
        passwordInput.value = 'demo123';
        showMessage('Dados de demo da empresa carregados!');
    });
    
    // Funcionalidade do formulário de login
    const loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (!email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // Simular login
        showMessage('Fazendo login...', 'loading');
        
        setTimeout(() => {
            showMessage('Login realizado com sucesso!', 'success');
        }, 1500);
    });
    
    // Função para mostrar mensagens
    function showMessage(message, type = 'info') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        const container = document.querySelector('.login-container');
        container.appendChild(messageDiv);
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
});

