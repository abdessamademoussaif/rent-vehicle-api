const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { Buffer } = require('buffer');
const dayjs = require('dayjs');
require('dayjs/locale/fr');
dayjs.locale('fr');

const generatePdfBuffer = (reservation) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // HEADER SECTION
    const logoPath = path.join(__dirname, '../uploads/pdf/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 100 });
    }

    doc
      .fontSize(22)
      .fillColor('#2c3e50')
      .text('Facture de Réservation', 0, 50, { align: 'center', underline: true });

    // Header Info Box
    doc
      .rect(50, 110, 500, 60)
      .fill('#f1f1f1')
      .stroke('#ddd');

    doc.fillColor('#000').fontSize(12).font('Helvetica-Bold');
    doc.text(`Réservation ID:`, 60, 120);
    doc.text(`Statut:`, 60, 135);
    doc.text(`Généré le:`, 60, 150);

    doc.font('Helvetica').fillColor('#333');
    doc.text(`${reservation.data._id}`, 160, 120);
    doc.text(`${reservation.data.status}`, 160, 135);
    doc.text(`${dayjs().format('D MMMM YYYY')}`, 160, 150);

    // SECTION TITLE
    doc.moveDown(4);
    doc.fontSize(14).fillColor('#005f73').text('Détails de la Réservation', { underline: true });

    // DETAILS TABLE
    const tableX = 50;
    let tableY = doc.y + 10;
    const col1Width = 180;
    const col2Width = 320;
    const rowHeight = 24;

    const details = [
      { label: 'Date de début', value: dayjs(reservation.data.startDate).format('D MMMM YYYY') },
      { label: 'Date de fin', value: dayjs(reservation.data.endDate).format('D MMMM YYYY') },
      { label: 'Véhicule', value: `${reservation.data.vehicle?.mark?.name || ''} ${reservation.data.vehicle?.model || ''}` },
      { label: 'Localisation', value: reservation.data.vehicle?.location || '' },
      { label: 'Prix par jour', value: `${reservation.data.vehicle?.pricePerDay} DH` },
      { label: 'Prix total', value: `${reservation.data.totalPrice} DH` },
      { label: 'Client', value: reservation.data.user?.name },
      { label: 'Email', value: reservation.data.user?.email },
      { label: 'Téléphone', value: reservation.data.userPhone },
      { label: 'Adresse', value: reservation.data.userAddress },
    ];

    doc.fontSize(11);

    details.forEach((item, i) => {
      // Background rows
      if (i % 2 === 0) {
        doc.rect(tableX, tableY, col1Width + col2Width, rowHeight).fill('#f9f9f9').fillColor('#000');
      }

      // Labels and values
      doc
        .fillColor('#1d3557')
        .font('Helvetica-Bold')
        .text(item.label, tableX + 10, tableY + 6, {
          width: col1Width - 20,
          align: 'left',
        });

      doc
        .font('Helvetica')
        .fillColor('#000')
        .text(item.value, tableX + col1Width + 10, tableY + 6, {
          width: col2Width - 20,
          align: 'left',
        });

      tableY += rowHeight;
    });

    // LOGO + QR
    const orgPath = path.join(__dirname, '../uploads/pdf/org.png');
    if (fs.existsSync(orgPath)) {
      doc.image(orgPath, 60, 620, { width: 100 });
    }

    const qrCodeDataUrl = await QRCode.toDataURL('https://easytrans.com');
    const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    doc.image(qrImageBuffer, 420, 620, { width: 100 });

    // FOOTER
    doc
      .fontSize(10)
      .fillColor('#666')
      .text('Merci d\'avoir utilisé notre service EASYTRANS !', 50, 740, { align: 'center' });

    doc
      .fontSize(9)
      .fillColor('#888')
      .text('Website: https://easytrans.com', { align: 'center' })
      .text('Facebook: https://facebook.com/profile.php?id=100070846296690', { align: 'center' })
      .text('X (Twitter): https://x.com/Abdssamade97267', { align: 'center' });

    doc.end();
  });
};

module.exports = generatePdfBuffer;
