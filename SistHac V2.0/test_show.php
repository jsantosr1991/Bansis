<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $controller = new \App\Http\Controllers\TalentoHumanoController();
    $solicitudId = \App\Models\SolicitudEmpleo::where('estado_solicitud', '!=', 'ELIMINADO')->orderBy('id', 'desc')->value('id');
    
    if (!$solicitudId) {
        echo "No solicitudes found.\n";
        exit;
    }
    
    $response = $controller->show($solicitudId);
    $data = $response->getData(true);
    
    echo "Solicitud ID: {$solicitudId}\n";
    echo "Area: " . $data['datosAdministrativos']['area'] . "\n";
    echo "Labor Raw in DB: " . \App\Models\SolicitudEmpleo::find($solicitudId)->labor . "\n";
    echo "Labor Output to Frontend: " . $data['datosAdministrativos']['labor'] . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
