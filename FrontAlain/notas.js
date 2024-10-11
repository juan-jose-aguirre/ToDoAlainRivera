//Creamos el arreglo de prueba
let listaNotas = [];

function getTask() {
  // var url = "http://localhost:7200/get-all";
  var url = "http://localhost:7200/api/notes/";


  fetch(url, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return res.json();
    })
    .then((response) => {
      // console.log(response);
      if (response) {
        listaNotas = response;
        console.log("Notas cargadas:", listaNotas);
        mostrarNotas(listaNotas);
      } else {
        console.error("La respuesta no contiene el campo allTask");
      }
    })
    .catch((error) => console.error("Error:", error));
}

(function () {
  getTask();
})();
//Creamos un id global para llevar la cuenta de los elementos en el arreglo de listaNotas
let idGlobal = 4;
//Mostramos primeramente las notas que tenemos en el arreglo con la funcion, dando como parametro el arreglo listaNotas

//a continuacion,obtenemos los elementos que necestitamos desde el html

//botones
let btnGuardar = document.getElementById("btnGuardarNota");
let btnLimpiar = document.getElementById("btnLimpiar");
//inputs de ingreso de datos
let titulo = document.getElementById("titulo");
let descripcion = document.getElementById("descripcion");
//inputs filtros de busqueda
let filtroRealizada = document.getElementById("realizadas");
let buscar = document.getElementById("buscar");

//Creacion de los eventos que se activarán con cada uno de los elementos de html

//cuando le den al boton guardar activa la funcion agregarNota, que nos permite guardar en el arreglo la nueva nota, le enviamos como parametros el titulo, la descripcion y el arreglo de listaNotas
btnGuardar.addEventListener("click", function () {
  agregarNota(titulo, descripcion);
});
//cuando le den al boton limpiar, este vacia los inputs del los campos titulo y descripcion
btnLimpiar.addEventListener("click", limpiarCampos);
//cuando un usuario cambie el estado del switch esta funcion nos envia el arreglo de listaNotas y tambien el evento para validar si esta checkeado o no
// filtroRealizada.addEventListener("change", function (e) {
//   filtraRealizadas(listaNotas, e, buscar.value);
// });
// //cuando un usuario ingrese texto en el input de busqueda, este no envia el arreglo listaNotas y el evento, para capturar su valor
// buscar.addEventListener("input", function (e) {
//   filtraTexto(
//     listaNotas,
//     e.target.value.toLowerCase(),
//     filtroRealizada.checked
//   );
// });

//Aqui comienzan las funciones

//funcion para filtrar por texto ingresado, recibe el arreglo original, texto que ingreso el usuario y el valor del input checkbox, si es true o false
function filtraTexto(arreglo, texto, realizadas) {
  let arregloFiltrado = [];
  //Validamos que el texto no este vacio y que ademas el checkbox este apagado o en false
  if (texto != "" && realizadas == false) {
    limpiarNotas();
    //vamos a filtrar el arreglo original para obtener lo que en titulo o texto contengan el texto que dio el usuario y lo guardamos en el arreglo de ayuda
    arregloFiltrado = arreglo.filter(
      (nota) =>
        nota.titulo.toLowerCase().includes(texto) ||
        nota.texto.toLowerCase().includes(texto)
    );
    mostrarNotas(arregloFiltrado);
    //validamos si el texto no esta vacio y si el checkbox esta activado o en true
  } else if (texto != "" && realizadas == true) {
    //comenzamos buscando en el arreglo original los que en titulo o texto contengan el texto ingresado por el usuario y lo guardamos en el arreglo de ayuda
    arregloFiltrado = arreglo.filter(
      (nota) =>
        nota.titulo.toLowerCase().includes(texto) ||
        nota.texto.toLowerCase().includes(texto)
    );
    //creamos un arreglo2 de ayuda donde guardaremos las notas del arreglo de ayuda 1 que tengan el valor en la propiedad realizadas = true
    let arregloMejorado = [];
    //recorremos el arreglo de ayuda 1
    for (let i = 0; i < arregloFiltrado.length; i++) {
      //validamos las notas de arreglo de ayuda 1 que tengan lo propiedad realizada = true
      if (arregloFiltrado[i].realizada) {
        arregloMejorado.push(arregloFiltrado[i]);
      }
    }
    limpiarNotas();
    //mostramos las notas del arreglo de ayuda 2, donde ya sabemos que solo hay notas que incluyen el texto del usuario y tienen la propiedad realizadas = true
    mostrarNotas(arregloMejorado);
    //Validamos si es texto esta vacio y el checkbox esta encendido o igual a true
  } else if (texto == "" && realizadas == true) {
    //recorremos el arreglo original
    for (let i = 0; i < arreglo.length; i++) {
      //validamos si cada nota tiene la propiedad realizada en true
      if (arreglo[i].realizada) {
        arregloFiltrado.push(arreglo[i]);
      }
    }
    limpiarNotas();
    //pintamos las notas que tengan la propiedad realizada en true
    mostrarNotas(arregloFiltrado);
  } else {
    limpiarNotas();
    //pintamos las notas que tengan texto = vacio y realizadas en false
    mostrarNotas(arreglo);
  }
}

