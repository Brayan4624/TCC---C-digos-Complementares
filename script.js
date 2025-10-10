function navegar(pagina) {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = ""; 

  switch (pagina) {
    case "inicio":
      conteudo.innerHTML = `
        <section>
          <h2>Bem-vindo ao Nexus</h2>
          <p>Conectamos estudantes, escolas e empresas em uma única plataforma de oportunidades e crescimento.</p>
          <button onclick="navegar('estudante')">Sou Estudante</button>
          <button onclick="navegar('empresa')">Sou Empresa</button>
          <button onclick="navegar('projetos')">Explorar Projetos</button>
        </section>`;
      break;

    case "estudante":
      conteudo.innerHTML = `
        <section>
          <h2>Área do Estudante</h2>
          <p>Monte seu portfólio, explore oportunidades e desenvolva suas habilidades.</p>
          <button onclick="navegar('projetos')">Ver Projetos</button>
          <button onclick="navegar('cursos')">Ver Cursos</button>
          <button onclick="navegar('inicio')">Voltar</button>
        </section>`;
      break;

    case "empresa":
      conteudo.innerHTML = `
        <section>
          <h2>Área da Empresa</h2>
          <p>Encontre talentos e conecte-se com futuros profissionais prontos para fazer a diferença.</p>
          <button onclick="navegar('vagas')">Ver Vagas</button>
          <button onclick="navegar('inicio')">Voltar</button>
        </section>`;
      break;

    case "projetos":
      conteudo.innerHTML = `
        <section>
          <h2>Projetos</h2>
          <p>Confira os projetos e produções acadêmicas desenvolvidos por estudantes.</p>
          <button onclick="navegar('inicio')">Voltar</button>
        </section>`;
      break;

    case "vagas":
      conteudo.innerHTML = `
        <section>
          <h2>Vagas Disponíveis</h2>
          <p>Veja oportunidades e programas de estágio oferecidos por empresas parceiras.</p>
          <button onclick="navegar('empresa')">Voltar</button>
        </section>`;
      break;

    case "cursos":
      conteudo.innerHTML = `
        <section>
          <h2>Cursos e Capacitações</h2>
          <p>Desenvolva novas habilidades com cursos recomendados pelas empresas e parceiros educacionais.</p>
          <button onclick="navegar('inicio')">Voltar</button>
        </section>`;
      break;

    case "contato":
      conteudo.innerHTML = `
        <section>
          <h2>Contato</h2>
          <p>Quer falar com nossa equipe? Envie uma mensagem.</p>
          <button onclick="navegar('inicio')">Voltar</button>
        </section>`;
      break;

    case "sobre":
      conteudo.innerHTML = `
        <section>
          <h2>Sobre o Nexus</h2>
          <p>O Nexus é uma ponte entre aprendizado e prática, ajudando estudantes a se destacarem desde cedo e empresas a encontrarem novos talentos.</p>
          <button onclick="navegar('inicio')">Voltar</button>
        </section>`;
      break;

    default:
      navegar('inicio');
  }
}

// inicia na página inicial
window.onload = () => navegar("inicio");
