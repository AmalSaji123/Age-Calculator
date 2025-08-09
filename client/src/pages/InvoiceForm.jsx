import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import ItemTable from '../components/ItemTable.jsx';

const emptyAddress = { name: '', email: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: '' };

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [sender, setSender] = useState(emptyAddress);
  const [client, setClient] = useState(emptyAddress);
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/api/invoices', {
        sender,
        client,
        items,
        currency,
        taxRate: Number(taxRate),
        discount: Number(discount),
        notes,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        invoiceNumber: invoiceNumber || undefined,
      });
      navigate(`/invoice/${res.data._id}`);
    } catch (err) {
      alert('Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const Section = ({ title, children }) => (
    <fieldset style={{ marginBottom: 16 }}>
      <legend style={{ fontWeight: 600 }}>{title}</legend>
      {children}
    </fieldset>
  );

  const AddressFields = ({ value, onChange }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <input placeholder="Name" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
      <input placeholder="Email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
      <input placeholder="Address Line 1" value={value.addressLine1} onChange={(e) => onChange({ ...value, addressLine1: e.target.value })} />
      <input placeholder="Address Line 2" value={value.addressLine2} onChange={(e) => onChange({ ...value, addressLine2: e.target.value })} />
      <input placeholder="City" value={value.city} onChange={(e) => onChange({ ...value, city: e.target.value })} />
      <input placeholder="State" value={value.state} onChange={(e) => onChange({ ...value, state: e.target.value })} />
      <input placeholder="Postal Code" value={value.postalCode} onChange={(e) => onChange({ ...value, postalCode: e.target.value })} />
      <input placeholder="Country" value={value.country} onChange={(e) => onChange({ ...value, country: e.target.value })} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h2>Create Invoice</h2>

      <Section title="From">
        <AddressFields value={sender} onChange={setSender} />
      </Section>

      <Section title="Bill To">
        <AddressFields value={client} onChange={setClient} />
      </Section>

      <Section title="Items">
        <ItemTable items={items} onChange={setItems} />
      </Section>

      <Section title="Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <input placeholder="Invoice # (optional)" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          <input placeholder="Currency (e.g., USD)" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input type="number" placeholder="Tax Rate %" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
          <input type="number" placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
      </Section>

      <Section title="Notes">
        <textarea rows={4} style={{ width: '100%' }} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Section>

      <button disabled={submitting} type="submit">{submitting ? 'Creating...' : 'Create Invoice'}</button>
    </form>
  );
}