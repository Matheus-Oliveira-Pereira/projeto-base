package br.com.matheus.base.controladores;

import br.com.matheus.base.entidades.superclasses.Entidade;
import br.com.matheus.base.servicos.AuditoriaService;
import br.com.matheus.base.servicos.EntidadeService;
import br.com.matheus.base.visoes.dtos.AuditoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

public abstract class EntidadeController<T extends Entidade, S extends EntidadeService<T, ?>> {

    @Autowired
    protected S service;

    @Autowired
    private AuditoriaService auditoriaService;

    @GetMapping("/{id}")
    public ResponseEntity<T> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscar(id));
    }

    @GetMapping
    public ResponseEntity<List<T>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<T> salvar(@Valid @RequestBody T entity) {
        return ResponseEntity.ok(service.salvar(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> atualizar(@PathVariable UUID id, @Valid @RequestBody T entity) {
        T existing = service.buscar(id);
        service.copyProperties(entity, existing);
        return ResponseEntity.ok(service.salvar(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<AuditoriaDTO>> historico(@PathVariable UUID id) {
        T entidade = service.buscar(id);
        @SuppressWarnings("unchecked")
        Class<T> entityClass = (Class<T>) entidade.getClass();
        return ResponseEntity.ok(auditoriaService.buscarHistorico(entityClass, id));
    }
}
