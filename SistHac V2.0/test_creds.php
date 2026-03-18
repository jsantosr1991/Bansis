<?php
$host = '192.168.191.94';
$db = 'erp_hac';
$credentials = [
    ['root', ''],
    ['root', 'Alfa2020'],
    ['root', 'SisHac241025'],
    ['sistemas', ''],
    ['sistemas', 'Alfa2020'],
    ['sistemas', 'SisHac241025'],
    ['sa', 'Alfa2020'],
];

foreach ($credentials as $cred) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $cred[0], $cred[1]);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Test query
        $stmt = $pdo->query("SELECT * FROM fuerza_laboral LIMIT 1");
        echo "SUCCESS with user: {$cred[0]}, pass: {$cred[1]}\n";
        break;
    } catch (PDOException $e) {
        // echo "FAILED with user: {$cred[0]} - " . $e->getMessage() . "\n";
    }
}
echo "Done testing credentials.\n";
