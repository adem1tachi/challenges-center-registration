-- ==============================================================================
-- Migration: Add Google Meet links & updated schedule for Online Masterclasses
-- ENSSEA × Challenges Center — 24 & 25 November 2026
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Mardi 24 novembre 2026
-- ------------------------------------------------------------------------------

-- 18h00 – 19h00 — Les fondamentaux de la santé et sécurité au travail (Ghani Arab)
UPDATE courses
SET time = '18:00 - 19:00',
    meeting_url = 'https://meet.google.com/ffr-cohu-edk',
    updated_at = timezone('utc'::text, now())
WHERE id = '016ea8f0-0810-4aea-b274-009241262a13';

-- 18h00 – 19h00 — Je ne suis pas mon échec : apprendre à rebondir (Bouchra Aissaoui)
UPDATE courses
SET time = '18:00 - 19:00',
    meeting_url = 'https://meet.google.com/qpn-jkdz-egz',
    updated_at = timezone('utc'::text, now())
WHERE id = '350d9873-64ed-4683-bee6-68f37455b4ab';

-- 18h00 – 19h00 — De l'université à l'entreprise : performance (Khadîdja Fekhar)
UPDATE courses
SET time = '18:00 - 19:00',
    meeting_url = 'https://meet.google.com/eps-sqgv-uvn',
    updated_at = timezone('utc'::text, now())
WHERE id = '06ad49bd-ea9a-4853-ac64-292ebbf34d3f';

-- 19h00 – 20h00 — Face aux risques chimiques (Karim Missoum)
UPDATE courses
SET time = '19:00 - 20:00',
    meeting_url = 'https://meet.google.com/kws-trpr-cnr',
    updated_at = timezone('utc'::text, now())
WHERE id = 'f797de89-06d2-48f7-bd65-d828b6fe6c55';

-- 19h00 – 20h00 — Manager l'engagement (Mahfoud Dorbhan)
UPDATE courses
SET time = '19:00 - 20:00',
    meeting_url = 'https://meet.google.com/mge-segu-nqq',
    updated_at = timezone('utc'::text, now())
WHERE id = 'e7a8db1c-49d7-4ff0-a420-eb9c018bfef1';

-- 19h00 – 20h00 — Introduction à la monétique (Yasmine Chettah)
UPDATE courses
SET time = '19:00 - 20:00',
    meeting_url = 'https://meet.google.com/kvt-sogs-gfn',
    updated_at = timezone('utc'::text, now())
WHERE id = '210a5d94-3bf4-4731-9a3c-ca7d404ac784';

-- 20h30 – 21h30 — Intelligence émotionnelle (Kahina Hadjara)
UPDATE courses
SET time = '20:30 - 21:30',
    meeting_url = 'https://meet.google.com/yfo-xnsk-qia',
    updated_at = timezone('utc'::text, now())
WHERE id = '93a255d7-c559-4b69-8749-9ec150d364b6';

-- 20h30 – 21h30 — Entreprendre dans l'artisanat algérien (Amel Gheddouchi)
UPDATE courses
SET time = '20:30 - 21:30',
    meeting_url = 'https://meet.google.com/sqe-yona-vkm',
    updated_at = timezone('utc'::text, now())
WHERE id = 'ef9deb6a-7217-42c9-8cb7-e9682f8a39ac';

-- 20h30 – 21h30 — Première impression et écoute active (Yahia Mouhoubi)
UPDATE courses
SET time = '20:30 - 21:30',
    meeting_url = 'https://meet.google.com/jxq-occj-rjf',
    updated_at = timezone('utc'::text, now())
WHERE id = 'a67869c9-bc16-47d9-9de2-ecd46b2df7e1';

-- ------------------------------------------------------------------------------
-- Mercredi 25 novembre 2026
-- ------------------------------------------------------------------------------

-- 18h00 – 19h00 — De l'ambition à l'action (Rasha Amrani)
UPDATE courses
SET time = '18:00 - 19:00',
    meeting_url = 'https://meet.google.com/ffr-cohu-edk',
    updated_at = timezone('utc'::text, now())
WHERE id = '9803cf80-3c40-4f1c-a90d-4431a5099015';

-- 18h00 – 19h00 — Projet agile : le sprint gagnant (Bahdja Boukhemia)
UPDATE courses
SET time = '18:00 - 19:00',
    meeting_url = 'https://meet.google.com/qpn-jkdz-egz',
    updated_at = timezone('utc'::text, now())
WHERE id = 'ac4e50e0-2191-4373-8be7-72acd3ad1f4e';

-- 18h00 – 19h00 — Les Soft Skills, levier de l'employabilité (Lounes Azzouz)
UPDATE courses
SET title = 'Les Soft Skills, levier de l''employabilité',
    time = '18:00 - 19:00',
    meeting_url = 'https://meet.google.com/eps-sqgv-uvn',
    updated_at = timezone('utc'::text, now())
WHERE id = '54017035-0f13-4301-93b4-fa7ce9150750';

-- 19h00 – 20h00 — La vente, premier métier (Yahia Mouhoubi)
UPDATE courses
SET time = '19:00 - 20:00',
    meeting_url = 'https://meet.google.com/kws-trpr-cnr',
    updated_at = timezone('utc'::text, now())
WHERE id = 'a4c71340-9a96-4d01-85c6-c65fbc932106';

-- 19h00 – 20h00 — Manager, c'est décider (Khadîdja Fekhar)
UPDATE courses
SET time = '19:00 - 20:00',
    meeting_url = 'https://meet.google.com/mge-segu-nqq',
    updated_at = timezone('utc'::text, now())
WHERE id = 'd0b5ea3d-7425-40ea-890b-372a8814ebca';

-- 19h00 – 20h00 — Du drame à la prévention : le storytelling (Fella Malek)
UPDATE courses
SET title = 'Du drame à la prévention : le storytelling au service d''une culture préventive au travail',
    time = '19:00 - 20:00',
    meeting_url = 'https://meet.google.com/kvt-sogs-gfn',
    updated_at = timezone('utc'::text, now())
WHERE id = '7e0819a1-6b1f-4846-9f87-7b3554ecaf95';

-- 20h00 – 21h00 — Statistics & Business Analysis (Rabah Rahmi)
UPDATE courses
SET time = '20:00 - 21:00',
    meeting_url = 'https://meet.google.com/yfo-xnsk-qia',
    updated_at = timezone('utc'::text, now())
WHERE id = '26a88e16-54eb-4bea-9f6f-406335d56eda';

-- 20h00 – 21h00 — Réduire les accidents de travail (Lounes Azzouz)
UPDATE courses
SET time = '20:00 - 21:00',
    meeting_url = 'https://meet.google.com/sqe-yona-vkm',
    updated_at = timezone('utc'::text, now())
WHERE id = '9e5d2f6d-0b3f-42b3-a034-3cdcf5283bec';

-- 20h00 – 21h00 — La première intervention incendie (Karim Missoum)
UPDATE courses
SET time = '20:00 - 21:00',
    meeting_url = 'https://meet.google.com/jxq-occj-rjf',
    updated_at = timezone('utc'::text, now())
WHERE id = 'b6462a5c-198a-4fe4-9851-667ec43a25cb';
