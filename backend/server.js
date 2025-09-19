import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "loan_comparison",
});

// 1. Create Provider
app.post("/providers", (req, res) => {
  const { provider_name, interest_rate, max_loan_amount } = req.body;
  const sql = "INSERT INTO providers (provider_name, interest_rate, max_loan_amount) VALUES (?, ?, ?)";
  db.query(sql, [provider_name, interest_rate, max_loan_amount], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, provider_name, interest_rate, max_loan_amount });
  });
});

// 2. Read Providers
app.get("/providers", (req, res) => {
  db.query("SELECT * FROM providers", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 3. Update Provider
app.put("/providers/:id", (req, res) => {
  const { id } = req.params;
  const { provider_name, interest_rate, max_loan_amount } = req.body;
  const sql = "UPDATE providers SET provider_name = ?, interest_rate = ?, max_loan_amount = ? WHERE id = ?";
  db.query(sql, [provider_name, interest_rate, max_loan_amount, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Provider updated successfully" });
  });
});

// 4. Delete Provider
app.delete("/providers/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM providers WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Provider deleted successfully" });
  });
});

app.listen(5100, () => console.log("Server running on port 5000"));