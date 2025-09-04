<?php
// Load CSV
$csvFile = __DIR__ . '/libraries.csv';
$handle = fopen($csvFile, 'r');
if (!$handle) {
    die("Cannot open $csvFile\n");
}

$header = fgetcsv($handle, 0, ',', '"', "\\");
while (($row = fgetcsv($handle, 0, ',', '"', "\\")) !== false) {
    $data = [];
    foreach ($header as $i => $field) {
        $value = isset($row[$i]) ? $row[$i] : '';
        if ($field === 'active') {
            $data[$field] = $value == '1';
        } else {
            $data[$field] = ($value === '') ? null : $value;
        }
    }
    $type = $data['type'];
    $name = $data['name'];
    if (!$type || !$name) continue;
    $jsonPath = sprintf("%s/%s/%s.json", __DIR__, $type, $name);
    if (!is_dir(dirname($jsonPath))) {
        mkdir(dirname($jsonPath), 0777, true);
    }

    file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
    $filename = substr($jsonPath, strlen(__DIR__) + 1);
    echo "Wrote $filename\n";
}
fclose($handle);
echo "Done exporting CSV to JSON files.\n";

// Delete the source CSV file
if (file_exists($csvFile)) {
    unlink($csvFile);
}
