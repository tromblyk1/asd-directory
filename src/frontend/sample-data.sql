-- Sample Data for Florida Autism Services
-- This file contains sample data to populate the database for demonstration purposes

-- Sample Providers
INSERT INTO providers (name, description, address, city, county, zip_code, phone, email, website, service_types, settings, credentials, rating, review_count, is_verified)
VALUES
  (
    'Sunshine ABA Therapy Center',
    'Comprehensive ABA therapy services for children with autism. Our board-certified behavior analysts provide individualized treatment plans in a supportive environment.',
    '123 Palm Avenue',
    'Miami',
    'Miami-Dade',
    '33101',
    '(305) 555-0123',
    'info@sunshineaba.com',
    'https://sunshineaba.com',
    ARRAY['ABA Therapy', 'Behavioral Support', 'Early Intervention'],
    ARRAY['Clinic', 'In-Home'],
    'BCBA, Licensed by Florida Board',
    4.8,
    42,
    true
  ),
  (
    'Tampa Speech & Language Center',
    'Specialized speech therapy for children and adults with autism spectrum disorders. Our SLPs have extensive experience with non-verbal communication and social skills.',
    '456 Bay Street',
    'Tampa',
    'Hillsborough',
    '33602',
    '(813) 555-0456',
    'contact@tampaspeech.com',
    'https://tampaspeech.com',
    ARRAY['Speech Therapy', 'Social Skills Groups'],
    ARRAY['Clinic', 'Telehealth'],
    'CCC-SLP, State Licensed',
    4.9,
    67,
    true
  ),
  (
    'Orlando Occupational Therapy',
    'Expert occupational therapy services focusing on sensory integration, fine motor skills, and daily living activities for individuals with autism.',
    '789 Magic Way',
    'Orlando',
    'Orange',
    '32801',
    '(407) 555-0789',
    'hello@orlandoot.com',
    'https://orlandoot.com',
    ARRAY['Occupational Therapy', 'Social Skills Groups'],
    ARRAY['Clinic', 'In-Home', 'School-Based'],
    'OTR/L, Sensory Integration Certified',
    4.7,
    38,
    true
  ),
  (
    'Jacksonville Autism Support Services',
    'Full-spectrum autism support including diagnostic services, case management, and family counseling. We help families navigate the complex landscape of autism services.',
    '321 River Road',
    'Jacksonville',
    'Duval',
    '32202',
    '(904) 555-0321',
    'info@jaxautism.org',
    'https://jaxautism.org',
    ARRAY['Diagnostic Services', 'Case Management', 'Behavioral Support'],
    ARRAY['Clinic', 'Telehealth'],
    'Licensed Psychologist, BCBA',
    4.6,
    29,
    true
  ),
  (
    'Gulf Coast Early Intervention',
    'Specialized early intervention services for children under 5 with autism. Evidence-based therapies delivered in natural environments.',
    '555 Coastal Drive',
    'Sarasota',
    'Sarasota',
    '34230',
    '(941) 555-0555',
    'team@gulfcoastei.com',
    'https://gulfcoastei.com',
    ARRAY['Early Intervention', 'ABA Therapy', 'Speech Therapy', 'Occupational Therapy'],
    ARRAY['In-Home', 'Clinic'],
    'BCBA, SLP, OTR/L',
    4.9,
    54,
    true
  );

