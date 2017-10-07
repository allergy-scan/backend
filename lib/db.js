const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

db.serialize(() => {
	db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(255), password VARCHAR(255))')

	db.run("INSERT INTO users VALUES (1, 'email', 'password')")

	db.each('SELECT * FROM users', (err, row) => {
		console.log(row)
	})
})