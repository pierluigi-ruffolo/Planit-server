import connection from "../db/connection.js";

function index(req, res) {
  res.send("ciao da index task");
}

function store(req, res) {
  res.send("ciao da store task");
}

function destroy(req, res) {
  res.send("ciao da destroy task");
}
export { index, store, destroy };
