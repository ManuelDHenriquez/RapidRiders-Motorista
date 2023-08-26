
var idMotorista = null;
var dataMotorista = null;
function getDataMotorista()
{
    idMotorista = localStorage.getItem('id_motorista');
    console.log(idMotorista);

    $.ajax({
        url: 'http://localhost:3000/motoristas/' + idMotorista + '/motorista',
        type: 'GET',
        success: function(data) {
            console.log(data);
            dataMotorista = data.motorista;
            document.getElementById('motorista-nombre').innerHTML = `${dataMotorista.nombre} ${dataMotorista.apellido}`;
            document.getElementById('correo').innerHTML = `${dataMotorista.correo}`;
            getDataPedidos();
            getDataPedidosMotorista();
        },
        error: function(error) {
          console.error('Error:', error);
        }
    });
}
getDataMotorista();

var dataPedidos = null;
function getDataPedidos()
{
    $.ajax({
        url: 'http://localhost:3000/pedidos',
        type: 'GET',
        success: function(data) {
          console.log(data);
          dataPedidos = data;
          renderizarPedidosDisponibles();
        },
        error: function(error) {
          console.error('Error:', error);
        }
    });
}

var dataPedidosMotorista = null;
function getDataPedidosMotorista()
{
    $.ajax({
        url: 'http://localhost:3000/motoristas/' + idMotorista + '/ordenesMotorista',
        type: 'GET',
        success: function(data) {
          console.log(data);
          dataPedidosMotorista = data.ordenesMotorista;
          console.log(dataPedidosMotorista);
        },
        error: function(error) {
          console.error('Error:', error);
        }
    });
}

function redirectToDetallePedido()
{
    window.location.href = '../pedido-detalle/detalle.html';
}

function renderizarPedidosDisponibles()
{
    document.getElementById('pedidos-disponibles').style.color = '#FDB700';
    document.getElementById('pedidos-estado').style.color = '#FFFFFF';
    document.getElementById('pedidos-historial').style.color = '#FFFFFF';

    document.getElementById('panel-pedidos').innerHTML = 
    `
    <div class="card-header col-md-12">
        <p class="my-2">Nuevos Pedidos</p>
    </div>
    `;

    dataPedidos.forEach(pedido => {

        if(pedido.estado == "Pendiente")
        {
            document.getElementById('panel-pedidos').innerHTML += 
            `
            <div class="card rounded-0 col-md-6 col-sm-12">
                <div class="card-body text-end">
                    <div id="informacion-0" class="text-start informacion">
                        <div class="fila-una mb-3">
                            <h5>Orden #${pedido.numeroOrden}</h5>
                            <p><strong>Nombre del cliente: </strong>${pedido.nombreCliente}</p>
                            <p><strong>Ubicación de entrega: </strong>${pedido.ubicacion}</p>
                            <p><strong>Estado: </strong>${pedido.estado}</p>
                        </div>
                        <p class="fila-dos text-end">Total: L.${pedido.totalPrice}</p>
                    </div>
                    <div>
                        <button type="button" class="btn btn-danger" onclick="detallesPedido('${pedido._id}')">Detalles</button>
                    </div>
                </div>
            </div>
            `;

            //console.log(pedido);
        }
    });
}

function detallesPedido(idPedido)
{
    localStorage.setItem('id_pedido', idPedido);
    localStorage.setItem('tipo_detalle_pedido', "detalle");
    redirectToDetallePedido();
}

