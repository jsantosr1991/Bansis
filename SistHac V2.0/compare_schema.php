<?php
$local = new PDO('mysql:host=127.0.0.1;dbname=sistemahacienda', 'root', '');
$prod = new PDO('mysql:host=192.168.191.97;dbname=sistemahacienda', 'sistemas', 'SisHac241025');

$tables = [
    'solicitudes_conyuges_anteriores',
    'solicitudes_cursos',
    'solicitudes_experiencias',
    'solicitudes_familiares_empresa',
    'solicitudes_hermanos',
    'solicitudes_hijos',
    'solicitudes_referencias_laborales',
    'solicitudes_referencias_personales'
];

$out = "SCHEMA COMPARISON\n=================\n\n";

foreach ($tables as $t) {
    try {
        $stmtL = $local->query("SHOW CREATE TABLE $t");
        $l = $stmtL->fetch(PDO::FETCH_ASSOC)['Create Table'];
    } catch (Exception $e) { $l = "Error Local: " . $e->getMessage(); }

    try {
        $stmtP = $prod->query("SHOW CREATE TABLE $t");
        $p = $stmtP->fetch(PDO::FETCH_ASSOC)['Create Table'];
    } catch (Exception $e) { $p = "Error Prod: " . $e->getMessage(); }

    $out .= "TABLE: $t\n";
    $out .= "--- LOCAL ---\n$l\n\n";
    $out .= "--- PROD ---\n$p\n\n";
    $out .= "=================\n\n";
}
file_put_contents('C:\wamp64\www\SistHac\schema_diff.txt', $out);
echo "Done.";