-- Sample Churches
INSERT INTO churches (name, description, address, city, county, zip_code, phone, email, website, denomination, programs, features, service_times, is_verified)
VALUES
  (
    'Grace Community Church',
    'A welcoming church family with a dedicated special needs ministry. We provide sensory-friendly worship services and individualized support for families.',
    '100 Church Street',
    'Tampa',
    'Hillsborough',
    '33610',
    '(813) 555-1000',
    'welcome@gracecc.org',
    'https://gracecc.org',
    'Non-denominational',
    ARRAY['Sensory-Friendly Service', 'Special Needs Ministry', 'Parent Support'],
    ARRAY['Sensory-Friendly Worship', 'Quiet Room Available', 'Trained Volunteers'],
    'Sensory-friendly service: Sunday 9:30 AM',
    true
  ),
  (
    'St. Michael Catholic Church',
    'Catholic parish with inclusive programs for individuals with autism and their families. Our community embraces neurodiversity.',
    '200 Faith Avenue',
    'Orlando',
    'Orange',
    '32805',
    '(407) 555-2000',
    'office@stmichael.org',
    'https://stmichael.org',
    'Catholic',
    ARRAY['Special Needs Ministry', 'Social Skills Group', 'Respite Care'],
    ARRAY['Sensory-Friendly Space', 'Visual Schedules', 'Quiet Room Available'],
    'Mass times: Saturday 5:30 PM, Sunday 8 AM, 10 AM, 12 PM',
    true
  ),
  (
    'New Hope Baptist Church',
    'Baptist church with a thriving special needs ministry offering Sunday school accommodations and parent support groups.',
    '300 Hope Lane',
    'Jacksonville',
    'Duval',
    '32210',
    '(904) 555-3000',
    'info@newhopejax.org',
    'https://newhopejax.org',
    'Baptist',
    ARRAY['Sunday School Accommodation', 'Parent Support', 'Special Needs Ministry'],
    ARRAY['Trained Volunteers', 'Sensory-Friendly Environment'],
    'Sunday services: 9 AM, 11 AM, 6 PM',
    true
  ),
  (
    'Cornerstone Fellowship',
    'Contemporary church with inclusive worship and a dedicated buddy program for children with special needs.',
    '400 Unity Road',
    'Fort Lauderdale',
    'Broward',
    '33301',
    '(954) 555-4000',
    'hello@cornerstonefellowship.org',
    'https://cornerstonefellowship.org',
    'Non-denominational',
    ARRAY['Special Needs Ministry', 'Social Skills Group'],
    ARRAY['Buddy Program', 'Visual Supports', 'Sensory-Friendly'],
    'Sunday worship: 9 AM, 11 AM',
    true
  );

