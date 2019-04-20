const multer = require("multer");
exports.fileStorageSettings = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});


exports.fileFilterTypes = (req,file,cb) => {
	const acceptableMimeTypes = ["image/png" , "image/jpeg" , "images/jpg"];
	if (acceptableMimeTypes.includes(file.mimetype))  cb(null,true);
	else cb(null,false);
}