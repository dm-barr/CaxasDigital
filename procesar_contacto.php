<?php
$host = 'localhost';
$dbname = 'a0030320_pagweb';
$username = 'a0030320_pagweb';
$password = 'VO28futaro';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $nombre = trim($_POST['nombre'] ?? '');
    $empresa = trim($_POST['empresa'] ?? '');
    $ciudad_pais = trim($_POST['ciudad_pais'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $tema_conversacion = trim($_POST['tema_conversacion'] ?? '');
    $mensaje = trim($_POST['mensaje'] ?? '');
    $acepta_privacidad = isset($_POST['acepta_privacidad']) ? 1 : 0;
    $acepta_marketing = isset($_POST['acepta_marketing']) ? 1 : 0;

    if (empty($nombre) || empty($email) || empty($tema_conversacion) || empty($mensaje)) {
        throw new Exception('Por favor completa todos los campos obligatorios');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email no válido');
    }

    if ($acepta_privacidad !== 1) {
        throw new Exception('Debes aceptar la política de privacidad');
    }

    $sql = "INSERT INTO contactos (
        nombre, 
        empresa, 
        ciudad_pais, 
        telefono, 
        email, 
        tema_conversacion, 
        mensaje, 
        acepta_privacidad, 
        acepta_marketing
    ) VALUES (
        :nombre, 
        :empresa, 
        :ciudad_pais, 
        :telefono, 
        :email, 
        :tema_conversacion, 
        :mensaje, 
        :acepta_privacidad, 
        :acepta_marketing
    )";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ':nombre' => $nombre,
        ':empresa' => $empresa,
        ':ciudad_pais' => $ciudad_pais,
        ':telefono' => $telefono,
        ':email' => $email,
        ':tema_conversacion' => $tema_conversacion,
        ':mensaje' => $mensaje,
        ':acepta_privacidad' => $acepta_privacidad,
        ':acepta_marketing' => $acepta_marketing
    ]);

    // ========== ENVÍO DE EMAIL - AGREGAR AQUÍ ==========
    $destinatario = "formularios@caxasdigital.com"; // CAMBIA POR TU EMAIL REAL
    $asunto = "Nuevo contacto desde la web: " . $tema_conversacion;

    $cuerpo = "Has recibido un nuevo mensaje de contacto:\n\n";
    $cuerpo .= "NOMBRE: " . $nombre . "\n";
    $cuerpo .= "EMPRESA: " . $empresa . "\n";
    $cuerpo .= "CIUDAD/PAÍS: " . $ciudad_pais . "\n";
    $cuerpo .= "TELÉFONO: " . $telefono . "\n";
    $cuerpo .= "EMAIL: " . $email . "\n";
    $cuerpo .= "TEMA: " . $tema_conversacion . "\n\n";
    $cuerpo .= "MENSAJE:\n" . $mensaje . "\n\n";
    $cuerpo .= "---\n";
    $cuerpo .= "Marketing: " . ($acepta_marketing ? 'Sí' : 'No');

    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    mail($destinatario, $asunto, $cuerpo, $headers);
    // ===================================================

    http_response_code(200);
    exit;


} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos. Inténtalo más tarde.'
    ]);
    error_log($e->getMessage());

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>