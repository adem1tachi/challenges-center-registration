-- ==============================================================================
-- Challenges Center - ENSSEA Training Program (24 & 25 November 2026)
-- Bulk Insert Script (English Edition) for Supabase SQL Editor
-- File: supabase/insert_enssea_courses_en.sql
-- ==============================================================================

-- Safe insertion: inserts courses only if they do not already exist by title
INSERT INTO courses (
    title,
    description,
    category,
    date,
    time,
    delivery_mode,
    location,
    max_seats,
    is_published,
    is_featured,
    instructor_name,
    instructor_title
)
SELECT * FROM (VALUES
    -- ==========================================================================
    -- Tuesday, 24 November 2026 - Online Masterclasses
    -- ==========================================================================
    (
        'De l’ambition à l’action : maîtriser son temps et atteindre ses objectifs',
        'This workshop aims to make time and priority management a vehicle for success by defining clear goals, organizing daily activities, managing priorities, and translating ambitions into concrete action steps.',
        'Soft Skills & Organisation',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        true,
        'Rasha AMRANI',
        'Trainer & Management Consultant'
    ),
    (
        'Je ne suis pas mon échec : apprendre à rebondir',
        'Fosters a constructive perspective on failure without tying it to personal self-worth, distinguishing facts from interpretations, extracting lessons from setbacks, identifying growth opportunities, and building resilience.',
        'Personal Development',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Bouchra AISSAOUI',
        'Trainer & Certified Coach'
    ),
    (
        'De l’université à l’entreprise : réussir ses premiers pas dans la vie professionnelle',
        'Prepares students for a seamless transition into professional life by understanding corporate expectations, integrating into workplace culture, and recognizing the critical role of human skills in career advancement.',
        'Career & Employability',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Tewfik METREF',
        'HR Expert & Career Advisor'
    ),
    (
        'Communiquer pour convaincre : s’exprimer avec impact et faire entendre ses idées',
        'Develops the ability to communicate with clarity, confidence, and influence through public speaking techniques, active listening, persuasive argumentation, idea structuring, and pitching in academic and professional settings.',
        'Communication & Pitch',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Rasha AMRANI',
        'Trainer & Management Consultant'
    ),
    (
        'Première impression et écoute active : les 3 réflexes qui changent tout',
        'Teaches participants how to create a positive first impression within the crucial first few minutes, understanding perceptual bias and mastering active listening reflexes.',
        'Communication & Soft Skills',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Yahia MOUHOUBI',
        'Trainer & Commercial Consultant'
    ),
    (
        'La vente, premier métier : transformer son diplôme en poste à impact',
        'Demystifies sales as a high-impact foundational career path, identifying transferable skills to commercial roles, and mastering the initial steps of business relationship building.',
        'Sales & Business Development',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Yahia MOUHOUBI',
        'Trainer & Commercial Consultant'
    ),
    (
        'Manager l’engagement : donner du sens, de la reconnaissance et de l’autonomie',
        'Helps managers transition teams from passive presence to genuine engagement and commitment by instilling meaning, recognizing contributions, fostering autonomy, and applying actionable leadership practices.',
        'Management & Leadership',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Mahfoud DORBHAN',
        'Management Consultant'
    ),
    (
        'Introduction à la monétique',
        'Introduces electronic payment systems (monétique), core technical and financial terminology, and explores their daily impact and near-future innovations in digital banking.',
        'FinTech & Banking',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Yasmine CHETTAH',
        'Electronic Payments Specialist'
    ),
    (
        'Sécurité au travail',
        'Raises awareness among organizational leaders on shifting from reactive accident management to building a proactive preventive culture centered on occupational health and safety.',
        'HSE & Workplace Safety',
        '2026-11-24'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Fella MALEK',
        'HSE Consultant & Corporate Trainer'
    ),

    -- ==========================================================================
    -- Tuesday, 24 November 2026 - In-Person Workshops
    -- ==========================================================================
    (
        'Trouver sa voie, définir sa réussite : entre aspirations personnelles et attentes des autres',
        'Assists participants in defining their personal concept of success, navigating external expectations, identifying aspirations, competencies, and potential, and mapping out aligned career goals.',
        'Personal Development',
        '2026-11-24'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Bouchra AISSAOUI',
        'Trainer & Certified Coach'
    ),
    (
        'L’apprentissage continu : les clés pour construire un parcours professionnel qui se démarque',
        'Encourages career reinvention and adaptability through multidisciplinary curiosity, lifelong learning, stepping outside comfort zones, and acquiring complementary high-value skills.',
        'Career & Lifelong Learning',
        '2026-11-24'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Mohamed Lotfi ALI RACHEDI',
        'Consultant & Professional Trainer'
    ),
    (
        'Self-branding express : se vendre sans se trahir',
        'Teaches self-presentation and asserting professional value authentically, identifying personal positioning and unique differentiators, and formulating a compelling personal pitch.',
        'Personal Branding',
        '2026-11-24'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Yahia MOUHOUBI',
        'Trainer & Commercial Consultant'
    ),
    (
        'Personal Branding : le marketing digital au service de votre avenir',
        'Leverages digital marketing strategies to build personal brand equity, elevate online presence and credibility, and substantially increase employability and career opportunities.',
        'Digital Marketing',
        '2026-11-24'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Amina ZIDOUNI',
        'Digital Marketing Specialist'
    ),
    (
        'Du déchet à la valeur, idée d’entrepreneuriat',
        'Demonstrates how waste can be converted into economic opportunities through entrepreneurship, innovation, and circular economy, featuring a field case study and workshop connecting statistics and data science to real-world impact.',
        'Entrepreneurship & Circular Economy',
        '2026-11-24'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        true,
        'Kahina HADJARA',
        'CSR Consultant & Corporate Trainer'
    ),

    -- ==========================================================================
    -- Wednesday, 25 November 2026 - Online Masterclasses
    -- ==========================================================================
    (
        'Soft skills et transformation',
        'Highlights the pivotal role of interpersonal and soft skills as essential drivers of employability and successful integration from university academia into corporate business.',
        'Soft Skills & Career Transition',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Lounes AZZOUZ',
        'Corporate Trainer & Consultant'
    ),
    (
        'Projet agile : le sprint gagnant',
        'Introduces Agile principles, mindset, and key practices, demonstrating how to effectively execute and manage projects calmly, dynamically, and collaboratively.',
        'Project Management & Agile',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        true,
        'Bahdja BOUKHEMIA',
        'Agile Coach & Scrum Master'
    ),
    (
        'Manager, c’est décider : comment transformer un problème en opportunité ?',
        'Explores structured problem-solving and decision-making frameworks to transform workplace challenges into opportunities for growth and optimization using practical toolkits.',
        'Management & Decision Making',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Khadîdja FEKHAR',
        'Management Consultant'
    ),
    (
        'Et si votre compétence devenait votre entreprise ? Entreprendre autrement dans l’artisanat algérien',
        'Uncovers entrepreneurial opportunities in Algerian artisanal sectors, identifying artisan market needs and delivering specialized consulting services in market research, cost control, data analysis, and commercial strategy.',
        'Entrepreneurship',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Amel GHEDDOUCHI',
        'Entrepreneurship Consultant'
    ),
    (
        'The Statistics contribution to project success and the role of business analysis/analyst',
        'Examines the contribution of statistical science to cross-sector project success, detailing the discipline of Business Analysis and the role of analysts in translating raw data into enterprise value.',
        'Data & Business Analysis',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        true,
        'Rabah RAHMI',
        'Senior Business Analyst'
    ),
    (
        'Les fondamentaux de la santé et sécurité au travail et l’esprit prévention en entreprise',
        'Covers fundamentals of occupational health and safety (OHS) as economic performance drivers, illustrating mutual responsibility between employers and staff to build preventive safety cultures.',
        'HSE & Prevention',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Ghani ARAB',
        'HSE Specialist'
    ),
    (
        'Réduire les accidents de travail en milieu industriel : les soft skills qui sauvent des vies',
        'Focuses on mitigating workplace and major industrial incidents through human behavior analysis and soft skills, cultivating daily safety habits across management and operational workforce.',
        'Industrial HSE & Human Factors',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Lounes AZZOUZ',
        'HSE & Human Factors Consultant'
    ),
    (
        'La première intervention incendie',
        'Teaches critical initial reflexes and first-response procedures during the incipient stage of a fire to prevent catastrophic outcomes in hazardous workplace environments.',
        'HSE & Fire Safety',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Karim MISSOUM',
        'Fire Safety & Prevention Expert'
    ),
    (
        'Face aux risques chimiques, comment lire une fiche de données de sécurité ?',
        'Guides attendees on managing chemical hazards by deciphering Safety Data Sheets (SDS), focusing on essential sections among the 16 standardized regulatory classifications.',
        'HSE & Chemical Safety',
        '2026-11-25'::date,
        'TBD',
        'online',
        'Online (Google Meet / Zoom)',
        100,
        true,
        false,
        'Karim MISSOUM',
        'Chemical Safety Specialist'
    ),

    -- ==========================================================================
    -- Wednesday, 25 November 2026 - In-Person Workshops
    -- ==========================================================================
    (
        'De l’université à l’entreprise : comment devenir un acteur de la performance dès son premier emploi ?',
        'Empowers newcomers to smoothly assimilate into organizations and actively drive corporate performance through foundational professional behaviors and continuous improvement principles.',
        'Performance & Career Insertion',
        '2026-11-25'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Khadîdja FEKHAR',
        'Management Consultant'
    ),
    (
        'Gestion et structuration d’un projet',
        'Teaches methodologies to convert ideas into actionable projects by analyzing requirements, setting realistic milestones, allocating resources, and drafting structured action plans.',
        'Project Management',
        '2026-11-25'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Samia NIA',
        'Project Manager & Corporate Trainer'
    ),
    (
        'Lancer sa startup en Algérie : statut, contrat et pièges à éviter',
        'Provides legal and strategic foundations to establish startups in Algeria, covering business legal forms, equity sharing, partnership contracts, Startup Label benefits, government grants, and pitfall avoidance.',
        'Startups & Legal Framework',
        '2026-11-25'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        true,
        'Zineb TRAD',
        'Attorney & Startup Legal Advisor'
    ),
    (
        'Du terrain aux données : transformer une situation professionnelle en problématique de mémoire',
        'Guides interns and students to convert workplace internship observations into structured research theses by moving from descriptive observation to problem formulation, data exploitation, and analytical reasoning.',
        'Research Methodology & Academic Thesis',
        '2026-11-25'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Amel GHEDDOUCHI',
        'University Lecturer & Researcher'
    ),
    (
        'DATA TO STORY : quand les chiffres prennent la parole',
        'Instructs participants on turning complex statistics and data points into strategic, impactful storytelling and executive narratives that drive organizational decision-making.',
        'Data Storytelling & Analytics',
        '2026-11-25'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        true,
        'Halim Lotfi KEBILENE',
        'Data Storytelling Consultant'
    ),

    -- ==========================================================================
    -- Complementary / Backup Workshops
    -- ==========================================================================
    (
        'Comprendre et utiliser son intelligence émotionnelle et s’en sortir dans un environnement toxique',
        'Explores emotional intelligence competencies and techniques to navigate challenging or toxic work environments constructively while maintaining mental wellbeing.',
        'Emotional Intelligence',
        '2026-11-24'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Kahina HADJARA',
        'CSR Consultant & Corporate Trainer'
    ),
    (
        'D’un accident vers une culture préventive',
        'Examines the transition from reactive accident handling to establishing an organizational culture of prevention dedicated to risk mitigation and proactive safety.',
        'HSE & Prevention',
        '2026-11-25'::date,
        'TBD',
        'in_person',
        'ENSSEA Higher National School - Kolea Campus',
        40,
        true,
        false,
        'Fella MALEK',
        'HSE Consultant & Corporate Trainer'
    )
) AS v(title, description, category, date, time, delivery_mode, location, max_seats, is_published, is_featured, instructor_name, instructor_title)
WHERE NOT EXISTS (
    SELECT 1 FROM courses WHERE courses.title = v.title
);
