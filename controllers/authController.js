import connection from "../db/connection.js";

function register(req, res) {
  res.send("ciao da Register");
}

function login(req, res) {
  res.send("ciao da Login");
}

function logout(req, res) {
  res.send("ciao da logout");
}

export { register, login, logout };