function renderizarPedidosHistorial()
{
    document.getElementById('pedidos-disponibles').style.color = '#FFFFFF';
    document.getElementById('pedidos-estado').style.color = '#FFFFFF';
    document.getElementById('pedidos-historial').style.color = '#FDB700';

    document.getElementById('panel-pedidos').innerHTML = 
    `
    <div class="card-header col-md-12">
        <p class="my-2">Historial de Pedidos</p>
    </div>
    `;

    dataPedidosMotorista.forEach(pedido => {

        if(pedido.estado == "Entregado")
        {
            document.getElementById('panel-pedidos').innerHTML += 
            `
            <div class="card rounded-0 col-md-6 col-sm-12">
                <div class="card-body text-end">
                    <div id="informacion-0" class="text-start informacion">
                        <div class="fila-una mb-3">
                            <h5>Orden #${pedido.numeroOrden}</h5>
                            <p><strong>Nombre del cliente: </strong>${pedido.nombreCliente}</p>
                            <p><strong>Ubicación de entrega: </strong>${pedido.ubicacion}</p>
                            <p><strong>Estado: </strong> ${pedido.estado}</p>
                            <p><strong>Fecha de entrega: </strong> ${pedido.fechaEntrega}</p>
                            <p><strong>Hora de entrega: </strong> ${pedido.horaEntrega}</p>
                        </div>
                        <p class="fila-dos text-end">Total: L.${pedido.totalPrice}</p>
                    </div>
                    <div>
                        <button type="button" class="btn btn-danger" onclick="facturaPedido('${pedido._id}')">Factura</button>
                    </div>
                </div>
            </div>
            `;

            //console.log(pedido);
        }
    });
}

function facturaPedido(idPedido)
{
    localStorage.setItem('id_pedido', idPedido);
    localStorage.setItem('tipo_detalle_pedido', "factura");
    redirectToDetallePedido();
}

function renderizarPedidosEstado()
{
    document.getElementById('pedidos-disponibles').style.color = '#FFFFFF';
    document.getElementById('pedidos-estado').style.color = '#FDB700';
    document.getElementById('pedidos-historial').style.color = '#FFFFFF';

    document.getElementById('panel-pedidos').innerHTML = 
    `
    <div class="card-header col-md-12">
        <p class="my-2">Pedidos Tomados</p>
    </div>
    `;

    dataPedidosMotorista.forEach(pedido => {

        if(pedido.estado != "Entregado" && pedido.estado != "Pendiente")
        {
            document.getElementById('panel-pedidos').innerHTML += 
            `
            <div class="card rounded-0 col-md-6 col-sm-12">
                <div class="card-body text-end">
                    <div id="informacion-0" class="text-start informacion">
                        <div class="fila-una mb-3">
                            <h5>Orden #${pedido.numeroOrden}</h5>
                            <p><strong>Nombre del cliente: </strong>${pedido.nombreCliente}</p>
                            <p><strong>Ubicación de entrega: </strong>${pedido.ubicacion}</p>
                            <p><strong>Estado Actual: </strong>${pedido.estado}</p>
                        </div>
                        <div class="text-center">
                            <select id="select-${pedido._id}" class="form-control text-center bg-warning" onchange="cambiarEstado('${pedido._id}')" onfocus="this.selectedIndex = -1;">
                            <option value="seleccionar">Seleccionar</option>
                                <option value="Tomada">Tomada</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En camino">En camino</option>
                                <option value="Procesando">Procesando</option>
                                <option value="Entregado">Entregado</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            `;

            //document.querySelector(`#select-${pedido._id} [value="' + ${pedido.estado} + '"]`).selected =  true;
            //document.getElementById(`select-${pedido._id}`).querySelector(`option[value="${pedido.estado}"]`).selected = true;
            //console.log(pedido);
        }
    });
}

function cambiarEstado(id)
{
    let valorEstado = document.getElementById("select-" + id).value;
    //console.log(estado);

    if(valorEstado != 'seleccionar')
    {
        const newData = {
            estado: valorEstado
        };
    
        $.ajax({
            url: 'http://localhost:3000/pedidos/' + id + '/estado', // URL del endpoint
            type: 'PUT', // Método HTTP
            contentType: 'application/json', // Tipo de contenido
            data: JSON.stringify(newData), // Datos en formato JSON
            success: function(response) {
                console.log('Registro actualizado:', response);
                getDataPedidos();
                getDataPedidosMotorista();
                renderizarPedidosEstado();
            },
            error: function(error) {
            console.error('Error al actualizar:', error);
            }
        });
    }
}