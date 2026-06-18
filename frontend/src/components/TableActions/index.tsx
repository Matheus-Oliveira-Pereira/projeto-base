import { Button } from 'primereact/button';
import './styles.scss';

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onHistory?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showHistory?: boolean;
}

function TableActions({ onEdit, onDelete, onHistory, showEdit = true, showDelete = true, showHistory = false }: TableActionsProps) {
  if (!showEdit && !showDelete && !showHistory) return null;

  return (
    <div className="flex gap-2">
      {showHistory && onHistory && (
        <Button icon="pi pi-history" rounded text className="btn-historico" onClick={onHistory} tooltip="Histórico" tooltipOptions={{ position: 'top' }} />
      )}
      {showEdit && onEdit && (
        <Button icon="pi pi-pencil" rounded text className="btn-editar" onClick={onEdit} tooltip="Editar" tooltipOptions={{ position: 'top' }} />
      )}
      {showDelete && onDelete && (
        <Button icon="pi pi-trash" rounded text className="btn-excluir" onClick={onDelete} tooltip="Excluir" tooltipOptions={{ position: 'top' }} />
      )}
    </div>
  );
}

export default TableActions;
