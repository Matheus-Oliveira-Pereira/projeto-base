package br.com.matheus.base.controladores;

import br.com.matheus.base.entidades.Perfil;
import br.com.matheus.base.servicos.PerfilService;
import br.com.matheus.base.visoes.dtos.PaginatedResponse;
import br.com.matheus.base.visoes.telas.perfil.PerfilDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/perfis")
public class PerfilController extends EntidadeController<Perfil, PerfilService> {

    @GetMapping("/listar")
    public ResponseEntity<PaginatedResponse<PerfilDTO>> listarDTO(HttpServletRequest request) {
        return ResponseEntity.ok(service.listarDTO(request.getParameterMap()));
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<Perfil>> listarAtivos() {
        return ResponseEntity.ok(service.listarAtivos());
    }
}
