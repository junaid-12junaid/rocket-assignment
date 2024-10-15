const mysql = require('mysql2/promise');


const db = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'root', 
  database: 'rocked'
});


async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to the database successfully!');

  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}


testConnection();

module.exports = db;
