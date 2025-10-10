import java.io.*;
import java.net.*;
import java.nio.file.*;

public class AppServer {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Servidor rodando em http://localhost:" + port);

        while (true) {
            try (Socket socket = serverSocket.accept()) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                OutputStream output = socket.getOutputStream();

                String line = reader.readLine();
                if (line == null) continue;

                String[] parts = line.split(" ");
                if (parts.length < 2) continue;
                String path = parts[1];
                if (path.equals("/")) path = "/index.html";

                File file = new File("." + path);
                if (file.exists() && !file.isDirectory()) {
                    byte[] content = Files.readAllBytes(file.toPath());
                    String mime = getMimeType(path);
                    output.write(("HTTP/1.1 200 OK\r\nContent-Type: " + mime + "\r\n\r\n").getBytes());
                    output.write(content);
                } else {
                    String notFound = "<h1 style='color:red;'>404 - Página não encontrada</h1>";
                    output.write(("HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\n\r\n" + notFound).getBytes());
                }
                output.flush();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static String getMimeType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".js")) return "application/javascript";
        return "text/plain";
    }
}
