// ════════════════════════════════════════════════════════════════════════════
// PROGRAMMES THÉRAPEUTIQUES DURAMEN
// Conçus selon les approches validées en sexologie clinique et TCC :
// - Techniques comportementales : stop-start (Semans), squeeze (Masters & Johnson)
// - Rééducation du plancher pelvien (Kegel)
// - Pleine conscience interoceptive & échelle d'excitation
// - Restructuration cognitive (TCC) pour l'anxiété de performance
// - Sensate focus (Masters & Johnson) pour le couple
// - Reconditionnement progressif (profil conditionné)
// ════════════════════════════════════════════════════════════════════════════

// ─── BIBLIOTHÈQUE D'EXERCICES ─────────────────────────────────────────────────
// Chaque exercice est réutilisable dans plusieurs programmes.
export const EXERCISE_LIBRARY = {

  // ── Respiration & régulation ──────────────────────────────────────────────
  breathing: {
    id: 'breathing', emoji: '🌬️', title: 'Respiration diaphragmatique',
    subtitle: 'Régulation du système nerveux', duration: '8 min', xp: 10,
    steps: [
      { text: 'Allonge-toi sur le dos, une main sur le ventre, une sur la poitrine.', duration: 15 },
      { text: 'Inspire lentement par le nez pendant 4 secondes. Seule la main sur le ventre se lève.', duration: 4 },
      { text: 'Retiens doucement pendant 2 secondes.', duration: 2 },
      { text: 'Expire par la bouche pendant 6 secondes. Sens ton ventre descendre.', duration: 6 },
      { text: 'Répète ce cycle 10 fois en restant concentré sur la sensation de l\'air.', duration: 120 },
    ],
    note: 'La respiration diaphragmatique active le système nerveux parasympathique. Elle abaisse directement le niveau d\'excitation physiologique et constitue ton premier outil de contrôle.',
  },

  breathing_478: {
    id: 'breathing_478', emoji: '🫁', title: 'Respiration 4-7-8',
    subtitle: 'Ancrage anti-anxiété', duration: '6 min', xp: 10,
    steps: [
      { text: 'Assieds-toi confortablement, dos droit. Pose la pointe de la langue derrière les dents du haut.', duration: 15 },
      { text: 'Inspire par le nez pendant 4 secondes.', duration: 4 },
      { text: 'Retiens ta respiration pendant 7 secondes.', duration: 7 },
      { text: 'Expire complètement par la bouche pendant 8 secondes.', duration: 8 },
      { text: 'Répète ce cycle 6 fois. Observe comment ton corps se calme.', duration: 120 },
    ],
    note: 'La respiration 4-7-8 est un outil puissant contre l\'anxiété de performance. Pratiquée avant un rapport, elle réduit l\'emballement physiologique lié au stress.',
  },

  // ── Conscience corporelle ─────────────────────────────────────────────────
  body_scan: {
    id: 'body_scan', emoji: '🧘', title: 'Scan corporel',
    subtitle: 'Pleine conscience des sensations', duration: '12 min', xp: 10,
    steps: [
      { text: 'Allonge-toi, ferme les yeux, fais quelques respirations profondes.', duration: 20 },
      { text: 'Porte ton attention sur tes pieds. Observe les sensations sans jugement.', duration: 40 },
      { text: 'Remonte lentement : mollets, cuisses, bassin. Remarque chaque sensation.', duration: 60 },
      { text: 'Concentre-toi sur le bas-ventre et le périnée. Tendu ou détendu ?', duration: 60 },
      { text: 'Continue vers le ventre, la poitrine, les épaules. Relâche les tensions.', duration: 60 },
      { text: 'Termine sur le visage. Ouvre les yeux doucement.', duration: 30 },
    ],
    note: 'La conscience corporelle est la fondation du contrôle. Reconnaître les sensations d\'excitation avant qu\'elles deviennent incontrôlables est la clé de toute la méthode.',
  },

  arousal_scale: {
    id: 'arousal_scale', emoji: '📊', title: 'L\'échelle d\'excitation',
    subtitle: 'Cartographier ton point de non-retour', duration: '10 min', xp: 15,
    steps: [
      { text: 'Cet exercice t\'apprend à mesurer ton excitation sur une échelle de 0 (aucune) à 10 (orgasme). Le but : identifier ton "point de non-retour", généralement vers 8-9.', duration: 20 },
      { text: 'Commence une stimulation lente et solitaire. Nomme mentalement ton niveau : 1... 2... 3...', duration: 60 },
      { text: 'Continue doucement. À chaque palier, demande-toi : "Où suis-je sur l\'échelle ?"', duration: 90 },
      { text: 'Quand tu atteins 6/10, ralentis. Observe précisément ce que ressent ton corps à ce niveau.', duration: 60 },
      { text: 'Monte prudemment vers 7. C\'est la zone critique à apprendre à reconnaître. Mémorise ces sensations.', duration: 60 },
      { text: 'Arrête-toi à 7. Laisse redescendre. Tu viens d\'apprendre à lire ton corps — c\'est une compétence fondamentale.', duration: 30 },
    ],
    note: 'Les hommes souffrant d\'EP perçoivent mal leur montée d\'excitation. Apprendre à la graduer de 0 à 10 permet d\'anticiper et d\'agir AVANT le point de non-retour.',
  },

  body_reconnect: {
    id: 'body_reconnect', emoji: '🤲', title: 'Reconnexion corps entier',
    subtitle: 'Pleine conscience corporelle', duration: '12 min', xp: 10,
    steps: [
      { text: 'Allonge-toi confortablement. Ferme les yeux. Fais 3 respirations profondes.', duration: 30 },
      { text: 'Porte ton attention sur tes mains. Sens leur température, leur poids.', duration: 30 },
      { text: 'Remonte vers les bras, les épaules, le cou. Relâche les tensions trouvées.', duration: 40 },
      { text: 'Porte attention au bas-ventre et au périnée. Tendu ou détendu ?', duration: 40 },
      { text: 'Sens-tu une connexion entre cette zone et le reste du corps, ou semble-t-elle isolée ?', duration: 30 },
      { text: 'Fais 5 respirations en imaginant envoyer l\'air vers le bas-ventre.', duration: 60 },
      { text: 'Ouvre les yeux doucement. Cette reconnexion est la base de tout.', duration: 20 },
    ],
    note: 'Les hommes avec EP conditionnée ont souvent une dissociation entre la zone génitale et le reste du corps. Cet exercice rétablit la connexion neurologique nécessaire au contrôle.',
  },

  // ── Plancher pelvien ──────────────────────────────────────────────────────
  kegel_basic: {
    id: 'kegel_basic', emoji: '💪', title: 'Kegel — Niveau débutant',
    subtitle: 'Renforcement du plancher pelvien', duration: '10 min', xp: 10,
    steps: [
      { text: 'Identifie ton muscle PC : c\'est celui qui arrête le jet d\'urine. Repère-le sans contracter les fesses ni le ventre.', duration: 20 },
      { text: 'Contracte ce muscle pendant 3 secondes.', duration: 3 },
      { text: 'Relâche complètement pendant 3 secondes. Le relâchement est aussi important que la contraction.', duration: 3 },
      { text: 'Répète 10 fois, puis repose 30 secondes.', duration: 90 },
      { text: 'Fais 2 séries supplémentaires avec 30 secondes de repos entre chaque.', duration: 180 },
    ],
    note: 'Un plancher pelvien tonique améliore significativement le contrôle éjaculatoire (preuves cliniques solides). La régularité quotidienne prime sur l\'intensité.',
  },

  kegel_advanced: {
    id: 'kegel_advanced', emoji: '⚡', title: 'Kegel — Niveau avancé',
    subtitle: 'Force et endurance musculaire', duration: '12 min', xp: 15,
    steps: [
      { text: 'Série 1 — Contractions lentes : contracte 5 s, relâche 5 s. 10 répétitions.', duration: 100 },
      { text: 'Repos 30 secondes.', duration: 30 },
      { text: 'Série 2 — Contractions rapides : contracte et relâche vite. 20 répétitions.', duration: 40 },
      { text: 'Repos 30 secondes.', duration: 30 },
      { text: 'Série 3 — Maintien long : contracte et tiens 10 secondes. 5 répétitions.', duration: 75 },
      { text: 'Apprends à contracter brièvement ce muscle juste avant le point de non-retour : c\'est un frein d\'urgence.', duration: 20 },
    ],
    note: 'Combiner contractions lentes, rapides et maintien développe force ET endurance. Une contraction volontaire au bon moment peut retarder l\'éjaculation.',
  },

  // ── Techniques comportementales ───────────────────────────────────────────
  stop_start: {
    id: 'stop_start', emoji: '⏸️', title: 'Technique Stop-Start',
    subtitle: 'Contrôle de l\'excitation', duration: '15 min', xp: 15,
    steps: [
      { text: 'Commence une stimulation solitaire à ton rythme.', duration: 15 },
      { text: 'Augmente lentement l\'intensité en suivant ton excitation sur l\'échelle de 1 à 10.', duration: 30 },
      { text: 'Arrivé à 7/10, STOP. Arrête toute stimulation.', duration: 5 },
      { text: 'Respire profondément. Attends que ton niveau redescende à 4/10. Prends le temps nécessaire.', duration: 30 },
      { text: 'Reprends. Répète ce cycle stop-start 3 fois.', duration: 300 },
      { text: 'À la dernière reprise, laisse-toi aller si tu le souhaites. Observe la différence de contrôle.', duration: 30 },
    ],
    note: 'La technique stop-start (Semans) entraîne ton système nerveux à reconnaître et tolérer une excitation élevée sans déclencher l\'éjaculation. 4 à 8 semaines de pratique régulière donnent des résultats nets.',
  },

  squeeze: {
    id: 'squeeze', emoji: '🤏', title: 'Technique du Squeeze',
    subtitle: 'Maîtrise avancée', duration: '15 min', xp: 20,
    steps: [
      { text: 'Stimule-toi jusqu\'à approcher le point de non-retour (8/10).', duration: 60 },
      { text: 'Juste avant, presse fermement le gland entre pouce et deux doigts, à la base du gland, pendant 5 à 10 secondes.', duration: 10 },
      { text: 'La pression fait légèrement baisser l\'excitation et l\'érection. C\'est normal et recherché.', duration: 15 },
      { text: 'Attends 30 secondes, puis reprends la stimulation.', duration: 30 },
      { text: 'Répète le cycle 3 à 4 fois avant de t\'autoriser à finir.', duration: 240 },
      { text: 'Cette technique te donne un outil concret et immédiat de reprise de contrôle.', duration: 20 },
    ],
    note: 'Le squeeze (Masters & Johnson) interrompt mécaniquement le réflexe éjaculatoire. C\'est un outil de secours puissant, à maîtriser seul avant de l\'intégrer au rapport.',
  },

  edging: {
    id: 'edging', emoji: '🌊', title: 'Edging progressif',
    subtitle: 'Endurance et tolérance', duration: '18 min', xp: 20,
    steps: [
      { text: 'L\'objectif : rester le plus longtemps possible dans la zone 7-8/10 sans basculer.', duration: 20 },
      { text: 'Monte ton excitation jusqu\'à 7/10.', duration: 60 },
      { text: 'Maintiens-toi à ce niveau en modulant l\'intensité — ralentis quand tu montes, reprends quand tu descends.', duration: 300 },
      { text: 'Reste dans cette zone "plateau" pendant 10 minutes. C\'est exigeant : c\'est exactement l\'entraînement recherché.', duration: 300 },
      { text: 'Termine quand tu le décides, en contrôle. Note combien de temps tu as tenu.', duration: 30 },
    ],
    note: 'L\'edging prolonge le temps passé en excitation élevée et augmente progressivement ton seuil. C\'est l\'étape qui consolide le contrôle acquis avec le stop-start.',
  },

  // ── TCC : cognition & anxiété ─────────────────────────────────────────────
  thought_log: {
    id: 'thought_log', emoji: '📝', title: 'Identifier les pensées',
    subtitle: 'TCC — Repérage cognitif', duration: '8 min', xp: 10,
    steps: [
      { text: 'Repense à un rapport récent où tu as éjaculé trop vite. Sans te juger.', duration: 30 },
      { text: 'Quelles pensées t\'ont traversé AVANT et PENDANT ? Par exemple : "Je vais encore rater", "Elle va être déçue", "Il faut que je tienne".', duration: 45 },
      { text: 'Note mentalement ces pensées. Ce sont des "pensées automatiques" — souvent catastrophistes et anticipatoires.', duration: 30 },
      { text: 'Observe : ces pensées augmentent ton stress, donc ton excitation, donc le risque même que tu redoutes. C\'est un cercle vicieux.', duration: 30 },
      { text: 'Reconnaître ce mécanisme est la première étape pour le désamorcer. Tu y reviendras dans les exercices suivants.', duration: 20 },
    ],
    note: 'En TCC, l\'EP psychogène est entretenue par des pensées automatiques anxieuses. Les identifier clairement permet ensuite de les remettre en question.',
  },

  cognitive_restructuring: {
    id: 'cognitive_restructuring', emoji: '🧠', title: 'Recadrer les pensées',
    subtitle: 'TCC — Restructuration cognitive', duration: '10 min', xp: 15,
    steps: [
      { text: 'Reprends une pensée automatique identifiée précédemment, par exemple : "Je vais forcément rater".', duration: 30 },
      { text: 'Interroge-la : est-ce un fait ou une peur ? Quelle preuve réelle ai-je ? Est-ce vrai à 100 % des fois ?', duration: 45 },
      { text: 'Formule une pensée alternative, réaliste et apaisante : "Je progresse. Un rapport n\'est pas un examen. Mon plaisir et celui de ma partenaire ne dépendent pas que de la durée."', duration: 45 },
      { text: 'Répète cette nouvelle pensée. Ressens la différence dans ton corps : moins de tension.', duration: 30 },
      { text: 'Choisis UNE phrase-ancre à te répéter avant tes prochains rapports.', duration: 30 },
    ],
    note: 'Remplacer les pensées catastrophistes par des pensées réalistes réduit l\'anxiété de performance, et donc l\'hyperexcitation qu\'elle provoque. C\'est le cœur de la TCC.',
  },

  mindfulness_sensations: {
    id: 'mindfulness_sensations', emoji: '🎯', title: 'Ancrage dans les sensations',
    subtitle: 'Pleine conscience anti-spectateur', duration: '12 min', xp: 15,
    steps: [
      { text: 'Le "spectatoring" — s\'observer de l\'extérieur en se jugeant — est l\'ennemi n°1 de l\'anxieux. Cet exercice t\'apprend à rester DANS tes sensations.', duration: 30 },
      { text: 'Commence une stimulation lente. Au lieu de penser, décris mentalement les sensations physiques pures : chaleur, contact, pression.', duration: 90 },
      { text: 'Dès que ton mental s\'emballe ("ça va trop vite", "je dois tenir"), reviens doucement à la sensation physique. Sans te juger.', duration: 90 },
      { text: 'Fais des allers-retours : quand tu remarques que tu penses, reviens au corps. C\'est l\'entraînement.', duration: 120 },
      { text: 'Termine en restant présent. Tu viens de muscler ton attention — la compétence qui désamorce l\'anxiété.', duration: 30 },
    ],
    note: 'La pleine conscience réduit le spectatoring et ramène l\'attention sur le plaisir réel plutôt que sur la peur de l\'échec. Très efficace sur l\'EP liée à l\'anxiété.',
  },

  visualization: {
    id: 'visualization', emoji: '🌅', title: 'Visualisation positive',
    subtitle: 'Exposition imaginée', duration: '10 min', xp: 15,
    steps: [
      { text: 'Installe-toi au calme, yeux fermés, après quelques respirations lentes.', duration: 30 },
      { text: 'Imagine un rapport qui se déroule bien : tu es détendu, présent, en contrôle. Visualise les détails.', duration: 90 },
      { text: 'Si une image d\'échec surgit, ne lutte pas : remplace-la calmement par l\'image positive.', duration: 60 },
      { text: 'Associe cette scène à une sensation de calme dans ton corps. Respire lentement.', duration: 60 },
      { text: 'Répète cette visualisation régulièrement. Ton cerveau apprend à associer l\'intimité à la sérénité plutôt qu\'au stress.', duration: 30 },
    ],
    note: 'L\'exposition imaginée réduit l\'anxiété anticipatoire. En répétant mentalement des scénarios maîtrisés, tu reconditionnes ta réponse émotionnelle à l\'intimité.',
  },

  // ── Situationnel : déclencheurs & relâchement ─────────────────────────────
  trigger_journal: {
    id: 'trigger_journal', emoji: '🔍', title: 'Journal des déclencheurs',
    subtitle: 'Cartographier les situations', duration: '8 min', xp: 10,
    steps: [
      { text: 'Ton EP est variable : elle dépend du contexte. L\'objectif est de comprendre QUAND elle se manifeste.', duration: 30 },
      { text: 'Repense aux situations où ça arrive le plus : nouvelle partenaire ? fatigue ? stress ? après une longue abstinence ? alcool ?', duration: 60 },
      { text: 'Repère maintenant les situations où ça va MIEUX. Qu\'est-ce qui change ? (détente, confiance, familiarité...)', duration: 60 },
      { text: 'Identifie ton principal déclencheur. C\'est lui que tu vas apprendre à désamorcer.', duration: 40 },
      { text: 'Comprendre que ton corps fonctionne bien dans certains contextes prouve que le problème est modulable — donc traitable.', duration: 30 },
    ],
    note: 'L\'EP situationnelle révèle que le réflexe n\'est pas "câblé" mais déclenché par des facteurs identifiables. Les cibler permet une progression rapide.',
  },

  pmr_jacobson: {
    id: 'pmr_jacobson', emoji: '🌿', title: 'Relaxation musculaire',
    subtitle: 'Méthode de Jacobson', duration: '12 min', xp: 10,
    steps: [
      { text: 'Allonge-toi. Cette technique consiste à contracter puis relâcher chaque groupe musculaire pour atteindre une détente profonde.', duration: 30 },
      { text: 'Contracte les poings et les bras 5 s, puis relâche d\'un coup. Sens la détente.', duration: 30 },
      { text: 'Contracte le visage et les épaules 5 s, relâche.', duration: 30 },
      { text: 'Contracte le ventre et les fesses 5 s, relâche.', duration: 30 },
      { text: 'Contracte les jambes et les pieds 5 s, relâche.', duration: 30 },
      { text: 'Reste immobile 2 minutes, savoure la détente globale de ton corps.', duration: 120 },
    ],
    note: 'La relaxation progressive abaisse le niveau de tension et de stress — facteurs majeurs de l\'EP situationnelle. Un corps détendu retarde naturellement l\'éjaculation.',
  },

  communication: {
    id: 'communication', emoji: '💬', title: 'Communiquer avec ta partenaire',
    subtitle: 'Désamorcer la pression', duration: '8 min', xp: 15,
    steps: [
      { text: 'Le silence et la peur du jugement amplifient l\'EP. En parler la désamorce. Cet exercice prépare cette conversation.', duration: 30 },
      { text: 'Choisis un moment calme, hors du lit. Formule l\'idée : "Je travaille sur quelque chose pour qu\'on profite mieux de nos moments ensemble."', duration: 45 },
      { text: 'Tu n\'as pas à tout détailler. L\'essentiel : transformer un sujet honteux en projet partagé.', duration: 30 },
      { text: 'Propose-lui des moments d\'intimité SANS objectif de performance (voir l\'exercice Sensate Focus). Cela retire la pression.', duration: 45 },
      { text: 'Une partenaire informée et impliquée devient une alliée, pas une juge. C\'est un levier de progression majeur.', duration: 30 },
    ],
    note: 'En thérapie de couple, ouvrir le dialogue réduit drastiquement l\'anxiété de performance. La complicité remplace la peur du regard de l\'autre.',
  },

  sensate_focus: {
    id: 'sensate_focus', emoji: '🤝', title: 'Sensate Focus',
    subtitle: 'Intimité sans performance', duration: '20 min', xp: 20,
    steps: [
      { text: 'Le Sensate Focus (Masters & Johnson) est l\'exercice de couple de référence. Règle d\'or : AUCUN objectif de pénétration ni d\'orgasme.', duration: 30 },
      { text: 'Étape 1 — À tour de rôle, caressez-vous le corps en évitant les zones génitales. Celui qui reçoit se concentre uniquement sur les sensations.', duration: 300 },
      { text: 'Aucune pression de "réussir". Le seul but est de redécouvrir le plaisir du toucher, sans enjeu.', duration: 60 },
      { text: 'Étape 2 (séances suivantes) — Inclure progressivement les zones génitales, toujours sans objectif de performance.', duration: 300 },
      { text: 'Communiquez ce qui est agréable. Reconnectez-vous au plaisir partagé plutôt qu\'à la performance.', duration: 120 },
      { text: 'Termine sans pression de "conclure". L\'intimité retrouvée fait baisser l\'anxiété — et paradoxalement, améliore le contrôle.', duration: 30 },
    ],
    note: 'Le Sensate Focus retire la pression de performance, cause majeure d\'EP. En dissociant intimité et "réussite", il restaure une sexualité sereine et un meilleur contrôle.',
  },

  // ── Conditionné : reconditionnement ───────────────────────────────────────
  conscious_masturb: {
    id: 'conscious_masturb', emoji: '🧠', title: 'Masturbation consciente',
    subtitle: 'Reconditionnement sensoriel', duration: '15 min', xp: 15,
    steps: [
      { text: 'Installe-toi au calme, sans téléphone, sans écran, sans pornographie.', duration: 15 },
      { text: 'Commence une stimulation lente et intentionnelle, sans chercher à éjaculer vite. Le but est d\'explorer les sensations.', duration: 30 },
      { text: 'Porte ton attention sur les sensations physiques précises — chaleur, pression, texture. Reste dans ton corps.', duration: 60 },
      { text: 'Si ton esprit cherche des images ou fantasmes visuels intenses, reviens doucement à la sensation physique. Sans te juger.', duration: 30 },
      { text: 'Continue lentement 10 minutes minimum. Si l\'éjaculation approche, ralentis — mais ne t\'arrête pas complètement.', duration: 600 },
      { text: 'Termine. Que tu aies éjaculé ou non, tu as reconnecté ton cerveau aux sensations réelles. C\'est l\'essentiel.', duration: 20 },
    ],
    note: 'La masturbation consciente sans pornographie est la première étape du reconditionnement neurologique. Elle réapprend au cerveau à trouver du plaisir dans une stimulation normale, sans hyperstimulation visuelle.',
  },

  porn_reduction: {
    id: 'porn_reduction', emoji: '📉', title: 'Réduction progressive',
    subtitle: 'Reconditionnement comportemental', duration: '5 min', xp: 10,
    steps: [
      { text: 'Note mentalement ta consommation habituelle de pornographie par semaine. Sois honnête, sans culpabilité.', duration: 20 },
      { text: 'Le problème n\'est pas la pornographie en soi, c\'est le conditionnement qu\'elle a créé : ton cerveau associe l\'excitation à une hyperstimulation rapide.', duration: 20 },
      { text: 'Fixe-toi un objectif de réduction de 50 % cette semaine. Si tu regardes 6 fois, vise 3. Tous les jours, vise un jour sur deux.', duration: 20 },
      { text: 'Remplace ces moments par une séance Duramen. Substitution progressive, pas pure volonté.', duration: 15 },
      { text: 'En fin de semaine, fais le bilan avec Alex. Il adaptera ton programme.', duration: 10 },
    ],
    note: 'La réduction progressive est plus efficace que l\'arrêt brutal, qui crée un effet rebond. L\'objectif est de ne plus dépendre de la pornographie pour t\'exciter.',
  },

  // ── Primaire : cadre médical ──────────────────────────────────────────────
  medical_frame: {
    id: 'medical_frame', emoji: '🩺', title: 'Comprendre ton profil',
    subtitle: 'Cadre & attentes réalistes', duration: '6 min', xp: 10,
    steps: [
      { text: 'Ton EP est présente depuis toujours (primaire). Elle a souvent une composante neurobiologique : une sensibilité particulière du réflexe éjaculatoire.', duration: 30 },
      { text: 'Bonne nouvelle : les techniques comportementales fonctionnent aussi sur ce profil. Elles demandent simplement plus de constance et de patience (8 à 16 semaines).', duration: 30 },
      { text: 'Important : un avis médical (urologue ou sexologue) est recommandé pour ton profil. Certains traitements médicaux peuvent compléter efficacement ton programme.', duration: 30 },
      { text: 'Duramen t\'accompagne sur toute la partie comportementale et psychologique, en complément d\'un éventuel suivi médical.', duration: 20 },
      { text: 'Fixe-toi des attentes réalistes : la progression sera régulière mais graduelle. Chaque semaine compte.', duration: 20 },
    ],
    note: 'L\'EP primaire répond bien à une approche combinée : rééducation comportementale (Duramen) + éventuel accompagnement médical. La régularité est la clé de la réussite.',
  },
}

