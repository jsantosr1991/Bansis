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

echo "Probando con Solicitud ID: " . $solicitud->id . "\n";

$data = [
    'saludPersonal' => [
        'operaciones' => [
            'aplica' => true,
            'detalle' => 'PRUEBA OPERACION UPDATE'
        ],
        'fracturas' => [
            'aplica' => false,
            'detalle' => ''
        ],
        'quemaduras' => [
            'aplica' => true,
            'detalle' => 'PRUEBA QUEMADURA UPDATE'
        ],
        'accidentes_laborales' => [
            'aplica' => false,
            'detalle' => ''
        ],
        'otros_antecedentes' => 'PRUEBA OTROS UPDATE',
        'deporte' => 'FUTBOL PRUEBA',
        'actividad_social' => 'VOLUNTARIADO PRUEBA'
    ]
];

$request = Request::create('/api/talento-humano/solicitudes/' . $solicitud->id, 'PUT', $data);

$controller = new TalentoHumanoController();
$response = $controller->update($request, $solicitud->id);

echo "Respuesta del controlador: " . $response->getContent() . "\n";

// Verificar en BD
$solicitudActualizada = SolicitudEmpleo::find($solicitud->id);

echo "--- Resultados en BD ---\n";
echo "Operaciones: " . ($solicitudActualizada->salud_operaciones ? 'SI' : 'NO') . " (" . $solicitudActualizada->salud_operaciones_detalle . ")\n";
echo "Quemaduras: " . ($solicitudActualizada->salud_quemaduras ? 'SI' : 'NO') . " (" . $solicitudActualizada->salud_quemaduras_detalle . ")\n";
echo "Deporte: " . $solicitudActualizada->salud_deporte . "\n";

if ($solicitudActualizada->salud_operaciones_detalle === 'PRUEBA OPERACION UPDATE') {
    echo "\n✅ VERIFICACIÓN EXITOSA: Los cambios se guardaron correctamente.\n";
} else {
    echo "\n❌ VERIFICACIÓN FALLIDA: Los cambios NO se guardaron.\n";
}
