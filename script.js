document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const createAccountPage = document.getElementById("create-account-page");
    const createStudentAccountPage = document.getElementById("create-student-account-page");
    const createCompanyAccountPage = document.getElementById("create-company-account-page");

    const createAccountLink = document.getElementById("create-account-link");
    const loginLinkFromCreate = document.getElementById("login-link-from-create");
    const loginLinkFromStudent = document.getElementById("login-link-from-student");
    const loginLinkFromCompany = document.getElementById("login-link-from-company");

    const studentAccountBtn = document.getElementById("student-account-btn");
    const companyAccountBtn = document.getElementById("company-account-btn");
    const backToCreateAccountFromStudentBtn = document.getElementById("back-to-create-account-from-student");
    const backToCreateAccountFromCompanyBtn = document.getElementById("back-to-create-account-from-company");

    // Navegar para a página de criação de conta (seleção de tipo)
    if (createAccountLink) {
        createAccountLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "none";
            createAccountPage.style.display = "block";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "none";
        });
    }

    // Navegar de volta para a página de login (da seleção de tipo de conta)
    if (loginLinkFromCreate) {
        loginLinkFromCreate.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "block";
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "none";
        });
    }

    // Navegar de volta para a página de login (do formulário de estudante)
    if (loginLinkFromStudent) {
        loginLinkFromStudent.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "block";
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "none";
        });
    }

    // Navegar de volta para a página de login (do formulário de empresa)
    if (loginLinkFromCompany) {
        loginLinkFromCompany.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "block";
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "none";
        });
    }

    // Selecionar tipo de conta Estudante/Estagiário
    if (studentAccountBtn) {
        studentAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "block";
            createCompanyAccountPage.style.display = "none";
        });
    }

    // Selecionar tipo de conta Empresa
    if (companyAccountBtn) {
        companyAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "block";
        });
    }

    // Voltar da página de criação de conta de estudante para a seleção de tipo de conta
    if (backToCreateAccountFromStudentBtn) {
        backToCreateAccountFromStudentBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createAccountPage.style.display = "block";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "none";
        });
    }

    // Voltar da página de criação de conta de empresa para a seleção de tipo de conta
    if (backToCreateAccountFromCompanyBtn) {
        backToCreateAccountFromCompanyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createAccountPage.style.display = "block";
            createStudentAccountPage.style.display = "none";
            createCompanyAccountPage.style.display = "none";
        });
    }
});

