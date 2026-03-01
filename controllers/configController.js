import connection from "../db/connection.js";
import { validPriorities, validStatuses } from "../constants/taskConstants.js";
function configController(req, res, next) {
  const sqlConfig = "SELECT * FROM categories";
  connection.query(sqlConfig, (error, result) => {
    if (error) return next(error);
    res.json({
      categories: result,
      priorities: validPriorities,
      status: validStatuses,
    });
  });
}

export { configController };
