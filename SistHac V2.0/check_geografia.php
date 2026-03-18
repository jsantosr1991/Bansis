<?php
$local = new PDO('mysql:host=127.0.0.1;dbname=sistemahacienda', 'root', '');
$prod = new PDO('mysql:host=192.168.191.97;dbname=sistemahacienda', 'sistemas', 'SisHac241025');

try {
    $stmtL = $local->query("SHOW CREATE TABLE cat_geografia");
    $l = $stmtL->fetch(PDO::FETCH_ASSOC)['Create Table'];
    echo "LOCAL STRUCTURE:\n$l\n\n";

    $count = $local->query("SELECT COUNT(*) FROM cat_geografia")->fetchColumn();
    echo "Registros en local: $count\n\n";
} catch (Exception $e) { echo "Error Local: " . $e->getMessage() . "\n"; }

try {
    $stmtP = $prod->query("SHOW CREATE TABLE cat_geografia");
    $p = $stmtP->fetch(PDO::FETCH_ASSOC)['Create Table'];
    echo "PROD STRUCTURE:\n$p\n\n";
} catch (Exception $e) { echo "Error Prod: " . $e->getMessage() . " (La tabla probablemente no existe, lo cual es correcto)\n"; }
