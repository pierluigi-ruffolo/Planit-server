import express from "express";
import routerTask from "./routers/taskRouters.js";
import routerAuth from "./routers/authRouters.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT;
app.use(cookieParser());
app.use(express.json());

app.use("/api/tasks", routerTask);
app.use("/api/auth", routerAuth);

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log("Server avviato sulla porta " + port);
});
