import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Activity } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <aside style={{
      width: '280px',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      background: 'rgba(10, 10, 10, 0.4)',
      backdropFilter: 'blur(30px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.5rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
          <Activity size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '-0.02em' }}>E-Analytics</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Workspace</span>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Menu</p>
        
        <Link to="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px',
          color: location.pathname.startsWith('/dashboard') ? '#fff' : 'var(--text-secondary)', 
          textDecoration: 'none', transition: 'all 0.2s',
          background: location.pathname.startsWith('/dashboard') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          border: location.pathname.startsWith('/dashboard') ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
          fontWeight: location.pathname.startsWith('/dashboard') ? '600' : '500'
        }}>
          <LayoutDashboard size={20} color={location.pathname.startsWith('/dashboard') ? 'var(--accent-primary)' : 'currentColor'} />
          Overview
        </Link>
        
        <Link to="/customers" style={{
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px',
          color: location.pathname.startsWith('/customers') ? '#fff' : 'var(--text-secondary)', 
          textDecoration: 'none', transition: 'all 0.2s',
          background: location.pathname.startsWith('/customers') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          border: location.pathname.startsWith('/customers') ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
          fontWeight: location.pathname.startsWith('/customers') ? '600' : '500'
        }}>
          <Users size={20} color={location.pathname.startsWith('/customers') ? 'var(--accent-primary)' : 'currentColor'} />
          Customers
        </Link>
      </nav>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            👤
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Administrator'}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="btn w-full" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-danger)', padding: '0.75rem', borderRadius: '10px' }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content animate-fade-in">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
