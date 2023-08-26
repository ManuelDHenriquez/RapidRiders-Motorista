
let idPedido = null;
let tipoDetalle = null;
var dataPedido = null;
function getDataPedido()
{
    idPedido = localStorage.getItem('id_pedido');

    $.ajax({
        url: 'http://localhost:3000/pedidos/' + idPedido + '/pedido',
        type: 'GET',
        success: function(data) {
            console.log(data);
            dataPedido = data.pedido;
            //console.log(dataPedido);

            tipoDetalle = localStorage.getItem('tipo_detalle_pedido');
            if(tipoDetalle == "detalle")
            {
                renderizarPedidoDetalle();
            }
            else if(tipoDetalle == "factura")
            {
                renderizarPedidoFactura();
            }
        },
        error: function(error) {
        console.error('Error:', error);
        }
    });

}
getDataPedido();

function retrocederPagina()
{
    history.back();
}

function renderizarPedidoDetalle()
{
    document.getElementById('pg-detalle-encabezado').innerHTML = `Detalle de Pedido`;
    document.getElementById('div-ubicacion').style.display = 'block';
    
    renderizar();

    document.getElementById('div-boton-pedido-accion').innerHTML = 
    `
    <button type="button" class="btn btn-warning" onclick="tomarPedido()"><i class="fa-sharp fa-solid fa-motorcycle"></i>
        <h5>Tomar pedido</h5>
    </button>
    `;
}

function tomarPedido()
{
    const idMotorista = localStorage.getItem('id_motorista');
    //const idPedido = localStorage.getItem('id_pedido');
    console.log('Motorista: ' + idMotorista);
    console.log('Pedido: ' + idPedido);

    // Agregar el Pedido al Motorista:
    var requestData = {
        idOrden: idPedido
    };
      
      $.ajax({
        url: 'http://localhost:3000/motoristas/' + idMotorista + '/ordenes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(data) {
          console.log(data);
        },
        error: function(error) {
          console.error('Error:', error);
        }
      });

      // Cambiar Estado del Pedido:
      const newData = {
        estado: "Tomado"
    };

    $.ajax({
        url: 'http://localhost:3000/pedidos/' + idPedido + '/estado', // URL del endpoint
        type: 'PUT', // Método HTTP
        contentType: 'application/json', // Tipo de contenido
        data: JSON.stringify(newData), // Datos en formato JSON
        success: function(response) {
            console.log('Realizado: ', response);
            alert("Pedido Tomado");
            window.location.href = '../pedidos/pedidos.html';
        },
        error: function(error) {
        console.error('Error al tomar el pedido:', error);
        }
    });
}

function renderizarPedidoFactura()
{
    document.getElementById('pg-detalle-encabezado').innerHTML = `Factura de Pedido`;
    document.getElementById('div-ubicacion').style.display = 'none';

    renderizar();

    document.getElementById('div-boton-pedido-accion').innerHTML = 
    `
    <button type="button" class="btn btn-warning" onclick="imprimirFactura()"><i class="fa-sharp fa-solid fa-motorcycle"></i>
        <h5>Imprimir Factura</h5>
    </button>
    `;
}

function imprimirFactura()
{
    alert("Imprimir Factura");
}

function renderizar()
{
    document.getElementById('pg-detalle-encabezado').style.display = 'block';

    document.getElementById('pedido-numero').innerHTML += `${dataPedido.numeroOrden}`;
    document.getElementById('pedido-fecha').innerHTML += `${dataPedido.fechaSolicitud}`;
    document.getElementById('pedido-ubicacion').innerHTML += `${dataPedido.ubicacion}`;
    document.getElementById('cliente-nombre').innerHTML += `${dataPedido.nombreCliente}`;
    document.getElementById('cliente-celular').innerHTML += `${dataPedido.celularCliente}`;
    document.getElementById('cliente-correo').innerHTML += `${dataPedido.correoCliente}`;

    let valorTotal=0;
    let valorSubtotal=0;
    let valorISV=0;
    let valorTotalPrice=0;

    dataPedido.productos.forEach(producto => {
        document.getElementById('tabla-cuerpo').innerHTML += 
        `
        <tr>
            <th>${producto.cantidad}</th>
            <td>${producto.nombreProducto}</td>
            <td>L.${producto.precio}</td>
        </tr>
        `;

        valorTotal = valorTotal + producto.cantidad*producto.precio;
    });

    valorSubtotal = valorTotal + dataPedido.comisionGestion + dataPedido.comisionServicio;
    valorISV = valorSubtotal * 0.15;
    valorTotalPrice = valorSubtotal + valorISV;

    document.getElementById('valor-total').innerHTML += `${valorTotal}`;
    document.getElementById('comision-gestion').innerHTML += `${dataPedido.comisionGestion}`;
    document.getElementById('comision-servicio').innerHTML += `${dataPedido.comisionServicio}`;
    document.getElementById('valor-subtotal').innerHTML += `${valorSubtotal}`;
    document.getElementById('valor-ISV').innerHTML += `${valorISV}`;
    document.getElementById('valor-total-price').innerHTML += `${valorTotalPrice}`;
}
