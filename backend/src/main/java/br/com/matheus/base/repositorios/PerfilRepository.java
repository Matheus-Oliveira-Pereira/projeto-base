package br.com.matheus.base.repositorios;

import br.com.matheus.base.entidades.Perfil;
import br.com.matheus.base.enums.StatusPerfil;

import java.util.List;
import java.util.Optional;

public interface PerfilRepository extends EntidadeRepository<Perfil> {

    Optional<Perfil> findByDescricao(String descricao);

    List<Perfil> findByStatus(StatusPerfil status);
}
