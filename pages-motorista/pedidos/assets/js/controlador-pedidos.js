var idMotorista = null;
var dataMotorista = null;
function getDataMotorista()
{
    idMotorista = localStorage.getItem('id_motorista');
    console.log(idMotorista);

    fetch('../../../../motoristas.json')
    .then(response => response.json())
    .then(data => {

        const longitud = Object.keys(data).length;
        
        for (let i=0; i<longitud; i++)
        {
            if(data[i].id == idMotorista)
            {
                dataMotorista = data[i];
                document.getElementById('motorista-nombre').innerHTML = `${dataMotorista.nombre} ${dataMotorista.apellido}`;
                document.getElementById('correo').innerHTML = `${dataMotorista.correo}`;
                break;
            }
        };

        getDataPedidos();
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });
}
getDataMotorista();

var dataPedidos = null;
function getDataPedidos()
{
    fetch('../../../../pedidos.json')
    .then(response => response.json())
    .then(data => {

        var cadenaJSON = "";

        const longitud = Object.keys(data).length;
        for (let i=0; i<longitud; i++)
        {
            if(dataMotorista.ordenes.includes(data[i].numeroOrden))
            {
                //console.log(data[i]);
                cadenaJSON = cadenaJSON + JSON.stringify(data[i]) + ",";
            }
        };

        cadenaJSON = cadenaJSON.substring(0, cadenaJSON.length-1);
        cadenaJSON = "[" + cadenaJSON + "]";
        //console.log(cadenaJSON);
        dataPedidos = JSON.parse(cadenaJSON);
        console.log(dataPedidos);
        renderizarPedidosDisponibles();
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
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
                        <button type="button" class="btn btn-danger" onclick="detallesPedido(${pedido.numeroOrden})">Detalles</button>
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

    dataPedidos.forEach(pedido => {

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
                        <button type="button" class="btn btn-danger" onclick="facturaPedido(${pedido.numeroOrden})">Factura</button>
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

    dataPedidos.forEach(pedido => {

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
                            <select class="form-control text-center bg-warning" id="">
                                <option value="Tomada">Tomada</option>
                                <option value="En camino">En camino</option>
                                <option value="Procesando">Procesando</option>
                                <option value="Entregado">Entregado</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            `;

            //console.log(pedido);
        }
    });
}