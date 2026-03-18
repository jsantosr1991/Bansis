<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$columns = DB::connection('sql_prueba')->getSchemaBuilder()->getColumnListing('rh_mtrab');
print_r($columns);
