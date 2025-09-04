<?php

// First make an array of all json files in current directory and subdirectories.
$directory = __DIR__;
$csvFile = $directory . '/libraries.csv';

if (file_exists($csvFile)) {
    echo "Error: $csvFile already exists. Aborting." . PHP_EOL;
    exit(1);
}

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));
$jsonFiles = [];
foreach ($iterator as $file) {
    if ($file->isFile() && strtolower($file->getExtension()) === 'json') {
        $jsonFiles[] = $file->getPathname();
    }
}

// Now load each json file and check if it has all the required fields.
$required_fields = ['type','name','title','platform','active','github','featured','featured_description','featured_icon'];
foreach ($jsonFiles as $jsonFile) {
    $filename = substr($jsonFile, strlen($directory) + 1);

    // echo "[$filename] Loading..." . PHP_EOL;
    $jsonData = json_decode(file_get_contents($jsonFile), true);
    if (!is_array($jsonData)) {
        echo "[$filename] Error: Not a valid JSON file." . PHP_EOL;
        continue;
    }
    $missing = array_diff($required_fields, array_keys($jsonData));
    $extra = array_diff(array_keys($jsonData), $required_fields);
    if (!empty($missing)) {
        foreach ($missing as $field) {
            echo "[$filename] Warning: Missing required field: $field" . PHP_EOL;
        }
    }
    if (!empty($extra)) {
        foreach ($extra as $field) {
            echo "[$filename] Warning: Has extra field: $field = '$jsonData[$field]'" . PHP_EOL;
        }
    }
}

$csvHandle = fopen($csvFile, 'w');

// Write CSV header
fputcsv($csvHandle, $required_fields, ',', '"', "\\");

$processedJsonFiles = [];
foreach ($jsonFiles as $jsonFile) {
    $filename = substr($jsonFile, strlen($directory) + 1);
    $jsonData = json_decode(file_get_contents($jsonFile), true);
    if (!is_array($jsonData)) {
        echo "[$filename] Error: Not a valid JSON file." . PHP_EOL;
        continue;
    }
    $row = [];
    foreach ($required_fields as $field) {
        if ($field === 'active') {
            $row[] = !empty($jsonData[$field]) && $jsonData[$field] ? 1 : 0;
        } else {
            $row[] = isset($jsonData[$field]) ? $jsonData[$field] : '';
        }
    }
    fputcsv($csvHandle, $row, ',', '"', "\\");
    $processedJsonFiles[] = $jsonFile;
}
fclose($csvHandle);
echo "Exported to $csvFile" . PHP_EOL;


// Delete JSON files after saving CSV
foreach ($processedJsonFiles as $jsonFile) {
    $filename = substr($jsonFile, strlen($directory) + 1);
    echo "Deleting $filename" . PHP_EOL;
    unlink($jsonFile);
}
