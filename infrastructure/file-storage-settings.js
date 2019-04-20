const multer = require("multer");
exports.fileStorageSettings = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});
