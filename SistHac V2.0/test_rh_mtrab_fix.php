<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\TalentoHumanoController;
use Illuminate\Http\Request;
use App\Models\SolicitudEmpleo;
use Illuminate\Support\Facades\DB;

// 1. Encontrar una solicitud que tenga Cédula y NO tenga deporte
$solicitud = SolicitudEmpleo::whereNotNull('cedula')
    ->where(function($q) {
        $q->whereNull('salud_deporte')->orWhere('salud_deporte', '');
    })
    ->latest()
    ->first();

if (!$solicitud) {
    die("No se encontró ninguna solicitud con cédula para probar.\n");
}

echo "Probando aprobación sin deporte para Solicitud ID: " . $solicitud->id . " (Cédula: " . $solicitud->cedula . ")\n";
echo "Estado actual: " . $solicitud->estado_solicitud . "\n";

// Asegurar que está en EN_REVISION para poder pasar a APROBADO
if ($solicitud->estado_solicitud !== 'EN_REVISION') {
    echo "Forzando estado EN_REVISION para permitir aprobación...\n";
    $solicitud->estado_solicitud = 'EN_REVISION';
    $solicitud->save();
}

// Asegurarse de que NO existe en rh_mtrab antes de empezar para validar la inserción
DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $solicitud->cedula)->delete();

// 2. Simular aprobación
$data = [
    'estado' => 'APROBADO',
    'aprobado_por' => 'TEST_BOT_FIX',
    'aprobacion_grupo' => 'CALIDAD'
];

$request = Request::create('/api/talento-humano/solicitudes/' . $solicitud->id . '/estado', 'PUT', $data);
$controller = new TalentoHumanoController();

try {
    $response = $controller->updateEstado($request, $solicitud->id);
    echo "Respuesta del controlador: " . $response->getContent() . "\n";

    // 3. Verificar en SQL Server
    $existeDespues = DB::connection('sql_prueba')->table('rh_mtrab')->where('NUM_CEDULA', $solicitud->cedula)->exists();

    if ($existeDespues) {
        echo "✅ VERIFICACIÓN EXITOSA: El registro se insertó en rh_mtrab (SQL Server) correctamente.\n";
    } else {
        echo "❌ VERIFICACIÓN FALLIDA: El registro NO se insertó.\n";
    }
} catch (\Exception $e) {
    echo "❌ Error durante la ejecución: " . $e->getMessage() . "\n";
}
