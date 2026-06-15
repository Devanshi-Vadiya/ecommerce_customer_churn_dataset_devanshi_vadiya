import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async (currentPage, search = '') => {
    setLoading(true);
    try {
      let url = `/customers?page=${currentPage}&limit=10`;
      if (search) {
        url = `/search/customers?q=${encodeURIComponent(search)}&page=${currentPage}&limit=10`;
      }
      
      const { data } = await api.get(url);
      setCustomers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(page, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Customers</h1>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search customers..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Location</th>
                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Age/Gender</th>
                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>LTV</th>
                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No customers found.</td>
                </tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>...{customer._id.slice(-6)}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{customer.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.country}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {customer.age} / {customer.gender}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--accent-primary)' }}>
                      ${customer.lifetimeValue?.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {customer.churned ? (
                        <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>Churned</span>
                      ) : (
                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500' }}>Active</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Link to={`/customers/${customer._id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.4rem' }}
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.4rem' }}
              disabled={page >= totalPages || loading}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
