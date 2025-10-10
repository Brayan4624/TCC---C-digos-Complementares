# Projeto NEXUS

Este projeto recria a interface e algumas funcionalidades básicas do aplicativo NEXUS, incluindo páginas de login e registro para estudantes e empresas. O backend é simulado com um servidor Java simples.

## Estrutura do Projeto

```
. 
├── public/
│   ├── assets/
│   │   └── logo.svg
│   ├── criar-conta-empresa.html
│   ├── criar-conta-estudante.html
│   ├── criar-conta.html
│   ├── index.html
│   ├── script.js
│   └── style.css
├── src/
│   └── AppServer.java
└── README.md
```

## Como Executar o Projeto

### Frontend (Páginas Estáticas)

Você pode abrir os arquivos HTML diretamente no seu navegador para visualizar a interface. No entanto, para que o JavaScript funcione corretamente com as rotas, é recomendável usar um servidor web local.

Uma maneira simples de fazer isso é usando o Python:

```bash
cd public
python3 -m http.server 8000
```

Depois, abra seu navegador e acesse `http://localhost:8000`.

### Backend (Java)

O `AppServer.java` é um servidor HTTP simples que serve os arquivos estáticos e simula endpoints de API. Para executá-lo:

1.  **Compile o código Java:**

    ```bash
    javac src/AppServer.java -d out
    ```

2.  **Execute o servidor:**

    ```bash
    java -cp out AppServer
    ```

O servidor será iniciado na porta `8080`. Você pode então acessar `http://localhost:8080` no seu navegador.

**Observação:** Este servidor Java é um exemplo básico e não possui persistência de dados ou lógica de negócios completa. Os endpoints de API (`/api/login`, `/api/register/student`, `/api/register/company`) apenas imprimem no console que foram acessados.

## Funcionalidades Implementadas

*   **Página de Login:** `index.html`
*   **Página de Seleção de Tipo de Conta:** `criar-conta.html`
*   **Formulário de Registro de Estudante:** `criar-conta-estudante.html`
*   **Formulário de Registro de Empresa:** `criar-conta-empresa.html`
*   **Estilização:** `style.css` (responsivo)
*   **Lógica Frontend:** `script.js` (com alertas para funcionalidades não implementadas)
*   **Servidor Backend Básico:** `AppServer.java` para servir arquivos e simular APIs.

## Próximos Passos (Sugestões)

*   Implementar a lógica de autenticação e registro no `AppServer.java`.
*   Adicionar um banco de dados para persistir as informações de usuários e empresas.
*   Desenvolver as páginas internas após o login (dashboard de estudante/empresa).
*   Melhorar a validação de formulários no frontend e backend.
*   Adicionar mais funcionalidades de UI/UX.
