<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

$passwords = ['123456', '123456789'];
$success = false;

foreach ($passwords as $pwd) {
    echo "Probando contraseña: $pwd\n";
    Config::set('database.connections.sql_prueba.password', $pwd);
    
    try {
        DB::connection('sql_prueba')->getPdo();
        echo "¡Conexión exitosa con contraseña: $pwd!\n";
        
        // Si tuvo éxito, ejecutar el script
        $sqlPath = 'C:\\Users\\Auditorio-PC\\Downloads\\rh_mtrab.sql';
        if (file_exists($sqlPath)) {
            echo "Leyendo script SQL...\n";
            $sql = file_get_contents($sqlPath);
            
            // El script tiene GO, PDO no soporta GO. Vamos a separarlo o ejecutarlo por partes.
            // Para SQL Server, a veces es mejor usar sqlsrv_query si está disponible, pero aquí usaremos DB::unprepared
            
            echo "Ejecutando creación de tabla...\n";
            
            // Limpiamos un poco el script para quitar los GO y comentarios si es necesario, 
            // pero DB::unprepared suele manejar bloques si el driver lo permite.
            // Sin embargo, GO es un delimitador de cliente, no de T-SQL.
            
            $queries = explode("GO", $sql);
            foreach ($queries as $query) {
                $query = trim($query);
                if (!empty($query)) {
                    try {
                        DB::connection('sql_prueba')->unprepared($query);
                    } catch (\Exception $e) {
                        echo "Error en query: " . substr($query, 0, 50) . "...\n";
                        echo "Detalle: " . $e->getMessage() . "\n";
                    }
                }
            }
            
            echo "Proceso finalizado.\n";
            $success = true;
            break;
        } else {
            echo "Error: No se encontró el archivo $sqlPath\n";
        }
    } catch (\Exception $e) {
        echo "Fallo de conexión: " . $e->getMessage() . "\n";
    }
}

if ($success) {
    echo "\nRECUERDA ACTUALIZAR EL .env CON LA CONTRASEÑA CORRECTA SI FUE LA SEGUNDA.\n";
}
