export default function userValidation(req, res, next) {
  const { name, surname, email, password } = req.body;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!name || name.trim() === "") {
    return res.status(400).json({
      Message: "Il nome è obbligatorio per creare un account.",
      error: "Error 400",
    });
  }
  if (!surname || surname.trim() === "") {
    return res.status(400).json({
      Message: "Il cognome è obbligatorio per creare un account.",
      error: "Error 400",
    });
  }
  if (!regex.test(email)) {
    return res.status(400).json({
      Message:
        "L'indirizzo email inserito non sembra corretto. Controlla il formato.",
      error: "Error 400",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      Message:
        "La sicurezza è importante: la password deve avere almeno 8 caratteri.",
      error: "Error 400",
    });
  }
  const formattedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  const formattedSurname =
    surname[0].toUpperCase() + surname.slice(1).toLowerCase();

  req.body.name = formattedName;
  req.body.surname = formattedSurname;
  next();
}
