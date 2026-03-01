export default function userValidation(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Non sono stati ricevuti dati per la creazione dell'account",
      error: "MISSING_REGISTRATION_DATA",
    });
  }

  const { name, surname, email, password } = req.body;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      message:
        "Il nome è un campo obbligatorio per completare la registrazione",
      error: "REQUIRED_NAME",
    });
  }

  if (!surname || surname.trim() === "") {
    return res.status(400).json({
      message:
        "Il cognome è un campo obbligatorio per completare la registrazione",
      error: "REQUIRED_SURNAME",
    });
  }

  if (!email || !regex.test(email)) {
    return res.status(400).json({
      message:
        "L'indirizzo email inserito non è valido. Controlla il formato (es. nome@esempio.com)",
      error: "INVALID_EMAIL_FORMAT",
    });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      message:
        "La sicurezza è importante: la password deve contenere almeno 8 caratteri",
      error: "WEAK_PASSWORD",
    });
  }

  const formattedName =
    name.trim()[0].toUpperCase() + name.trim().slice(1).toLowerCase();
  const formattedSurname =
    surname.trim()[0].toUpperCase() + surname.trim().slice(1).toLowerCase();

  req.body.name = formattedName;
  req.body.surname = formattedSurname;

  next();
}
