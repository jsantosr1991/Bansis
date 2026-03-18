<?php
$local = new PDO('mysql:host=127.0.0.1;dbname=sistemahacienda', 'root', '');
$local->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$prod = new PDO('mysql:host=192.168.191.97;dbname=sistemahacienda', 'sistemas', 'SisHac241025');
$prod->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    // 1. Get Table Structure
    $stmt = $local->query("SHOW CREATE TABLE cat_geografia");
    $createTableSql = $stmt->fetch(PDO::FETCH_ASSOC)['Create Table'];
    
    // 2. Create Table on Prod
    echo "Creating table cat_geografia on prod...\n";
    $prod->exec($createTableSql);
    echo "Table created successfully.\n";

    // 3. Get Data
    $stmt = $local->query("SELECT * FROM cat_geografia");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($rows) . " rows to insert.\n";
    
    if (count($rows) > 0) {
        $columns = array_keys($rows[0]);
        $colsString = "`" . implode("`, `", $columns) . "`";
        
        $placeholders = implode(", ", array_fill(0, count($columns), "?"));
        
        $insertStmt = $prod->prepare("INSERT INTO cat_geografia ($colsString) VALUES ($placeholders)");
        
        $count = 0;
        foreach ($rows as $row) {
            $insertStmt->execute(array_values($row));
            $count++;
        }
        
        echo "Successfully inserted $count rows into production.\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
