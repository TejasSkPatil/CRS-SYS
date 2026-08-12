import jsPDF from 'jspdf';

interface ChallanItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: {
    name: string;
    sku: string;
    description?: string;
  };
}

interface Customer {
  name: string;
  companyName: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
}

interface Challan {
  id: string;
  challanNumber: string;
  customer: Customer;
  salesUser: { name: string };
  status: string;
  deliveryDate: string | null;
  notes: string | null;
  totalAmount: number;
  items: ChallanItem[];
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; r: number; g: number; b: number }> = {
  draft:     { label: 'DRAFT',     r: 245, g: 158, b: 11  },
  confirmed: { label: 'CONFIRMED', r: 16,  g: 185, b: 129 },
  delivered: { label: 'DELIVERED', r: 16,  g: 185, b: 129 },
  invoiced:  { label: 'INVOICED',  r: 99,  g: 102, b: 241 },
  cancelled: { label: 'CANCELLED', r: 239, g: 68,  b: 68  },
};

// jsPDF Helvetica doesn't support Rs symbol — use ASCII "INR"
const fmtMoney = (val: number): string => {
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `INR ${formatted}`;
};

const fmtDate = (d: string | null): string => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// Draw horizontal rule
const hRule = (doc: jsPDF, y: number, x1 = 16, x2 = 194, r = 220, g = 220, b = 220) => {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(0.3);
  doc.line(x1, y, x2, y);
};

