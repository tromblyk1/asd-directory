<?php
// send-submission-email.php
// Place this in: https://floridaautismservices.com/api/

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

// Extract form data
$resource_name = htmlspecialchars($input['resource_name'] ?? '');
$category = htmlspecialchars($input['category'] ?? '');
$description = htmlspecialchars($input['description'] ?? '');
$address = htmlspecialchars($input['address'] ?? '');
$city = htmlspecialchars($input['city'] ?? '');
$phone = htmlspecialchars($input['phone'] ?? '');
$email = htmlspecialchars($input['email'] ?? '');
$website = htmlspecialchars($input['website'] ?? '');
$submitter_name = htmlspecialchars($input['submitter_name'] ?? '');
$submitter_email = htmlspecialchars($input['submitter_email'] ?? '');
$submitter_relationship = htmlspecialchars($input['submitter_relationship'] ?? '');

// Sub-category data
$services = $input['services'] ?? [];
$scholarships = $input['scholarships'] ?? [];
$denomination = htmlspecialchars($input['denomination'] ?? '');
$accreditations = $input['accreditations'] ?? [];
$grade_levels = $input['grade_levels'] ?? [];
$insurances = $input['insurances'] ?? [];
$accommodations = $input['accommodations'] ?? [];
$programs = $input['programs'] ?? [];

// Format category for display
$category_labels = [
    'healthcare' => 'Healthcare Provider',
    'school' => 'School',
    'faith' => 'Faith Community',
    'support' => 'Support Services',
    'recreation' => 'Recreation & Activities'
];
$category_display = $category_labels[$category] ?? ucwords($category);

// Format arrays for display
$services_display = is_array($services) && count($services) > 0 
    ? implode(', ', array_map('ucwords', str_replace('-', ' ', $services))) 
    : 'None specified';

$scholarships_display = is_array($scholarships) && count($scholarships) > 0 
    ? implode(', ', array_map('strtoupper', $scholarships)) 
    : 'None specified';

$accreditations_display = is_array($accreditations) && count($accreditations) > 0 
    ? implode(', ', array_map('strtoupper', $accreditations)) 
    : 'None specified';

$grade_levels_display = is_array($grade_levels) && count($grade_levels) > 0 
    ? implode(', ', array_map('ucwords', str_replace('-', ' ', $grade_levels))) 
    : 'None specified';

$insurances_display = is_array($insurances) && count($insurances) > 0 
    ? implode(', ', array_map(function($ins) { return ucwords(str_replace('-', ' ', $ins)); }, $insurances)) 
    : 'None specified';

$accommodations_display = is_array($accommodations) && count($accommodations) > 0 
    ? implode(', ', array_map(function($acc) { return ucwords(str_replace('-', ' ', $acc)); }, $accommodations)) 
    : 'None specified';

$programs_display = is_array($programs) && count($programs) > 0 
    ? implode(', ', array_map(function($prog) { return ucwords(str_replace('-', ' ', $prog)); }, $programs)) 
    : 'None specified';

$denomination_display = $denomination ?: 'Not specified';

// Build email content for admin notification
$admin_subject = "New Resource Submission: $resource_name";

// Build sub-category section based on category type
$subcategory_section = '';
if ($category === 'healthcare') {
    $subcategory_section = "
            <div class='section'>
                <div class='section-title'>Healthcare Provider Details</div>
                <div class='field'><span class='label'>Services:</span> <span class='value'>$services_display</span></div>
                <div class='field'><span class='label'>Insurances:</span> <span class='value'>$insurances_display</span></div>
            </div>";
} elseif ($category === 'support') {
    $subcategory_section = "
            <div class='section'>
                <div class='section-title'>Support Services Details</div>
                <div class='field'><span class='label'>Services:</span> <span class='value'>$services_display</span></div>
            </div>";
} elseif ($category === 'school') {
    $subcategory_section = "
            <div class='section'>
                <div class='section-title'>School Details</div>
                <div class='field'><span class='label'>Grade Levels:</span> <span class='value'>$grade_levels_display</span></div>
                <div class='field'><span class='label'>Scholarships:</span> <span class='value'>$scholarships_display</span></div>
                <div class='field'><span class='label'>Denomination:</span> <span class='value'>$denomination_display</span></div>
                <div class='field'><span class='label'>Accreditations:</span> <span class='value'>$accreditations_display</span></div>
            </div>";
} elseif ($category === 'faith') {
    $subcategory_section = "
            <div class='section'>
                <div class='section-title'>Faith Community Details</div>
                <div class='field'><span class='label'>Denomination:</span> <span class='value'>$denomination_display</span></div>
                <div class='field'><span class='label'>Accommodations:</span> <span class='value'>$accommodations_display</span></div>
                <div class='field'><span class='label'>Programs:</span> <span class='value'>$programs_display</span></div>
            </div>";
}

