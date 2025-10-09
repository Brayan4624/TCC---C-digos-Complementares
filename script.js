document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const createAccountPage = document.getElementById("create-account-page");
    const createStudentAccountPage = document.getElementById("create-student-account-page");

    const createAccountLink = document.getElementById("create-account-link");
    const loginLinkFromCreate = document.getElementById("login-link-from-create");
    const loginLinkFromStudent = document.getElementById("login-link-from-student");
    const studentAccountBtn = document.getElementById("student-account-btn");
    const companyAccountBtn = document.getElementById("company-account-btn");
    const backToCreateAccountBtn = document.getElementById("back-to-create-account");

    // Navegar para a página de criação de conta
    if (createAccountLink) {
        createAccountLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "none";
            createAccountPage.style.display = "block";
            createStudentAccountPage.style.display = "none";
        });
    }

    // Navegar de volta para a página de login (da seleção de tipo de conta)
    if (loginLinkFromCreate) {
        loginLinkFromCreate.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "block";
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "none";
        });
    }

    // Navegar de volta para a página de login (do formulário de estudante)
    if (loginLinkFromStudent) {
        loginLinkFromStudent.addEventListener("click", (e) => {
            e.preventDefault();
            loginPage.style.display = "block";
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "none";
        });
    }

    // Selecionar tipo de conta Estudante/Estagiário
    if (studentAccountBtn) {
        studentAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createAccountPage.style.display = "none";
            createStudentAccountPage.style.display = "block";
        });
    }

    // Selecionar tipo de conta Empresa (ainda não implementado, mas para consistência)
    if (companyAccountBtn) {
        companyAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();
            // Por enquanto, apenas exibe um alerta ou redireciona para a página de criação de conta de empresa se existir
            alert("Funcionalidade de criação de conta para Empresa ainda não implementada.");
        });
    }

    // Voltar da página de criação de conta de estudante para a seleção de tipo de conta
    if (backToCreateAccountBtn) {
        backToCreateAccountBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createAccountPage.style.display = "block";
            createStudentAccountPage.style.display = "none";
        });
    }
});

