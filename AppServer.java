import java.io.*;
import java.net.*;
import java.nio.file.*;

public class AppServer {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Servidor rodando em http://localhost:" + port);

        while (true) {
            Socket socket = serverSocket.accept();
            new Thread(() -> handleRequest(socket)).start();
        }
    }

    private static void handleRequest(Socket socket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             OutputStream out = socket.getOutputStream()) {

            String line = in.readLine();
            if (line == null) return;

            String[] parts = line.split(" ");
            String path = parts.length > 1 ? parts[1] : "/";
            if (path.equals("/")) path = "/index.html";

            File file = new File("." + path);
            if (!file.exists()) {
                sendResponse(out, "404 Not Found", "text/html", "<h1>404 - Página não encontrada</h1>");
                return;
            }

            String contentType = getContentType(path);
            byte[] content = Files.readAllBytes(file.toPath());
            out.write(("HTTP/1.1 200 OK\r\nContent-Type: " + contentType + "\r\n\r\n").getBytes());
            out.write(content);
            out.flush();

        } catch (IOException e) {
            System.out.println("Erro ao processar requisição: " + e.getMessage());
        }
    }

    private static void sendResponse(OutputStream out, String status, String contentType, String body) throws IOException {
        String response = "HTTP/1.1 " + status + "\r\nContent-Type: " + contentType + "\r\n\r\n" + body;
        out.write(response.getBytes());
        out.flush();
    }

    private static String getContentType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".js")) return "application/javascript";
        return "text/plain";
    }
}
