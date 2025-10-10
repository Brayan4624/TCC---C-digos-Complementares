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

/*
 AppServer.java
 Servidor simples para desenvolvimento local do NEXUS demo.

 - Serve arquivos estáticos: index.html, login.html, estudante.html, empresa.html, style.css, script.js
 - Endpoints REST (dados em memória):
    GET  /api/vagas
    POST /api/vagas
    GET  /api/empresas
    GET  /api/projects
    POST /api/projects
    GET  /api/feed
    POST /api/feed
    POST /api/auth   (action=login|register)
    GET  /api/demo/student
    GET  /api/demo/company
    POST /api/profile/update
 - Dados são seeds (sem persistência). Para persistência, salve mapToJson(...) em arquivos e carregue na inicialização.
*/

public class AppServer {
    static List<Map<String,String>> users = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> jobs = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> projects = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> posts = Collections.synchronizedList(new ArrayList<>());
    static List<Map<String,String>> companies = Collections.synchronizedList(new ArrayList<>());

    static AtomicInteger userSeq = new AtomicInteger(1);
    static AtomicInteger jobSeq = new AtomicInteger(1);
    static AtomicInteger projSeq = new AtomicInteger(1);
    static AtomicInteger postSeq = new AtomicInteger(1);
    static AtomicInteger compSeq = new AtomicInteger(1);

    public static void main(String[] args) throws Exception {
        seedData();

        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new StaticHandler());
        server.createContext("/index.html", new StaticHandler());
        server.createContext("/login.html", new StaticHandler());
        server.createContext("/estudante.html", new StaticHandler());
        server.createContext("/empresa.html", new StaticHandler());
        server.createContext("/style.css", new StaticHandler());
        server.createContext("/script.js", new StaticHandler());

        // API endpoints
        server.createContext("/api/vagas", new VagasHandler());
        server.createContext("/api/empresas", new EmpresasHandler());
        server.createContext("/api/projects", new ProjectsHandler());
        server.createContext("/api/feed", new FeedHandler());
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/demo/student", new DemoStudentHandler());
        server.createContext("/api/demo/company", new DemoCompanyHandler());
        server.createContext("/api/profile/update", new ProfileUpdateHandler());

