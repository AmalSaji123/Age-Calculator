import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/invoices').then((res) => setInvoices(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices yet. <Link to="/new">Create one</Link>.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber || inv._id.slice(-6)}</td>
                <td>{inv.client?.name}</td>
                <td>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: inv.currency || 'USD' }).format(
                    inv.total || 0
                  )}
                </td>
                <td>{inv.status}</td>
                <td>{new Date(inv.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/invoice/${inv._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}