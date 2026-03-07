import connection from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function register(req, res, next) {
  const { name, surname, email, password } = req.body;
  const saltRounds = 10;
  const formatMail = email.toLowerCase();
  const checkedMail = "select * from users where users.email = ?";
  connection.query(checkedMail, [formatMail], (error, resalt) => {
    if (error) return next(error);
    if (resalt.length !== 0) {
      return res.status(400).json({
        message:
          "Questa email è già associata a un account. Prova a effettuare il login.",
        error: "EMAIL_ALREADY_EXISTS",
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
      message: "Dati di accesso non ricevuti",
      error: "MISSING_DATA",
    });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email e Password sono campi obbligatori",
      error: "REQUIRED_FIELDS",
    });
  }

  const checkmail = "select * from users where email = ?";
  connection.query(checkmail, [email], (error, result) => {
    if (error) return next(error);
    if (result.length === 0) {
      return res.status(400).json({
        message: "Credenziali non valide. Riprova.",
        error: "INVALID_CREDENTIALS",
      });
    }
    const resultUser = result[0];
    const keyPassword = resultUser.password;
    bcrypt.compare(password, keyPassword, function (err, result) {
      if (err) return next(err);
      if (!result) {
        return res.status(400).json({
          message: "Credenziali non valide. Riprova.",
          error: "INVALID_CREDENTIALS",
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
        .json({
          status: "success",
          message: "Login effettuato con successo",
          user: {
            id: resultUser.id,
            name: resultUser.name,
            surname: resultUser.surname,
            email: resultUser.email,
          },
        });
    });
  });
}

function logout(req, res) {
  res.clearCookie("access_token").status(200).json({
    status: "success",
    message: "Logout effettuato con successo",
  });
}

export { register, login, logout };
