package br.com.matheus.base.repositorios;

import br.com.matheus.base.entidades.Perfil;

import java.util.Optional;

public interface PerfilRepository extends EntidadeRepository<Perfil> {

    Optional<Perfil> findByDescricao(String descricao);
}
