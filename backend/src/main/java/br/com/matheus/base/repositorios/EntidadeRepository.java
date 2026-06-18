package br.com.matheus.base.repositorios;

import br.com.matheus.base.entidades.superclasses.Entidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.UUID;

@NoRepositoryBean
public interface EntidadeRepository<T extends Entidade> extends JpaRepository<T, UUID>, JpaSpecificationExecutor<T> {
}
