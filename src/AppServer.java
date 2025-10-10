import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class AppServer {

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Serve static files
        server.createContext("/", new StaticFileHandler());
        server.createContext("/criar-conta", new StaticFileHandler("criar-conta.html"));
        server.createContext("/criar-conta/estudante", new StaticFileHandler("criar-conta-estudante.html"));
        server.createContext("/criar-conta/empresa", new StaticFileHandler("criar-conta-empresa.html"));
        server.createContext("/style.css", new StaticFileHandler("style.css"));
        server.createContext("/script.js", new StaticFileHandler("script.js"));
        server.createContext("/assets/logo.svg", new StaticFileHandler("assets/logo.svg"));

        // Placeholder for API endpoints
        server.createContext("/api/login", new ApiHandler("Login"));
        server.createContext("/api/register/student", new ApiHandler("Student Registration"));
        server.createContext("/api/register/company", new ApiHandler("Company Registration"));

        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server started on port 8080");
    }

    static class StaticFileHandler implements HttpHandler {
        private String filePath;

        public StaticFileHandler() {
            this.filePath = "index.html"; // Default to index.html
        }

        public StaticFileHandler(String filePath) {
            this.filePath = filePath;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String requestPath = exchange.getRequestURI().getPath();
            String fileToServe = this.filePath;

            if (requestPath.equals("/")) {
                fileToServe = "index.html";
            } else if (requestPath.equals("/criar-conta")) {
                fileToServe = "criar-conta.html";
            } else if (requestPath.equals("/criar-conta/estudante")) {
                fileToServe = "criar-conta-estudante.html";
            } else if (requestPath.equals("/criar-conta/empresa")) {
                fileToServe = "criar-conta-empresa.html";
            } else if (requestPath.equals("/style.css")) {
                fileToServe = "style.css";
            } else if (requestPath.equals("/script.js")) {
                fileToServe = "script.js";
            } else if (requestPath.equals("/assets/logo.svg")) {
                fileToServe = "assets/logo.svg";
            }

            try {
                byte[] response = Files.readAllBytes(Paths.get(fileToServe));
                String contentType = "text/html";
                if (fileToServe.endsWith(".css")) {
                    contentType = "text/css";
                } else if (fileToServe.endsWith(".js")) {
                    contentType = "application/javascript";
                } else if (fileToServe.endsWith(".svg")) {
                    contentType = "image/svg+xml";
                }

                exchange.getResponseHeaders().set("Content-Type", contentType);
                exchange.sendResponseHeaders(200, response.length);
                OutputStream os = exchange.getResponseBody();
                os.write(response);
                os.close();
            } catch (IOException e) {
                String response = "404 (Not Found)";
                exchange.sendResponseHeaders(404, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                e.printStackTrace();
            }
        }
    }

    static class ApiHandler implements HttpHandler {
        private String apiName;

        public ApiHandler(String apiName) {
            this.apiName = apiName;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "API " + apiName + " endpoint reached. Method: " + exchange.getRequestMethod();
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                // Read request body for POST requests
                String requestBody = new String(exchange.getRequestBody().readAllBytes());
                response += ", Body: " + requestBody;
            }
            System.out.println(response);
            exchange.sendResponseHeaders(200, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}

