import express = require("express");
import handlebars = require("express-handlebars");
import fs = require("fs");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = 8080;
const router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(express.static("./public"));

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
server.on("error", (error: any) => console.log("Error en servidor", error));

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

const productos: any[] = [];

let messagesFile = "mensajes/mensajes.json";

function leerMensajes() {
  let messages = fs.readFileSync(messagesFile, "utf-8");
  let parsedMessages = JSON.parse(messages);
  console.log("File read correctly.");
  return parsedMessages;
}

function guardarMensajes(msj:any) {
  let messages = leerMensajes();
  messages.push(msj);
  fs.writeFileSync(messagesFile, JSON.stringify(messages));
  console.log("Message saved.");
}

router.get("/", (req, res) => {
  res.status(201).render("main", { productos, listExists: true });
});

io.on("connection", (socket: { emit: (arg0: string, arg1: any[]) => void; on: (arg0: string, arg1: { (data: any): void; (data: any): void; }) => void; }) => {
  console.log("nuevo cliente coencetado");

  socket.emit("productos", productos);
  socket.on("newProduct", (data: any) => {
    productos.push({ id: productos.length + 1, ...data });
    io.sockets.emit("productos", productos);
  });

  let mensajes = leerMensajes();
  socket.emit("mensajes", mensajes);
  socket.on("nuevo", (data: any) => {
    guardarMensajes(data);
    io.sockets.emit("mensajes", leerMensajes() );
  });

  
});

