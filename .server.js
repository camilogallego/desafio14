"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var express = require("express");
var handlebars = require("express-handlebars");
var fs = require("fs");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var PORT = 8080;
var router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(express.static("./public"));

server.listen(PORT, function () {
  return console.log("Listening on port " + PORT + "...");
});
server.on("error", function (error) {
  return console.log("Error en servidor", error);
});

app.engine("hbs", handlebars({
  extname: ".hbs",
  defaultLayout: "index.hbs"
}));

app.set("views", "./views");
app.set("view engine", "hbs");

var productos = [];

var messagesFile = "mensajes/mensajes.json";

function leerMensajes() {
  var messages = fs.readFileSync(messagesFile, "utf-8");
  var parsedMessages = JSON.parse(messages);
  console.log("File read correctly.");
  return parsedMessages;
}

function guardarMensajes(msj) {
  var messages = leerMensajes();
  messages.push(msj);
  fs.writeFileSync(messagesFile, JSON.stringify(messages));
  console.log("Message saved.");
}

router.get("/", function (req, res) {
  res.status(201).render("main", { productos: productos, listExists: true });
});

io.on("connection", function (socket) {
  console.log("nuevo cliente coencetado");

  socket.emit("productos", productos);
  socket.on("newProduct", function (data) {
    productos.push(_extends({ id: productos.length + 1 }, data));
    io.sockets.emit("productos", productos);
  });

  var mensajes = leerMensajes();
  socket.emit("mensajes", mensajes);
  socket.on("nuevo", function (data) {
    guardarMensajes(data);
    io.sockets.emit("mensajes", leerMensajes());
  });
});
