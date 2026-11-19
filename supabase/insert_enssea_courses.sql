-- ==============================================================================
-- Challenges Center - ENSSEA Training Program (24 & 25 November 2026)
-- Bulk Insert Script (Arabic Edition) for Supabase SQL Editor
-- File: supabase/insert_enssea_courses.sql
-- ==============================================================================

-- 1. Ensure table and extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Workshop',
    date DATE NOT NULL,
    time TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('in_person', 'online')),
    location TEXT NOT NULL DEFAULT '',
    meeting_url TEXT,
    max_seats INTEGER NOT NULL CHECK (max_seats > 0),
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    instructor_name TEXT,
    instructor_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure unique constraint on title so the script can be re-run safely without duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_title_unique ON courses(title);

-- 2. Insert all 30 courses cleanly
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
) VALUES
    -- ==========================================================================
    -- الثلاثاء 24 نوفمبر 2026 - الدورات عبر الإنترنت (Online)
    -- ==========================================================================
    (
        'De l’ambition à l’action : maîtriser son temps et atteindre ses objectifs',
        'تهدف الدورة إلى جعل إدارة الوقت والأولويات وسيلة لتحقيق النجاح، من خلال تحديد أهداف واضحة، وتنظيم الأنشطة، وإدارة الأولويات، وتحويل الطموحات إلى خطوات عملية.',
        'Soft Skills & Organisation',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        true,
        'Rasha AMRANI',
        'Formatrice & Consultante'
    ),
    (
        'Je ne suis pas mon échec : apprendre à rebondir',
        'تهدف إلى تقديم نظرة بنّاءة تجاه الفشل دون ربطه بالقيمة الشخصية للفرد، من خلال التمييز بين الوقائع وتفسيراتها، واستخلاص الدروس من الصعوبات، وتحديد فرص التحسين، وتطوير القدرة على الصمود والمثابرة.',
        'Développement Personnel',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Bouchra AISSAOUI',
        'Formatrice & Coach'
    ),
    (
        'De l’université à l’entreprise : réussir ses premiers pas dans la vie professionnelle',
        'تهدف إلى تحضير الطلبة للاندماج في الحياة المهنية، من خلال فهم متطلبات المؤسسات، والنجاح في الاندماج داخل بيئة العمل، والتعرف على أهمية المهارات الإنسانية في بناء المسار المهني.',
        'Carrière & Insertion',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Tewfik METREF',
        'Expert RH & Accompagnateur'
    ),
    (
        'Communiquer pour convaincre : s’exprimer avec impact et faire entendre ses idées',
        'تهدف إلى تطوير القدرة على التواصل بوضوح وثقة وتأثير، من خلال تقنيات التحدث أمام الجمهور، والاستماع الفعّال، وبناء الحجج، وتنظيم الأفكار والدفاع عن وجهات النظر والإقناع في التفاعلات الجامعية والمهنية.',
        'Communication & Pitch',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Rasha AMRANI',
        'Formatrice & Consultante'
    ),
    (
        'Première impression et écoute active : les 3 réflexes qui changent tout',
        'تهدف إلى تعلم كيفية تكوين انطباع أول إيجابي منذ الدقائق الأولى، من خلال فهم تأثير الإدراك وممارسة الاستماع الفعّال.',
        'Communication & Soft Skills',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Yahia MOUHOUBI',
        'Formateur & Expert Commercial'
    ),
    (
        'La vente, premier métier : transformer son diplôme en poste à impact',
        'تهدف إلى إزالة التصورات الخاطئة حول البيع باعتباره مساراً مهنياً أولياً، والتعرف على المهارات القابلة للتحويل إلى المجال التجاري، وكيفية النجاح في الخطوات الأولى للعلاقات التجارية.',
        'Vente & Commerce',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Yahia MOUHOUBI',
        'Formateur & Expert Commercial'
    ),
    (
        'Manager l’engagement : donner du sens, de la reconnaissance et de l’autonomie',
        'تهدف إلى مساعدة المديرين على الانتقال بفرق العمل من مجرد الحضور إلى المشاركة والالتزام الفعلي، من خلال إعطاء معنى للعمل، وتقدير مساهمات الأفراد، وتعزيز الاستقلالية، مع تقديم إجراءات عملية قابلة للتطبيق.',
        'Management & Leadership',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Mahfoud DORBHAN',
        'Consultant Management'
    ),
    (
        'Introduction à la monétique',
        'تهدف إلى التعريف بنظام المدفوعات الإلكترونية (Monétique)، والتعرف على المصطلحات الأساسية المرتبطة به، وفهم تأثيره في الحياة اليومية ومستقبله القريب.',
        'Fintech & Finance',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Yasmine CHETTAH',
        'Spécialiste Monétique'
    ),
    (
        'Sécurité au travail',
        'تهدف إلى توعية مسؤولي المؤسسات بأهمية الانتقال من التعامل مع الحوادث بعد وقوعها إلى بناء ثقافة وقائية تركز على السلامة في بيئة العمل.',
        'HSE & Prévention',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Fella MALEK',
        'Formatrice & Consultante HSE'
    ),

    -- ==========================================================================
    -- الثلاثاء 24 نوفمبر 2026 - الدورات الحضورية (In-person)
    -- ==========================================================================
    (
        'Trouver sa voie, définir sa réussite : entre aspirations personnelles et attentes des autres',
        'تهدف إلى مساعدة المشاركين على تحديد مفهومهم الشخصي للنجاح، وفهم تأثير توقعات الآخرين على اختياراتهم، والتعرف على تطلعاتهم ومهاراتهم وإمكاناتهم، وبناء مسار شخصي ومهني يتناسب مع أهدافهم.',
        'Développement Personnel',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Bouchra AISSAOUI',
        'Formatrice & Coach'
    ),
    (
        'L’apprentissage continu : les clés pour construire un parcours professionnel qui se démarque',
        'تهدف إلى إعادة التفكير في المسار المهني وتطوير القدرة على التكيف واغتنام الفرص، من خلال تعدد التخصصات، والفضول الفكري، والتعلم المستمر، والخروج من منطقة الراحة، واكتساب مهارات تكميلية.',
        'Carrière & Compétences',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Mohamed Lotfi ALI RACHEDI',
        'Consultant & Formateur'
    ),
    (
        'Self-branding express : se vendre sans se trahir',
        'تهدف إلى تعلم كيفية تقديم الذات والتعريف بالقيمة المهنية دون التخلي عن الهوية الشخصية، من خلال تحديد التموضع الشخصي، واكتشاف عناصر التميز، وصياغة عرض شخصي موجز ومؤثر (Personal Pitch).',
        'Personal Branding',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Yahia MOUHOUBI',
        'Formateur & Expert Commercial'
    ),
    (
        'Personal Branding : le marketing digital au service de votre avenir',
        'تهدف إلى توظيف التسويق الرقمي لبناء العلامة الشخصية، وتعزيز الظهور والمصداقية عبر الإنترنت، وتحسين فرص المشاركين المهنية وجعلهم أكثر قابلية للتوظيف.',
        'Marketing Digital',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Amina ZIDOUNI',
        'Experte Marketing Digital'
    ),
    (
        'Du déchet à la valeur, idée d’entrepreneuriat',
        'تهدف إلى توضيح كيفية تحويل النفايات إلى فرص اقتصادية من خلال ريادة الأعمال والابتكار والاقتصاد الدائري، مع عرض تجربة ميدانية ودراسة حالة رقمية وورشة مصغرة تربط مهارات الإحصاء والاقتصاد وعلوم البيانات بمشكلات واقعية.',
        'Entrepreneuriat & Écologie',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        true,
        'Kahina HADJARA',
        'Formatrice & Consultante RSE'
    ),

    -- ==========================================================================
    -- الأربعاء 25 نوفمبر 2026 - الدورات عبر الإنترنت (Online)
    -- ==========================================================================
    (
        'Soft skills et transformation',
        'تهدف إلى فهم دور المهارات الشخصية (Soft Skills) باعتبارها عاملاً أساسياً في تعزيز قابلية التوظيف، والانتقال بنجاح من البيئة الجامعية إلى عالم المؤسسات.',
        'Soft Skills',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Lounes AZZOUZ',
        'Formateur & Consultant'
    ),
    (
        'Projet agile : le sprint gagnant',
        'تهدف إلى التعرف على العقلية والمنهجية المرنة (Agile) وممارساتها الأساسية، وكيفية توظيفها لإدارة المشاريع بفعالية وهدوء.',
        'Gestion de Projet & Agile',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        true,
        'Bahdja BOUKHEMIA',
        'Agile Coach & Scrum Master'
    ),
    (
        'Manager, c’est décider : comment transformer un problème en opportunité ?',
        'تهدف إلى التعرف على تقنيات حل المشكلات واتخاذ القرارات، وتحويل الصعوبات والتحديات إلى فرص للتحسين والتطوير، بالاعتماد على أمثلة وأدوات عملية.',
        'Management & Décision',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Khadîdja FEKHAR',
        'Consultante en Management'
    ),
    (
        'Et si votre compétence devenait votre entreprise ? Entreprendre autrement dans l’artisanat algérien',
        'تهدف إلى اكتشاف الفرص الريادية في قطاع الصناعة التقليدية الجزائرية، وفهم احتياجات الحرفيين وتحديد فرص الأعمال، مع التعرف على الخدمات الممكن تقديمها مثل دراسات السوق وتحليل الطلب وإدارة التكاليف والاستراتيجيات التجارية والاستشارات، وتوظيف مهارات الإحصاء والاقتصاد وتحليل البيانات.',
        'Entrepreneuriat',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Amel GHEDDOUCHI',
        'Consultante en Entrepreneuriat'
    ),
    (
        'The Statistics contribution to project success and the role of business analysis/analyst',
        'تهدف إلى التعريف بمساهمة الإحصاء في نجاح المشاريع بمختلف القطاعات، وفهم دور تحليل الأعمال (Business Analysis)، والتعرف على دور محلل الأعمال (Business Analyst) في تحويل البيانات الخام إلى قيمة مضافة للمؤسسات.',
        'Data & Business Analysis',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        true,
        'Rabah RAHMI',
        'Senior Business Analyst'
    ),
    (
        'Les fondamentaux de la santé et sécurité au travail et l’esprit prévention en entreprise',
        'تهدف إلى فهم أساسيات الصحة والسلامة المهنية، والنظر إلى السلامة باعتبارها عاملاً من عوامل الأداء الاقتصادي، مع توضيح المسؤولية المشتركة بين صاحب العمل والموظفين وأهمية ترسيخ ثقافة الوقاية داخل المؤسسة.',
        'HSE & Prévention',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Ghani ARAB',
        'Expert HSE'
    ),
    (
        'Réduire les accidents de travail en milieu industriel : les soft skills qui sauvent des vies',
        'تهدف إلى الحد من حوادث العمل والحوادث الكبرى في البيئة الصناعية، مع التركيز على دور السلوك البشري والمهارات الشخصية في الوقاية، وتحسين ثقافة السلامة الصناعية من خلال ممارسات يومية لدى المسؤولين والموظفين.',
        'HSE & Industrie',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Lounes AZZOUZ',
        'Consultant HSE & Facteurs Humains'
    ),
    (
        'La première intervention incendie',
        'تهدف إلى تعلم كيفية التصرف عند بداية نشوب حريق، والتعرف على ردود الفعل الأولية وطرق التدخل والإجراءات الأولى التي تساعد على تجنب الكوارث في بيئات العمل الخطرة.',
        'HSE & Sécurité Incendie',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Karim MISSOUM',
        'Expert Prévention Incendie'
    ),
    (
        'Face aux risques chimiques, comment lire une fiche de données de sécurité ?',
        'تهدف إلى تعلم كيفية التعامل مع المخاطر الكيميائية من خلال فهم وقراءة صحيفة بيانات السلامة (Safety Data Sheet)، والتعرف على أهم الأقسام التي يجب الاطلاع عليها من بين أقسامها الستة عشر.',
        'HSE & Risques Chimiques',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'online',
        'عبر الإنترنت (Google Meet / Zoom)',
        100,
        true,
        false,
        'Karim MISSOUM',
        'Spécialiste Risques Chimiques'
    ),

    -- ==========================================================================
    -- الأربعاء 25 نوفمبر 2026 - الدورات الحضورية (In-person)
    -- ==========================================================================
    (
        'De l’université à l’entreprise : comment devenir un acteur de la performance dès son premier emploi ?',
        'تهدف إلى مساعدة المشاركين على النجاح في الاندماج داخل المؤسسات والمساهمة الفعلية في تحسين أدائها، من خلال اكتساب المهارات والسلوكيات المهنية الأساسية وفهم مبادئ التحسين المستمر.',
        'Performance & Insertion',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Khadîdja FEKHAR',
        'Consultante en Management'
    ),
    (
        'Gestion et structuration d’un projet',
        'تهدف إلى تعلم كيفية تحويل فكرة إلى مشروع قابل للتنفيذ، من خلال تحليل الاحتياجات، وتحديد الأهداف، وتنظيم الموارد، وإعداد خطة عمل واضحة.',
        'Gestion de Projet',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Samia NIA',
        'Chef de Projet & Formatrice'
    ),
    (
        'Lancer sa startup en Algérie : statut, contrat et pièges à éviter',
        'تهدف إلى اكتساب الأساسيات القانونية اللازمة لتحويل فكرة إلى مؤسسة، من خلال اختيار الشكل القانوني المناسب، وتوزيع رأس المال بين الشركاء، وتأمين العلاقات مع الشركاء من خلال العقود، والتعرف على مزايا علامة Startup والمساعدات الحكومية الفعلية والمخاطر التي يجب تجنبها.',
        'Startup & Cadre Légal',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        true,
        'Zineb TRAD',
        'Avocate & Conseillère Juridique Startups'
    ),
    (
        'Du terrain aux données : transformer une situation professionnelle en problématique de mémoire',
        'تهدف إلى توظيف تجارب التدريب والملاحظات الميدانية في إعداد مذكرة أو تقرير تربص منظم وتحليلي، من خلال الانتقال من مجرد وصف التجربة إلى تحليلها، وتحديد المشكلات والاحتياجات، وجمع المعلومات واستغلالها، وصياغة إشكالية وبناء تفكير متماسك.',
        'Méthodologie & Recherche',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Amel GHEDDOUCHI',
        'Enseignante & Chercheuse'
    ),
    (
        'DATA TO STORY : quand les chiffres prennent la parole',
        'تهدف إلى تعلم كيفية تحويل البيانات والأرقام الإحصائية إلى وسيلة للتواصل الاستراتيجي والتأثير، والانتقال من الإحصاء إلى تقديم المعلومات بطريقة تخدم أهداف المؤسسة.',
        'Data Storytelling',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        true,
        'Halim Lotfi KEBILENE',
        'Data Storyteller & Consultant'
    ),

    -- ==========================================================================
    -- ملاحق: التكوينات التكميلية (Complémentaires / Backup)
    -- ==========================================================================
    (
        'Comprendre et utiliser son intelligence émotionnelle et s’en sortir dans un environnement toxique',
        'التعرف على الذكاء العاطفي وكيفية استخدامه للتعامل مع بيئة غير صحية أو سامة.',
        'Intelligence Émotionnelle',
        '2026-11-24'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Kahina HADJARA',
        'Formatrice & Consultante RSE'
    ),
    (
        'D’un accident vers une culture préventive',
        'الانتقال من التعامل مع الحوادث بعد وقوعها إلى بناء ثقافة وقائية تهدف إلى الحد من المخاطر وتعزيز السلامة.',
        'HSE & Prévention',
        '2026-11-25'::date,
        'يحدد لاحقاً',
        'in_person',
        'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA) - القليعة',
        40,
        true,
        false,
        'Fella MALEK',
        'Formatrice & Consultante HSE'
    )
ON CONFLICT (title) DO NOTHING;
