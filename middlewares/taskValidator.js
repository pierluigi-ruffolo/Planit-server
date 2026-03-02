import { validPriorities, validStatuses } from "../constants/taskConstants.js";
import connection from "../db/connection.js";

export default function taskValidator(req, res, next) {
  const { title, status, priority, scheduled_at, category_id } = req.body;
  if (req.body === undefined || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Dati mancanti per l'aggiornamento del task",
      error: "MISSING_DATA",
    });
  }
  const method = req.method;
  if (method === "POST") {
    if (!title) {
      return res.status(400).json({
        message: "Il titolo è un campo obbligatorio",
        error: "REQUIRED_FIELD",
      });
    }
  }
  if (status) {
    const chekedStatus = validStatuses.find(
      (s) => s.value === status.trim().toLowerCase(),
    );

    if (!chekedStatus) {
      return res.status(400).json({
        message: "Lo stato richiesto non è tra quelli validi",
        error: "INVALID_STATUS",
      });
    }
  }
  if (priority) {
    const chekedPriority = validPriorities.find(
      (p) => p.value === priority.trim().toLowerCase(),
    );
    if (!chekedPriority) {
      return res.status(400).json({
        message: "Il valore di priorità non è valido",
        error: "INVALID_PRIORITY",
      });
    }
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (scheduled_at) {
    if (!dateRegex.test(scheduled_at)) {
      return res.status(400).json({
        message:
          "Formato data non valido. Utilizzare il formato YYYY-MM-DD HH:mm:ss",
        error: "INVALID_DATE_FORMAT",
      });
    }
  }
  if (category_id) {
    const sqlCategory = "Select * from categories WHERE id = ?";
    connection.query(sqlCategory, [category_id], (error, result) => {
      if (error) return next(error);
      if (result.length === 0) {
        return res.status(400).json({
          message: "La categoria selezionata non esiste",
          error: "INVALID_CATEGORY",
        });
      }
      next();
    });
  } else {
    next();
  }
}
