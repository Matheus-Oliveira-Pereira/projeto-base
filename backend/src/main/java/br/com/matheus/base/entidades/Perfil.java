package br.com.matheus.base.entidades;

import br.com.matheus.base.entidades.superclasses.Entidade;
import br.com.matheus.base.enums.Role;
import br.com.matheus.base.enums.StatusPerfil;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "PERFIL")
@Audited
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Perfil extends Entidade {

    @NotBlank(message = "Descrição é obrigatória")
    @Column(unique = true)
    private String descricao;

    @Enumerated(EnumType.STRING)
    private StatusPerfil status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "PERFIL_ROLES", joinColumns = @JoinColumn(name = "perfil_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Role> roles = new HashSet<>();
}
