import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { useAuth } from '../../contexts/AuthContext';
import BaseService from '../../services/baseService';
import './styles.scss';

const usuarioService = new BaseService('/usuarios');
const perfilService = new BaseService('/perfis');

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  bg: string;
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ usuarios: 0, perfis: 0 });

  useEffect(() => {
    Promise.all([
      usuarioService.getAll().catch(() => []),
      perfilService.getAll().catch(() => []),
    ]).then(([usuarios, perfis]) => {
      setStats({ usuarios: usuarios.length || 0, perfis: perfis.length || 0 });
    });
  }, []);

  const cards: StatCard[] = [
    { title: 'Usuários', value: stats.usuarios, icon: 'pi pi-users', color: '#3b82f6', bg: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
    { title: 'Perfis', value: stats.perfis, icon: 'pi pi-shield', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf6, #a855f7)' },
    { title: 'Roles', value: 8, icon: 'pi pi-key', color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    { title: 'Status', value: 'Online', icon: 'pi pi-check-circle', color: '#22c55e', bg: 'linear-gradient(135deg, #22c55e, #10b981)' },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo de volta, {user?.nome || 'Administrador'}</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.title} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg }}>
              <i className={card.icon} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card className="content-card">
          <div className="card-header-custom"><h3>Acesso Rápido</h3></div>
          <div className="quick-links">
            <a href="/usuarios" className="quick-link"><i className="pi pi-user-plus" /><span>Novo Usuário</span></a>
            <a href="/perfis" className="quick-link"><i className="pi pi-shield" /><span>Gerenciar Perfis</span></a>
          </div>
        </Card>

        <Card className="content-card">
          <div className="card-header-custom"><h3>Informações do Sistema</h3></div>
          <div className="system-info">
            <div className="info-row"><span className="info-label">Versão</span><span className="info-value">1.0.0</span></div>
            <div className="info-row"><span className="info-label">Ambiente</span><span className="info-value">Desenvolvimento</span></div>
            <div className="info-row"><span className="info-label">Banco de Dados</span><span className="info-value">PostgreSQL</span></div>
            <div className="info-row"><span className="info-label">Autenticação</span><span className="info-value">JWT</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
