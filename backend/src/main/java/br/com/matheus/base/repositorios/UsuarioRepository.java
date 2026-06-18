package br.com.matheus.base.repositorios;

import br.com.matheus.base.entidades.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends EntidadeRepository<Usuario> {

    Optional<Usuario> findByEmail(String email);
}
