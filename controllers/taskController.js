import connection from "../db/connection.js";
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
        Message: "Utente non trovato",
        Error: "Error 400",
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
        lengthTasks: tasksUser.length,
        tasksUser,
      });
    });
  });
}

function store(req, res) {
  console.log(req.id);
  res.send("ciao da store task");
}

function destroy(req, res) {
  console.log(req.id);
  res.send("ciao da destroy task");
}
export { index, store, destroy };
