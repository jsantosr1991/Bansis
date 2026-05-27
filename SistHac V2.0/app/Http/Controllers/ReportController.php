<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use PHPJasper\PHPJasper;

class ReportController extends Controller
{
 

public function empleados()
{

    $data = DB::connection('mysqlrrhh')
        ->select('select * from v_administrativo');

    $json = json_encode($data);

    $jsonFile = storage_path('app/empleados.json');

    file_put_contents($jsonFile, $json);

    $input = base_path('app/Reports/Prueba.jrxml');

    $output = storage_path('app/reports/empleados');

    $options = [
        'format' => ['pdf'],
        'params' => [],
        'db_connection' => [
            'driver' => 'json',
            'data_file' => $jsonFile,
            'json_query' => '.'
        ]
    ];

    $jasper = new PHPJasper;

    $jasper->process(
        $input,
        $output,
        $options
    )->execute();

    return response()->file($output . '.pdf');

}

public function reportematascaidas(Request $request)
{

   $id = $request->input('idcab');
    
   $cabecera = DB::connection('mysql')
    ->selectOne("
       SELECT
	
	matas_caidas_cab.nombrehacienda , 
	matas_caidas_cab.semana, 
	matas_caidas_cab.anio, 
	rh_mtrab.NOMBRE_CORTO , 
    matas_caidas_cab.fecha,
	matas_caidas_cab.id
FROM
	matas_caidas_cab
	INNER JOIN
	matas_caidas_det
	ON 
		matas_caidas_cab.id = matas_caidas_det.cabecera_id
	INNER JOIN
	users
	ON 
		matas_caidas_cab.`user` = users.username
	INNER JOIN
	rh_mtrab
	ON 
		users.codempleado = rh_mtrab.COD_TRABAJ
WHERE
	matas_caidas_cab.id = ?
GROUP BY
matas_caidas_cab.nombrehacienda , 
	matas_caidas_cab.semana, 
	matas_caidas_cab.anio, 
	rh_mtrab.NOMBRE_CORTO ,

	matas_caidas_cab.id
    ", [$id]);


   $data = DB::connection('mysql')->select('CALL Get_Det_Matascaidas (?)', [$id]);

    $json = json_encode($data);

    $jsonFile = storage_path('app/empleados.json');

    file_put_contents($jsonFile, $json);

    $input = base_path('app/Reports/ReporteMatascaidas.jrxml');

    $output = storage_path('app/reports/empleados');

    $options = [
        'format' => ['pdf'],
         'params' => [
            'nombrehacienda' => $cabecera->nombrehacienda ?? '',
            'NOMBRE_CORTO' => $cabecera->NOMBRE_CORTO ?? '',
            'semana' => $cabecera->semana ?? '',
            'anio' => $cabecera->anio ?? '',
           
   
],
   
        'db_connection' => [
            'driver' => 'json',
            'data_file' => $jsonFile,
            'json_query' => '.'
                 ]
    ];

    $jasper = new PHPJasper;

    $jasper->process(
        $input,
        $output,
        $options
    )->execute();

    return response()->file($output . '.pdf');

}



}
