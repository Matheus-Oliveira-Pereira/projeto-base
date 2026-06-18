package br.com.matheus.base.visoes.repositorios;

import br.com.matheus.base.enums.Role;
import br.com.matheus.base.visoes.telas.perfil.PerfilDTO;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@Transactional(readOnly = true)
public class PerfilDTORepository extends EntidadeDTORepository {

    private static final String HQL_LISTAR = """
            select new br.com.matheus.base.visoes.telas.perfil.PerfilDTO(
                p.id, p.descricao, p.status
            ) from Perfil p where 1 = 1
            """;

    private static final String HQL_CONTAR_ROLE = """
            select count(r)
            from Perfil p join p.roles r
            where p.id = :id and r in :roles
            """;

    private static final Set<Role> ROLES_A = Arrays.stream(Role.values())
            .filter(r -> r.name().endsWith("A")).collect(Collectors.toSet());

    private static final Set<Role> ROLES_B = Arrays.stream(Role.values())
            .filter(r -> r.name().endsWith("B")).collect(Collectors.toSet());

    private static final Set<Role> ROLES_C = Arrays.stream(Role.values())
            .filter(r -> r.name().endsWith("C")).collect(Collectors.toSet());

    private static final Set<Role> ROLES_D = Arrays.stream(Role.values())
            .filter(r -> r.name().endsWith("D")).collect(Collectors.toSet());

    private HashMap<String, Object> consulta(Map<String, String[]> requestParams, StringBuilder builder) {
        var params = new HashMap<String, Object>();

        if (requestParams.containsKey("descricao")) {
            builder.append(" and upper(p.descricao) like :descricao ");
            params.put("descricao", "%" + requestParams.get("descricao")[0].toUpperCase() + "%");
        }

        if (requestParams.containsKey("status")) {
            builder.append(" and p.status = :status ");
            params.put("status", br.com.matheus.base.enums.StatusPerfil.valueOf(requestParams.get("status")[0]));
        }

        if (requestParams.containsKey("textoDeBusca")) {
            var texto = requestParams.get("textoDeBusca")[0].toUpperCase();
            builder.append(" and upper(p.descricao) like :textoDeBusca ");
            params.put("textoDeBusca", "%" + texto + "%");
        }

        return params;
    }

    public List<PerfilDTO> listar(Map<String, String[]> requestParams) {
        var builder = new StringBuilder(HQL_LISTAR);
        var params = consulta(requestParams, builder);
        builder.append(" order by p.descricao ");

        var query = entityManager.createQuery(builder.toString(), PerfilDTO.class);
        params.forEach(query::setParameter);

        var lista = query.getResultList();
        for (var perfil : lista) {
            perfil.setTotalA(contarRolesPorTipo(perfil.getId(), ROLES_A));
            perfil.setTotalB(contarRolesPorTipo(perfil.getId(), ROLES_B));
            perfil.setTotalC(contarRolesPorTipo(perfil.getId(), ROLES_C));
            perfil.setTotalD(contarRolesPorTipo(perfil.getId(), ROLES_D));
        }

        return lista;
    }

    private int contarRolesPorTipo(UUID perfilId, Set<Role> roles) {
        return entityManager.createQuery(HQL_CONTAR_ROLE, Long.class)
                .setParameter("id", perfilId)
                .setParameter("roles", roles)
                .getSingleResult()
                .intValue();
    }
}
