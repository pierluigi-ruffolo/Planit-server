import connection from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
function register(req, res, next) {
  const { name, surname, email, password } = req.body;
  const saltRounds = 10;
  const formatMail = email.toLowerCase();
  const checkedMail = "select * from users where users.email = ?";
  connection.query(checkedMail, [formatMail], (error, resalt) => {
    if (error) return next(error);
    if (resalt.length !== 0) {
      return res.status(400).json({
        Message:
          "Questa email è già associata a un account. Prova a fare il login.",
        error: "Error 400",
      });
    }

    bcrypt.hash(password, saltRounds, function (error, hash) {
      if (error) return next(error);
      const insertUser =
        "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
      connection.query(
        insertUser,
        [name, surname, formatMail, hash],
        (error, result) => {
          if (error) return next(error);
          res.status(201).json({
            status: "success",
            message: "Registrazione completata con successo!",
            name: name,
            surname: surname,
            userId: result.insertId,
          });
        },
      );
    });
  });
}

function login(req, res, next) {
  const { email, password } = req.body;
  const checkmail = "select * from users where email = ?";
  connection.query(checkmail, [email], (error, result) => {
    if (error) return next(error);
    if (result.length === 0) {
      return res.status(400).json({
        Message: "Email non valida",
        Error: "Error 400",
      });
    }
    const resultUser = result[0];
    const keyPassword = resultUser.password;
    bcrypt.compare(password, keyPassword, function (err, result) {
      if (!result) {
        return res.status(400).json({
          Message: "Password non valida",
          Error: "Error 400",
        });
      }

      const token = jwt.sign({ id: resultUser.id }, process.env.PRIVATE_KEY, {
        expiresIn: "1h",
      });

      console.log(token);
      res
        .cookie("access_token", token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Login effettuato" });
    });
  });
}

function logout(req, res) {
  res.send("ciao da logout");
}

export { register, login, logout };
