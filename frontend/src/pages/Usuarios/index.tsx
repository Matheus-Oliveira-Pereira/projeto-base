import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
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

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  status: string;
  perfis: Perfil[];
}

interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  status: string;
  perfis: Perfil[];
}

interface Filtros {
  status: string | null;
  perfil: string | null;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
}

const usuarioService = new BaseService('/usuarios');
const perfilService = new BaseService('/perfis');

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [filtroGlobal, setFiltroGlobal] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({ status: null, perfil: null });
  const [form, setForm] = useState<UsuarioForm>({ nome: '', email: '', senha: '', status: 'ATIVO', perfis: [] });
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
      const [usuariosData, perfisData] = await Promise.all([
        usuarioService.getAll(),
        perfilService.getAll(),
      ]);
      setUsuarios(usuariosData);
      setPerfis(perfisData);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados' });
    }
    setLoading(false);
  };

  const dadosFiltrados = () => {
    let data = [...usuarios];
    if (filtros.status) data = data.filter((u) => u.status === filtros.status);
    if (filtros.perfil) data = data.filter((u) => u.perfis?.some((p) => p.descricao === filtros.perfil));
    return data;
  };

  const validar = (): boolean => {
    const errs: FormErrors = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.email.trim()) errs.email = 'E-mail é obrigatório';
    if (!editando && !form.senha.trim()) errs.senha = 'Senha é obrigatória';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const abrirNovo = () => {
    setForm({ nome: '', email: '', senha: '', status: 'ATIVO', perfis: [] });
    setFormId(null);
    setEditando(false);
    setErrors({});
    setSubmitted(false);
    setDialogVisible(true);
  };

  const abrirEdicao = (usuario: Usuario) => {
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      status: usuario.status,
      perfis: usuario.perfis || [],
    });
    setFormId(usuario.id);
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
      const payload: Record<string, unknown> = { ...form };
      if (editando && !payload.senha) delete payload.senha;

      if (editando) {
        await usuarioService.update(formId!, payload);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado' });
      } else {
        await usuarioService.create(payload);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado' });
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

  const confirmarExclusao = (usuario: Usuario) => {
    confirmDialog({
      message: `Deseja excluir o usuário "${usuario.nome}"?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: async () => {
        try {
          await usuarioService.remove(usuario.id);
          toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído' });
          carregarDados();
        } catch {
          toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir' });
        }
      },
    });
  };

  const perfisTemplate = (rowData: Usuario) => {
    if (!rowData.perfis?.length) return <span className="text-gray-400">&mdash;</span>;
    return (
      <div className="perfis-chips">
        {rowData.perfis.map((p) => (
          <span key={p.id || p.descricao} className="perfil-chip">
            <i className="pi pi-shield" />
            {p.descricao}
          </span>
        ))}
      </div>
    );
  };

  const { user: authUser } = useAuth();
  const roles = authUser?.roles ?? [];
  const podeAdicionar = canAdd(roles, MODULES.USUARIOS.prefix);
  const podeEditar = canChange(roles, MODULES.USUARIOS.prefix);
  const podeExcluir = canDelete(roles, MODULES.USUARIOS.prefix);

  const statusTemplate = (rowData: Usuario) => <StatusBadge status={rowData.status} />;
  const acoesTemplate = (rowData: Usuario) => (
    <TableActions
      onHistory={() => { setHistoryId(rowData.id); setHistoryVisible(true); }}
      onEdit={() => abrirEdicao(rowData)}
      onDelete={() => confirmarExclusao(rowData)}
      showHistory
      showEdit={podeEditar}
      showDelete={podeExcluir}
    />
  );
  const temFiltroAtivo = filtros.status || filtros.perfil;

  return (
    <div className="crud-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <PageHeader title="Usuários" subtitle="Gerenciamento de usuários do sistema" />

      <div className="content-card">
        <DataTable
          value={dadosFiltrados()}
          loading={loading}
          header={
            <CrudHeader
              searchValue={filtroGlobal}
              onSearchChange={setFiltroGlobal}
              searchPlaceholder="Buscar por nome, e-mail..."
              onFilterClick={() => setFilterVisible(true)}
              newLabel="Novo Usuário"
              onNewClick={abrirNovo}
              showNew={podeAdicionar}
            />
          }
          globalFilter={filtroGlobal}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="Nenhum usuário encontrado"
          stripedRows
          removableSort
        >
          <Column field="nome" header="Nome" sortable />
          <Column field="email" header="E-mail" sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable style={{ width: '130px' }} />
          <Column header="Perfis" body={perfisTemplate} />
          <Column header="Ações" body={acoesTemplate} style={{ width: '120px' }} />
        </DataTable>
      </div>

      <FormDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        title={editando ? 'Editar Usuário' : 'Novo Usuário'}
        icon={editando ? 'pi pi-user-edit' : 'pi pi-user-plus'}
        onSave={salvar}
        loading={salvando}
      >
        <div className={`form-field ${submitted && errors.nome ? 'field-error' : ''}`}>
          <label htmlFor="nome">Nome <span className="required">*</span></label>
          <InputText id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full" />
          {submitted && errors.nome && <small className="p-error"><i className="pi pi-exclamation-circle" />{errors.nome}</small>}
        </div>
        <div className={`form-field ${submitted && errors.email ? 'field-error' : ''}`}>
          <label htmlFor="email">E-mail <span className="required">*</span></label>
          <InputText id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full" />
          {submitted && errors.email && <small className="p-error"><i className="pi pi-exclamation-circle" />{errors.email}</small>}
        </div>
        <div className={`form-field ${submitted && errors.senha ? 'field-error' : ''}`}>
          <label htmlFor="senha">Senha {!editando && <span className="required">*</span>} {editando && <small>(deixe em branco para manter)</small>}</label>
          <InputText id="senha" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} className="w-full" />
          {submitted && errors.senha && <small className="p-error"><i className="pi pi-exclamation-circle" />{errors.senha}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="status">Status <span className="required">*</span></label>
          <StatusDropdown id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.value })} className="w-full" />
        </div>
        <div className="form-field">
          <label htmlFor="perfis">Perfis</label>
          <MultiSelect
            id="perfis"
            value={form.perfis}
            options={perfis}
            onChange={(e) => setForm({ ...form, perfis: e.value })}
            optionLabel="descricao"
            placeholder="Selecione os perfis"
            className="w-full"
            display="chip"
          />
        </div>
      </FormDialog>

      <HistoryDialog
        visible={historyVisible}
        onHide={() => setHistoryVisible(false)}
        entityId={historyId}
        servicePath="/usuarios"
      />

      <FilterSidebar
        visible={filterVisible}
        onHide={() => setFilterVisible(false)}
        onClear={() => setFiltros({ status: null, perfil: null })}
        clearDisabled={!temFiltroAtivo}
      >
        <div className="form-field">
          <label htmlFor="filter-status">Status</label>
          <StatusDropdown id="filter-status" value={filtros.status} onChange={(e) => setFiltros({ ...filtros, status: e.value })} placeholder="Todos" className="w-full" showClear />
        </div>
        <div className="form-field">
          <label htmlFor="filter-perfil">Perfil</label>
          <Dropdown
            id="filter-perfil"
            value={filtros.perfil}
            options={perfis.map((p) => ({ label: p.descricao, value: p.descricao }))}
            onChange={(e) => setFiltros({ ...filtros, perfil: e.value })}
            placeholder="Todos"
            className="w-full"
            showClear
          />
        </div>
      </FilterSidebar>
    </div>
  );
}

export default Usuarios;
