import connection from "../db/connection.js";
import { validPriorities, validStatuses } from "../constants/taskConstants.js";

function index(req, res, next) {
  const sqlUser =
    "select users.id, users.name, users.surname, users.email from users where users.id = ?";

  let sqlTasks = `select tasks.id as "tasks_id", tasks.title, tasks.description, tasks.status,  tasks.priority, tasks.scheduled_at, categories.name as "categories_name",  categories.color  from tasks left join categories on categories.id = tasks.category_id WHERE tasks.user_id = ?`;
  const { status, priority, category, sort } = req.query;
  const params = [req.id];

  if (status) {
    sqlTasks += ` AND tasks.status = ?`;
    params.push(status.toLowerCase());
  }

  if (priority) {
    sqlTasks += " AND tasks.priority = ?";
    params.push(priority.toLowerCase());
  }

  if (category) {
    sqlTasks += " AND categories.name = ?";
    params.push(category.toLowerCase());
  }
  let direction = "ASC";
  if (sort === "furthest") {
    direction = "DESC";
  }
  sqlTasks += ` ORDER BY tasks.scheduled_at IS NULL ASC, tasks.scheduled_at ${direction}`;

  connection.query(sqlUser, [req.id], (error, result) => {
    if (error) return next(error);
    if (result.length === 0) {
      return res.status(404).json({
        message: "Utente non trovato nel sistema",
        error: "NOT_FOUND",
      });
    }
    const user = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
    };
    connection.query(sqlTasks, params, (error, result) => {
      if (error) return next(error);
      let tasksUser = [];
      if (result.length !== 0) {
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);
        tasksUser = result.map((t) => {
          let isOverdue = false;
          const taskDate = t.scheduled_at ? new Date(t.scheduled_at) : null;
          if (taskDate < oggi && t.status !== "done" && taskDate !== null) {
            isOverdue = true;
          }

          return {
            task_id: t.tasks_id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            scheduled_at: t.scheduled_at,
            isOverdue,
            categories: t.categories_name,
            categories_color: t.color,
          };
        });
      }
      res.json({
        user,
        totalTasks: tasksUser.length,
        tasksUser,
      });
    });
  });
}

function store(req, res, next) {
  const { title, description, status, priority, scheduled_at, category_id } =
    req.body;
  const idUtente = req.id;
  const columns = ["user_id"];
  const params = [idUtente];

  if (req.body === undefined || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Non sono stati ricevuti dati per la creazione del task",
      error: "MISSING_DATA",
    });
  }
  if (!title) {
    return res.status(400).json({
      message: "Il titolo è un campo obbligatorio",
      error: "REQUIRED_FIELD",
    });
  }

  columns.push("title");
  params.push(title.trim());

  if (description) {
    columns.push("description");
    params.push(description.trim());
  }

  if (priority) {
    const chekedPriority = validPriorities.find(
      (p) => p.value === priority.toLowerCase(),
    );

    if (!chekedPriority) {
      return res.status(400).json({
        message: "Il livello di priorità inserito non è valido",
        error: "INVALID_PRIORITY",
      });
    }
    columns.push("priority");
    params.push(priority.trim());
  }

  if (status) {
    const chekedStatus = validStatuses.find(
      (s) => s.value === status.toLowerCase(),
    );
    if (!chekedStatus) {
      return res.status(400).json({
        message: "Lo stato selezionato non è valido",
        error: "INVALID_STATUS",
      });
    }
    columns.push("status");
    params.push(status.trim().toLowerCase());
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
    columns.push("scheduled_at");
    params.push(scheduled_at);
  }

  function insertTask() {
    const placeholders = params.map(() => "?").join(", ");
    const sqlInsertTask = `INSERT INTO tasks (${columns.join(", ")}) VALUES (${placeholders})`;
    connection.query(sqlInsertTask, params, (error, result) => {
      if (error) return next(error);
      res.status(201).json({
        status: "success",
        message: "Nuovo task creato con successo",
        taskId: result.insertId,
      });
    });
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
      columns.push("category_id");
      params.push(category_id);
      insertTask();
    });
  } else {
    insertTask();
  }
}

function modify(req, res, next) {
  const idUser = req.id;
  const idTask = req.params.id;
  const updates = [];
  const params = [];
  const { title, description, status, priority, scheduled_at, category_id } =
    req.body;

  if (req.body === undefined || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Dati mancanti per l'aggiornamento del task",
      error: "MISSING_DATA",
    });
  }

  if (title) {
    updates.push("title = ?");
    params.push(title.trim());
  }

  if (description) {
    updates.push("description = ?");
    params.push(description.trim());
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
    updates.push("status = ?");
    params.push(status.trim().toLowerCase());
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
    updates.push("priority = ?");
    params.push(priority.trim().toLowerCase());
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (scheduled_at) {
    if (!dateRegex.test(scheduled_at)) {
      return res.status(400).json({
        message: "Formato data non valido. Usa YYYY-MM-DD HH:mm:ss",
        error: "INVALID_DATE_FORMAT",
      });
    }
    updates.push("scheduled_at = ?");
    params.push(scheduled_at);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      message: "Nessun campo valido fornito per la modifica",
      error: "NO_VALID_FIELDS",
    });
  }

  function updateTask() {
    const formatUpdates = updates.join(", ");
    const sqlUpdate = `UPDATE tasks set ${formatUpdates} WHERE id = ? AND user_id = ?`;
    params.push(idTask);
    params.push(idUser);
    connection.query(sqlUpdate, params, (error, result) => {
      if (error) return next(error);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Impossibile modificare il task: ID non trovato o permessi insufficienti",
          error: "UPDATE_FAILED",
        });
      }
      res.json({
        status: "success",
        message: "Il task è stato aggiornato correttamente",
      });
    });
  }

  if (category_id) {
    const sql = "SELECT * FROM categories where id = ?";
    connection.query(sql, [category_id], (error, result) => {
      if (error) return next(error);
      if (result.length === 0) {
        return res.status(400).json({
          message: "La categoria specificata non è valida",
          error: "INVALID_CATEGORY",
        });
      }
      updates.push("category_id = ?");
      params.push(category_id);
      updateTask();
    });
  } else {
    updateTask();
  }
}

function destroy(req, res, next) {
  const userId = req.id;
  const taskId = req.params.id;

  const sqlDestroy = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  connection.query(sqlDestroy, [taskId, userId], (error, result) => {
    if (error) return next(error);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message:
          "Impossibile eliminare il task: ID non trovato o non autorizzato",
        error: "DELETE_FAILED",
      });
    }

    res.json({
      status: "success",
      message: "Il task è stato rimosso definitivamente",
    });
  });
}

export { index, store, destroy, modify };
