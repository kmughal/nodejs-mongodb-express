const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const fileExists = promisify(fs.exists);

exports.getInvoiceStream = async filename => {
	try {
		const invoiceFileFullPath = path.resolve(__dirname, "../invoices",filename);
		console.log("Invoice path:", invoiceFileFullPath);
		// const invoiceExists = await fileExists(invoiceFileFullPath);
		// if (!invoiceExists) new Error(`${filename} not found`);
		
		return fs.createReadStream(invoiceFileFullPath);
	} catch (e) {
		throw e;
	}
};
