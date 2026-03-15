<?php
header('Content-Type: application/json');

$response = [
    'status' => 'ok',
    'framework' => 'php',
    'message' => 'Hello from PHP on Veloz!',
    'timestamp' => date('c'),
    'php_version' => phpversion()
];

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/health') {
    echo json_encode(['status' => 'healthy']);
} else {
    echo json_encode($response, JSON_PRETTY_PRINT);
}
