import PDFDocument from 'pdfkit';

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function generateInvoicePdfBuffer(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Header
    doc
      .fontSize(24)
      .text('INVOICE', { align: 'right' })
      .moveDown();

    // Sender and Client
    doc.fontSize(12).text('From:', { continued: false });
    doc.text(invoice.sender.name);
    if (invoice.sender.addressLine1) doc.text(invoice.sender.addressLine1);
    if (invoice.sender.addressLine2) doc.text(invoice.sender.addressLine2);
    if (invoice.sender.city || invoice.sender.state || invoice.sender.postalCode)
      doc.text(
        `${invoice.sender.city || ''} ${invoice.sender.state || ''} ${invoice.sender.postalCode || ''}`.trim()
      );
    if (invoice.sender.country) doc.text(invoice.sender.country);
    if (invoice.sender.email) doc.text(invoice.sender.email);

    doc.moveDown();

    doc.text('Bill To:');
    doc.text(invoice.client.name);
    if (invoice.client.addressLine1) doc.text(invoice.client.addressLine1);
    if (invoice.client.addressLine2) doc.text(invoice.client.addressLine2);
    if (invoice.client.city || invoice.client.state || invoice.client.postalCode)
      doc.text(
        `${invoice.client.city || ''} ${invoice.client.state || ''} ${invoice.client.postalCode || ''}`.trim()
      );
    if (invoice.client.country) doc.text(invoice.client.country);
    if (invoice.client.email) doc.text(invoice.client.email);

    doc.moveDown();

    if (invoice.invoiceNumber) doc.text(`Invoice #: ${invoice.invoiceNumber}`);
    if (invoice.dueDate) doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);

    doc.moveDown();

    // Table Header
    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 320;
    const priceX = 380;
    const amountX = 460;

    doc.font('Helvetica-Bold');
    doc.text('Item', itemX, tableTop);
    doc.text('Qty', qtyX, tableTop);
    doc.text('Unit Price', priceX, tableTop);
    doc.text('Amount', amountX, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica');
    let y = tableTop + 25;
    invoice.items.forEach((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      doc.text(item.description, itemX, y, { width: 250 });
      doc.text(String(item.quantity), qtyX, y);
      doc.text(formatCurrency(item.unitPrice, invoice.currency), priceX, y);
      doc.text(formatCurrency(lineTotal, invoice.currency), amountX, y);
      y += 20;
    });

    doc.moveDown(2);

    // Totals
    const subtotalLabelX = 360;
    const subtotalValueX = 460;

    doc.text('Subtotal:', subtotalLabelX, y + 10);
    doc.text(formatCurrency(invoice.subtotal, invoice.currency), subtotalValueX, y + 10);

    if (invoice.taxRate && invoice.taxRate > 0) {
      doc.text(`Tax (${invoice.taxRate}%):`, subtotalLabelX, y + 30);
      doc.text(formatCurrency(invoice.taxAmount, invoice.currency), subtotalValueX, y + 30);
    }

    if (invoice.discount && invoice.discount > 0) {
      doc.text('Discount:', subtotalLabelX, y + 50);
      doc.text(`- ${formatCurrency(invoice.discount, invoice.currency)}`, subtotalValueX, y + 50);
    }

    doc.font('Helvetica-Bold');
    doc.text('Total:', subtotalLabelX, y + 80);
    doc.text(formatCurrency(invoice.total, invoice.currency), subtotalValueX, y + 80);
    doc.font('Helvetica');

    if (invoice.notes) {
      doc.moveDown(2);
      doc.text('Notes:');
      doc.text(invoice.notes);
    }

    doc.end();
  });
}

export async function streamInvoicePdfResponse(res, invoice) {
  const buffer = await generateInvoicePdfBuffer(invoice);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=invoice-${invoice._id}.pdf`);
  return res.send(buffer);
}