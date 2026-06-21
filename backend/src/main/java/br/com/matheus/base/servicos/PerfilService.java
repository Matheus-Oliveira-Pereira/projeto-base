package br.com.matheus.base.servicos;

import br.com.matheus.base.entidades.Perfil;
import br.com.matheus.base.enums.StatusPerfil;
import br.com.matheus.base.repositorios.PerfilRepository;
import br.com.matheus.base.visoes.dtos.PaginatedResponse;
import br.com.matheus.base.visoes.repositorios.PerfilDTORepository;
import br.com.matheus.base.visoes.telas.perfil.PerfilDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PerfilService extends EntidadeService<Perfil, PerfilRepository> {

    @Autowired
    private PerfilDTORepository dtoRepository;

    public PaginatedResponse<PerfilDTO> listarDTO(Map<String, String[]> requestParams) {
        return dtoRepository.listar(requestParams);
    }

    public List<Perfil> listarAtivos() {
        return repository.findByStatus(StatusPerfil.ATIVO);
    }
}
