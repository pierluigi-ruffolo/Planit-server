import connection from "../db/connection.js";

function index(req, res) {
  console.log(req.id);
  res.send("ciao da index task");
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
