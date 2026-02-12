export interface ServiceDefinition {
  title: string;
  slug: string;
  short: string;
  long: string;
}

export const SERVICE_DEFINITIONS: Record<string, ServiceDefinition> = {
  aba: {
    title: "ABA Therapy",
    slug: "aba",
    short: "Evidence-based behavior therapy supporting autism learning and independence.",
    long:
      "ABA Therapy (Applied Behavior Analysis) is an evidence-based approach that breaks complex goals into manageable steps. Therapists collect data to reinforce positive behaviors, teach new skills, and reduce behaviors that interfere with learning and daily life.",
  },
  speech: {
    title: "Speech Therapy",
    slug: "speech",
    short: "Builds speech clarity, language understanding, and social communication confidence.",
    long:
      "Speech Therapy helps individuals develop clearer articulation, stronger language comprehension, and more effective expressive communication. Sessions may focus on vocabulary, grammar, fluency, social pragmatics, and alternative communication strategies.",
  },
  ot: {
    title: "Occupational Therapy",
    slug: "occupational-therapy",
    short: "Develops sensory processing, fine-motor coordination, and everyday self-care.",
    long:
      "Occupational Therapy supports participation in daily routines by strengthening fine-motor skills, sensory processing, self-care, and adaptive coping strategies. Therapists tailor activities to promote confidence and independence at home, school, and in the community.",
  },
  pt: {
    title: "Physical Therapy",
    slug: "physical-therapy",
    short: "Strengthens balance, endurance, and movement for greater physical participation.",
    long:
      "Physical Therapy emphasizes gross-motor skills, posture, balance, and mobility so individuals can move more safely and comfortably. Sessions often include exercises, stretching, and play-based activities that improve strength and overall physical confidence.",
  },
  feeding: {
    title: "Feeding Therapy",
    slug: "feeding-therapy",
    short: "Guides safer eating habits through gradual exposure and skill practice.",
    long:
      "Feeding Therapy addresses swallowing, chewing, sensory sensitivities, and food aversions that make mealtimes challenging. Clinicians build tolerance to new textures, improve oral-motor coordination, and support stress-free family routines.",
  },
  music_therapy: {
    title: "Music Therapy",
    slug: "music-therapy",
    short: "Uses music experiences to improve regulation, communication, and cognition.",
    long:
      "Music Therapy leverages rhythm, singing, movement, and instrument play to engage multiple areas of the brain. Board-certified music therapists design creative sessions that target emotional regulation, social interaction, physical skills, and communication goals.",
  },
  inpp: {
    title: "INPP (Neuromotor Maturity)",
    slug: "inpp",
    short: "Retrains retained reflexes to support coordination, balance, and learning.",
    long:
      "The INPP (Institute for Neuro-Physiological Psychology) method evaluates primitive reflexes that may persist beyond infancy and affect development. Guided movement programs help integrate these reflexes, improving posture, balance, and classroom readiness.",
  },
  aac_speech: {
    title: "AAC / Speech Devices",
    slug: "aac-speech",
    short: "Teaches assistive communication devices for expressive language and autonomy.",
    long:
      "AAC (Augmentative and Alternative Communication) services introduce tools such as speech-generating devices, picture systems, or communication apps. Specialists customize vocabularies, train caregivers, and empower users to communicate more independently.",
  },
  aac: {
    title: "AAC (Augmentative & Alternative Communication)",
    slug: "aac",
    short: "Communication systems and devices for individuals who are nonverbal or have limited speech.",
    long:
      "Augmentative and Alternative Communication (AAC) encompasses all forms of communication outside of oral speech. For individuals with autism who are nonverbal or have limited verbal abilities, AAC provides a way to express needs, share thoughts, and connect with others. AAC ranges from low-tech options like picture boards to high-tech speech-generating devices and tablet apps.",
  },
  dir_floortime: {
    title: "DIR / Floortime",
    slug: "dir-floortime",
    short: "Play-based approach nurturing connection, emotional growth, and flexible thinking.",
    long:
      "DIR / Floortime (Developmental, Individual-difference, Relationship-based) therapy meets the child at their developmental level and follows their lead in play. Therapists and caregivers build emotional connection, encourage communication, and expand problem-solving skills.",
  },
  respite_care: {
    title: "Respite Care",
    slug: "respite-care",
    short: "Provides temporary caregiver relief through trusted short-term support services.",
    long:
      "Respite Care offers trained support workers who step in so family caregivers can rest, attend appointments, or manage other responsibilities. Services may occur at home or in community programs and are tailored to the individual's needs and routines.",
  },
  life_skills: {
    title: "Life Skills / Daily Living",
    slug: "life-skills-daily-living",
    short: "Coaches daily living routines, self-care, and community participation.",
    long:
      "Life Skills programs teach practical strategies for dressing, cooking, money management, transportation, and other daily routines. Coaches scaffold tasks to build confidence, independence, and successful participation in home and community settings.",
  },
  residential_program: {
    title: "Residential Program",
    slug: "residential-program",
    short: "Therapeutic living environments delivering round-the-clock autism support services.",
    long:
      "Residential Programs provide structured, supportive living arrangements with trained staff available day and night. These programs develop self-care, vocational, and social skills while ensuring safety, health services, and community engagement opportunities.",
  },
  support_groups: {
    title: "Support Groups",
    slug: "support-groups",
    short: "Peer-led gatherings for shared encouragement, information, and advocacy.",
    long:
      "Support Groups connect families, self-advocates, and caregivers who share lived experiences. Facilitated meetings provide a space to exchange resources, celebrate milestones, problem-solve challenges, and foster a sense of community belonging.",
  },
  pet_therapy: {
    title: "Pet Therapy",
    slug: "pet-therapy",
    short: "Animal-assisted sessions promoting calm, motivation, and social engagement.",
    long:
      "Pet Therapy introduces specially trained animals into therapeutic sessions to reduce anxiety, encourage communication, and increase motivation. Interacting with animals can improve mood regulation, empathy, and willingness to participate in other therapies.",
  },
  church_support: {
    title: "Faith-Based / Church Support",
    slug: "faith-based-support",
    short: "Church-led support integrating faith, community, and disability resources.",
    long:
      "Faith-Based or Church Support ministries offer inclusive worship experiences, respite events, peer mentoring, and practical assistance for families. Programs blend spiritual encouragement with disability-informed resources tailored to congregational life.",
  },
  virtual_therapy: {
    title: "Virtual Therapy",
    slug: "virtual-therapy",
    short: "Telehealth sessions delivering remote therapy with real-time interaction.",
    long:
      "Virtual Therapy uses secure video platforms so individuals can access services from home or school. Clinicians adapt materials and coaching strategies for telehealth, ensuring continuity of care when in-person visits are not possible.",
  },
  ados_testing: {
    title: "ADOS Testing",
    slug: "ados-testing",
    short: "Standardized autism evaluation assessing communication, behavior, and play.",
    long:
      "ADOS (Autism Diagnostic Observation Schedule) Testing is a gold-standard assessment administered by trained clinicians. Structured activities provide opportunities to observe social interaction, communication, and repetitive behaviors to inform diagnostic decisions.",
  },
  pharmacogenetic_testing: {
    title: "Pharmacogenetic Testing",
    slug: "pharmacogenetic-testing",
    short: "Analyzes genetics to tailor medication choices and dosing safely.",
    long:
      "Pharmacogenetic Testing evaluates how an individual's genes may affect their response to medications. Results help healthcare providers choose treatments that are more effective, reduce side effects, and personalize medication plans.",
  },
  autism_travel: {
    title: "Autism Travel",
    slug: "autism-travel",
    short: "Plans sensory-friendly trips with accommodations, supports, and strategies.",
    long:
      "Autism Travel specialists coordinate transportation, lodging, and attractions that prioritize sensory needs and accessibility. Families receive preparation strategies, social stories, and on-the-go support for smoother travel experiences.",
  },
  mobile_services: {
    title: "Mobile Services",
    slug: "mobile-services",
    short: "Therapists travel to homes or schools for onsite support.",
    long:
      "Mobile Services bring clinicians directly to homes, schools, or community locations, reducing transportation barriers. Teams collaborate with caregivers and educators to generalize skills across environments where they matter most.",
  },
  transportation: {
    title: "Transportation",
    slug: "transportation",
    short: "Transportation assistance for individuals with disabilities.",
    long:
      "Transportation services help individuals with autism and developmental disabilities travel to appointments, programs, work, and community activities. Providers specialize in accommodating sensory sensitivities and behavioral support during transit. Many accept APD Medicaid waiver funding.",
  },
  skilled_nursing: {
    title: "Skilled Nursing",
    slug: "skilled-nursing",
    short: "Licensed nursing care including medication administration and medical monitoring.",
    long:
      "Skilled Nursing services provide licensed nursing care including medication administration, tube feeding, tracheostomy care, and medical monitoring. These services are commonly offered at PPEC centers and other pediatric facilities to support children with complex medical needs.",
  },
  respiratory_care: {
    title: "Respiratory Care",
    slug: "respiratory-care",
    short: "Respiratory therapy and support including oxygen management and breathing treatments.",
    long:
      "Respiratory Care services provide respiratory therapy and support including oxygen management, ventilator care, and breathing treatments. Licensed respiratory therapists monitor and manage airway conditions to ensure safe and effective breathing for children with complex needs.",
  },
  executive_function_coaching: {
    title: "Executive Function Coaching",
    slug: "executive-function-coaching",
    short: "Builds planning, organization, and self-regulation for daily success.",
    long:
      "Executive Function Coaching teaches practical strategies for organizing materials, managing time, initiating tasks, and regulating emotions. Coaches personalize tools and accountability systems that reinforce independence at home, school, and work.",
  },
  parent_coaching: {
    title: "Parent Coaching",
    slug: "parent-coaching",
    short: "Guides caregivers to implement therapeutic strategies at home.",
    long:
      "Parent Coaching equips caregivers with evidence-based techniques for supporting communication, behavior, and daily routines. Coaches model strategies, provide feedback, and adapt plans to fit cultural values and family dynamics.",
  },
  tutoring: {
    title: "Tutoring",
    slug: "tutoring",
    short: "Delivers individualized academic support adapted for neurodiverse learners.",
    long:
      "Tutoring services use specialized instructional methods to reinforce classroom concepts, build foundational skills, and accommodate sensory or attention needs. Tutors collaborate with families and schools to keep progress aligned with educational goals.",
  },
  group_therapy: {
    title: "Group Therapy",
    slug: "group-therapy",
    short: "Facilitated sessions building social communication, coping, and empathy.",
    long:
      "Group Therapy brings peers together to practice social interaction, emotional regulation, and problem-solving in a supportive setting. Therapists design structured activities that encourage teamwork, perspective-taking, and shared goal achievement.",
  },
  fes_ua: {
    title: "FES-UA (Family Empowerment Scholarship for Unique Abilities)",
    slug: "fes-ua",
    short: "State scholarship covering specialized education for students with unique abilities.",
    long:
      "The Family Empowerment Scholarship for Unique Abilities (FES-UA) provides flexible funds for private school tuition, therapies, curriculum, and other approved services. Eligible Florida students with disabilities can access customized learning supports using this scholarship.",
  },
  fes_eo: {
    title: "FES-EO (Family Empowerment for Educational Options)",
    slug: "fes-eo",
    short: "Supports K-12 school choice for eligible Florida families seeking options.",
    long:
      "FES-EO assists income-eligible or military-connected families in choosing the best educational setting for their children. Funds may cover private school tuition, transportation, or part-time public school enrollment to expand learning options.",
  },
  ftc: {
    title: "FTC (Florida Tax Credit Scholarship)",
    slug: "ftc-scholarship",
    short: "Provides tax-credit funded scholarships for K-12 private schooling.",
    long:
      "The Florida Tax Credit (FTC) Scholarship uses corporate donations to offer tuition assistance for qualifying students. Families can pursue private school placements or transportation to public schools outside their district of residence.",
  },
  pep_scholarship: {
    title: "PEP Scholarship",
    slug: "pep-scholarship",
    short: "Flexible education savings account for personalized learning expenses.",
    long:
      "The Personalized Education Program (PEP) Scholarship operates like an education savings account. Families can allocate funds toward tutoring, curriculum, therapies, assessments, and other approved services that match their child's learning plan.",
  },
  hope_scholarship: {
    title: "Hope Scholarship",
    slug: "hope-scholarship",
    short: "Scholarship assisting students affected by bullying or harassment transfers.",
    long:
      "The Hope Scholarship supports Florida students who have experienced bullying, harassment, or violence in public schools. Eligible families may transfer to another public school or receive private school tuition assistance to find a safer learning environment.",
  },
  florida_kidcare: {
    title: "Florida KidCare",
    slug: "florida-kidcare",
    short: "Low-cost health coverage for Florida children through partnered plans.",
    long:
      "Florida KidCare is the state's affordable health insurance program for infants through age 18. It connects families with subsidized coverage options that include medical, dental, vision, and behavioral health services.",
  },
  accepts_most_insurances: {
    title: "Accepts Most Insurances",
    slug: "accepts-most-insurances",
    short: "Provider accepts most major insurance plans — contact to verify your specific coverage.",
    long:
      "Some providers work with a wide range of insurance carriers rather than listing each one individually. This tag indicates broad insurance acceptance, but coverage varies by plan. Always contact the provider directly to confirm they accept your specific insurance, and ask about co-pays, deductibles, and prior authorization requirements.",
  },
  medicaid_waiver: {
    title: "Medicaid Waiver",
    slug: "medicaid-waiver",
    short: "Home and community services funded through Florida Medicaid programs.",
    long:
      "Florida Medicaid Waiver programs fund in-home supports, respite, therapies, and assistive technologies that help individuals remain in their communities. Services are tailored through individualized plans and coordinated with approved providers.",
  },
  medicaid: {
    title: "Medicaid",
    slug: "medicaid",
    short: "Public insurance covering eligible low-income individuals and families statewide.",
    long:
      "Medicaid is jointly funded by the state and federal governments to provide comprehensive health coverage for eligible low-income children, adults, seniors, and people with disabilities. Benefits often include medical, behavioral, and long-term care services.",
  },
  medicare: {
    title: "Medicare",
    slug: "medicare",
    short: "Federal health coverage for seniors and qualifying disabled individuals.",
    long:
      "Medicare is a federal program offering hospital, medical, and prescription coverage for people age 65 and older, as well as certain younger individuals with disabilities. Many providers accept Medicare Advantage or supplemental plans for additional benefits.",
  },
  aetna: {
    title: "Aetna",
    slug: "aetna",
    short: "National private insurer offering behavioral health and medical plans.",
    long:
      "Aetna is a national insurance carrier providing health plans that include medical, mental health, and therapy benefits. Coverage specifics depend on the employer or marketplace plan and often require verifying network participation with the provider.",
  },
  cigna: {
    title: "Cigna",
    slug: "cigna",
    short: "Global insurer providing medical, behavioral, and pharmacy benefit networks.",
    long:
      "Cigna offers employer-based and marketplace health plans with robust networks for medical, behavioral health, and pharmacy services. Families should confirm deductibles, co-pays, and prior authorization requirements directly with their plan.",
  },
  tricare: {
    title: "TRICARE",
    slug: "tricare",
    short: "Department of Defense insurance for military members and families.",
    long:
      "TRICARE delivers healthcare coverage to active-duty service members, National Guard and Reserve members, retirees, and their families. Plans encompass medical, behavioral health, and specialty services with varying referral and authorization processes.",
  },
  humana: {
    title: "Humana",
    slug: "humana",
    short: "Health insurer with medical, behavioral, and specialty coverage options.",
    long:
      "Humana provides commercial, Medicare, and Medicaid plans that may include autism-related therapies, behavioral health services, and wellness programs. Coverage levels vary by plan, so families should verify benefits before starting services.",
  },
  florida_blue: {
    title: "Florida Blue",
    slug: "florida-blue",
    short: "Blue Cross Blue Shield plans serving Florida individuals and employers.",
    long:
      "Florida Blue, part of the Blue Cross Blue Shield network, offers individual, family, and employer health plans across the state. Members can access broad provider networks for medical care, therapies, and preventive services.",
  },
  sunshine_health: {
    title: "Sunshine Health",
    slug: "sunshine-health",
    short: "Florida managed care plans covering Medicaid and related programs.",
    long:
      "Sunshine Health administers Medicaid, Marketplace, and specialty plans tailored to Florida residents. Plans often include care coordination, behavioral health services, and supports for individuals with complex medical needs.",
  },
  wellcare: {
    title: "WellCare",
    slug: "wellcare",
    short: "Managed care organization offering Medicare, Medicaid, and pharmacy benefits.",
    long:
      "WellCare provides government-sponsored health plans, including Medicaid and Medicare Advantage options. Members may receive integrated medical, behavioral, and pharmacy services coordinated through provider networks and case managers.",
  },
  molina: {
    title: "Molina",
    slug: "molina",
    short: "Provides government-sponsored health coverage with behavioral supports included.",
    long:
      "Molina Healthcare delivers Medicaid, Medicare, and Marketplace plans focused on underserved communities. Coverage often includes behavioral health, long-term services, and disease management programs tailored to member needs.",
  },
  unitedhealthcare: {
    title: "UnitedHealthcare",
    slug: "unitedhealthcare",
    short: "Nationwide insurer delivering medical, behavioral, and specialty networks.",
    long:
      "UnitedHealthcare offers a wide range of employer-sponsored, Medicare, Medicaid, and individual plans. Members benefit from extensive provider networks, care management programs, and digital tools supporting whole-person health.",
  },
  florida_healthcare_plans: {
    title: "Florida Healthcare Plans",
    slug: "florida-healthcare-plans",
    short: "Regional health plans offering integrated medical and wellness services.",
    long:
      "Florida Healthcare Plans (FHCP) provides regional HMO and PPO options serving Central and Northeast Florida. Plans emphasize coordinated medical care, preventive services, and access to local specialists and therapists.",
  },
  private_pay: {
    title: "Private Pay Only",
    slug: "private-pay-only",
    short: "Services billed directly to families without insurance reimbursement.",
    long:
      "Private Pay providers do not bill insurance and instead invoice families directly for services. This option can offer more flexibility in scheduling and service design but requires families to manage payment or seek reimbursement independently.",
  },
};
