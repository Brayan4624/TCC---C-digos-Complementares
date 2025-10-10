import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Servidor simples para demonstrar o frontend do NEXUS.
 * Endpoints:
 *  - GET /, /index.html, /style.css, /script.js, /demo-empresa -> arquivos estáticos
 *  - /api/auth  (POST login/register via form-urlencoded)
 *  - /api/feed  (GET list posts, POST create post)
 *  - /api/vagas (GET list jobs, POST create job)
 *  - /api/empresas (GET list companies)
 *  - /api/candidaturas (GET list applications, POST apply)
 *  - /api/profile (GET profile by id)
 *
 * Dados são mantidos em memória. Simples, para desenvolvimento.
 */
public class AppServer {
    static List<Map<String,String>> users = Collections.synchronizedList(new ArrayList<>()); // estudantes & empresas (type)
    static List<Map<String,String>> posts = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> jobs = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> companies = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> applications = Collections.synchronizedList(new ArrayList<>());

    static AtomicInteger userId = new AtomicInteger(1);
    static AtomicInteger postId = new AtomicInteger(1);
    static AtomicInteger jobId = new AtomicInteger(1);
    static AtomicInteger companyId = new AtomicInteger(1);
    static AtomicInteger appId = new AtomicInteger(1);

    public static void main(String[] args) throws Exception {
        seedDemoData();
        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new StaticHandler());
        server.createContext("/index.html", new StaticHandler());
        server.createContext("/style.css", new StaticHandler());
        server.createContext("/script.js", new StaticHandler());
        server.createContext("/demo-empresa", new StaticHandler()); // serve index.html (SPA)
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/feed", new FeedHandler());
        server.createContext("/api/vagas", new VagasHandler());
        server.createContext("/api/empresas", new EmpresasHandler());
        server.createContext("/api/candidaturas", new CandidaturasHandler());
        server.createContext("/api/profile", new ProfileHandler());
        server.setExecutor(Executors.newFixedThreadPool(8));
        System.out.println("Servidor iniciado em http://localhost:" + port);
        server.start();
    }

    static void seedDemoData() {
        // companies
        addCompany("Tech Solutions", "São Paulo, SP", 120, "4.5");
        addCompany("Creative Studio", "Porto Alegre, RS", 45, "4.2");
        addCompany("StartUp Inc", "Curitiba, PR", 18, "4.0");
        addCompany("Global Corp", "Belo Horizonte, MG", 680, "4.6");

        // jobs
        addJob("Desenvolvedor Full Stack Jr", "Tech Solutions", "Desenvolvimento web fullstack", "React, Node.js, SQL, Remote");
        addJob("Designer UI/UX", "Creative Studio", "Design de interfaces e protótipos", "Figma, UX, Prototipagem");
        addJob("Estágio Mobile", "StartUp Inc", "Estágio em desenvolvimento mobile", "React Native, Mobile, Git");

        // users (example student)
        Map<String,String> u = new HashMap<>();
        u.put("id", String.valueOf(userId.getAndIncrement()));
        u.put("email", "aluno@example.com");
        u.put("password", "123456"); // claro: apenas demo
        u.put("name", "João Paulo");
        u.put("type", "student");
        u.put("bio", "Desenvolvedor Full Stack apaixonado por criar experiências digitais.");
        u.put("skills", "React,Node.js,Python");
        users.add(u);

        // sample post
        Map<String,String> p = new HashMap<>();
        p.put("id", String.valueOf(postId.getAndIncrement()));
        p.put("authorId", "1");
        p.put("authorName", "Tech Solutions");
        p.put("type", "company");
        p.put("content", "Estamos contratando desenvolvedor full stack júnior. Confira a vaga!");
        p.put("time", "1h");
        posts.add(p);
    }

    static void addCompany(String name, String location, int employees, String rating) {
        Map<String,String> c = new LinkedHashMap<>();
        c.put("id", String.valueOf(companyId.getAndIncrement()));
        c.put("name", name);
        c.put("location", location);
        c.put("employees", String.valueOf(employees));
        c.put("rating", rating);
        c.put("openings", String.valueOf((int)(Math.random()*10)+1));
        companies.add(c);
    }

    static void addJob(String title, String company, String desc, String tags) {
        Map<String,String> j = new LinkedHashMap<>();
        j.put("id", String.valueOf(jobId.getAndIncrement()));
        j.put("title", title);
        j.put("company", company);
        j.put("description", desc);
        j.put("tags", tags);
        jobs.add(j);
    }

    static void addCORSHeaders(Headers h) {
        h.add("Access-Control-Allow-Origin", "*");
        h.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        h.add("Access-Control-Allow-Headers", "Content-Type");
    }

    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            String path = ex.getRequestURI().getPath();
            if ("/demo-empresa".equals(path)) path = "/index.html";
            if ("/".equals(path) || "/index.html".equals(path)) {
                serveFile(ex, "index.html", "text/html; charset=utf-8");
            } else if ("/style.css".equals(path)) {
                serveFile(ex, "style.css", "text/css; charset=utf-8");
            } else if ("/script.js".equals(path)) {
                serveFile(ex, "script.js", "application/javascript; charset=utf-8");
            } else {
                sendResponse(ex, 404, "Not Found");
            }
        }

        void serveFile(HttpExchange ex, String filename, String contentType) throws IOException {
            Path p = Path.of(filename);
            if (!Files.exists(p)) {
                sendResponse(ex, 404, "Arquivo não encontrado: " + filename);
                return;
            }
            byte[] b = Files.readAllBytes(p);
            ex.getResponseHeaders().set("Content-Type", contentType);
            ex.sendResponseHeaders(200, b.length);
            try (OutputStream os = ex.getResponseBody()) { os.write(b); }
        }
    }

    static class AuthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204,-1); return; }
            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseFormUrlEncoded(body);
                String action = data.getOrDefault("action","login"); // login or register
                if ("register".equalsIgnoreCase(action)) {
                    // create user
                    Map<String,String> u = new LinkedHashMap<>();
                    u.put("id", String.valueOf(userId.getAndIncrement()));
                    u.put("email", data.getOrDefault("email",""));
                    u.put("password", data.getOrDefault("password",""));
                    u.put("name", data.getOrDefault("name", "Usuário"));
                    u.put("type", data.getOrDefault("type","student"));
                    u.put("bio", data.getOrDefault("bio", ""));
                    u.put("skills", data.getOrDefault("skills", ""));
                    users.add(u);
                    sendJson(ex,200,mapToJson(u));
                } else {
                    String email = data.getOrDefault("email","");
                    String password = data.getOrDefault("password","");
                    for (Map<String,String> u : users) {
                        if (u.get("email").equals(email) && u.get("password").equals(password)) {
                            sendJson(ex,200,mapToJson(u));
                            return;
                        }
                    }
                    sendResponse(ex,401,"{\"error\":\"Credenciais inválidas\"}");
                }
            } else {
                sendResponse(ex,405,"Method Not Allowed");
            }
        }
    }

    static class FeedHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204,-1); return; }
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex,200,listToJson(posts));
            } else if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseFormUrlEncoded(body);
                Map<String,String> p = new LinkedHashMap<>();
                p.put("id", String.valueOf(postId.getAndIncrement()));
                p.put("authorId", data.getOrDefault("authorId","0"));
                p.put("authorName", data.getOrDefault("authorName","Anon"));
                p.put("type", data.getOrDefault("type","student"));
                p.put("content", data.getOrDefault("content",""));
                p.put("time", "agora");
                posts.add(0,p); // push to top
                sendJson(ex,201,mapToJson(p));
            } else {
                sendResponse(ex,405,"Method Not Allowed");
            }
        }
    }

    static class VagasHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204,-1); return; }
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex,200,listToJson(jobs));
            } else if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseFormUrlEncoded(body);
                Map<String,String> j = new LinkedHashMap<>();
                j.put("id", String.valueOf(jobId.getAndIncrement()));
                j.put("title", data.getOrDefault("title",""));
                j.put("company", data.getOrDefault("company",""));
                j.put("description", data.getOrDefault("description",""));
                j.put("tags", data.getOrDefault("tags",""));
                jobs.add(j);
                sendJson(ex,201,mapToJson(j));
            } else {
                sendResponse(ex,405,"Method Not Allowed");
            }
        }
    }

    static class EmpresasHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex,200,listToJson(companies));
            } else {
                sendResponse(ex,405,"Method Not Allowed");
            }
        }
    }

    static class CandidaturasHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204,-1); return; }
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex,200,listToJson(applications));
            } else if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseFormUrlEncoded(body);
                Map<String,String> a = new LinkedHashMap<>();
                a.put("id", String.valueOf(appId.getAndIncrement()));
                a.put("jobId", data.getOrDefault("jobId",""));
                a.put("jobTitle", data.getOrDefault("jobTitle",""));
                a.put("applicantId", data.getOrDefault("applicantId",""));
                a.put("applicantName", data.getOrDefault("applicantName",""));
                a.put("status", "Em Análise");
                a.put("date", new Date().toString());
                applications.add(a);
                sendJson(ex,201,mapToJson(a));
            } else {
                sendResponse(ex,405,"Method Not Allowed");
            }
        }
    }

    static class ProfileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex.getResponseHeaders());
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                String q = ex.getRequestURI().getQuery(); // ?id=1
                Map<String,String> params = queryToMap(q);
                String id = params.get("id");
                if (id == null) { sendJson(ex,400,"{\"error\":\"id required\"}"); return; }
                for (Map<String,String> u : users) {
                    if (u.get("id").equals(id)) {
                        sendJson(ex,200,mapToJson(u)); return;
                    }
                }
                sendJson(ex,404,"{\"error\":\"not found\"}");
            } else {
                sendResponse(ex,405,"Method Not Allowed");
            }
        }
    }

    // Helpers
    static String readBody(HttpExchange ex) throws IOException {
        InputStream is = ex.getRequestBody();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[2048];
        int r;
        while ((r = is.read(buf)) != -1) baos.write(buf,0,r);
        return baos.toString(StandardCharsets.UTF_8);
    }

    static Map<String,String> parseFormUrlEncoded(String body) throws UnsupportedEncodingException {
        Map<String,String> map = new HashMap<>();
        if (body == null || body.isBlank()) return map;
        String[] pairs = body.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=",2);
            String k = URLDecoder.decode(kv[0], StandardCharsets.UTF_8);
            String v = kv.length>1 ? URLDecoder.decode(kv[1], StandardCharsets.UTF_8) : "";
            map.put(k,v);
        }
        return map;
    }

    static Map<String,String> queryToMap(String q) {
        Map<String,String> map = new HashMap<>();
        if (q==null || q.isBlank()) return map;
        String[] parts = q.split("&");
        for (String p : parts) {
            String[] kv = p.split("=",2);
            if (kv.length==2) map.put(kv[0], kv[1]);
        }
        return map;
    }

    static void sendResponse(HttpExchange ex, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) { os.write(bytes); }
    }

    static void sendJson(HttpExchange ex, int status, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        sendResponse(ex,status,json);
    }

    static String escape(String s) {
        if (s==null) return "";
        return s.replace("\\","\\\\").replace("\"","\\\"").replace("\n","\\n").replace("\r","\\r");
    }

    static String mapToJson(Map<String,String> map) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        boolean first=true;
        for (Map.Entry<String,String> e : map.entrySet()) {
            if (!first) sb.append(",");
            sb.append("\"").append(escape(e.getKey())).append("\":");
            sb.append("\"").append(escape(e.getValue())).append("\"");
            first=false;
        }
        sb.append("}");
        return sb.toString();
    }

    static String listToJson(List<Map<String,String>> list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        boolean first=true;
        for (Map<String,String> m : list) {
            if (!first) sb.append(",");
            sb.append(mapToJson(m));
            first=false;
        }
        sb.append("]");
        return sb.toString();
    }
}

