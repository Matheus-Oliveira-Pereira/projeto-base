package br.com.matheus.base.controladores;

import br.com.matheus.base.entidades.Usuario;
import br.com.matheus.base.servicos.UsuarioService;
import br.com.matheus.base.visoes.dtos.PaginatedResponse;
import br.com.matheus.base.visoes.telas.usuario.UsuarioDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController extends EntidadeController<Usuario, UsuarioService> {

    @GetMapping("/listar")
    public ResponseEntity<PaginatedResponse<UsuarioDTO>> listarDTO(HttpServletRequest request) {
        return ResponseEntity.ok(service.listarDTO(request.getParameterMap()));
    }
}
