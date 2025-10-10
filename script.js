// ========= INTERAÇÕES BÁSICAS =========

// Simulação de redirecionamentos
function continuar() {
  alert("Redirecionando para o painel de empresa...");
  window.location.href = "/feed";
}

function voltar() {
  alert("Voltando à página de login...");
  window.location.href = "/";
}

function abrirDemo(secao) {
  alert(`Abrindo demonstração de: ${secao}`);
}
