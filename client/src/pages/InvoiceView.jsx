import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

export default function InvoiceView() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [toEmail, setToEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get(`/api/invoices/${id}`).then((res) => {
      setInvoice(res.data);
      setToEmail(res.data.client?.email || '');
    });
  }, [id]);

  const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/invoices/${id}/pdf`;

  const sendMail = async () => {
    setSending(true);
    try {
      await api.post(`/api/invoices/${id}/send`, { to: toEmail });
      alert('Email sent');
    } catch (err) {
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (!invoice) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Invoice {invoice.invoiceNumber || invoice._id.slice(-6)}</h2>
      <div style={{ margin: '12px 0' }}>
        <label>
          Send to:
          <input style={{ marginLeft: 8 }} type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
        </label>
        <button onClick={sendMail} disabled={sending || !toEmail} style={{ marginLeft: 8 }}>
          {sending ? 'Sending...' : 'Send Email'}
        </button>
      </div>
      <div style={{ border: '1px solid #ddd', height: 700 }}>
        <iframe title="Invoice PDF" src={pdfUrl} style={{ width: '100%', height: '100%', border: 'none' }} />
      </div>
    </div>
  );
}