export function exportChallanPDF(challan: Challan): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const margin = 16;
  const rightEdge = pageW - margin;
  const contentW = rightEdge - margin;
  let y = 0;

  // ── 1. BRAND HEADER STRIP ────────────────────────────────────────────────
  // Deep blue header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 36, 'F');

  // Left — brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('Mini ERP', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Business Management System', margin, 22);

  // Right — "INVOICE" label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', rightEdge, 15, { align: 'right' });

  // Status pill
  const st = STATUS_MAP[challan.status] || { label: challan.status.toUpperCase(), r: 100, g: 116, b: 139 };
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(st.r, st.g, st.b);
  doc.text(`\u25CF  ${st.label}`, rightEdge, 23, { align: 'right' });

  y = 44;

  // ── 2. CHALLAN # + DATES ────────────────────────────────────────────────
  // Challan number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Invoice / Challan No.', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(challan.challanNumber, margin, y + 7);

  // Right — date block
  const col2 = rightEdge - 50;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Issue Date', col2, y, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(fmtDate(challan.createdAt), col2, y + 6, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Delivery Date', rightEdge, y, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(fmtDate(challan.deliveryDate), rightEdge, y + 6, { align: 'right' });

  y += 18;
  hRule(doc, y);
  y += 8;

  // ── 3. FROM / BILL TO ────────────────────────────────────────────────────
  const halfW = (contentW / 2) - 6;

  // FROM block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248);
  doc.text('FROM', margin, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Mini ERP Pvt. Ltd.', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const fromLines = [
    '42, Business Hub, Sector 18',
    'Gurugram, Haryana - 122001',
    'GSTIN: 06ABCDE1234F1Z5',
    'support@minierp.in',
  ];
  fromLines.forEach((line, i) => {
    doc.text(line, margin, y + 6 + i * 5.5);
  });

  // BILL TO block
  const billX = margin + halfW + 10;
  const billTopY = y - 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(56, 189, 248);
  doc.text('BILL TO', billX, billTopY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(challan.customer?.name || 'Customer', billX, billTopY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const billLines: string[] = [
    challan.customer?.companyName || '',
  ];
  if (challan.customer?.address) billLines.push(challan.customer.address);
  if (challan.customer?.phone) billLines.push(`Tel: ${challan.customer.phone}`);
  if (challan.customer?.email) billLines.push(challan.customer.email);
  if (challan.customer?.gstNumber) billLines.push(`GSTIN: ${challan.customer.gstNumber}`);

  billLines.forEach((line, i) => {
    doc.text(line, billX, billTopY + 11 + i * 5.5);
  });

  y += 40;
  hRule(doc, y);
  y += 8;

  // ── 4. SALES REP ─────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Sales Executive:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(challan.salesUser?.name || '—', margin + 28, y);

  y += 8;

  // ── 5. ITEMS TABLE ───────────────────────────────────────────────────────

  // Table header
  const colW = {
    no:    8,
    name:  66, // width for Product column
    sku:   44, // width for SKU column
    qty:   12, // width for Qty column
    price: 24, // width for Rate column
    total: 24, // width for Amount column
  };
  const colX = {
    no:    margin,
    name:  margin + colW.no,
    sku:   margin + colW.no + colW.name,
    qty:   margin + colW.no + colW.name + colW.sku,
    price: margin + colW.no + colW.name + colW.sku + colW.qty,
    total: margin + colW.no + colW.name + colW.sku + colW.qty + colW.price,
  };

  // Header row
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentW, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  doc.text('#',         colX.no + 1,    y + 5.2);
  doc.text('PRODUCT',   colX.name + 1,  y + 5.2);
  doc.text('SKU',       colX.sku + 1,   y + 5.2);
  doc.text('QTY',       colX.qty + 1,   y + 5.2);
  doc.text('RATE',      colX.price + colW.price - 1, y + 5.2, { align: 'right' });
  doc.text('AMOUNT',    colX.total + colW.total - 1, y + 5.2, { align: 'right' });

  y += 8;

  // Rows
  let subtotal = 0;
  challan.items.forEach((item, idx) => {
    const rowH = 11;
    const lineTotal = item.unitPrice * item.quantity;
    subtotal += lineTotal;

    // Alternating row bg
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(margin, y, contentW, rowH, 'F');

    // Row bottom border
    hRule(doc, y + rowH, margin, rightEdge, 234, 234, 234);

    // Row number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(String(idx + 1), colX.no + 1, y + 7.2);

    // Product name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const productName = item.product?.name || 'Unknown';
    const truncated = productName.length > 32 ? productName.slice(0, 30) + '…' : productName;
    doc.text(truncated, colX.name + 1, y + 7.2);

    // SKU
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.product?.sku || '—', colX.sku + 1, y + 7.2);

    // Quantity
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(String(item.quantity), colX.qty + colW.qty / 2, y + 7.2, { align: 'center' });

    // Unit price
    doc.setFont('helvetica', 'normal');
    doc.text(fmtMoney(item.unitPrice), colX.price + colW.price - 1, y + 7.2, { align: 'right' });

    // Line total
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(fmtMoney(lineTotal), colX.total + colW.total - 1, y + 7.2, { align: 'right' });

    y += rowH;
  });

  y += 4;

  // ── 6. TOTALS BLOCK ──────────────────────────────────────────────────────
  const totX = margin + contentW / 2;
  const totW = contentW / 2;

  const drawTotRow = (label: string, value: string, bold = false, accent = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 9.5 : 8.5);
    doc.setTextColor(accent ? 56 : 71, accent ? 189 : 85, accent ? 248 : 105);
    doc.text(label, totX + 4, y + 5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(value, rightEdge - 1, y + 5, { align: 'right' });
    y += 7;
  };

  // Subtotal
  hRule(doc, y, totX, rightEdge);
  y += 5;
  drawTotRow('Subtotal', fmtMoney(subtotal));

  // Tax (18% GST simulation)
  const tax = subtotal * 0.18;
  drawTotRow('GST (18%)', fmtMoney(tax));

  // Divider before total
  hRule(doc, y, totX, rightEdge, 15, 23, 42);
  y += 2;

  // Grand total row — highlighted
  doc.setFillColor(15, 23, 42);
  doc.rect(totX, y, totW, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('TOTAL DUE', totX + 4, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(56, 189, 248);
  doc.text(fmtMoney(challan.totalAmount > 0 ? challan.totalAmount : subtotal + tax), rightEdge - 2, y + 7, { align: 'right' });

  y += 16;

  // ── 7. NOTES ─────────────────────────────────────────────────────────────
  if (challan.notes && challan.notes !== 'NA' && challan.notes !== 'N/A') {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentW, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144);
    doc.text('NOTES', margin + 4, y + 6);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 64, 175);
    const noteLines = doc.splitTextToSize(challan.notes, contentW - 8);
    doc.text(noteLines, margin + 4, y + 13);

    y += 26;
  }

  // ── 8. PAYMENT TERMS ─────────────────────────────────────────────────────
  y += 4;
  hRule(doc, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Payment Terms', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const terms = [
    'Payment is due within 30 days of the invoice date.',
    'Please reference the challan number in your payment.',
    'For bank transfer: HDFC Bank | A/C: 12345678901234 | IFSC: HDFC0001234',
  ];
  terms.forEach((t, i) => {
    doc.text(t, margin, y + 6 + i * 5);
  });

  // ── 9. FOOTER ────────────────────────────────────────────────────────────
  const footerY = 285;
  doc.setFillColor(15, 23, 42);
  doc.rect(0, footerY - 2, pageW, 14, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Generated by Mini ERP  \u2022  This is a computer-generated invoice and requires no signature.', margin, footerY + 4);
  doc.text(`${challan.challanNumber}  \u2022  ${fmtDate(challan.createdAt)}`, rightEdge, footerY + 4, { align: 'right' });

  // ── Save ─────────────────────────────────────────────────────────────────
  doc.save(`${challan.challanNumber}.pdf`);
}
