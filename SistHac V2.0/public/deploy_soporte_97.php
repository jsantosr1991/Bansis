<?php
/**
 * Script de despliegue de tablas para Producción (.97)
 * Creado por Antigravity
 */

// Forzar visualización de errores para el usuario
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = '192.168.191.97';
$db   = 'sistemahacienda';
$user = 'sistemas';
$pass = 'SisHac241025';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

echo "<pre>";
try {
    echo "--- INICIANDO CONEXIÓN A PRODUCCIÓN ($host) ---\n";
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "✅ Conexión establecida satisfactoriamente.\n\n";

    // 1. Tabla soporte_tecnico
    echo "1/3 Creando tabla 'soporte_tecnico'...\n";
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
        updated_at TIMESTAMP NULL DEFAULT NULL,
        CONSTRAINT fk_sop_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
        CONSTRAINT fk_sop_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql1);
    echo "✅ Tabla 'soporte_tecnico' lista.\n\n";

    // 2. Tabla soporte_comentarios
    echo "2/3 Creando tabla 'soporte_comentarios'...\n";
    $sql2 = "CREATE TABLE IF NOT EXISTS soporte_comentarios (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        solicitud_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        mensaje TEXT NOT NULL,
        created_at TIMESTAMP NULL DEFAULT NULL,
        updated_at TIMESTAMP NULL DEFAULT NULL,
        CONSTRAINT fk_com_solicitud FOREIGN KEY (solicitud_id) REFERENCES soporte_tecnico(id) ON DELETE RESTRICT,
        CONSTRAINT fk_com_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql2);
    echo "✅ Tabla 'soporte_comentarios' lista.\n\n";

    // 3. Tabla soporte_materiales_consumo
    echo "3/3 Creando tabla 'soporte_materiales_consumo'...\n";
    $sql3 = "CREATE TABLE IF NOT EXISTS soporte_materiales_consumo (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        solicitud_id BIGINT UNSIGNED NOT NULL,
        material_id INT NOT NULL,
        cantidad INT NOT NULL,
        stock_previo INT NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cons_solicitud FOREIGN KEY (solicitud_id) REFERENCES soporte_tecnico(id) ON DELETE CASCADE,
        CONSTRAINT fk_cons_user FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sql3);
    echo "✅ Tabla 'soporte_materiales_consumo' lista.\n\n";

    echo "--- VERIFICACIÓN FINAL ---\n";
    $stmt = $pdo->query("SHOW TABLES LIKE 'soporte%'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tablas encontradas en producción:\n";
    foreach ($tables as $t) {
        echo "- $t\n";
    }

    echo "\n🚀 DESPLIEGUE FINALIZADO EXITOSAMENTE.\n";
    echo "\n<b>POR SEGURIDAD, ELIMINA ESTE ARCHIVO DESPUÉS DE USARLO.</b>";

} catch (\PDOException $e) {
    echo "❌ ERROR EN LA BASE DE DATOS: " . $e->getMessage() . "\n";
} catch (\Exception $e) {
    echo "❌ ERROR GENERAL: " . $e->getMessage() . "\n";
}
echo "</pre>";
