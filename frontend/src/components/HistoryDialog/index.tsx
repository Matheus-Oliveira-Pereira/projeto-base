import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Tag } from 'primereact/tag';
import BaseService from '../../services/baseService';
import './styles.scss';

interface AuditoriaItem {
  revisao: number;
  data: string;
  usuario: string;
  tipoOperacao: string;
  dados: Record<string, string>;
}

interface HistoryDialogProps {
  visible: boolean;
  onHide: () => void;
  entityId: string | null;
  servicePath: string;
  title?: string;
}

const OPERATION_CONFIG: Record<string, { severity: 'success' | 'info' | 'danger'; icon: string }> = {
  'CRIAÇÃO': { severity: 'success', icon: 'pi pi-plus' },
  'ALTERAÇÃO': { severity: 'info', icon: 'pi pi-pencil' },
  'EXCLUSÃO': { severity: 'danger', icon: 'pi pi-trash' },
};

function HistoryDialog({ visible, onHide, entityId, servicePath, title = 'Histórico de Alterações' }: HistoryDialogProps) {
  const [historico, setHistorico] = useState<AuditoriaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && entityId) {
      setLoading(true);
      const service = new BaseService(servicePath);
      service.getById(`${entityId}/historico`)
        .then((data) => setHistorico(data as unknown as AuditoriaItem[]))
        .catch(() => setHistorico([]))
        .finally(() => setLoading(false));
    }
  }, [visible, entityId, servicePath]);

  const header = (
    <span className="p-dialog-title">
      <i className="pi pi-history" />{' '}{title}
    </span>
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const FIELD_LABELS: Record<string, string> = {
    nome: 'Nome',
    email: 'E-mail',
    status: 'Status',
    descricao: 'Descrição',
  };

  const customContent = (item: AuditoriaItem) => {
    const config = OPERATION_CONFIG[item.tipoOperacao] || OPERATION_CONFIG['ALTERAÇÃO'];

    return (
      <div className="history-item">
        <div className="history-header">
          <Tag value={item.tipoOperacao} severity={config.severity} icon={config.icon} />
          <span className="history-date">{formatDate(item.data)}</span>
        </div>
        <div className="history-user">
          <i className="pi pi-user" />
          <span>{item.usuario}</span>
        </div>
        {item.dados && Object.keys(item.dados).length > 0 && (
          <div className="history-data">
            {Object.entries(item.dados).map(([key, value]) => (
              <div key={key} className="history-field">
                <span className="field-name">{FIELD_LABELS[key] || key}</span>
                <span className="field-value">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const marker = (item: AuditoriaItem) => {
    const config = OPERATION_CONFIG[item.tipoOperacao] || OPERATION_CONFIG['ALTERAÇÃO'];
    const colors: Record<string, string> = {
      success: '#22c55e',
      info: '#3b82f6',
      danger: '#ef4444',
    };
    return (
      <span className="history-marker" style={{ background: colors[config.severity] }}>
        <i className={config.icon} />
      </span>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      style={{ width: '600px', maxHeight: '80vh' }}
      modal
      draggable={false}
    >
      {loading ? (
        <div className="flex justify-content-center p-4">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#3b82f6' }} />
        </div>
      ) : historico.length === 0 ? (
        <div className="text-center p-4" style={{ color: '#94a3b8' }}>
          Nenhum histórico encontrado.
        </div>
      ) : (
        <Timeline
          value={historico}
          content={customContent}
          marker={marker}
          className="history-timeline"
        />
      )}
    </Dialog>
  );
}

export default HistoryDialog;
