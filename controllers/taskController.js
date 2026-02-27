import connection from "../db/connection.js";

function index(req, res, next) {
  let sql = `select users.id, users.name, users.surname, users.email, tasks.id as "tasks_id", tasks.title, tasks.description, tasks.status, tasks.priority, tasks.scheduled_at, categories.name as "categories_name", categories.color from users left join tasks on users.id = tasks.user_id left join categories on categories.id = tasks.category_id 	WHERE 1=1  and users.id = ?`;

  connection.query(sql, [10], (error, result) => {
    if (error) return next(error);
    if (result.length === 0) {
      return res.status(400).json({
        Message: "Utente non trovato",
        Error: "Error 400",
      });
    }
    const user = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
    };

    const tasksUser = result.map((t) => {
      return {
        task_id: t.tasks_id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        scheduled_at: t.scheduled_at,
        categories: t.categories_name,
        categories_color: t.color,
      };
    });

    res.json({
      user,
      tasksUser: result[0].tasks_id === null ? [] : tasksUser,
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
