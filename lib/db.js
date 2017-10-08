const sqlite3 = require('sqlite3').verbose()
const fsPromiser = require('promisify-fs')
const path = require('path')
const bcrypt = require('bcrypt-nodejs')

const dbSetupFile = path.join(__dirname, 'db_setup.sql')
const dbFile = path.join(__dirname, '..', 'database.sqlite')



const db = new sqlite3.Database(dbFile)

fsPromiser.readFile(dbSetupFile).then(contents => {
  db.serialize(() => {
    db.run(contents)
  })
})

// db.serialize(() => {


//   db.each('SELECT * FROM users', (err, row) => {
//     console.log(row)
//   })
// })


module.exports.createUser = (email, password) => {
  if (email === undefined || password === undefined)
    return null

  const encrypted = bcrypt.hashSync(password)
  
  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)")
  stmt.run(email, encrypted)
  stmt.finalize()

  return Promise((resolve, reject) => {
    db.each("SELECT id FROM users ORDER BY id DESC LIMIT 1", (err, row) => {
      resolve(row.id)
    })
  })
}

module.exports.validateUser = (email, password) => {
  if (email === undefined || password === undefined)
    return false

  const encrypted = bcrypt.hashSync(password)
  
  return Promise((resolve, reject) => {
    var found = false
    db.each("SELECT * FROM users WHERE email=?", email, (err, row) => {
      const result = bcrypt.compareSync(password, row.password)
      resolve(result)
      found = true
    }, (done) => {
      if (!found)
        resolve(false)
    })
  })
}