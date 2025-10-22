// ===== CADASTRO EMPRESA =====
document.addEventListener('DOMContentLoaded', function() {
    const empresaForm = document.getElementById('empresaForm');
    const cnpjInput = document.getElementById('cnpj');
    const telefoneInput = document.getElementById('telefoneEmpresa');

    // Formatação de campos
    cnpjInput.addEventListener('input', formatarCNPJ);
    telefoneInput.addEventListener('input', formatarTelefoneEmpresa);

    // Validações
    document.getElementById('senhaEmpresa').addEventListener('input', validarForcaSenhaEmpresa);
    document.getElementById('confirmarSenhaEmpresa').addEventListener('input', validarConfirmacaoSenhaEmpresa);

    // Submissão do formulário
    empresaForm.addEventListener('submit', handleCadastroEmpresa);
});

function formatarCNPJ() {
    let valor = this.value.replace(/\D/g, '');
    
    if (valor.length > 14) valor = valor.substring(0, 14);
    
    if (valor.length > 0) {
        valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    this.value = valor;
}

function formatarTelefoneEmpresa() {
    let valor = this.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.substring(0, 11);
    
    if (valor.length > 0) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        if (valor.length > 10) {
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        } else {
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        }
    }
    
    this.value = valor;
}

function validarForcaSenhaEmpresa() {
    const senha = this.value;
    let forca = 0;
    
    if (senha.length >= 8) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;
    
    const cores = { 0: '#ef4444', 1: '#ef4444', 2: '#f59e0b', 3: '#84cc16', 4: '#22c55e' };
    this.style.borderColor = cores[forca] || '#e5e5e5';
}

function validarConfirmacaoSenhaEmpresa() {
    const senha = document.getElementById('senhaEmpresa').value;
    const confirmacao = this.value;
    
    if (confirmacao && senha !== confirmacao) {
        this.style.borderColor = '#ef4444';
        mostrarErroSenhaEmpresa('As senhas não coincidem');
    } else {
        this.style.borderColor = '#22c55e';
        limparErroSenhaEmpresa();
    }
}

function mostrarErroSenhaEmpresa(mensagem) {
    let erroDiv = document.querySelector('.erro-senha-empresa');
    if (!erroDiv) {
        erroDiv = document.createElement('div');
        erroDiv.className = 'erro-senha-empresa';
        document.getElementById('confirmarSenhaEmpresa').parentNode.appendChild(erroDiv);
    }
    erroDiv.textContent = mensagem;
    erroDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 5px;
    `;
}

function limparErroSenhaEmpresa() {
    const erroDiv = document.querySelector('.erro-senha-empresa');
    if (erroDiv) erroDiv.remove();
}

async function handleCadastroEmpresa(event) {
    event.preventDefault();
    
    const formData = {
        nomeEmpresa: document.getElementById('nomeEmpresa').value.trim(),
        email: document.getElementById('emailEmpresa').value.trim(),
        cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),
        ramoAtuacao: document.getElementById('ramoAtuacao').value,
        tamanhoEmpresa: document.getElementById('tamanhoEmpresa').value,
        telefone: document.getElementById('telefoneEmpresa').value,
        senha: document.getElementById('senhaEmpresa').value
    };

    // Validações
    if (!validarFormularioEmpresa(formData)) return;

    // Simular cadastro
    const loading = mostrarLoadingEmpresa('Criando conta empresa...');
    
    try {
        const resultado = await simularCadastroEmpresa(formData);
        if (resultado.success) {
            mostrarSucessoEmpresa('Conta empresa criada com sucesso! Redirecionando...');
            setTimeout(() => {
                window.location.href = 'dashboard-empresa.html';
            }, 2000);
        } else {
            mostrarErroEmpresa(resultado.error);
        }
    } catch (error) {
        mostrarErroEmpresa('Erro ao criar conta. Tente novamente.');
    } finally {
        loading.hide();
    }
}

function validarFormularioEmpresa(formData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cnpjRegex = /^\d{14}$/;
    
    if (!formData.nomeEmpresa) {
        mostrarErroEmpresa('Nome da empresa é obrigatório');
        return false;
    }
    
    if (!emailRegex.test(formData.email)) {
        mostrarErroEmpresa('Email corporativo inválido');
        return false;
    }
    
    if (!cnpjRegex.test(formData.cnpj)) {
        mostrarErroEmpresa('CNPJ inválido');
        return false;
    }
    
    if (!formData.ramoAtuacao) {
        mostrarErroEmpresa('Ramo de atuação é obrigatório');
        return false;
    }
    
    if (!formData.tamanhoEmpresa) {
        mostrarErroEmpresa('Tamanho da empresa é obrigatório');
        return false;
    }
    
    if (formData.senha.length < 8) {
        mostrarErroEmpresa('A senha deve ter pelo menos 8 caracteres');
        return false;
    }
    
    if (formData.senha !== document.getElementById('confirmarSenhaEmpresa').value) {
        mostrarErroEmpresa('As senhas não coincidem');
        return false;
    }
    
    return true;
}

async function simularCadastroEmpresa(formData) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulação de resposta da API
    return {
        success: true,
        data: {
            id: Math.random().toString(36).substr(2, 9),
            user: {
                nomeEmpresa: formData.nomeEmpresa,
                email: formData.email,
                tipo: 'empresa',
                cnpj: formData.cnpj,
                ramoAtuacao: formData.ramoAtuacao,
                tamanhoEmpresa: formData.tamanhoEmpresa
            },
            token: 'empresa_token_' + Math.random().toString(36).substr(2, 9)
        }
    };
}

function mostrarLoadingEmpresa(mensagem) {
    const botao = document.querySelector('.continue-btn');
    const textoOriginal = botao.textContent;
    
    botao.disabled = true;
    botao.innerHTML = `<div class="loading-spinner"></div> ${mensagem}`;
    
    return {
        hide: function() {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    };
}

// Sistema de mensagens
function mostrarSucessoEmpresa(mensagem) { alert('✅ ' + mensagem); }
function mostrarErroEmpresa(mensagem) { alert('❌ ' + mensagem); }

console.log('✅ Módulo de cadastro empresa carregado');