const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi MySQL Railway
const connection = mysql.createConnection({
  host: "crossover.proxy.rlwy.net",
  user: "root",
  password: "JPHKrAJyRtXBvPzkFBWAPBOjFdvMnjyS",
  database: "railway",
  port: 51536
});

// Insert / Update leaderboard
app.post("/summit", (req, res) => {
  const { player, score, updated_at } = req.body;
  const sql = `
    INSERT INTO SummitNaikTurun (player, score, updated_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      score = VALUES(score),
      updated_at = VALUES(updated_at);
  `;
  connection.query(sql, [player, score, updated_at], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ status: "OK" });
  });
});

// Get Top 10 leaderboard
app.get("/top10", (req, res) => {
  const sql = `
    SELECT player, score
    FROM SummitNaikTurun
    ORDER BY score DESC
    LIMIT 10
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.listen(3000, () => console.log("API running on port 3000"));
