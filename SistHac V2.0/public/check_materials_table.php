<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

try {
    $exists = Schema::hasTable('materials');
    if ($exists) {
        echo "Table 'materials' exists.\n";
        $columns = Schema::getColumnListing('materials');
        print_r($columns);
        
        // Try to get some samples to see if there is 'name', 'descripcion', and something that looks like stock
        $samples = DB::table('materials')->limit(1)->get();
        print_r($samples);
    } else {
        echo "Table 'materials' does not exist in the default connection.\n";
        
        // Check DB_CONNECTION2 or others if possible
        echo "Checking other connections...\n";
        try {
            $exists2 = Schema::connection('mysql2')->hasTable('materials');
            if ($exists2) echo "Table 'materials' exists in mysql2.\n";
        } catch (\Exception $e) {}
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
