// ===== CADASTRO ESTUDANTE =====
document.addEventListener('DOMContentLoaded', function() {
    const estudanteForm = document.getElementById('estudanteForm');
    const senhaEstudante = document.getElementById('senhaEstudante');
    const confirmarSenha = document.getElementById('confirmarSenha');

    // Validação em tempo real
    senhaEstudante.addEventListener('input', validarForcaSenha);
    confirmarSenha.addEventListener('input', validarConfirmacaoSenha);

    // Formatação de campos
    document.getElementById('telefone').addEventListener('input', formatarTelefone);

    // Submissão do formulário
    estudanteForm.addEventListener('submit', handleCadastroEstudante);
});

function validarForcaSenha() {
    const senha = this.value;
    let forca = 0;
    
    if (senha.length >= 8) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;
    
    const cores = { 0: '#ef4444', 1: '#ef4444', 2: '#f59e0b', 3: '#84cc16', 4: '#22c55e' };
    this.style.borderColor = cores[forca] || '#e5e5e5';
}

function validarConfirmacaoSenha() {
    const senha = document.getElementById('senhaEstudante').value;
    const confirmacao = this.value;
    
    if (confirmacao && senha !== confirmacao) {
        this.style.borderColor = '#ef4444';
        mostrarErroSenha('As senhas não coincidem');
    } else {
        this.style.borderColor = '#22c55e';
        limparErroSenha();
    }
}

function formatarTelefone() {
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

function mostrarErroSenha(mensagem) {
    let erroDiv = document.querySelector('.erro-senha');
    if (!erroDiv) {
        erroDiv = document.createElement('div');
        erroDiv.className = 'erro-senha';
        document.getElementById('confirmarSenha').parentNode.appendChild(erroDiv);
    }
    erroDiv.textContent = mensagem;
    erroDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 5px;
    `;
}

function limparErroSenha() {
    const erroDiv = document.querySelector('.erro-senha');
    if (erroDiv) erroDiv.remove();
}

async function handleCadastroEstudante(event) {
    event.preventDefault();
    
    const formData = {
        nomeCompleto: document.getElementById('nomeCompleto').value.trim(),
        email: document.getElementById('emailEstudante').value.trim(),
        instituicao: document.getElementById('instituicao').value.trim(),
        curso: document.getElementById('curso').value.trim(),
        semestre: document.getElementById('semestre').value,
        telefone: document.getElementById('telefone').value,
        senha: document.getElementById('senhaEstudante').value
    };

    // Validações
    if (!validarFormularioEstudante(formData)) return;

    // Simular cadastro
    const loading = mostrarLoading('Criando sua conta...');
    
    try {
        const resultado = await simularCadastroEstudante(formData);
        if (resultado.success) {
            mostrarSucesso('Conta criada com sucesso! Redirecionando...');
            setTimeout(() => {
                window.location.href = 'dashboard-estudante.html';
            }, 2000);
        } else {
            mostrarErro(resultado.error);
        }
    } catch (error) {
        mostrarErro('Erro ao criar conta. Tente novamente.');
    } finally {
        loading.hide();
    }
}

function validarFormularioEstudante(formData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.nomeCompleto) {
        mostrarErro('Nome completo é obrigatório');
        return false;
    }
    
    if (!emailRegex.test(formData.email)) {
        mostrarErro('Email inválido');
        return false;
    }
    
    if (!formData.instituicao) {
        mostrarErro('Instituição de ensino é obrigatória');
        return false;
    }
    
    if (!formData.curso) {
        mostrarErro('Curso é obrigatório');
        return false;
    }
    
    if (!formData.semestre || formData.semestre < 1 || formData.semestre > 20) {
        mostrarErro('Semestre deve ser entre 1 e 20');
        return false;
    }
    
    if (formData.senha.length < 8) {
        mostrarErro('A senha deve ter pelo menos 8 caracteres');
        return false;
    }
    
    if (formData.senha !== document.getElementById('confirmarSenha').value) {
        mostrarErro('As senhas não coincidem');
        return false;
    }
    
    return true;
}

async function simularCadastroEstudante(formData) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulação de resposta da API
    return {
        success: true,
        data: {
            id: Math.random().toString(36).substr(2, 9),
            user: {
                nome: formData.nomeCompleto,
                email: formData.email,
                tipo: 'estudante',
                instituicao: formData.instituicao,
                curso: formData.curso,
                semestre: formData.semestre
            },
            token: 'estudante_token_' + Math.random().toString(36).substr(2, 9)
        }
    };
}

function mostrarLoading(mensagem) {
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

// Sistema de mensagens (similar ao principal)
function mostrarSucesso(mensagem) { alert('✅ ' + mensagem); }
function mostrarErro(mensagem) { alert('❌ ' + mensagem); }

console.log('✅ Módulo de cadastro estudante carregado');