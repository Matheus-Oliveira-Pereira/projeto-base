package br.com.matheus.base.servicos;

import br.com.matheus.base.entidades.Usuario;
import br.com.matheus.base.exceptions.EntidadeNaoEncontradaException;
import br.com.matheus.base.repositorios.UsuarioRepository;
import br.com.matheus.base.visoes.dtos.PaginatedResponse;
import br.com.matheus.base.visoes.repositorios.UsuarioDTORepository;
import br.com.matheus.base.visoes.telas.usuario.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UsuarioService extends EntidadeService<Usuario, UsuarioRepository> {

    @Autowired
    private UsuarioDTORepository dtoRepository;

    public Usuario findByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não encontrado com email: " + email));
    }

    public PaginatedResponse<UsuarioDTO> listarDTO(Map<String, String[]> requestParams) {
        return dtoRepository.listar(requestParams);
    }
}