$admin_message = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #2563eb, #16a34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; color: #1f2937; margin-bottom: 8px; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
        .field { margin-bottom: 8px; }
        .label { font-weight: bold; color: #6b7280; }
        .value { color: #1f2937; }
        .category-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-weight: bold; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='margin: 0;'>New Resource Submission</h1>
            <p style='margin: 5px 0 0 0; opacity: 0.9;'>Florida Autism Services Directory</p>
        </div>
        <div class='content'>
            <div class='section'>
                <div class='section-title'>Resource Details</div>
                <div class='field'><span class='label'>Name:</span> <span class='value'>$resource_name</span></div>
                <div class='field'><span class='label'>Category:</span> <span class='category-badge'>$category_display</span></div>
                <div class='field'><span class='label'>Description:</span><br><span class='value'>$description</span></div>
            </div>
            $subcategory_section
            <div class='section'>
                <div class='section-title'>Location</div>
                <div class='field'><span class='label'>Address:</span> <span class='value'>" . ($address ?: 'Not provided') . "</span></div>
                <div class='field'><span class='label'>City:</span> <span class='value'>$city</span></div>
            </div>
            
            <div class='section'>
                <div class='section-title'>Resource Contact Info</div>
                <div class='field'><span class='label'>Phone:</span> <span class='value'>" . ($phone ?: 'Not provided') . "</span></div>
                <div class='field'><span class='label'>Email:</span> <span class='value'>" . ($email ?: 'Not provided') . "</span></div>
                <div class='field'><span class='label'>Website:</span> <span class='value'>" . ($website ?: 'Not provided') . "</span></div>
            </div>
            
            <div class='section'>
                <div class='section-title'>Submitted By</div>
                <div class='field'><span class='label'>Name:</span> <span class='value'>" . ($submitter_name ?: 'Not provided') . "</span></div>
                <div class='field'><span class='label'>Email:</span> <span class='value'>$submitter_email</span></div>
                <div class='field'><span class='label'>Relationship:</span> <span class='value'>" . ($submitter_relationship ?: 'Not provided') . "</span></div>
            </div>
        </div>
        <div class='footer'>
            This submission has been saved to the database and is awaiting review.
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Florida Autism Services <noreply@floridaautismservices.com>\r\n";
$headers .= "Reply-To: $submitter_email\r\n";

// Send to admin
$admin_email = "floridaautismservices@gmail.com";
$admin_sent = mail($admin_email, $admin_subject, $admin_message, $headers);

// Send confirmation to submitter
$confirmation_sent = false;
if ($submitter_email) {
    $confirm_subject = "We received your resource submission - Florida Autism Services";
    $confirm_message = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #2563eb, #16a34a); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1 style='margin: 0;'>Thank You!</h1>
                <p style='margin: 5px 0 0 0; opacity: 0.9;'>We received your submission</p>
            </div>
            <div class='content'>
                <p>Hi" . ($submitter_name ? " $submitter_name" : "") . ",</p>
                <p>Thank you for submitting <strong>$resource_name</strong> to the Florida Autism Services Directory!</p>
                <p>Our team will review your submission within 2-3 business days. Once verified, it will be added to our directory to help families across Florida find autism-friendly resources.</p>
                <p>If we need any additional information, we'll reach out to you at this email address.</p>
                <p>Thank you for helping us build a more comprehensive resource for the autism community!</p>
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
