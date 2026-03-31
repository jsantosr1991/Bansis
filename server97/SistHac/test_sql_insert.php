<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\SolicitudEmpleo;
use App\Http\Controllers\TalentoHumanoController;
use Illuminate\Http\Request;

// 1. Encontrar una solicitud (cualquiera servirá, forzaremos su estado a EN_REVISION temporalmente)
$solicitud = SolicitudEmpleo::first();

if (!$solicitud) {
    echo "No hay solicitudes. Creando una de prueba...\n";
    $solicitud = SolicitudEmpleo::create([
        'codigo_solicitud' => 'SOL-TEST-0001',
        'nombres' => 'Juan Perez',
        'apellido_paterno' => 'Perez',
        'apellido_materno' => 'Gomez',
        'cedula' => '0999999999',
        'estado_solicitud' => 'EN_REVISION'
    ]);
}

$id = $solicitud->id;
$cedula = $solicitud->cedula;
$originales = [
    'estado_solicitud' => $solicitud->estado_solicitud,
    'genero' => $solicitud->genero,
    'tiene_discapacidad' => $solicitud->tiene_discapacidad,
    'discapacidad_detalle' => $solicitud->discapacidad_detalle,
    'referencial_telefono_principal' => $solicitud->referencial_telefono_principal,
    'referencial_telefono_secundario' => $solicitud->referencial_telefono_secundario,
    'referencial_familiares_relacion' => $solicitud->referencial_familiares_relacion,
];

// Forzamos temporalmente a EN_REVISION para pasar la validación y datos de prueba
$solicitud->estado_solicitud = 'EN_REVISION';
$solicitud->genero = 'FEMENINO';
$solicitud->tiene_discapacidad = true;
$solicitud->discapacidad_detalle = 'SORDERA PARCIAL TEST';
$solicitud->referencial_telefono_principal = '0988888888'; // celular
$solicitud->referencial_telefono_secundario = '042222222'; // telefono
$solicitud->referencial_familiares_relacion = 'PADRES Y UN HERMANO TEST';
$solicitud->save();

echo "Probando aprobación para Solicitud ID: {$id}, Cédula: {$cedula}\n";

// Asegurarse de que no exista ya en rh_mtrab local o remoto para la prueba
DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $cedula)->delete();

// 2. Invocar updateEstado del controlador
$controller = new TalentoHumanoController();
$request = Request::create('/api/solicitudes/'.$id.'/estado', 'PATCH', [
    'estado' => 'APROBADO',
    'aprobado_por' => 'TestScript',
    'aprobacion_grupo' => 'SISTEMAS'
]);

$response = $controller->updateEstado($request, $id);
echo "Respuesta del Controlador:\n";
echo $response->getContent() . "\n";

// 3. Verificar en SQL Server directamente
$existe = DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $cedula)->first();

if ($existe) {
    echo "¡ÉXITO! Registro encontrado en SQL Server rh_mtrab.\n";
    print_r((array)$existe);
} else {
    echo "¡FALLO! El registro no se insertó en SQL Server rh_mtrab.\n";
}

// Revertir el estado de la solicitud para no afectar los datos reales y limpiar SQL Server
$solicitud->estado_solicitud = $originales['estado_solicitud'];
$solicitud->genero = $originales['genero'];
$solicitud->tiene_discapacidad = $originales['tiene_discapacidad'];
$solicitud->discapacidad_detalle = $originales['discapacidad_detalle'];
$solicitud->referencial_telefono_principal = $originales['referencial_telefono_principal'];
$solicitud->referencial_telefono_secundario = $originales['referencial_telefono_secundario'];
$solicitud->referencial_familiares_relacion = $originales['referencial_familiares_relacion'];
$solicitud->aprobado_por = null;
$solicitud->aprobacion_grupo = null;
$solicitud->aprobacion_fecha = null;
$solicitud->save();

DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $cedula)->delete();
echo "Limpieza completada. Prueba finalizada.\n";
