var app = new Vue({
  el: '#app',
  data: {
    //guardaremos los datos recuperados en cada accion que se valla realizando
    datos:[],  
    //esta varianle se encarga de recuperar los mensajes que vamos a mostrar con toastr
    mensaje: ''
  },
  methods:{
    //obteniendo los datos a enviar al controlador ApiDatosController.php
      getDatos(){
        //la url es donde tenemos la consulta de los datos, de esta manera la ruta para el controlador
        //ApiDatosController.php va a ser /api/datosp
          let url = '/api/datosp';
          axios.get(url).then(response=>{
              console.log(response.data);
              this.datos=response.data;
          });
      },

      //funcion para agregar un nuevo empleado
      NuevoDato(){
          console.log('Nuevo Dato');
          //mostrando la pantalla emergente para agregar un nuevo usuario
          Swal.mixin({
              confirmButtonText: 'Next &rarr;',
              showCancelButton: true,
              progressSteps: ['1', '2', '3']
            }).queue([
              {
                  title: 'Nombre completo',
                  text:  'Nombre y apellido',
                  input: 'text',
                  //validando que el campo nombre no este vacio
                  inputValidator: (value) => {
                      if (!value) {
                        toastr.error('Ingresa un nombre','Error');  
                        return ' '
                      }
                    }
              },
              {
                  title: 'Selecciona la posición',
                  text:  'Posición del empleado',
                  input: 'select',
                  inputOptions: {
                    Auditor: 'Programador',
                    Soporte: 'Soporte',
                    Seguridad: 'Seguridad'                      
                  },
                  inputPlaceholder: 'Selecciona una posición',
                  //validando que se seleccione una posicion
                  inputValidator: (value) => {
                      if (!value) {
                        toastr.error('Por favor seleccione una opción','Error');  
                        return ' '
                      }
                    }
              },
              {
                  title: 'Salario del empleado',
                  text:  'Este campo acepta decimales',
                  input: 'number',
                  inputAttributes: {
                      //minimo 4 digitos para guardar
                      min: 4,           
                      //acepta dos decimales             
                      step: 0.01
                    },
                    //validando que el campo no este vacio
                  inputValidator: (value) => {
                      if (!value) {
                        toastr.error('Por favor ingrese una cantidad','Error');  
                        return ' '
                      }
                    }
              },
              //en esta pate colocamos el async para que la variable 
              //mensaje le de tiempo de cargar el mensaje que se envia desde el controlador
            ]).then( async  (result) => {
              //validamos que si hay dtos entonces se realiza la operacion
              if (result.value) {
                //leemos los datos en su posicion mediante un arreglo
                datos= {
                    nombre   : result.value[0],
                    posicion : result.value[1],
                    salario  : result.value[2],
                }   
                //ahora le mandamos los datos al controlador para que realice la opcion correspondiente
               let url = '/api/datosp';
               //enviamos los datos a traves de post
               await axios.post(url, datos).then(response=>{
                  console.log(response.data);
                  //cargamos el mensaje de respuesta
                  //esto lo recibimos del controlador y lo visualizaremos en la pantalla a traves de toastr
                  this.mensaje=response.data;
               });
               //refrescamos la vista
               this.getDatos();      
               //mostramos el mensaje con toastr            
               toastr.success(this.mensaje);
              }
            })
      },
      EliminarDato(dato){
          console.log(dato);
          //mostrando el alert
          const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
              },
              buttonsStyling: true
            })
            swalWithBootstrapButtons.fire({
              title: '¿Estas Seguro?',
              //mostramos el nombre con html, de los contrario no podremos visualizarlo
              html: "Si eliminas el registro de <strong>"+ dato.nombre +"</strong>, <br>¡No podrás revertir esto!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Eliminar!',
              cancelButtonText: 'Cancelar!',
              confirmButtonColor: '#d33',
              cancelButtonColor: '#28a745',
              reverseButtons: true
            }).then( async (result) => {
              if (result.value) {
              let url = '/api/datosp/'+dato.id;
              //mandamos el id al controlador
              await axios.delete(url).then(response=>{
                  console.log(response.data);
                  //obteniendo el mensaje
                  this.mensaje=response.data;
              });
              this.getDatos();                  
              toastr.success(this.mensaje);
              } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
              ){
                  toastr.error('Acción Cancelada!');  
              }
            })
      },
      EditarDato(dato){
          console.log(dato);
          //con la variable formulario visualizamos los datos del usuario a editar
          formulario = 
          '<div id="swal2-content" class="swal2-html-container" style="display: block;">Nombre y apellido</div>'+
          '<input id="nombre" name="nombre" class="swal2-input" placeholder="" type="text" style="display: flex;">'+

          '<div id="swal2-content" class="swal2-html-container" style="display: block;">Posicion de este empleado</div>'+
          '<select id="posicion" name="posicion" class="swal2-select" style="display: flex;"><option value="" disabled="">Selecciona una posicion</option><option value="Auditor">Auditor</option><option value="Soporte">Soporte</option><option value="Seguridad">Seguridad</option></select>'+

          '<div id="swal2-content" class="swal2-html-container" style="display: block;">Salario</div>'+
          '<input id="salario" name="salario" min="4" step="0.01" class="swal2-input" placeholder="" type="number" style="display: flex;">';

            Swal.fire({
              title: 'Editar Registro',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Guardar',
              html: formulario,
              focusConfirm: false,
              preConfirm: async () => {
                //guardando los datos que vamos a enviar al contolador
                  ultimosdatoseditados = {
                      nombre:    document.getElementById('nombre').value,                          
                      posicion:  document.getElementById('posicion').value, 
                      salario:   document.getElementById('salario').value,            
                  };
                  //enviando el id del usuario al controlador
                  let url = '/api/datosp/'+dato.id;
                  //enviando los nuevos datos al controlador
                  await axios.put(url, ultimosdatoseditados).then(response=>{
                      console.log(response.data);
                      this.mensaje=response.data;
                  });
                  this.getDatos();
                return toastr.success(this.mensaje);
              }
            })
            //asignando los datos a los input para visualizar los datos del usuario a editar
            document.getElementById('nombre').value    = dato.nombre;
            document.getElementById('posicion').value  = dato.posicion;
            document.getElementById('salario').value   = dato.salario;
      }
  },
  //esta funcion de vue que se ejecuta cada ves q se termina una funcion
  mounted(){
    //ejecutando la funcion que visualiza los datos en la tabla
       this.getDatos();   
  }
})

//haciendo un pequeño cambio en git