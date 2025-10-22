// Central de Denúncias - Nexus
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const reportForm = document.getElementById('reportForm');
    const confirmation = document.getElementById('confirmation');
    const backButton = document.getElementById('backButton');
    const reportType = document.getElementById('reportType');
    const reportDescription = document.getElementById('reportDescription');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Estado da aplicação
    let uploadedFiles = [];
    let isSubmitting = false;

    // Inicialização
    initApp();

    function initApp() {
        setupEventListeners();
        setupFormValidation();
        loadFromLocalStorage();
    }

    function setupEventListeners() {
        // Upload de arquivos
        fileInput.addEventListener('change', handleFileUpload);
        
        // Envio do formulário
        reportForm.addEventListener('submit', handleFormSubmit);
        
        // Botão voltar
        backButton.addEventListener('click', handleBackButton);
        
        // Validação em tempo real
        reportType.addEventListener('change', validateForm);
        reportDescription.addEventListener('input', validateForm);
        
        // Prevenir fechamento com dados não salvos
        window.addEventListener('beforeunload', handleBeforeUnload);
    }

    function setupFormValidation() {
        // Adicionar validação customizada
        reportForm.addEventListener('input', function(e) {
            const target = e.target;
            if (target.required) {
                validateField(target);
            }
        });
    }

    function validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            field.style.borderColor = '#ff4444';
            field.title = field.validationMessage;
        } else {
            field.style.borderColor = '#3d3d3d';
            field.title = '';
        }
        
        return isValid;
    }

    function validateForm() {
        const isTypeValid = reportType.value !== '';
        const isDescriptionValid = reportDescription.value.trim().length >= 10;
        
        // Atualizar estilos de validação
        reportType.style.borderColor = isTypeValid ? '#3d3d3d' : '#ff4444';
        reportDescription.style.borderColor = isDescriptionValid ? '#3d3d3d' : '#ff4444';
        
        // Habilitar/desabilitar botão
        submitBtn.disabled = !(isTypeValid && isDescriptionValid);
        
        return isTypeValid && isDescriptionValid;
    }

    function handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        // Validar arquivos
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            
            if (!isValidType) {
                showNotification('Apenas imagens são permitidas!', 'error');
                return false;
            }
            
            if (!isValidSize) {
                showNotification('Arquivo muito grande! Máximo 5MB.', 'error');
                return false;
            }
            
            return true;
        });

        // Adicionar aos arquivos existentes
        uploadedFiles = [...uploadedFiles, ...validFiles];
        
        // Atualizar preview
        updatePreview();
        
        // Atualizar input de arquivo (limpar para permitir novos uploads do mesmo arquivo)
        fileInput.value = '';
        
        // Salvar no localStorage
        saveToLocalStorage();
        
        if (validFiles.length > 0) {
            showNotification(`${validFiles.length} arquivo(s) adicionado(s) com sucesso!`, 'success');
        }
    }

    function updatePreview() {
        previewContainer.innerHTML = '';
        
        if (uploadedFiles.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-preview';
            emptyMessage.innerHTML = '<p>Nenhuma imagem adicionada</p>';
            emptyMessage.style.gridColumn = '1 / -1';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--text-gray)';
            emptyMessage.style.padding = '20px';
            previewContainer.appendChild(emptyMessage);
            return;
        }

        uploadedFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.dataset.index = index;
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Preview ${file.name}`;
                img.title = file.name;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '×';
                removeBtn.type = 'button';
                removeBtn.title = 'Remover imagem';
                
                removeBtn.addEventListener('click', function() {
                    removeFile(index);
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                previewContainer.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        });
    }

    function removeFile(index) {
        uploadedFiles.splice(index, 1);
        updatePreview();
        saveToLocalStorage();
        showNotification('Imagem removida!', 'info');
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        if (isSubmitting) return;
        
        // Validar formulário
        if (!validateForm()) {
            showNotification('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
            return;
        }
        
        // Preparar dados
        const formData = {
            reportType: reportType.value,
            reportDescription: reportDescription.value,
            files: uploadedFiles,
            timestamp: new Date().toISOString(),
            reportId: generateReportId()
        };
        
        // Simular envio
        try {
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Enviando...';
            
            // Simular delay de rede
            await simulateNetworkRequest(formData);
            
            // Sucesso
            showConfirmation();
            clearForm();
            clearLocalStorage();
            showNotification('Denúncia enviada com sucesso!', 'success');
            
        } catch (error) {
            // Erro
            showNotification('Erro ao enviar denúncia. Tente novamente.', 'error');
            console.error('Erro no envio:', error);
        } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Enviar Denúncia';
        }
    }

    function simulateNetworkRequest(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular 10% de chance de erro para teste
                if (Math.random() < 0.1) {
                    reject(new Error('Erro de conexão'));
                } else {
                    // Simular sucesso - em produção, enviaria para o servidor
                    console.log('Dados enviados:', {
                        ...formData,
                        files: `${formData.files.length} arquivo(s)`
                    });
                    resolve(formData);
                }
            }, 2000);
        });
    }

    function showConfirmation() {
        reportForm.style.display = 'none';
        confirmation.style.display = 'block';
        
        // Animar entrada
        confirmation.style.animation = 'fadeIn 0.5s ease';
    }

    function handleBackButton() {
        confirmation.style.display = 'none';
        reportForm.style.display = 'block';
    }

    function clearForm() {
        reportForm.reset();
        uploadedFiles = [];
        updatePreview();
        validateForm();
    }

    function generateReportId() {
        return 'NEX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        `;
        
        // Estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#ff4444' : 
                       type === 'success' ? '#00c851' : 
                       type === 'warning' ? '#ffbb33' : '#33b5e5',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease'
        });
        
        // Botão fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none',
        closeBtn.style.border = 'none',
        closeBtn.style.color = 'white',
        closeBtn.style.cursor = 'pointer',
        closeBtn.style.fontSize = '18px',
        closeBtn.style.padding = '0',
        closeBtn.style.width = '20px',
        closeBtn.style.height = '20px'
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Adicionar animações CSS
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
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
            `;
            document.head.appendChild(style);
        }
    }

    function saveToLocalStorage() {
        const formData = {
            reportType: reportType.value,
            reportDescription: reportDescription.value
        };
        
        localStorage.setItem('nexusReportDraft', JSON.stringify(formData));
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('nexusReportDraft');
        
        if (saved) {
            try {
                const formData = JSON.parse(saved);
                reportType.value = formData.reportType || '';
                reportDescription.value = formData.reportDescription || '';
                
                if (formData.reportType || formData.reportDescription) {
                    showNotification('Rascunho recuperado automaticamente.', 'info');
                }
                
                validateForm();
            } catch (error) {
                console.error('Erro ao carregar rascunho:', error);
            }
        }
    }

    function clearLocalStorage() {
        localStorage.removeItem('nexusReportDraft');
    }

    function handleBeforeUnload(event) {
        const hasData = reportType.value || reportDescription.value || uploadedFiles.length > 0;
        
        if (hasData && !isSubmitting) {
            event.preventDefault();
            event.returnValue = 'Você tem dados não salvos. Tem certeza que deseja sair?';
            return event.returnValue;
        }
    }

    // Validação inicial
    validateForm();

    // Expor funções globais para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
        window.nexusReport = {
            clearForm: () => {
                clearForm();
                showNotification('Formulário limpo!', 'info');
            },
            getFormData: () => ({
                reportType: reportType.value,
                reportDescription: reportDescription.value,
                files: uploadedFiles
            }),
            simulateError: () => {
                showNotification('Este é um erro simulado!', 'error');
            }
        };
    }
});