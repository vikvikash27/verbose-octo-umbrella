import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Order } from '../types';

// Use a type intersection to correctly extend the jsPDF class with plugin methods for TypeScript.
type jsPDFWithPlugin = jsPDF & {
  autoTable: (options: any) => jsPDFWithPlugin;
  lastAutoTable: {
    finalY: number;
  };
};

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF() as jsPDFWithPlugin;

  // --- Header ---
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('EasyOrganic Invoice', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('EasyOrganic Store', 14, 30);
  doc.text('123 Green Valley, Hyderabad, India', 14, 35);
  doc.text('contact@easyorganic.com', 14, 40);

  // --- Invoice Details ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice #${order.id}`, 196, 22, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(order.orderTimestamp).toLocaleDateString()}`, 196, 28, { align: 'right' });

  // --- Bill To Section ---
  doc.setLineWidth(0.5);
  doc.line(14, 50, 196, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(order.address?.fullName || order.customerName, 14, 63);
  doc.text(order.address?.street || '', 14, 68);
  doc.text(`${order.address?.city}, ${order.address?.state} ${order.address?.zip}`, 14, 73);
  doc.text(order.address?.phone || '', 14, 78);

  // --- Items Table ---
  const tableColumn = ["#", "Item Description", "Quantity", "Unit Price", "Total"];
  const tableRows = order.items.map((item, index) => [
    index + 1,
    item.productName + (item.subscription ? ` (${item.subscription})` : ''),
    item.quantity,
    `₹${item.price.toFixed(2)}`,
    `₹${(item.quantity * item.price).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // brand-primary color
    styles: { font: 'helvetica', fontSize: 10 },
  });

  // --- Totals Section ---
  const finalY = doc.lastAutoTable.finalY || 150;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 140, finalY + 15, { align: 'left' });
  doc.text(`₹${order.total.toFixed(2)}`, 196, finalY + 15, { align: 'right' });

  // --- Footer ---
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });

  // --- Save PDF ---
  doc.save(`invoice-${order.id}.pdf`);
};
