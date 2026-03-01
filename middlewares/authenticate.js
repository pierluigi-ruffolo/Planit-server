import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const Token = req.cookies.access_token;

  if (!Token) {
    return res.status(401).json({
      message: "Accesso negato: Token di autenticazione mancante",
      error: "MISSING_TOKEN",
    });
  }

  jwt.verify(Token, process.env.PRIVATE_KEY, function (err, decoded) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "La sessione è scaduta, effettua nuovamente il login",
          error: "TOKEN_EXPIRED",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Token non valido o manomesso",
          error: "INVALID_TOKEN",
        });
      }

      return res.status(401).json({
        message: "Autorizzazione fallita: verifica dell'identità non riuscita",
        error: "AUTH_ERROR",
      });
    }

    req.id = decoded.id;
    next();
  });
}