-- Sample Resources
INSERT INTO resources (title, slug, category, excerpt, content, author, tags, featured, published)
VALUES
  (
    'Understanding ABA Therapy: A Guide for Parents',
    'understanding-aba-therapy',
    'Types of Therapy',
    'Applied Behavior Analysis (ABA) is one of the most widely used therapies for autism. Learn what it is, how it works, and what to expect.',
    '# Understanding ABA Therapy: A Guide for Parents\n\nApplied Behavior Analysis (ABA) is a scientific approach to understanding behavior and how it is affected by the environment. For children with autism, ABA therapy can help develop communication, social, and learning skills.\n\n## What is ABA Therapy?\n\nABA therapy uses principles of learning and behavior to bring about meaningful and positive change. It focuses on increasing helpful behaviors and decreasing behaviors that may be harmful or interfere with learning.\n\n## Key Components:\n\n- **Assessment**: Understanding the child''s current skills and challenges\n- **Goal Setting**: Developing specific, measurable objectives\n- **Intervention**: Teaching new skills through structured sessions\n- **Data Collection**: Tracking progress systematically\n- **Adjustment**: Modifying approaches based on results\n\n## Is ABA Right for Your Child?\n\nConsider factors like your child''s age, specific needs, and family goals. Consult with qualified professionals to determine if ABA is appropriate.',
    'Florida Autism Services',
    ARRAY['ABA', 'Therapy', 'Treatment', 'Behavioral Support'],
    true,
    true
  ),
  (
    'Navigating Insurance for Autism Services in Florida',
    'navigating-insurance-florida',
    'Insurance & Funding',
    'Understanding insurance coverage for autism services can be complex. This guide breaks down Florida insurance laws and how to maximize your benefits.',
    '# Navigating Insurance for Autism Services in Florida\n\nFlorida has laws requiring insurance coverage for autism services, but understanding your benefits can be challenging.\n\n## Florida Insurance Requirements\n\nFlorida Statute 627.6686 requires most health insurance plans to cover autism services, including:\n\n- Behavioral therapy (like ABA)\n- Speech therapy\n- Occupational therapy\n- Physical therapy\n\n## Coverage Limits\n\n- Children under 18: Up to $36,000 per year\n- Some plans may have higher limits\n- Check your specific policy\n\n## Tips for Working with Insurance:\n\n1. Get pre-authorization for services\n2. Keep detailed records\n3. Appeal denials promptly\n4. Consider hiring a case manager\n\n## Additional Funding Sources\n\nIf insurance doesn''t cover everything:\n\n- Medicaid waivers\n- Scholarships\n- Non-profit assistance programs',
    'Florida Autism Services',
    ARRAY['Insurance', 'Funding', 'Financial Support', 'Florida Law'],
    true,
    true
  ),
  (
    'IEP Essentials: Getting Educational Support for Your Child',
    'iep-essentials-florida',
    'Education & IEP',
    'An Individualized Education Program (IEP) ensures your child receives appropriate educational services. Learn how to prepare for and participate in IEP meetings.',
    '# IEP Essentials: Getting Educational Support for Your Child\n\nEvery child with autism who qualifies for special education services should have an IEP.\n\n## What is an IEP?\n\nAn IEP is a legally binding document that outlines:\n\n- Your child''s current performance levels\n- Annual educational goals\n- Special education services\n- Accommodations and modifications\n- How progress will be measured\n\n## The IEP Process:\n\n1. **Evaluation**: Comprehensive assessment of your child\n2. **Eligibility**: Determination of special education qualification\n3. **IEP Meeting**: Team develops the plan\n4. **Implementation**: Services begin\n5. **Annual Review**: Progress evaluation and updates\n\n## Your Rights as a Parent:\n\n- Participate in all decisions\n- Request evaluations\n- Review educational records\n- Bring advocates to meetings\n- Disagree with decisions\n\n## Preparing for IEP Meetings:\n\n- Review last year''s IEP\n- List concerns and priorities\n- Bring data and examples\n- Ask questions\n- Request clarification',
    'Florida Autism Services',
    ARRAY['IEP', 'Education', 'Special Education', 'Schools', 'Rights'],
    true,
    true
  ),
  (
    'Early Intervention in Florida: Services for Children Under 5',
    'early-intervention-florida',
    'Early Intervention',
    'Early intervention services can make a significant difference for young children with autism. Learn about Florida''s Early Steps program and available services.',
    '# Early Intervention in Florida: Services for Children Under 5\n\nResearch shows that early intervention leads to better outcomes for children with autism.\n\n## Florida''s Early Steps Program\n\nEarly Steps is Florida''s early intervention system for children birth to 36 months who have developmental delays or disabilities.\n\n## Eligible Services:\n\n- Developmental therapy\n- Speech-language therapy\n- Occupational therapy\n- Physical therapy\n- Service coordination\n- Family training and counseling\n\n## How to Access Services:\n\n1. **Referral**: Contact Early Steps at 1-800-218-0001\n2. **Evaluation**: Free developmental screening\n3. **IFSP**: Individualized Family Service Plan created\n4. **Services Begin**: Typically in natural environments\n\n## Costs:\n\nMost families pay nothing. Services are covered by:\n\n- Medicaid\n- Private insurance\n- State funding\n\n## Transitioning at Age 3:\n\nAt age 3, children transition from Early Steps to preschool special education services through the school district.',
    'Florida Autism Services',
    ARRAY['Early Intervention', 'Early Steps', 'Toddlers', 'Infants', 'Development'],
    false,
    true
  ),
  (
    'Self-Care for Autism Parents: You Can''t Pour from an Empty Cup',
    'parent-self-care',
    'Parent Support',
    'Caring for a child with autism is rewarding but challenging. Learn strategies for maintaining your own well-being while supporting your child.',
    '# Self-Care for Autism Parents\n\nParenting a child with autism comes with unique joys and challenges. Taking care of yourself isn''t selfish—it''s essential.\n\n## Why Self-Care Matters\n\nWhen you''re depleted:\n\n- Patience decreases\n- Decision-making suffers\n- Physical health declines\n- Emotional resilience weakens\n\n## Practical Self-Care Strategies:\n\n### 1. Build Your Support Network\n\n- Connect with other autism parents\n- Join support groups\n- Accept help from family and friends\n\n### 2. Schedule \"Me Time\"\n\n- Even 15 minutes daily makes a difference\n- Protect this time as sacred\n- Do something you enjoy\n\n### 3. Maintain Physical Health\n\n- Get adequate sleep\n- Eat regular, nutritious meals\n- Exercise (even brief walks)\n\n### 4. Manage Stress\n\n- Practice mindfulness or meditation\n- Try deep breathing exercises\n- Consider therapy or counseling\n\n### 5. Utilize Respite Care\n\n- Don''t feel guilty\n- Research respite options\n- Schedule regular breaks\n\n## Remember:\n\nYou''re doing an amazing job. Taking care of yourself helps you take better care of your child.',
    'Florida Autism Services',
    ARRAY['Parents', 'Self-Care', 'Mental Health', 'Support', 'Stress Management'],
    false,
    true
  );