function agregarNota(title, description) {
  // console.log("titulo: ",title.value,"  descripcion: ", description.value);
  // return;
  if (title.value == "" || description.value == "")
    return alert("faltan campos por rellenar");
  let data = {
    title: title.value,
    content: description.value,
    status: false,
  };
  // var url = "http://localhost:7200/create-task";
  var url = "http://localhost:7200/api/notes/";
  

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Encabezado para indicar que el cuerpo es JSON
    },
    body: JSON.stringify(data), // Convierte el objeto a una cadena JSON
  })
    .then((res) => {
      // console.log("Estoooo: ",res);
      // return;
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return res.json();
    })
    .then((response) => {
      if (response) {
        console.log("Respuestica:", response);
        // limpiarNotas();
        limpiarCampos();
        getTask();
      } else {
        console.error("Algo pasó :(");
      }
    })
    .catch((error) => console.error("Error:", error));
}
function mostrarNotas(arreglo) {
  if (arreglo.length > 0) {
    limpiarNotas();

    let i = 0;
    for (let nota of arreglo) {
      if (!nota.status) {
        let lugar = document.getElementById("verNotas");

        lugar.className =
          "d-flex flex-wrap justify-content-center align-items-center";

        let tarjeta = document.createElement("div");
        tarjeta.innerHTML = `
          
          <div class="card m-1 tarjeta" style="width: 13rem;">
            <div class="card-body text-center">
              <h5 class="card-title d-flex justify-content-between bg-secondary-subtle p-1 rounded">
                
                ${nota.title}
              </h5>
              <p class="card-text text-start  ">${nota.content}</p>
             
                </div>
               <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 0.2rem; gap:0.2rem">
  <button onClick="marcarRealizada('${nota._id}')" class="btn btn-success w-50">Finalizada</button>
                <button onClick="borrarNota('${nota._id}')" class="btn btn-danger">Borrar Tarea</button>
                </div>

               
               
          </div>`;
        lugar.appendChild(tarjeta);
        i++;
      } else {
        let lugar = document.getElementById("verNotasCompletas");
        lugar.className =
          "d-flex flex-wrap justify-content-center align-items-center";
        let tarjeta = document.createElement("div");
        tarjeta.innerHTML = `
          <div class="card m-1 tarjeta" style="width: 13rem;">
            <div class="card-body text-center">
              <h5 class="card-title d-flex justify-content-between bg-secondary-subtle p-1 rounded">
                ${nota.title}
              </h5>
              <p class="card-text text-start  ">${nota.content}</p>             
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 0.2rem; gap:0.2rem">
  <button onClick="marcarRealizada('${nota._id}')" class="btn btn-success w-50">Pendiente</button>
                <button onClick="borrarNota('${nota._id}')" class="btn btn-danger">Borrar Tarea</button>
                </div>
               
               
          </div>`;
        lugar.appendChild(tarjeta);
        i++;
      }
    }
  }
}

function borrarNota(id) {
  // var url = `http://localhost:7200/delete-task/${id}`;
  var url = `http://localhost:7200/api/notes/${id}`;

  fetch(url, {
    method: "DELETE", // Método DELETE
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return res.json();
    })
    .then((response) => {
      console.log("Nota eliminada:", response);
      // Aquí puedes actualizar la interfaz de usuario, por ejemplo:
      limpiarNotas();
      getTask(); // Si tienes una función para actualizar la lista de tareas
    })
    .catch((error) => console.error("Error eliminando la nota:", error));
}

function marcarRealizada(id) {
  var url = `http://localhost:7200/api/notes/${id}`;

  fetch(url, {
    method: "PATCH", // Método PATCH para actualizar la tarea
    headers: {
      "Content-Type": "application/json", // Encabezado para enviar datos en formato JSON
    },
    body: JSON.stringify({ status: true }), // Enviar el nuevo estado
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return res.json();
    })
    .then((response) => {
      console.log("Tarea actualizada:", response);
      // Aquí puedes actualizar la interfaz de usuario, por ejemplo:
      limpiarNotas();
      getTask(); // Si tienes una función para actualizar la lista de tareas
    })
    .catch((error) => console.error("Error actualizando la tarea:", error));
}

function limpiarCampos() {
  let txtTitulo = document.getElementById("titulo");
  let txtTexto = document.getElementById("descripcion");
  // filtroRealizada.checked = false;
  txtTitulo.value = "";
  txtTexto.value = "";
}
function limpiarNotas() {
  let lugar = document.getElementById("verNotas");
  lugar.innerHTML = "";
  let lugar2 = document.getElementById("verNotasCompletas");
  lugar2.innerHTML = "";
}
