<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\DatosP;

class ApiDatosPController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //mostrando la tabla de los registros
        return DatosP::orderBy('id','desc')->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    //funcion para guardar los datos 
    public function store(Request $request)
    {
        $datos = new DatosP;

        $datos->nombre   = $request->nombre;
        $datos->posicion = $request->posicion;
        $datos->salario  = $request->salario;
        $datos->save();        
        
        return 'Datos guardados correctamente';
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    //esta funcion se encarga de editar al usuario atraves de su ID
    //el parametro $datosp recibe la lista de los nuevos datos del usuario
    public function update(Request $request, DatosP $datosp)
    {
        //obtenemos el valor de los input y los asignamos al request
        $datosp->nombre   = $request->nombre;
        $datosp->posicion = $request->posicion;
        $datosp->salario  = $request->salario;
        //guardamos los valores en la bd con la funcion save()
        $datosp->save();   

        //mostramos el mensage en el toastr de que los datos se han editado, 
        //este mensaje solo se vera si se ha echo la edicion de manera correcta
        return 'Datos editados correctamente';

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    //funcion para eliminar un registro
    public function destroy(DatosP $datosp)
    {
        $datosp->delete();
        return 'Registro eliminado correctamente!';
    }
}
