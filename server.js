"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
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
server.listen(PORT, function () { return console.log("Listening on port " + PORT + "..."); });
server.on("error", function (error) { return console.log("Error en servidor", error); });
app.engine("hbs", handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
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
        productos.push(__assign({ id: productos.length + 1 }, data));
        io.sockets.emit("productos", productos);
    });
    var mensajes = leerMensajes();
    socket.emit("mensajes", mensajes);
    socket.on("nuevo", function (data) {
        guardarMensajes(data);
        io.sockets.emit("mensajes", leerMensajes());
    });
});
