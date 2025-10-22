// criar-conta.js - NEXUS - Tela de Criar Conta

document.addEventListener('DOMContentLoaded', function() {
    const accountOptions = document.querySelectorAll('.account-option');
    const continueBtn = document.getElementById('continueBtn');
    const radioInputs = document.querySelectorAll('input[name="accountType"]');

    // Seleção de tipo de conta
    accountOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radioId = this.id === 'estudante' ? 'radioEstudante' : 'radioEmpresa';
            const radioInput = document.getElementById(radioId);
            
            // Marca o radio button
            radioInput.checked = true;
            
            // Atualiza visualmente
            accountOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Habilita o botão continuar
            continueBtn.disabled = false;
            continueBtn.textContent = `Continuar como ${this.id === 'estudante' ? 'Estudante' : 'Empresa'}`;
        });
    });

    // Botão continuar
    continueBtn.addEventListener('click', function() {
        const selectedOption = document.querySelector('.account-option.selected');
        
        if (!selectedOption) {
            alert('Por favor, selecione um tipo de conta.');
            return;
        }

        const accountType = selectedOption.id;
        const accountTypeName = accountType === 'estudante' ? 'Estudante' : 'Empresa';
        
        // Simula o processo de criação de conta
        showLoading('Criando sua conta...');
        
        setTimeout(() => {
            alert(`Conta ${accountTypeName} criada com sucesso!\n\nRedirecionando para completar seu perfil...`);
            // Em produção, redirecionaria para a próxima etapa
            window.location.href = `completar-perfil.html?type=${accountType}`;
        }, 1500);
    });

    // Efeitos hover
    accountOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.15)';
            }
        });

        option.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }
        });
    });
});

function showLoading(message) {
    const continueBtn = document.getElementById('continueBtn');
    const originalText = continueBtn.textContent;
    
    continueBtn.disabled = true;
    continueBtn.innerHTML = `<div class="loading-spinner"></div> ${message}`;
    
    return {
        hide: function() {
            continueBtn.disabled = false;
            continueBtn.textContent = originalText;
        }
    };
}