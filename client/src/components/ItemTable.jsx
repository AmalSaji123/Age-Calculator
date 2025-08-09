import React from 'react';

export default function ItemTable({ items, onChange }) {
  const updateItem = (index, key, value) => {
    const updated = items.map((it, i) => (i === index ? { ...it, [key]: value } : it));
    onChange(updated);
  };

  const addItem = () => onChange([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min={0}
                  onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                  style={{ width: 100 }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.unitPrice}
                  min={0}
                  step="0.01"
                  onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                  style={{ width: 120 }}
                />
              </td>
              <td>
                <button type="button" onClick={() => removeItem(idx)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem} style={{ marginTop: 8 }}>Add Item</button>
    </div>
  );
}