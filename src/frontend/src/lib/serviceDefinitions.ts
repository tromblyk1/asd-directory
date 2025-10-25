export const SERVICE_DEFINITIONS: Record<
  string,
  { label: string; slug: string; short: string; long: string }
> = {
  aba: {
    label: "ABA Therapy",
    slug: "aba",
    short:
      "Applied Behavior Analysis (ABA) helps build positive behaviors and reduce challenging ones through data-driven techniques.",
    long:
      "ABA Therapy (Applied Behavior Analysis) is an evidence-based approach that breaks complex skills into smaller, teachable steps. It is often used for individuals with autism to improve communication, social, and daily living skills while reducing behaviors that interfere with learning.",
  },
  speech: {
    label: "Speech Therapy",
    slug: "speech",
    short:
      "Improves speech, language, and communication skills through guided practice.",
    long:
      "Speech Therapy helps individuals develop clearer speech, stronger language comprehension, and improved communication. Therapists may work on articulation, fluency, voice, and social communication skills.",
  },
  ot: {
    label: "Occupational Therapy",
    slug: "occupational-therapy",
    short:
      "Builds fine-motor, sensory, and daily living skills for greater independence.",
    long:
      "Occupational Therapy (OT) supports individuals in developing motor coordination, self-care, sensory processing, and everyday functional skills—helping children and adults participate more fully in daily life.",
  },
  pt: {
    label: "Physical Therapy",
    slug: "physical-therapy",
    short:
      "Improves strength, balance, and coordination for better movement and mobility.",
    long:
      "Physical Therapy (PT) focuses on gross-motor development, posture, balance, and mobility. Therapists help individuals build physical strength and coordination for improved participation in play, school, and community activities.",
  },
  feeding: {
    label: "Feeding Therapy",
    slug: "feeding-therapy",
    short:
      "Helps children with feeding difficulties eat safely and comfortably.",
    long:
      "Feeding Therapy addresses challenges such as food aversions, texture sensitivities, and swallowing difficulties. Therapists guide gradual exposure and strengthen oral-motor coordination.",
  },
  music_therapy: {
    label: "Music Therapy",
    slug: "music-therapy",
    short:
      "Uses music and rhythm to enhance communication, emotional regulation, and motor skills.",
    long:
      "Music Therapy leverages rhythm, singing, and instrument play to promote communication, emotional expression, and cognitive or motor development in individuals with special needs.",
  },
  inpp: {
    label: "INPP (Neuromotor Maturity)",
    slug: "inpp",
    short:
      "The INPP method assesses and retrains retained primitive reflexes that affect learning and coordination.",
    long:
      "The INPP (Institute for Neuro-Physiological Psychology) program helps identify and integrate retained infant reflexes that may interfere with movement, balance, and learning, using specific physical exercises.",
  },
  dir_floortime: {
    label: "DIR / Floortime",
    slug: "dir-floortime",
    short:
      "A relationship-based therapy that builds emotional connection and communication through play.",
    long:
      "DIR/Floortime (Developmental, Individual-difference, Relationship-based) focuses on meeting a child at their developmental level and using play to foster communication, problem-solving, and social interaction.",
  },
  aac_speech: {
    label: "AAC / Speech Devices",
    slug: "aac-speech",
    short:
      "Teaches use of augmentative and alternative communication devices for non-verbal individuals.",
    long:
      "AAC (Augmentative and Alternative Communication) Therapy trains individuals to use devices or picture systems to express themselves, supporting those who are non-verbal or have limited speech.",
  },
};
