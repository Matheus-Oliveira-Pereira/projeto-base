import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './styles.scss';

interface CrudHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onFilterClick: () => void;
  newLabel?: string;
  onNewClick?: () => void;
  showNew?: boolean;
}

function CrudHeader({ searchValue, onSearchChange, searchPlaceholder = 'Buscar...', onFilterClick, newLabel, onNewClick, showNew = true }: CrudHeaderProps) {
  return (
    <div className="table-header">
      <div className="search-wrapper">
        <i className="pi pi-search" />
        <InputText value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} />
      </div>
      <Button icon="pi pi-filter" label="Filtros" className="btn-filtros" onClick={onFilterClick} />
      {showNew && newLabel && onNewClick && (
        <Button label={newLabel} icon="pi pi-plus" className="btn-novo" onClick={onNewClick} />
      )}
    </div>
  );
}

export default CrudHeader;
