import express from 'express';
import Invoice from '../models/Invoice.js';
import { generateInvoicePdfBuffer, streamInvoicePdfResponse } from '../utils/pdf.js';
import { sendInvoiceEmail } from '../email/mailer.js';

const router = express.Router();

function calculateTotals(invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = ((invoice.taxRate || 0) / 100) * subtotal;
  const discount = invoice.discount || 0;
  const total = subtotal + taxAmount - discount;
  return { subtotal, taxAmount, total };
}

router.get('/', async (_req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
});

router.get('/:id', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const totals = calculateTotals(data);
    const invoice = await Invoice.create({ ...data, ...totals });
    res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid invoice data', error: String(err) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const totals = calculateTotals(data);
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: { ...data, ...totals } },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Invalid invoice data', error: String(err) });
  }
});

router.delete('/:id', async (req, res) => {
  const invoice = await Invoice.findByIdAndDelete(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json({ message: 'Deleted' });
});

router.get('/:id/pdf', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  await streamInvoicePdfResponse(res, invoice);
});

router.post('/:id/send', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const to = req.body?.to || invoice.client?.email;
  if (!to) return res.status(400).json({ message: 'Recipient email not provided' });

  const pdfBuffer = await generateInvoicePdfBuffer(invoice);

  const subject = `Invoice ${invoice.invoiceNumber || invoice._id}`;
  const text = `Please find attached your invoice. Total: ${invoice.total} ${invoice.currency}`;
  const html = `<p>Please find attached your invoice.</p><p>Total: <strong>${invoice.total} ${invoice.currency}</strong></p>`;

  try {
    const info = await sendInvoiceEmail({
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: `invoice-${invoice._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    await Invoice.findByIdAndUpdate(invoice._id, { $set: { status: 'sent' } });

    res.json({ message: 'Email sent', id: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email', error: String(err) });
  }
});

export default router;