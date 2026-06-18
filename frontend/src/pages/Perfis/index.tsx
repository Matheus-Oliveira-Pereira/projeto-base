import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import PageHeader from '../../components/PageHeader';
import CrudHeader from '../../components/CrudHeader';
import FormDialog from '../../components/FormDialog';
import FilterSidebar from '../../components/FilterSidebar';
import StatusBadge from '../../components/StatusBadge';
import StatusDropdown from '../../components/StatusDropdown';
import TableActions from '../../components/TableActions';
import HistoryDialog from '../../components/HistoryDialog';
import RoleBoards from './components/RoleBoards';
import BaseService from '../../services/baseService';
import { useAuth } from '../../contexts/AuthContext';
import { canAdd, canChange, canDelete, MODULES } from '../../utils/roles';
import './styles.scss';

interface Perfil {
  id: string;
  descricao: string;
  status: string;
  roles: string[];
}

interface PerfilForm {
  descricao: string;
  status: string;
  roles: string[];
}

interface Filtros {
  status: string | null;
}

interface FormErrors {
  descricao?: string;
}

const perfilService = new BaseService('/perfis');

function Perfis() {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [filtroGlobal, setFiltroGlobal] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({ status: null });
  const [form, setForm] = useState<PerfilForm>({ descricao: '', status: 'ATIVO', roles: [] });
  const [formId, setFormId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      setPerfis(await perfilService.getAll());
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar perfis' });
    }
    setLoading(false);
  };

  const dadosFiltrados = () => {
    let data = [...perfis];
    if (filtros.status) data = data.filter((p) => p.status === filtros.status);
    return data;
  };

  const validar = (): boolean => {
    const errs: FormErrors = {};
    if (!form.descricao.trim()) errs.descricao = 'Descrição é obrigatória';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const abrirNovo = () => {
    setForm({ descricao: '', status: 'ATIVO', roles: [] });
    setFormId(null);
    setEditando(false);
    setErrors({});
    setSubmitted(false);
    setDialogVisible(true);
  };

  const abrirEdicao = (perfil: Perfil) => {
    setForm({ descricao: perfil.descricao, status: perfil.status, roles: perfil.roles || [] });
    setFormId(perfil.id);
    setEditando(true);
    setErrors({});
    setSubmitted(false);
    setDialogVisible(true);
  };

  const salvar = async () => {
    setSubmitted(true);
    if (!validar()) return;

    setSalvando(true);
    try {
      if (editando) {
        await perfilService.update(formId!, form);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado' });
      } else {
        await perfilService.create(form);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil criado' });
      }
      setDialogVisible(false);
      carregarDados();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: axiosErr.response?.data?.message || 'Erro ao salvar' });
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = (perfil: Perfil) => {
    confirmDialog({
      message: `Deseja excluir o perfil "${perfil.descricao}"?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: async () => {
        try {
          await perfilService.remove(perfil.id);
          toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil excluído' });
          carregarDados();
        } catch {
          toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir' });
        }
      },
    });
  };

  const rolesTemplate = (rowData: Perfil) => {
    if (!rowData.roles?.length) return <span className="text-gray-400">&mdash;</span>;
    return (
      <div className="roles-chips">
        {rowData.roles.map((role) => (
          <span key={role} className="role-chip">{role}</span>
        ))}
      </div>
    );
  };

  const { user: authUser } = useAuth();
  const roles = authUser?.roles ?? [];
  const podeAdicionar = canAdd(roles, MODULES.PERFIS.prefix);
  const podeEditar = canChange(roles, MODULES.PERFIS.prefix);
  const podeExcluir = canDelete(roles, MODULES.PERFIS.prefix);

  const statusTemplate = (rowData: Perfil) => <StatusBadge status={rowData.status} />;
  const acoesTemplate = (rowData: Perfil) => (
    <TableActions
      onHistory={() => { setHistoryId(rowData.id); setHistoryVisible(true); }}
      onEdit={() => abrirEdicao(rowData)}
      onDelete={() => confirmarExclusao(rowData)}
      showHistory
      showEdit={podeEditar}
      showDelete={podeExcluir}
    />
  );

  return (
    <div className="crud-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeader title="Perfis" subtitle="Gerenciamento de perfis e permissões" />

      <div className="content-card">
        <DataTable
          value={dadosFiltrados()}
          loading={loading}
          header={
            <CrudHeader
              searchValue={filtroGlobal}
              onSearchChange={setFiltroGlobal}
              searchPlaceholder="Buscar por descrição..."
              onFilterClick={() => setFilterVisible(true)}
              newLabel="Novo Perfil"
              onNewClick={abrirNovo}
              showNew={podeAdicionar}
            />
          }
          globalFilter={filtroGlobal}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="Nenhum perfil encontrado"
          stripedRows
          removableSort
        >
          <Column field="descricao" header="Descrição" sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable style={{ width: '130px' }} />
          <Column header="Roles" body={rolesTemplate} />
          <Column header="Ações" body={acoesTemplate} style={{ width: '120px' }} />
        </DataTable>
      </div>

      <FormDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        title={editando ? 'Editar Perfil' : 'Novo Perfil'}
        icon={editando ? 'pi pi-shield' : 'pi pi-plus-circle'}
        onSave={salvar}
        loading={salvando}
        width="600px"
      >
        <div className={`form-field ${submitted && errors.descricao ? 'field-error' : ''}`}>
          <label htmlFor="descricao">Descrição <span className="required">*</span></label>
          <InputText id="descricao" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="w-full" />
          {submitted && errors.descricao && <small className="p-error"><i className="pi pi-exclamation-circle" />{errors.descricao}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="status">Status <span className="required">*</span></label>
          <StatusDropdown id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.value })} className="w-full" />
        </div>
        <RoleBoards selectedRoles={form.roles} onChange={(roles) => setForm({ ...form, roles })} />
      </FormDialog>

      <HistoryDialog
        visible={historyVisible}
        onHide={() => setHistoryVisible(false)}
        entityId={historyId}
        servicePath="/perfis"
      />

      <FilterSidebar
        visible={filterVisible}
        onHide={() => setFilterVisible(false)}
        onClear={() => setFiltros({ status: null })}
        clearDisabled={!filtros.status}
      >
        <div className="form-field">
          <label htmlFor="filter-status">Status</label>
          <StatusDropdown id="filter-status" value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.value })} placeholder="Todos" className="w-full" showClear />
        </div>
      </FilterSidebar>
    </div>
  );
}

export default Perfis;
