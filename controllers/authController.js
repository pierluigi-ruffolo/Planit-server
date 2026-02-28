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
  if (req.body === undefined || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      Message: "Dati mancanti",
      Error: "Error 400",
    });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      Message: "Email e Password sono obbligatorie",
      Error: "Error 400",
    });
  }

  const checkmail = "select * from users where email = ?";
  connection.query(checkmail, [email], (error, result) => {
    if (error) return next(error);
    if (result.length === 0) {
      return res.status(400).json({
        Message: "Credenziali non valide",
        Error: "Error 400",
      });
    }
    const resultUser = result[0];
    const keyPassword = resultUser.password;
    bcrypt.compare(password, keyPassword, function (err, result) {
      if (!result) {
        return res.status(400).json({
          Message: "Credenziali non valide",
          Error: "Error 400",
        });
      }

      const token = jwt.sign({ id: resultUser.id }, process.env.PRIVATE_KEY, {
        expiresIn: "1h",
      });

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
  res
    .clearCookie("access_token")
    .status(200)
    .json({ Message: "Logout effettuato con successo" });
}

export { register, login, logout };
