//Cambiar a página de inicio
var login = document.querySelector("#logIn")
var signin = document.querySelector("#signIn")
// Variables
let cesta = document.querySelector(".cesta")
let listaProductos = document.querySelector(".listado-productos")
let vaciarCesta = document.querySelector("#vaciar-cesta")
let contenedorCesta = document.querySelector("#lista-carrito tbody")
let articulosCarrito = []
let allUsers
//ojo comprobar false o null
let currentUser = null
if(! localStorage.getItem("allUsers")){
    localStorage.setItem("allUsers", JSON.stringify([])) 
}
var html = getHtml();


function getHtml(){
    return document.URL;
}
cargarEventListeners()
function cargarEventListeners() {
    //Página de inicio sesión
    if (! html === "sesion.html"){
    //Funciones relacionadas con la cesta en página de inicio/Menú/Cocktails
    listaProductos.addEventListener("click", agregarProducto)
    cesta.addEventListener("click", eliminarProducto)
    vaciarCesta.addEventListener("click",()=>{
        articulosCarrito = []
        limpiarHTML()
    })
    }else{
        signin.addEventListener("click",userSignIn)
        login.addEventListener("click",userLogin)
    }
}

// Funciones
function userSignIn(e) {
    e.preventDefault()
    allUsers = getUserNameFromLocalStorage()
    if(allUsers){
        allUsers = JSON.parse(allUsers)
        var userName = {
            nombre:document.querySelector("#firstName").value,
            apellido:document.querySelector("#secondName").value,
            email:document.querySelector("#email").value,
            password:document.querySelector("#password").value,
            productos:articulosCarrito
        }
        let existe = allUsers.some(element => element.email === userName.email)
        if (existe){
            alert("Ya existe una cuenta asociada a este email. Inicio sesión por favor o restablezca contraseña.")
        }else{
            allUsers = [...allUsers, userName]
            setAllUsersInLocalStorage(allUsers)
            alert("Usuario registrado con éxito.")
            userLogin(e)
        }

        
    }

}

function userLogin(e){
    e.preventDefault()
    allUsers = getUserNameFromLocalStorage()
    if(allUsers) {
        allUsers = JSON.parse(allUsers)
        let existe = allUsers.some(element =>element.email === document.querySelector("#email").value)
        if(existe){
            const currentUser = allUsers.forEach(element => {
                if(element.email === document.querySelector("#email").value){
                    return element
                }
            })
        }else{
            alert("Usuario aún no registrado. Por favor seleccione la pestaña de registro.")
        }
        
    }
}

function getUserNameFromLocalStorage(){
    return localStorage.getItem("allUsers")
}
function setAllUsersInLocalStorage(users) {
    localStorage.setItem("allUsers",  JSON.stringify(users))
}

function agregarProducto(e) {
    e.preventDefault()
    if (e.target.classList.contains("agregar-carrito")){
        const productoSeleccionado = e.target.parentElement.parentElement
        obtenerDatosProducto(productoSeleccionado)
    }

}

function obtenerDatosProducto(producto) {
    
    const infoProducto = {
        id: producto.querySelector("a").getAttribute("data-id"),
        imagen: producto.querySelector("img").src,
        titulo: producto.querySelector("h3").textContent,
        precio: producto.querySelector(".precio").textContent,
        cantidad: 1
    }
    //Devuelve boolean dependiendo la condicion de la function arrow
    let existe = articulosCarrito.some(element => element.id === infoProducto.id)
    if (existe) {
    //Devuelve un array comparando el id de los objetos que están en articuloCarrito
        const productosActualizados = articulosCarrito.map(element => {
            if (element.id === infoProducto.id){
                element.cantidad++
                return element
            }else {
                return element
            }
        })
        articulosCarrito = [ ...productosActualizados]
    }else {
        articulosCarrito = [...articulosCarrito, infoProducto]
    }
    cestaHTML()
}

function cestaHTML(){
    limpiarHTML()

    articulosCarrito.forEach(element=>{
        const {imagen, titulo, precio, cantidad, id } = element
        const row = document.createElement("tr")
        row.innerHTML = `
        <td><img src="${imagen}" alt="Imagen" width="200px"/>  </td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td><a href="#" class="borrar-producto" data-id="${id}">X</a></td>
        `
        contenedorCesta.appendChild(row)
    })
    sincronizarStorage()
}

function sincronizarStorage() {
    if (currentUser) {
        currentUser.productos = articulosCarrito
        allUsers = [...allUsers, currentUser]
        setAllUsersInLocalStorage(allUsers)
    }else {
        localStorage.setItem("unknownCarrito", articulosCarrito)
    }
   
}

function limpiarHTML(){
    while(contenedorCesta.firstChild){
        contenedorCesta.removeChild(contenedorCesta.firstChild)
    }
}

function eliminarProducto(e) {

    if(e.target.classList.contains("borrar-producto")){
        const productoId = e.target.getAttribute("data-id")
        //elimina el producto por el data-id 
        articulosCarrito = articulosCarrito.filter(element=>element.id !== productoId)
        cestaHTML()
    }

}

