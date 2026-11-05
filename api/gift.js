const { Pool } = require("pg");

// Append sslmode=no-verify to bypass cloud provider self-signed certificate checks safely
const connectionString = process.env.POSTGRES_URL;
const finalConnectionString = connectionString.includes("?")
  ? `${connectionString}&sslmode=no-verify`
  : `${connectionString}?sslmode=no-verify`;

const pool = new Pool({
  connectionString: finalConnectionString,
  ssl: { rejectUnauthorized: false },
});

const MEM = global.__EVERMORE_MEM || (global.__EVERMORE_MEM = new Map());

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS gifts (id TEXT PRIMARY KEY, data JSONB);`,
    );
  } catch (e) {
    console.error("Table creation check error:", e.message);
  }

  if (req.method === "POST") {
    try {
      const data =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const slug = Array.from(
        { length: 6 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

      await pool.query(
        `INSERT INTO gifts (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
        [slug, JSON.stringify(data)],
      );

      MEM.set(slug, data);
      return res.status(200).json({ slug, mode: "supabase-permanent" });
    } catch (err) {
      console.error("POST Error:", err.message);
      return res
        .status(500)
        .json({ error: err.message || "Failed to save gift" });
    }
  }

  if (req.method === "GET") {
    const slug = String(req.query.id || "").trim();
    if (!slug) return res.status(400).json({ error: "Missing gift id" });

    try {
      if (MEM.has(slug)) {
        return res.status(200).json(MEM.get(slug));
      }

      const result = await pool.query(`SELECT data FROM gifts WHERE id = $1`, [
        slug,
      ]);
      if (result.rows.length > 0) {
        const json = result.rows[0].data;
        MEM.set(slug, json);
        return res.status(200).json(json);
      }

      return res.status(404).json({ error: "Gift not found" });
    } catch (err) {
      console.error("GET Error:", err.message);
      return res
        .status(500)
        .json({ error: err.message || "Failed to load gift" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
