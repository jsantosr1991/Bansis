<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$columns = DB::connection('sql_prueba')->select("
    SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'rh_mtrab' AND COLUMN_NAME IN ('sexo', 'discapacitado', 'porc_disc', 'vivecon')
");
print_r($columns);
