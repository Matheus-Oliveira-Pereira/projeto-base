package br.com.matheus.base.servicos;

import br.com.matheus.base.entidades.superclasses.Entidade;
import br.com.matheus.base.exceptions.EntidadeNaoEncontradaException;
import br.com.matheus.base.repositorios.EntidadeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

public abstract class EntidadeService<T extends Entidade, R extends EntidadeRepository<T>> {

    @Autowired
    protected R repository;

    public T buscar(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Entidade não encontrada com id: " + id));
    }

    public List<T> listar() {
        return repository.findAll();
    }

    public T salvar(T entidade) {
        return repository.save(entidade);
    }

    public void excluir(UUID id) {
        buscar(id);
        repository.deleteById(id);
    }

    public void copyProperties(T source, T target) {
        BeanUtils.copyProperties(source, target, "id", "versao", "registro", "criadoPor", "senha");
    }
}
