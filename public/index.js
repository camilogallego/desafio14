const socket = io();

socket.on("productos", (data) => {
  render(data);
});

let render = (data) => {
  if (data.length > 0) {
    let html = `
    <div class="container">
    <legend>Lista de Producto</legend>
    <div class="container scrol" >
        <table class="table" style='color: aliceblue'>
        <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">nombre</th>
          <th scope="col">Precio</th>
          <th scope="col">Foto</th>
        </tr>
      </thead>
      <tbody >
      ${data
        .map(
          (p) => `<tr>
            <th scope="row">${p.id}</th>
            <td>${p.title}</td>
            <td>${p.price}</td>
            <td>${p.thumbnail}</td>
          </tr>`
        )
        .join(" ")}
      </tbody>
    </table>
    </div>`;
    document.getElementById("listProducts").innerHTML = html;
  } else {
    let html = `
    <div>
    <h2>No hay productos cargados</h2>
    </div>`;
    document.getElementById("listProducts").innerHTML = html;
  }
};

function addProduct(form) {
  let newProduct = {
    title: document.getElementById("titleProduct").value,
    price: document.getElementById("pricesProduct").value,
    thumbnail: document.getElementById("thumbnailProduct").value,
  };
  socket.emit("newProduct", newProduct);
  return false;
}

socket.on("mensajes", (data) => {
  renderMessage(data);
});

let renderMessage = (data) => {
   if (data.length > 0) {
    let contenMenssage = `
    <div class="containerMessage">
    ${data
      .map(
        (m) =>
          `
          <div class="message">
          <strong style="color: blue; font-size: 16px">${m.email}<em style="color:#804000; font-size: 10px">[${m.fechaYhora}] : </em></strong>
          <em style="color:green; margin-left: 5px; font-size: 20px" > ${m.mensaje}</em> 
          </div>`
      )
      .join(" ")}
    </div>`;
  
    document.getElementById("mensajes").innerHTML = contenMenssage;
  }else {
    let contenMenssage = `
    <div>
    <h2>No hay Mensajes</h2>
    </div>`;
    document.getElementById("mensajes").innerHTML = contenMenssage;
  }
};

function addMessage() {
  let hoy = new Date();
  let fecha =
    hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
  let hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
  let fechaYhora = fecha + " " + hora;

  let envio = {
    email: document.getElementById("inputEmail").value,
    mensaje: document.getElementById("inputMessage").value,
    fechaYhora,
  };
  socket.emit("nuevo", envio);
  console.log(envio);
  return false;
}
