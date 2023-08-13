var dataJSON = null;
function getData()
{
    fetch('../../../motoristas.json')
    .then(response => response.json())
    .then(data => {
        dataJSON = data;
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });
}
getData();

function checkLogin()
{
    let autenticacion = false;
    const userEmail = document.getElementById('user-email').value;
    const userPassword = document.getElementById('user-password').value;

    dataJSON.forEach(motorista => {

        if(motorista.correo == userEmail)
        {
            if(motorista.password == userPassword)
            {
                autenticacion = true;
                console.log("Usuario autenticado");
                localStorage.setItem('id_motorista', motorista.id);
                redirectToPedidosDisponibles();
            }
        }
    });

    if(autenticacion == false)
    {
        alert("Datos de usuario incorrectos");
    }
}

function redirectToPedidosDisponibles()
{
    window.location.href = '../pedidos/pedidos.html';
}