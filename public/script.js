document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const perfilEmpresaBtn = document.getElementById('perfilEmpresaBtn');
    const perfilEstudanteBtn = document.getElementById('perfilEstudanteBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Funcionalidade de login ainda não implementada.');
            // Aqui você enviaria os dados para o backend
            // console.log('Email:', document.getElementById('email').value);
            // console.log('Senha:', document.getElementById('password').value);
        });
    }

    if (perfilEmpresaBtn) {
        perfilEmpresaBtn.addEventListener('click', () => {
            alert('Redirecionando para login de empresa (funcionalidade não implementada).');
            // window.location.href = '/login-empresa'; // Exemplo de redirecionamento
        });
    }

    if (perfilEstudanteBtn) {
        perfilEstudanteBtn.addEventListener('click', () => {
            alert('Redirecionando para login de estudante (funcionalidade não implementada).');
            // window.location.href = '/login-estudante'; // Exemplo de redirecionamento
        });
    }

    // Lógica para a página de criar conta
    const accountTypeSelection = document.querySelector('.account-type-selection');
    const studentRegisterForm = document.getElementById('studentRegisterForm');
    const companyRegisterForm = document.getElementById('companyRegisterForm');
    const backToLoginBtn = document.getElementById('backToLoginBtn');

    if (accountTypeSelection) {
        const studentBtn = accountTypeSelection.querySelector('#selectStudentBtn');
        const companyBtn = accountTypeSelection.querySelector('#selectCompanyBtn');

        if (studentBtn) {
            studentBtn.addEventListener('click', () => {
                window.location.href = '/criar-conta/estudante';
            });
        }

        if (companyBtn) {
            companyBtn.addEventListener('click', () => {
                window.location.href = '/criar-conta/empresa';
            });
        }
    }

    if (studentRegisterForm) {
        studentRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registro de estudante ainda não implementado.');
            // console.log('Nome:', document.getElementById('studentName').value);
            // console.log('Email:', document.getElementById('studentEmail').value);
            // console.log('Telefone:', document.getElementById('studentPhone').value);
            // console.log('Senha:', document.getElementById('studentPassword').value);
        });
    }

    if (companyRegisterForm) {
        companyRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registro de empresa ainda não implementado.');
            // console.log('Nome da Empresa:', document.getElementById('companyName').value);
            // console.log('Email:', document.getElementById('companyEmail').value);
            // console.log('Telefone:', document.getElementById('companyPhone').value);
            // console.log('Senha:', document.getElementById('companyPassword').value);
        });
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
});

