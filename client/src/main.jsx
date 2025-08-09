import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/InvoiceList.jsx';
import InvoiceForm from './pages/InvoiceForm.jsx';
import InvoiceView from './pages/InvoiceView.jsx';
import Navbar from './components/Navbar.jsx';

function Root() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/new" element={<InvoiceForm />} />
        <Route path="/invoice/:id" element={<InvoiceView />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<Root />);