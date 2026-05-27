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
     
     $sql = "CREATE TABLE IF NOT EXISTS `soporte_materiales_consumo` (
          `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          `solicitud_id` BIGINT UNSIGNED NOT NULL,
          `material_id` INT NOT NULL,
          `cantidad` INT NOT NULL,
          `stock_previo` INT NOT NULL,
          `user_id` BIGINT UNSIGNED NOT NULL,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_solicitud_consumo FOREIGN KEY (`solicitud_id`) REFERENCES `soporte_tecnico`(`id`) ON DELETE CASCADE,
          CONSTRAINT fk_user_consumo FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

     $pdo->exec($sql);
     echo "Tabla 'soporte_materiales_consumo' creada satisfactoriamente o ya existe.\n";
     
} catch (\PDOException $e) {
     echo "Error en la base de datos: " . $e->getMessage();
}
?>
