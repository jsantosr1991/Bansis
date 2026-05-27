<?php
/**
 * Script de Diagnóstico de Subida de Archivos
 * Este script NO modifica nada en la base de datos ni elimina archivos existentes.
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔍 Diagnóstico de Almacenamiento y Subida</h2>";

// 1. Verificación de Directorios
$dir = __DIR__ . '/storage/fotos_soporte';
echo "<h3>1. Directorios</h3>";
echo "Ruta objetivo: <code>$dir</code><br>";

if (file_exists($dir)) {
    echo "✅ El directorio existe.<br>";
    if (is_writable($dir)) {
        echo "✅ El directorio tiene permisos de ESCRITURA.<br>";
    } else {
        echo "❌ El directorio NO es escribible. Permisos actuales: " . substr(sprintf('%o', fileperms($dir)), -4) . "<br>";
        echo "💡 Solución: Ejecutar <code>chmod -R 775 " . $dir . "</code> en el servidor.<br>";
    }
} else {
    echo "❌ El directorio NO existe.<br>";
    $parent = dirname($dir);
    if (is_writable($parent)) {
        echo "✅ El directorio padre (" . basename($parent) . ") es escribible. mkdir() debería funcionar.<br>";
    } else {
        echo "❌ El directorio padre (" . basename($parent) . ") NO es escribible. mkdir() fallará.<br>";
    }
}

// 2. Configuración de PHP
echo "<h3>2. Configuración de PHP (php.ini)</h3>";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "<br>";
echo "post_max_size: " . ini_get('post_max_size') . "<br>";
echo "memory_limit: " . ini_get('memory_limit') . "<br>";

$max_upload = min(parse_size(ini_get('upload_max_filesize')), parse_size(ini_get('post_max_size')));
echo "<b>Máximo permitido por archivo: " . format_bytes($max_upload) . "</b><br>";

if ($max_upload < 2 * 1024 * 1024) {
    echo "⚠️ El límite es bajo (2MB). Fotos de celulares fallarán frecuentemente.<br>";
}

// 3. Prueba de Escritura Real
echo "<h3>3. Prueba de Escritura</h3>";
$testFile = $dir . '/test_debug.txt';
if (@file_put_contents($testFile, "Prueba de Antigravity " . date('Y-m-d H:i:s'))) {
    echo "✅ ¡ÉXITO! Se pudo escribir un archivo de prueba.<br>";
    unlink($testFile); // Limpiamos la prueba
} else {
    echo "❌ FALLÓ la escritura del archivo de prueba.<br>";
}

// 4. Información del Propietario
if (function_exists('posix_getpwuid')) {
    $processUser = posix_getpwuid(posix_geteuid());
    echo "<h3>4. Usuario del Proceso</h3>";
    echo "PHP se ejecuta como el usuario: <b>" . $processUser['name'] . "</b><br>";
}

function parse_size($size)
{
    $unit = preg_replace('/[^bkmgt]/i', '', $size);
    $size = preg_replace('/[^0-9\.]/', '', $size);
    if ($unit) {
        return round($size * pow(1024, stripos('bkmgt', $unit[0])));
    }
    return round($size);
}

function format_bytes($bytes, $precision = 2)
{
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}
?>