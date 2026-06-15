import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await api.get(`/customers/${id}`);
        setCustomer(data.data);
      } catch (err) {
        setError('Failed to fetch customer details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.put(`/customers/${id}`, customer);
      // Show success indicator here if needed
    } catch (err) {
      setError('Failed to save customer updates.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        navigate('/customers');
      } catch (err) {
        setError('Failed to delete customer.');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading customer details...</div>;
  if (error && !customer) return <div className="text-danger">{error}</div>;
  if (!customer) return <div>Customer not found.</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/customers')} className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ margin: 0 }}>Customer Details</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          <button onClick={handleDelete} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>
            <Trash2 size={18} /> Delete
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{error}</div>}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Demographics</h3>
            
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" name="age" className="form-control" value={customer.age || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-control" value={customer.gender || ''} onChange={handleInputChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-control" value={customer.city || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input type="text" name="country" className="form-control" value={customer.country || ''} onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Behavior & Analytics</h3>
            
            <div className="form-group">
              <label className="form-label">Lifetime Value ($)</label>
              <input type="number" step="0.01" name="lifetimeValue" className="form-control" value={customer.lifetimeValue || 0} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Purchases</label>
              <input type="number" name="totalPurchases" className="form-control" value={customer.totalPurchases || 0} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Credit Balance ($)</label>
              <input type="number" step="0.01" name="creditBalance" className="form-control" value={customer.creditBalance || 0} onChange={handleInputChange} />
            </div>
            
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <input 
                type="checkbox" 
                name="churned" 
                id="churned"
                checked={customer.churned || false} 
                onChange={handleInputChange} 
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-danger)' }}
              />
              <label htmlFor="churned" style={{ fontSize: '1.1rem', color: customer.churned ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                Customer has Churned
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
