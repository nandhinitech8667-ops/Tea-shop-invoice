import { jsPDF } from 'jspdf';
import type { Invoice } from '../types';

export const downloadInvoicePDF = (invoice: Invoice) => {
  // Create PDF in A4 size
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Helper to draw horizontal lines
  const drawLine = (y: number, color = [220, 220, 220], width = 0.2) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(width);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Helper to format currency safe for jsPDF (uses "Rs." instead of "₹" to avoid encoding bugs in built-in PDF fonts)
  const formatPDFCurrency = (val: number) => {
    return `Rs. ${val.toFixed(2)}`;
  };

  // --- BRAND HEADER ---
  // Background accent block at top
  doc.setFillColor(74, 98, 60); // Matcha Green theme color
  doc.rect(0, 0, pageWidth, 12, 'F');

  let y = 22;

  // Shop Name (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(74, 98, 60);
  doc.text(invoice.shop.name, margin, y);

  // "INVOICE" title (Right)
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('TAX INVOICE', pageWidth - margin, y, { align: 'right' });

  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(74, 98, 60);
  doc.text('Brewing Happiness in Every Cup', margin, y);
  y += 5;

  // Shop Address & Details (Left)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(invoice.shop.address, margin, y);

  // Invoice Code details (Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, pageWidth - margin, y, { align: 'right' });

  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Phone: ${invoice.shop.phone}  |  GSTIN: ${invoice.shop.gstin}`, margin, y);
  
  doc.text(`Date: ${invoice.date}  |  Time: ${invoice.time}`, pageWidth - margin, y, { align: 'right' });

  y += 8;
  drawLine(y, [74, 98, 60], 0.5); // Matcha colored divider

  // --- CUSTOMER & INVOICE DETAILS ---
  y += 8;
  
  // Draw Customer Details box
  doc.setFillColor(247, 249, 245); // Very light matcha cream
  doc.rect(margin, y, contentWidth, 22, 'F');
  
  // Border for customer details box
  doc.setDrawColor(213, 223, 207);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 22, 'S');

  // Customer text
  const boxY = y + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(74, 98, 60);
  doc.text('BILLED TO:', margin + 5, boxY);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('PAYMENT METHOD:', pageWidth / 2 + 10, boxY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Name:  ${invoice.customer.name || 'Walk-in Customer'}`, margin + 5, boxY + 6);
  doc.text(`Phone: ${invoice.customer.phone || 'N/A'}`, margin + 5, boxY + 11);

  doc.text(`Mode:   ${invoice.paymentMethod.toUpperCase()}`, pageWidth / 2 + 10, boxY + 6);
  doc.text(`Status:  ${invoice.status.toUpperCase()}`, pageWidth / 2 + 10, boxY + 11);

  y += 30;

  // --- ITEMS TABLE ---
  // Table Header
  doc.setFillColor(74, 98, 60);
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  
  const col1X = margin + 5; // Item Name
  const col2X = pageWidth - margin - 70; // Price (right)
  const col3X = pageWidth - margin - 40; // Qty (right)
  const col4X = pageWidth - margin - 5; // Subtotal (right)

  doc.text('Item Description', col1X, y + 5.5);
  doc.text('Price', col2X, y + 5.5, { align: 'right' });
  doc.text('Qty', col3X, y + 5.5, { align: 'right' });
  doc.text('Amount', col4X, y + 5.5, { align: 'right' });

  y += 8;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9.5);

  invoice.items.forEach((item, index) => {
    // Alternating background
    if (index % 2 === 1) {
      doc.setFillColor(250, 251, 249);
      doc.rect(margin, y, contentWidth, 8, 'F');
    }
    
    // Draw text
    doc.text(item.name, col1X, y + 5.5);
    doc.text(formatPDFCurrency(item.price), col2X, y + 5.5, { align: 'right' });
    doc.text(String(item.quantity), col3X, y + 5.5, { align: 'right' });
    doc.text(formatPDFCurrency(item.subtotal), col4X, y + 5.5, { align: 'right' });

    y += 8;
  });

  drawLine(y, [200, 200, 200], 0.3);
  y += 6;

  // --- TOTALS BLOCK ---
  const totalsX = pageWidth - margin - 60;
  const totalsValX = pageWidth - margin - 5;
  doc.setFontSize(9.5);

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', totalsX, y);
  doc.setTextColor(60, 60, 60);
  doc.text(formatPDFCurrency(invoice.subtotal), totalsValX, y, { align: 'right' });
  y += 5.5;

  // GST
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`GST (${invoice.gstPercent}%):`, totalsX, y);
  doc.setTextColor(60, 60, 60);
  doc.text(formatPDFCurrency(invoice.gstAmount), totalsValX, y, { align: 'right' });
  y += 6;
  
  drawLine(y, [74, 98, 60], 0.5);
  y += 6.5;

  // Grand Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(74, 98, 60);
  doc.text('Grand Total:', totalsX, y);
  doc.text(formatPDFCurrency(invoice.grandTotal), totalsValX, y, { align: 'right' });

  // --- TERMS & CONDITIONS & FOOTER ---
  y = pageHeight - 35;
  drawLine(y, [220, 220, 220], 0.3);
  
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(130, 130, 130);
  doc.text('Thank you for visiting! Have a tea-licious day!', pageWidth / 2, y, { align: 'center' });
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, y, { align: 'center' });

  // Save the PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
