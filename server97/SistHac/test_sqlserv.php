<?php
try {
    $conn = new PDO(
        "sqlsrv:Server=192.168.0.105\\SQLXASS;Database=PRIMOBANANO;Encrypt=no;TrustServerCertificate=yes",
        "sa",
        "Alfa2020"
    );
    echo "Conexión exitosa!";
} catch (PDOException $e) {
    echo "Error en la conexión: " . $e->getMessage();
}