        server.setExecutor(Executors.newFixedThreadPool(8));
        System.out.println("AppServer rodando em http://localhost:" + port);
        server.start();
    }

    static void seedData(){
        // add demo companies
        addCompany("Tech Solutions","São Paulo, SP","120","4.5");
        addCompany("Creative Studio","Porto Alegre, RS","45","4.2");
        addCompany("StartUp Inc","Curitiba, PR","18","4.0");

        // add demo jobs
        addJob("Desenvolvedor Full Stack Jr","Tech Solutions","Trabalhe em projetos web","React,Node.js,SQL");
        addJob("Designer UI/UX","Creative Studio","Design de interfaces e experiências","Figma,UI,UX");
        addJob("Estágio Mobile","StartUp Inc","Aprendizado em desenvolvimento mobile","React Native,Mobile");

        // demo student user
        Map<String,String> u = new LinkedHashMap<>();
        u.put("id", String.valueOf(userSeq.getAndIncrement()));
        u.put("name", "João Paulo");
        u.put("email", "aluno@example.com");
        u.put("password", "123456");
        u.put("type", "student");
        u.put("bio", "Desenvolvedor Full Stack apaixonado por criar experiências digitais.");
        u.put("skills", "React,Node.js,Python");
        users.add(u);

        // demo projects
        addProject("Portfolio Web", "1", "Portfolio pessoal com projetos em React");
        addProject("Jogo 2D", "1", "Jogo criado durante curso técnico");

        // demo post
        Map<String,String> p = new LinkedHashMap<>();
        p.put("id", String.valueOf(postSeq.getAndIncrement()));
        p.put("authorId","1");
        p.put("authorName","Tech Solutions");
        p.put("type","company");
        p.put("content","Estamos contratando! Vaga de Desenvolvedor Full Stack Jr.");
        p.put("time","1h");
        posts.add(p);
    }

    static void addCompany(String name, String loc, String employees, String rating){
        Map<String,String> c = new LinkedHashMap<>();
        c.put("id", String.valueOf(compSeq.getAndIncrement()));
        c.put("name", name);
        c.put("location", loc);
        c.put("employees", employees);
        c.put("rating", rating);
        c.put("openings", String.valueOf((int)(Math.random()*10)+1));
        companies.add(c);
    }

    static void addJob(String title, String company, String desc, String tags){
        Map<String,String> j = new LinkedHashMap<>();
        j.put("id", String.valueOf(jobSeq.getAndIncrement()));
        j.put("title", title);
        j.put("company", company);
        j.put("description", desc);
        j.put("tags", tags);
        jobs.add(j);
    }

    static void addProject(String title, String authorId, String desc){
        Map<String,String> pr = new LinkedHashMap<>();
        pr.put("id", String.valueOf(projSeq.getAndIncrement()));
        pr.put("title", title);
        pr.put("authorId", authorId);
        pr.put("description", desc);
        projects.add(pr);
    }

    // --- Handlers ---
    static void addCORSHeaders(HttpExchange h){ h.getResponseHeaders().add("Access-Control-Allow-Origin","*"); h.getResponseHeaders().add("Access-Control-Allow-Methods","GET,POST,OPTIONS"); h.getResponseHeaders().add("Access-Control-Allow-Headers","Content-Type"); }

    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            String path = ex.getRequestURI().getPath();
            if ("/".equals(path) || "/index.html".equals(path)) serveFile(ex, "index.html", "text/html; charset=utf-8");
            else if ("/login.html".equals(path)) serveFile(ex, "login.html", "text/html; charset=utf-8");
            else if ("/estudante.html".equals(path)) serveFile(ex, "estudante.html", "text/html; charset=utf-8");
            else if ("/empresa.html".equals(path)) serveFile(ex, "empresa.html", "text/html; charset=utf-8");
            else if ("/style.css".equals(path)) serveFile(ex, "style.css", "text/css; charset=utf-8");
            else if ("/script.js".equals(path)) serveFile(ex, "script.js", "application/javascript; charset=utf-8");
            else {
                sendResponse(ex,404,"Not Found");
            }
        }

        void serveFile(HttpExchange ex, String filename, String contentType) throws IOException {
            Path p = Path.of(filename);
            if (!Files.exists(p)) { sendResponse(ex,404,"Arquivo não encontrado: " + filename); return; }
            byte[] bytes = Files.readAllBytes(p);
            ex.getResponseHeaders().set("Content-Type", contentType);
            ex.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = ex.getResponseBody()) { os.write(bytes); }
        }
    }

    static class VagasHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204,-1); return; }
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) {
                sendJson(ex,200,listToJson(jobs));
            } else if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseForm(body);
                Map<String,String> j = new LinkedHashMap<>();
                j.put("id", String.valueOf(jobSeq.getAndIncrement()));
                j.put("title", data.getOrDefault("title",""));
                j.put("company", data.getOrDefault("company",""));
                j.put("description", data.getOrDefault("description",""));
                j.put("tags", data.getOrDefault("tags",""));
                jobs.add(j);
                sendJson(ex,201,mapToJson(j));
            } else sendResponse(ex,405,"Method Not Allowed");
        }
    }

    static class EmpresasHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) sendJson(ex,200,listToJson(companies));
            else sendResponse(ex,405,"Method Not Allowed");
        }
    }

    static class ProjectsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) sendJson(ex,200,listToJson(projects));
            else if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseForm(body);
                Map<String,String> pr = new LinkedHashMap<>();
                pr.put("id", String.valueOf(projSeq.getAndIncrement()));
                pr.put("title", data.getOrDefault("title",""));
                pr.put("authorId", data.getOrDefault("authorId",""));
                pr.put("description", data.getOrDefault("description",""));
                projects.add(pr);
                sendJson(ex,201,mapToJson(pr));
            } else sendResponse(ex,405,"Method Not Allowed");
        }
    }

    static class FeedHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            if ("GET".equalsIgnoreCase(ex.getRequestMethod())) sendJson(ex,200,listToJson(posts));
            else if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseForm(body);
                Map<String,String> p = new LinkedHashMap<>();
                p.put("id", String.valueOf(postSeq.getAndIncrement()));
                p.put("authorId", data.getOrDefault("authorId","0"));
                p.put("authorName", data.getOrDefault("authorName","Anon"));
                p.put("type", data.getOrDefault("type","student"));
                p.put("content", data.getOrDefault("content",""));
                p.put("time", "agora");
                posts.add(0,p);
                sendJson(ex,201,mapToJson(p));
            } else sendResponse(ex,405,"Method Not Allowed");
        }
    }

    static class AuthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204,-1); return; }
            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseForm(body);
                String action = data.getOrDefault("action","login");
                if ("register".equalsIgnoreCase(action)) {
                    Map<String,String> u = new LinkedHashMap<>();
                    u.put("id", String.valueOf(userSeq.getAndIncrement()));
                    u.put("name", data.getOrDefault("name","Usuário"));
                    u.put("email", data.getOrDefault("email",""));
                    u.put("password", data.getOrDefault("password",""));
                    u.put("type", data.getOrDefault("type","student"));
                    u.put("bio", data.getOrDefault("bio",""));
                    u.put("skills", data.getOrDefault("skills",""));
                    users.add(u);
                    sendJson(ex,200,mapToJson(u));
                } else {
                    String email = data.getOrDefault("email","");
                    String password = data.getOrDefault("password","");
                    for (Map<String,String> u : users) {
                        if (u.get("email").equals(email) && u.get("password").equals(password)) {
                            sendJson(ex,200,mapToJson(u)); return;
                        }
                    }
                    sendResponse(ex,401,"{\"error\":\"Credenciais inválidas\"}");
                }
            } else sendResponse(ex,405,"Method Not Allowed");
        }
    }

    static class DemoStudentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            Map<String,String> demo = users.size()>0 ? users.get(0) : Map.of("id","1","name","João Paulo","bio","Demo","skills","React,Node");
            sendJson(ex,200,mapToJson(demo));
        }
    }

    static class DemoCompanyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            Map<String,String> demo = companies.size()>0 ? companies.get(0) : Map.of("id","1","name","Tech Solutions","location","São Paulo","bio","Demo");
            sendJson(ex,200,mapToJson(demo));
        }
    }

    static class ProfileUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            addCORSHeaders(ex);
            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                String body = readBody(ex);
                Map<String,String> data = parseForm(body);
                String id = data.get("id");
                for (Map<String,String> u : users) {
                    if (u.get("id").equals(id)) {
                        if (data.containsKey("name")) u.put("name", data.get("name"));
                        if (data.containsKey("bio")) u.put("bio", data.get("bio"));
                        sendJson(ex,200,mapToJson(u)); return;
                    }
                }
                sendResponse(ex,404,"{\"error\":\"user not found\"}");
            } else sendResponse(ex,405,"Method Not Allowed");
        }
    }

    // --- helpers ---

    static String readBody(HttpExchange ex) throws IOException {
        InputStream is = ex.getRequestBody();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[2048];
        int r;
        while ((r = is.read(buf)) != -1) baos.write(buf,0,r);
        return baos.toString(StandardCharsets.UTF_8);
    }

    static Map<String,String> parseForm(String body) throws UnsupportedEncodingException {
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

    static void sendResponse(HttpExchange ex, int status, String body) throws IOException {
        byte[] b = body.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(status, b.length);
        try (OutputStream os = ex.getResponseBody()) { os.write(b); }
    }

    static void sendJson(HttpExchange ex, int status, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type","application/json; charset=utf-8");
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
