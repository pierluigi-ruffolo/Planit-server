import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABSE,
});

connection.connect((err) => {
  if (err) {
    return console.log("Errore di connessione" + err.message);
  }
  console.log("Connesso al databse MySQL!");
});

export default connection;
