<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=sistemahacienda;port=3306', 'root', '');
    $stmt = $pdo->query('DESCRIBE groups');
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    file_put_contents(__DIR__ . '/test_groups_out.txt', print_r($res, true));
    echo "Done";
} catch (Exception $e) {
    file_put_contents(__DIR__ . '/test_groups_out.txt', $e->getMessage());
    echo "Error";
}
