import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '12px 16px', borderBottom: '1px solid #eee', marginBottom: 16 }}>
      <Link to="/" style={{ marginRight: 16, fontWeight: 600 }}>Invoices</Link>
      <Link to="/new">New Invoice</Link>
    </nav>
  );
}