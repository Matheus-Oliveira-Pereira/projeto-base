package br.com.matheus.base.visoes.repositorios;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public abstract class EntidadeDTORepository {

    @PersistenceContext
    protected EntityManager entityManager;
}
