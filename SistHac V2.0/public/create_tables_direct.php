<?php
$host = '127.0.0.1';
$db   = 'sistemahacienda';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     
     // Primero verificamos que la tabla de usuarios exista para las FK
     $query = $pdo->query("SHOW TABLES LIKE 'users'");
     if (!$query->fetch()) {
         die("Error: La tabla 'users' no existe. Deteniendo procesos.");
     }

     $sql1 = "CREATE TABLE IF NOT EXISTS soporte_tecnico (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            tipo_solicitud ENUM('MANT', 'HARD', 'CONS', 'SOFT', 'RED', 'OTRO') NOT NULL,
            tipo_personalizado VARCHAR(150),
            titulo VARCHAR(150) NOT NULL,
            descripcion TEXT NOT NULL,
            estado ENUM('pendiente', 'resuelto') DEFAULT 'pendiente',
            area_solicitante VARCHAR(150),
            empresa_id INT,
            foto_path VARCHAR(255),
            visto_por_sistemas BOOLEAN DEFAULT FALSE,
            visto_por_solicitante BOOLEAN DEFAULT FALSE,
            created_by BIGINT UNSIGNED,
            updated_by BIGINT UNSIGNED,
            fecha_resuelto DATETIME,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

     $sql2 = "CREATE TABLE IF NOT EXISTS soporte_comentarios (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            solicitud_id BIGINT UNSIGNED NOT NULL,
            user_id BIGINT UNSIGNED NOT NULL,
            mensaje TEXT NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL,
            CONSTRAINT fk_solicitud FOREIGN KEY (solicitud_id) REFERENCES soporte_tecnico(id) ON DELETE RESTRICT,
            CONSTRAINT fk_user_comentario FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

     $pdo->exec($sql1);
     echo "Tabla soporte_tecnico creada satisfactoriamente o ya existe.\n";
     $pdo->exec($sql2);
     echo "Tabla soporte_comentarios creada satisfactoriamente o ya existe.\n";
     
} catch (\PDOException $e) {
     echo "Error en la base de datos: " . $e->getMessage();
}
?>
