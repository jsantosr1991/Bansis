<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$dbLabores = DB::connection('mysqlrrhh')
                 ->table('fuerza_laboral')
                 ->whereNotNull('nombre_labor')
                 ->where('nombre_labor', '!=', '')
                 ->select('nombre_labor')
                 ->distinct()
                 ->orderBy('nombre_labor', 'asc')
                 ->pluck('nombre_labor');

foreach ($dbLabores as $l) {
    echo "- $l\n";
}
