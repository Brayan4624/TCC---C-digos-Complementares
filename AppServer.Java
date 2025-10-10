package com.nexus.empresas;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

/**
 * Servidor básico do NEXUS Empresas
 * Responsável por gerenciar rotas simples para páginas HTML.
 */

@WebServlet("/*")
public class AppServer extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getPathInfo();
        if (path == null || path.equals("/")) {
            req.getRequestDispatcher("/index.html").forward(req, resp);
        } else if (path.equals("/feed")) {
            req.getRequestDispatcher("/feed.html").forward(req, resp);
        } else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Página não encontrada");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.getWriter().write("{\"status\":\"ok\",\"mensagem\":\"Requisição POST recebida com sucesso!\"}");
    }
}
