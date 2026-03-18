<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\TalentoHumanoController;
use Illuminate\Http\Request;
use App\Models\SolicitudEmpleo;
use Illuminate\Support\Facades\DB;

// Encontrar una solicitud para probar
$solicitud = SolicitudEmpleo::latest()->first();
if (!$solicitud) {
    die("No hay solicitudes para probar.\n");
}

echo "Probando PERSISTENCIA DE BORRADO con Solicitud ID: " . $solicitud->id . "\n";

// 1. Llenar campo
$dataLleno = [
    'saludPersonal' => [
        'deporte' => 'FUTBOL PRUEBA'
    ],
    'datosPersonales' => [
        'apodo' => 'TEST APODO'
    ]
];
$requestLleno = Request::create('/api/talento-humano/solicitudes/' . $solicitud->id, 'PUT', $dataLleno);
$controller = new TalentoHumanoController();
$controller->update($requestLleno, $solicitud->id);

$sol1 = SolicitudEmpleo::find($solicitud->id);
echo "Valor inicial - Deporte: " . ($sol1->salud_deporte ?: 'VACIO') . ", Apodo: " . ($sol1->apodo ?: 'VACIO') . "\n";

// 2. Borrar campo (enviar string vacío o null)
$dataVacio = [
    'saludPersonal' => [
        'deporte' => '' // Queremos borrar esto
    ],
    'datosPersonales' => [
        'apodo' => null // Queremos borrar esto
    ]
];
$requestVacio = Request::create('/api/talento-humano/solicitudes/' . $solicitud->id, 'PUT', $dataVacio);
$controller->update($requestVacio, $solicitud->id);

$sol2 = SolicitudEmpleo::find($solicitud->id);
echo "Valor final - Deporte: " . ($sol2->salud_deporte ?: 'VACIO') . ", Apodo: " . ($sol2->apodo ?: 'VACIO') . "\n";

if (empty($sol2->salud_deporte) && empty($sol2->apodo)) {
    echo "\n✅ VERIFICACIÓN EXITOSA: Los campos se borraron correctamente.\n";
} else {
    echo "\n❌ VERIFICACIÓN FALLIDA: Los campos NO se borraron.\n";
}
