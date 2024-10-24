const sqlite3 = require('sqlite3').verbose();

const express = require('express')
const app = express()


app.get("/refresh_db", (req, res) => {
	const db = new sqlite3.Database('plovdivsoft.db');
	const statements = [
		'PRAGMA foreign_keys = ON;',
		'CREATE TABLE IF NOT EXISTS languages (iso_code VARCHAR(2) PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE);',
		'CREATE TABLE IF NOT EXISTS phrases (id INTEGER PRIMARY KEY AUTOINCREMENT, language_iso_code VARCHAR(2) NOT NULL, key VARCHAR(100) NOT NULL, value TEXT NOT NULL, FOREIGN KEY (language_iso_code) REFERENCES languages(iso_code));',
		'DELETE FROM phrases;',
		'DELETE FROM languages;',
		'INSERT INTO languages (iso_code, name) VALUES ("en", "English");',
		'INSERT INTO languages (iso_code, name) VALUES ("bg", "български");',

		'INSERT INTO phrases (language_iso_code, key, value) VALUES ("en", "title", "My Title");',
		'INSERT INTO phrases (language_iso_code, key, value) VALUES ("bg", "title", "Моето Заглавие");',
	];

	db.serialize(); // ensure statements are executed in sequence

	statements.forEach((statement) => {
		db.run(statement, (err) => {
			if (err) {
				console.error(err);
			}
		});
	});


	db.close();
	res.json('')
})

app.get("/api", (req, res) => {
	const db = new sqlite3.Database('plovdivsoft.db');
	const language = req.query.language;


	var phrases;
	db.all(`SELECT key, value FROM phrases WHERE language_iso_code = ?`, language, (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: "Failed to retrieve phrases" });
		} else {
			phrases = rows;
			res.json(phrases);
		}
	});

	db.close();
})

app.listen(5000, () => { console.log("Server started on port 5000") })
