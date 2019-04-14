exports.getSettings = filename => {
	const settingFilePath = require("path").resolve(
		__dirname,
		"../settings",
		`${filename}.json`
	);
	return require(settingFilePath);
};
