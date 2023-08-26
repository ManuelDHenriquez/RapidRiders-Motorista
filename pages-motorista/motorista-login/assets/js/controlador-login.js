var dataJSON = null;
function getData()
{  
    
    $.ajax({
        url: 'http://localhost:3000/motoristas',
        type: 'GET',
        success: function(data) {
          console.log(data);
          dataJSON = data;
        },
        error: function(error) {
          console.error('Error:', error);
        }
    });
    
}
getData();

function checkLogin()
{
    let autenticacion = false;
    const userEmail = document.getElementById('user-email').value;
    const userPassword = document.getElementById('user-password').value;

    /*
    var requestData = 
    {
        correo: userEmail,
        password: userPassword
    };
    console.log(requestData);

    $.ajax({
        url: 'http://localhost:3000/motoristas/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(data) {
            console.log(data);
            autenticacion = true;
            console.log("Usuario autenticado");
            localStorage.setItem('id_motorista', data.id);
            redirectToPedidosDisponibles();
        },
        error: function(error) {
          console.error('Error:', error);
        }
    });
    */

    dataJSON.forEach(motorista => {

        if(motorista.correo == userEmail)
        {
            if(motorista.password == userPassword)
            {
                autenticacion = true;
                console.log("Usuario autenticado");
                localStorage.setItem('id_motorista', motorista._id);
                redirectToPedidosDisponibles();
            }
        }
    });

    if(autenticacion == false)
    {
        alert("Datos de usuario incorrectos");
    }
    else
    {
        
    }
}

function redirectToPedidosDisponibles()
{
    window.location.href = '../pedidos/pedidos.html';
}