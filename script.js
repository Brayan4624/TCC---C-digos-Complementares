// Navegação suave
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        window.location.href = href;
    });
});

// Simulação de formulário
function simulateFormSubmission(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Formulário enviado com sucesso! (simulado)');
        form.reset();
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    simulateFormSubmission('contactForm');
});
