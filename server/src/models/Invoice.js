import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    sender: { type: AddressSchema, required: true },
    client: { type: AddressSchema, required: true },
    items: { type: [ItemSchema], required: true, default: [] },
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    notes: { type: String },
    dueDate: { type: Date },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'void'], default: 'draft' },
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    invoiceNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', InvoiceSchema);