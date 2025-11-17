const fs = require("fs-extra");
const path = require("path");

const dbPath = path.join(__dirname, "..", "users.json");

async function readDB() {
    await fs.ensureFile(dbPath);

    let raw;
    try {
        raw = await fs.readFile(dbPath, "utf-8");
        if (!raw.trim()) {
            return { users: [] };
        }
        return JSON.parse(raw);
    } catch (err) {
        return { users: [] };
    }
}

async function writeDB(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    readDB,
    writeDB
};
