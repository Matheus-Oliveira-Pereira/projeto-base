package br.com.matheus.base.visoes.repositorios;

import br.com.matheus.base.visoes.telas.usuario.UsuarioDTO;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@Transactional(readOnly = true)
public class UsuarioDTORepository extends EntidadeDTORepository {

    private static final String HQL_LISTAR = """
            select new br.com.matheus.base.visoes.telas.usuario.UsuarioDTO(
                u.id, u.nome, u.email, u.status
            ) from Usuario u where 1 = 1
            """;

    private HashMap<String, Object> consulta(Map<String, String[]> requestParams, StringBuilder builder) {
        var params = new HashMap<String, Object>();

        if (requestParams.containsKey("nome")) {
            builder.append(" and upper(u.nome) like :nome ");
            params.put("nome", "%" + requestParams.get("nome")[0].toUpperCase() + "%");
        }

        if (requestParams.containsKey("email")) {
            builder.append(" and upper(u.email) like :email ");
            params.put("email", "%" + requestParams.get("email")[0].toUpperCase() + "%");
        }

        if (requestParams.containsKey("status")) {
            builder.append(" and u.status = :status ");
            params.put("status", br.com.matheus.base.enums.StatusUsuario.valueOf(requestParams.get("status")[0]));
        }

        if (requestParams.containsKey("textoDeBusca")) {
            var texto = requestParams.get("textoDeBusca")[0].toUpperCase();
            builder.append(" and (upper(u.nome) like :textoDeBusca or upper(u.email) like :textoDeBusca) ");
            params.put("textoDeBusca", "%" + texto + "%");
        }

        return params;
    }

    public List<UsuarioDTO> listar(Map<String, String[]> requestParams) {
        var builder = new StringBuilder(HQL_LISTAR);
        var params = consulta(requestParams, builder);
        builder.append(" order by u.nome ");

        var query = entityManager.createQuery(builder.toString(), UsuarioDTO.class);
        params.forEach(query::setParameter);

        var lista = query.getResultList();

        var perfisPorUsuario = buscarPerfisPorUsuario(lista.stream().map(UsuarioDTO::getId).toList());
        lista.forEach(u -> u.setPerfis(perfisPorUsuario.getOrDefault(u.getId(), "")));

        return lista;
    }

    private Map<UUID, String> buscarPerfisPorUsuario(List<UUID> ids) {
        if (ids.isEmpty()) return Map.of();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createQuery(
                "select u.id, p.descricao from Usuario u join u.perfis p where u.id in :ids order by p.descricao"
        ).setParameter("ids", ids).getResultList();

        return rows.stream().collect(Collectors.groupingBy(
                r -> (UUID) r[0],
                Collectors.mapping(r -> (String) r[1], Collectors.joining(", "))
        ));
    }
}
