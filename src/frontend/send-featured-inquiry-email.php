<?php
// send-featured-inquiry-email.php
// Place this in: https://floridaautismservices.com/api/
// "Not ready yet? Get the details by email" form on /featured.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

// Honeypot: real visitors never see or fill this field. Pretend success, send nothing.
if (!empty($input['company'])) {
    echo json_encode(['success' => true]);
    exit();
}

$name = htmlspecialchars(trim($input['name'] ?? ''));
$practice_name = htmlspecialchars(trim($input['practice_name'] ?? ''));
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if ($name === '' || $practice_name === '' || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, practice name and a valid email are required']);
    exit();
}

$safe_email = htmlspecialchars($email);
// Strip line breaks so the practice name cannot inject mail headers via the subject.
$subject_practice = str_replace(["\r", "\n"], ' ', $practice_name);
$admin_subject = "Featured details request: $subject_practice";

$admin_message = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #2563eb, #16a34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 8px; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #1f2937; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='margin: 0;'>Featured Details Request</h1>
            <p style='margin: 5px 0 0 0; opacity: 0.9;'>From the /featured page: not ready yet, wants details by email</p>
        </div>
        <div class='content'>
            <div class='field'><span class='label'>Name:</span> <span class='value'>$name</span></div>
            <div class='field'><span class='label'>Practice:</span> <span class='value'>$practice_name</span></div>
            <div class='field'><span class='label'>Email:</span> <span class='value'>$safe_email</span></div>
        </div>
        <div class='footer'>
            Florida Autism Services Directory
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Florida Autism Services <noreply@floridaautismservices.com>\r\n";
$headers .= "Reply-To: $email\r\n";

// Send to admin
$admin_email = "info@floridaautismservices.com";
$admin_sent = mail($admin_email, $admin_subject, $admin_message, $headers);

if ($admin_sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send admin notification'
    ]);
}
?>
