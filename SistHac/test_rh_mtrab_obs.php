<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\TalentoHumanoController;
use Illuminate\Http\Request;
use App\Models\SolicitudEmpleo;
use Illuminate\Support\Facades\DB;

// 1. Encontrar una solicitud con Cédula para probar
$solicitud = SolicitudEmpleo::whereNotNull('cedula')
    ->where('tiene_discapacidad', 1) // Usamos una que tenga discapacidad para ver que NO guarde el detalle en observación
    ->latest()
    ->first();

if (!$solicitud) {
    // Si no hay con discapacidad, creamos una temporal para el test
    $solicitud = SolicitudEmpleo::whereNotNull('cedula')->latest()->first();
    if (!$solicitud) die("No hay solicitudes con cédula para probar.\n");
    $solicitud->tiene_discapacidad = 1;
    $solicitud->discapacidad_detalle = 'DISCAPACIDAD DE PRUEBA';
    $solicitud->estado_solicitud = 'EN_REVISION';
    $solicitud->save();
} else {
    $solicitud->estado_solicitud = 'EN_REVISION';
    $solicitud->save();
}

echo "Probando aprobación con observación vacía para Solicitud ID: " . $solicitud->id . "\n";

// Asegurarse de que NO existe en rh_mtrab antes de empezar
DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $solicitud->cedula)->delete();

// 2. Simular aprobación
$data = [
    'estado' => 'APROBADO',
    'aprobado_por' => 'TEST_BOT_OBS',
    'aprobacion_grupo' => 'CALIDAD'
];

$request = Request::create('/api/talento-humano/solicitudes/' . $solicitud->id . '/estado', 'PUT', $data);
$controller = new TalentoHumanoController();

try {
    $response = $controller->updateEstado($request, $solicitud->id);
    echo "Respuesta del controlador: " . $response->getContent() . "\n";

    // 3. Verificar en SQL Server
    $registro = DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $solicitud->cedula)->first();

    if ($registro) {
        $obsActual = trim($registro->observacion);
        if ($obsActual === '') {
            echo "✅ VERIFICACIÓN EXITOSA: El campo observacion está vacío (después de trim).\n";
        } else {
            echo "❌ VERIFICACIÓN FALLIDA: El campo observacion contiene: '" . $obsActual . "'\n";
        }
    } else {
        echo "❌ VERIFICACIÓN FALLIDA: El registro no se insertó.\n";
    }
} catch (\Exception $e) {
    echo "❌ Error durante la ejecución: " . $e->getMessage() . "\n";
}
