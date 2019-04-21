const fs = require("fs");
const path = require("path");

const PdfDocument = require("pdfkit");

exports.generateInvoice = ({ orderId, products }) => {
	const invoiceFileFullPath = path.resolve(
		__dirname,
		`../invoices/invoice-${orderId}.pdf`
	);

	console.log(invoiceFileFullPath);
	const pdf = new PdfDocument();
	pdf.pipe(fs.createWriteStream(invoiceFileFullPath));

	pdf
		.fontSize(8)
		.text("Date:" + new Date().toLocaleDateString("en-gb"), 400, 10);
	pdf.fontSize(15).text("Invoice", 10, 50);

	let total = 0.0;
	pdf.fontSize(10);
	pdf.text("=================================", 20);
	products.forEach(prod => {
		pdf.fontSize(11).text("Product name: " + prod.title, 20);
		pdf.fontSize(10).text("Quantity: " + prod.quantity, 20);
		pdf.fontSize(10).text("Unit price: " + prod.price, 20);
		total += parseFloat(prod.quantity) * parseFloat(prod.price, 20);
		pdf.text("=================================", 20);
	});
	pdf.text(" ");
	pdf.fontSize(12).text("Total: £" + total);
	pdf.end();
	return pdf;
};

exports.deleteFile = async filepath => {
	await fs.unlink(filepath);
};
