import fs from"fs-extra";
import path from "path";

const dbPath = path.join(__dirname, "users.json");

exports.readDB = async () => {
    await fs.ensureFile(dbPath);

    try {
        const raw = await fs.readFile(dbPath, "utf-8");
        return raw ? JSON.parse(raw) : { users: [] };
    } catch (err) {
        return { users: [] };
    }
};

exports.writeDB = async (data) => {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
};
