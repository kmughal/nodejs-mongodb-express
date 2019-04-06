const {
  promisify
} = require("util");
const {
  readFile,
  writeFile,
  existsSync
} = require("fs");
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class JsonUpdater {

  static async read(path, initValue) {
    try {
      if (!existsSync(path)) {
        initValue = initValue ? initValue :  [];
        await JsonUpdater.write(path, initValue);
        return initValue;
      }
      const result = await readFileAsync(path, {
        encoding: "UTF-8"
      });
      return result.length === 0 ? [] : JSON.parse(result);
    } catch (e) {
      throw new Error("JsonUpdater.read failed, error:", e);
    }
  }

  static async write(path, json) {
    try {
      await writeFileAsync(path, JSON.stringify(json, 2), {
        encoding: "UTF-8"
      });
    } catch (e) {
      throw new Error("JsonUpdater.write failed, error:", e);
    }
  }
}

module.exports.JsonUpdater = JsonUpdater;