<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$rows = DB::connection('sql_prueba')->select("
    SELECT TOP 5 discapacitado, sexo, observacion, porc_disc 
    FROM rh_mtrab 
    WHERE discapacitado IS NOT NULL AND discapacitado != ''
");
print_r($rows);
