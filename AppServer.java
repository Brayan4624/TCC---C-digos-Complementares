import java.io.*;
import java.net.*;

public class AppServer {
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(8080);
        System.out.println("Servidor rodando em http://localhost:8080");

        while(true){
            Socket client = server.accept();
            BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            BufferedWriter out = new BufferedWriter(new OutputStreamWriter(client.getOutputStream()));

            String line = in.readLine();
            if(line == null) continue;
            String[] request = line.split(" ");
            String file = "index.html";

            if(request.length > 1){
                switch(request[1]){
                    case "/about.html": file="about.html"; break;
                    case "/services.html": file="services.html"; break;
                    case "/contact.html": file="contact.html"; break;
                    case "/signup.html": file="signup.html"; break;
                    default: file="index.html";
                }
            }

            File f = new File(file);
            if(f.exists()){
                out.write("HTTP/1.1 200 OK\r\n");
                if(file.endsWith(".css")) out.write("Content-Type: text/css\r\n");
                else if(file.endsWith(".js")) out.write("Content-Type: application/javascript\r\n");
                else out.write("Content-Type: text/html\r\n");
                out.write("\r\n");

                FileInputStream fis = new FileInputStream(f);
                byte[] buffer = new byte[1024];
                int bytes;
                while((bytes = fis.read(buffer)) != -1){
                    out.write(new String(buffer, 0, bytes));
                }
                fis.close();
            } else {
                out.write("HTTP/1.1 404 Not Found\r\n\r\n<h1>Página não encontrada</h1>");
            }

            out.flush();
            client.close();
        }
    }
}
