<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Extract form data
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$date = $data['date'] ?? '';
$time = $data['time'] ?? '';
$location = $data['location'] ?? '';
$address = $data['address'] ?? '';
$city = $data['city'] ?? '';
$state = $data['state'] ?? 'FL';
$zip_code = $data['zip_code'] ?? '';
$region = $data['region'] ?? '';
$category = $data['category'] ?? '';
$event_type = $data['event_type'] ?? '';
$age_groups = $data['age_groups'] ?? [];
$cost = $data['cost'] ?? '';
$organizer = $data['organizer'] ?? '';
$website = $data['website'] ?? '';
$contact_email = $data['contact_email'] ?? '';
$registration_required = $data['registration_required'] ?? false;
$registration_method = $data['registration_method'] ?? '';
$registration_url = $data['registration_url'] ?? '';
$registration_deadline = $data['registration_deadline'] ?? '';
$registration_details = $data['registration_details'] ?? '';
$sensory_accommodations = $data['sensory_accommodations'] ?? [];
$ceu_available = $data['ceu_available'] ?? false;
$recurring = $data['recurring'] ?? '';
$submitter_name = $data['submitter_name'] ?? '';
$submitter_email = $data['submitter_email'] ?? '';
$submitter_relationship = $data['submitter_relationship'] ?? '';

// Format arrays for email
$age_groups_str = is_array($age_groups) ? implode(', ', $age_groups) : $age_groups;
$sensory_str = is_array($sensory_accommodations) ? implode(', ', $sensory_accommodations) : $sensory_accommodations;

// Format date for display
$date_display = $date ? date('F j, Y', strtotime($date)) : 'TBD';
$deadline_display = $registration_deadline ? date('F j, Y', strtotime($registration_deadline)) : '';

// Admin notification email
$admin_email = 'info@floridaautismservices.com';
$admin_subject = "New Event Submission: $title";

$admin_message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h3 { color: #059669; margin-top: 25px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-left: 10px; }
        .section { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>📅 New Event Submission</h2>
        
        <div class='section'>
            <h3>Event Details</h3>
            <div class='field'><span class='label'>Title:</span><span class='value'>$title</span></div>
            <div class='field'><span class='label'>Description:</span><span class='value'>$description</span></div>
            <div class='field'><span class='label'>Date:</span><span class='value'>$date_display</span></div>
            <div class='field'><span class='label'>Time:</span><span class='value'>$time</span></div>
            <div class='field'><span class='label'>Category:</span><span class='value'>$category</span></div>
            <div class='field'><span class='label'>Event Type:</span><span class='value'>$event_type</span></div>
            <div class='field'><span class='label'>Age Groups:</span><span class='value'>$age_groups_str</span></div>
            <div class='field'><span class='label'>Cost:</span><span class='value'>$cost</span></div>
            <div class='field'><span class='label'>Recurring:</span><span class='value'>$recurring</span></div>
        </div>
        
        <div class='section'>
            <h3>Location</h3>
            <div class='field'><span class='label'>Venue:</span><span class='value'>$location</span></div>
            <div class='field'><span class='label'>Address:</span><span class='value'>$address</span></div>
            <div class='field'><span class='label'>City:</span><span class='value'>$city</span></div>
            <div class='field'><span class='label'>State:</span><span class='value'>$state</span></div>
            <div class='field'><span class='label'>ZIP:</span><span class='value'>$zip_code</span></div>
            <div class='field'><span class='label'>Region:</span><span class='value'>$region</span></div>
        </div>
        
        <div class='section'>
            <h3>Organizer Info</h3>
            <div class='field'><span class='label'>Organizer:</span><span class='value'>$organizer</span></div>
            <div class='field'><span class='label'>Website:</span><span class='value'>$website</span></div>
            <div class='field'><span class='label'>Contact Email:</span><span class='value'>$contact_email</span></div>
        </div>
        
        <div class='section'>
            <h3>Registration</h3>
            <div class='field'><span class='label'>Required:</span><span class='value'>" . ($registration_required ? 'Yes' : 'No') . "</span></div>
            <div class='field'><span class='label'>Method:</span><span class='value'>$registration_method</span></div>
            <div class='field'><span class='label'>URL:</span><span class='value'>$registration_url</span></div>
            <div class='field'><span class='label'>Deadline:</span><span class='value'>$deadline_display</span></div>
            <div class='field'><span class='label'>Details:</span><span class='value'>$registration_details</span></div>
        </div>
        
        <div class='section'>
            <h3>Accommodations</h3>
            <div class='field'><span class='label'>Sensory Accommodations:</span><span class='value'>$sensory_str</span></div>
            <div class='field'><span class='label'>CEU Available:</span><span class='value'>" . ($ceu_available ? 'Yes' : 'No') . "</span></div>
        </div>
        
        <div class='section'>
            <h3>Submitter Info</h3>
            <div class='field'><span class='label'>Name:</span><span class='value'>$submitter_name</span></div>
            <div class='field'><span class='label'>Email:</span><span class='value'>$submitter_email</span></div>
            <div class='field'><span class='label'>Relationship:</span><span class='value'>$submitter_relationship</span></div>
        </div>
    </div>
</body>
</html>
";

$admin_headers = "MIME-Version: 1.0\r\n";
$admin_headers .= "Content-type: text/html; charset=UTF-8\r\n";
$admin_headers .= "From: Florida Autism Services <noreply@floridaautismservices.com>\r\n";
$admin_headers .= "Reply-To: $submitter_email\r\n";

$admin_sent = mail($admin_email, $admin_subject, $admin_message, $admin_headers);

// Confirmation email to submitter
$confirmation_sent = false;
if ($submitter_email) {
    $confirm_subject = "Event Submission Received - Florida Autism Services";
    $confirm_message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .event-box { background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 10px 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Thank You!</h1>
                <p>Your event has been submitted for review</p>
            </div>
            <div class='content'>
                <p>Hi" . ($submitter_name ? " $submitter_name" : "") . ",</p>
                <p>Thank you for submitting your event to the Florida Autism Services Directory!</p>
                
                <div class='event-box'>
                    <strong>$title</strong><br>
                    📅 $date_display" . ($time ? " at $time" : "") . "<br>
                    📍 " . ($city ?: 'Location TBD') . "
                </div>
                
                <p>Our team will review your submission within 2-3 business days. Once verified, it will be added to our events calendar to help families across Florida discover autism-friendly events.</p>
                <p>If we need any additional information, we'll reach out to you at this email address.</p>
                <p>Thank you for helping us connect the autism community!</p>
                <p>Best regards,<br>The Florida Autism Services Team</p>
            </div>
            <div class='footer'>
                <p>Florida Autism Services Directory<br>
                <a href='https://floridaautismservices.com'>floridaautismservices.com</a></p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $confirm_headers = "MIME-Version: 1.0\r\n";
    $confirm_headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $confirm_headers .= "From: Florida Autism Services <noreply@floridaautismservices.com>\r\n";
    
    $confirmation_sent = mail($submitter_email, $confirm_subject, $confirm_message, $confirm_headers);
}

// Return response
if ($admin_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Emails sent successfully',
        'admin_sent' => $admin_sent,
        'confirmation_sent' => $confirmation_sent
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send admin notification'
    ]);
}
?>