// ─── PROGRAMMES PAR PROFIL ────────────────────────────────────────────────────
// Chaque programme = 4 phases. Chaque phase référence des exercices de la bibliothèque.
const PALETTE = ['#4A7C6F', '#5A9E8F', '#D4A855', '#7C6F4A']

export const PROGRAMS = {

  // ── HYPEREXCITÉ SENSORIEL ─────────────────────────────────────────────────
  sensory: {
    label: 'Hyperexcité Sensoriel',
    approach: 'Sensorielle & corporelle',
    duration: '4 à 6 semaines',
    intro: 'Ton corps s\'emballe avant que tu puisses réagir. Ton programme t\'apprend à percevoir et maîtriser ta montée d\'excitation, étape par étape.',
    phases: [
      { n: 1, title: 'Conscience corporelle', emoji: '🧘', focus: 'Apprendre à lire ton corps', exercises: ['breathing', 'body_scan', 'arousal_scale'] },
      { n: 2, title: 'Plancher pelvien', emoji: '💪', focus: 'Construire ton outil de contrôle', exercises: ['kegel_basic', 'kegel_advanced'] },
      { n: 3, title: 'Contrôle actif', emoji: '⏸️', focus: 'Maîtriser le point de non-retour', exercises: ['stop_start', 'edging'] },
      { n: 4, title: 'Intégration', emoji: '✨', focus: 'Consolider et transférer', exercises: ['squeeze', 'sensate_focus'] },
    ],
  },

  // ── ANXIEUX DE PERFORMANCE ────────────────────────────────────────────────
  cognitive: {
    label: 'Anxieux de Performance',
    approach: 'TCC & pleine conscience',
    duration: '4 à 6 semaines',
    intro: 'Ta tête prend le dessus pendant l\'acte. Ton programme, basé sur les thérapies cognitivo-comportementales, t\'apprend à apaiser ton mental et à rester présent.',
    phases: [
      { n: 1, title: 'Comprendre l\'anxiété', emoji: '🧠', focus: 'Identifier le mécanisme', exercises: ['breathing_478', 'thought_log'] },
      { n: 2, title: 'Restructuration cognitive', emoji: '💡', focus: 'Désamorcer les pensées', exercises: ['cognitive_restructuring', 'mindfulness_sensations'] },
      { n: 3, title: 'Réancrage attentionnel', emoji: '🎯', focus: 'Rester dans le corps', exercises: ['body_scan', 'stop_start'] },
      { n: 4, title: 'Confiance & intégration', emoji: '🌅', focus: 'Reconstruire la sérénité', exercises: ['visualization', 'sensate_focus'] },
    ],
  },

  // ── EP SITUATIONNELLE ─────────────────────────────────────────────────────
  situational: {
    label: 'EP Situationnelle',
    approach: 'Contextuelle & relationnelle',
    duration: '4 à 6 semaines',
    intro: 'Ton EP dépend des situations. Ton programme t\'aide à identifier tes déclencheurs, à te détendre et à reprendre confiance dans tous les contextes.',
    phases: [
      { n: 1, title: 'Identifier les déclencheurs', emoji: '🔍', focus: 'Comprendre tes contextes', exercises: ['trigger_journal', 'pmr_jacobson'] },
      { n: 2, title: 'Détente & sécurité', emoji: '🌿', focus: 'Apaiser le corps', exercises: ['breathing', 'body_scan'] },
      { n: 3, title: 'Exposition progressive', emoji: '⏸️', focus: 'Reprendre le contrôle', exercises: ['stop_start', 'communication'] },
      { n: 4, title: 'Consolidation', emoji: '🤝', focus: 'Ancrer la confiance', exercises: ['sensate_focus', 'visualization'] },
    ],
  },

  // ── EP CONDITIONNÉE ───────────────────────────────────────────────────────
  conditioned: {
    label: 'EP Conditionnée',
    approach: 'Reconditionnement neurologique',
    duration: '8 à 12 semaines',
    intro: 'Ton excitation s\'est conditionnée à une stimulation rapide et visuelle. Ton programme commence par un reconditionnement neurologique avant les techniques de contrôle.',
    phases: [
      { n: 1, title: 'Reconditionnement', emoji: '🔄', focus: 'Reconnecter aux sensations réelles', exercises: ['conscious_masturb', 'porn_reduction', 'body_reconnect'] },
      { n: 2, title: 'Conscience corporelle', emoji: '🧘', focus: 'Lire ton corps sans écran', exercises: ['breathing', 'arousal_scale'] },
      { n: 3, title: 'Contrôle', emoji: '⏸️', focus: 'Maîtriser l\'excitation', exercises: ['stop_start', 'kegel_basic'] },
      { n: 4, title: 'Intégration', emoji: '✨', focus: 'Transférer au réel', exercises: ['squeeze', 'sensate_focus'] },
    ],
  },

  // ── EP PRIMAIRE ───────────────────────────────────────────────────────────
  primary: {
    label: 'EP Primaire',
    approach: 'Comportementale & médicale',
    duration: '8 à 16 semaines',
    intro: 'Ton EP est présente depuis toujours. Ton programme construit des fondations comportementales solides, en complément d\'un éventuel suivi médical.',
    phases: [
      { n: 1, title: 'Fondations & cadre', emoji: '🩺', focus: 'Comprendre et démarrer', exercises: ['medical_frame', 'breathing'] },
      { n: 2, title: 'Renforcement', emoji: '💪', focus: 'Muscler le plancher pelvien', exercises: ['kegel_basic', 'kegel_advanced'] },
      { n: 3, title: 'Techniques comportementales', emoji: '⏸️', focus: 'Outils de contrôle', exercises: ['stop_start', 'squeeze'] },
      { n: 4, title: 'Maîtrise & maintien', emoji: '✨', focus: 'Consolider durablement', exercises: ['edging', 'sensate_focus'] },
    ],
  },
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function getProgram(profileType) {
  return PROGRAMS[profileType] || PROGRAMS.cognitive
}

// Retourne la liste à plat des exercices d'une phase, enrichis (couleur, niveau, n° phase)
export function getPhaseExercises(program, phaseNumber) {
  const phase = program.phases.find(p => p.n === phaseNumber)
  if (!phase) return []
  const color = PALETTE[(phaseNumber - 1) % PALETTE.length]
  return phase.exercises.map((exId, i) => ({
    ...EXERCISE_LIBRARY[exId],
    phase: phaseNumber,
    level: phaseNumber,
    color,
    bg: color + '1a', // teinte légère
  }))
}

export { PALETTE }
