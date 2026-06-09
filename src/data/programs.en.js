// ════════════════════════════════════════════════════════════════════════════
// ENGLISH TRANSLATION of the therapeutic programs (mirror of programs.js).
// Same exercise IDs and structure — only the displayed text is translated.
// ════════════════════════════════════════════════════════════════════════════

export const LIBRARY_EN = {

  breathing: {
    id: 'breathing', emoji: '🌬️', title: 'Diaphragmatic breathing',
    subtitle: 'Nervous system regulation', duration: '8 min', xp: 10,
    steps: [
      { text: 'Lie on your back, one hand on your belly, one on your chest.', duration: 15 },
      { text: 'Inhale slowly through your nose for 4 seconds. Only the hand on your belly should rise.', duration: 4 },
      { text: 'Hold gently for 2 seconds.', duration: 2 },
      { text: 'Exhale through your mouth for 6 seconds. Feel your belly drop.', duration: 6 },
      { text: 'Repeat this cycle 10 times, staying focused on the feeling of the air.', duration: 120 },
    ],
    note: 'Diaphragmatic breathing activates the parasympathetic nervous system. It directly lowers your physiological arousal and is your first tool for control.',
  },

  breathing_478: {
    id: 'breathing_478', emoji: '🫁', title: '4-7-8 breathing',
    subtitle: 'Anti-anxiety anchor', duration: '6 min', xp: 10,
    steps: [
      { text: 'Sit comfortably, back straight. Place the tip of your tongue behind your upper teeth.', duration: 15 },
      { text: 'Inhale through your nose for 4 seconds.', duration: 4 },
      { text: 'Hold your breath for 7 seconds.', duration: 7 },
      { text: 'Exhale fully through your mouth for 8 seconds.', duration: 8 },
      { text: 'Repeat this cycle 6 times. Notice how your body calms down.', duration: 120 },
    ],
    note: '4-7-8 breathing is a powerful tool against performance anxiety. Practiced before sex, it reduces the stress-driven arousal spike.',
  },

  body_scan: {
    id: 'body_scan', emoji: '🧘', title: 'Body scan',
    subtitle: 'Mindfulness of sensations', duration: '12 min', xp: 10,
    steps: [
      { text: 'Lie down, close your eyes, take a few deep breaths.', duration: 20 },
      { text: 'Bring your attention to your feet. Observe the sensations without judgment.', duration: 40 },
      { text: 'Slowly move up: calves, thighs, pelvis. Notice each sensation.', duration: 60 },
      { text: 'Focus on your lower belly and perineum. Tense or relaxed?', duration: 60 },
      { text: 'Continue to your belly, chest, shoulders. Release the tension.', duration: 60 },
      { text: 'Finish at your face. Slowly open your eyes.', duration: 30 },
    ],
    note: 'Body awareness is the foundation of control. Recognizing the sensations of arousal before they become uncontrollable is the key to the whole method.',
  },

  arousal_scale: {
    id: 'arousal_scale', emoji: '📊', title: 'The arousal scale',
    subtitle: 'Mapping your point of no return', duration: '10 min', xp: 15,
    steps: [
      { text: 'This exercise teaches you to measure your arousal on a scale from 0 (none) to 10 (orgasm). The goal: identify your "point of no return", usually around 8-9.', duration: 20 },
      { text: 'Begin slow, solo stimulation. Mentally name your level: 1... 2... 3...', duration: 60 },
      { text: 'Keep going gently. At each step, ask yourself: "Where am I on the scale?"', duration: 90 },
      { text: 'When you reach 6/10, slow down. Observe precisely what your body feels at this level.', duration: 60 },
      { text: 'Carefully climb toward 7. This is the critical zone to learn to recognize. Memorize these sensations.', duration: 60 },
      { text: 'Stop at 7. Let it come down. You just learned to read your body — a fundamental skill.', duration: 30 },
    ],
    note: 'Men with PE often poorly perceive their rising arousal. Learning to grade it from 0 to 10 lets you anticipate and act BEFORE the point of no return.',
  },

  body_reconnect: {
    id: 'body_reconnect', emoji: '🤲', title: 'Whole-body reconnection',
    subtitle: 'Full-body mindfulness', duration: '12 min', xp: 10,
    steps: [
      { text: 'Lie down comfortably. Close your eyes. Take 3 deep breaths.', duration: 30 },
      { text: 'Bring your attention to your hands. Feel their temperature, their weight.', duration: 30 },
      { text: 'Move up to your arms, shoulders, neck. Release any tension you find.', duration: 40 },
      { text: 'Bring attention to your lower belly and perineum. Tense or relaxed?', duration: 40 },
      { text: 'Do you feel a connection between this area and the rest of your body, or does it feel isolated?', duration: 30 },
      { text: 'Take 5 breaths, imagining you send the air toward your lower belly.', duration: 60 },
      { text: 'Gently open your eyes. This reconnection is the foundation of everything.', duration: 20 },
    ],
    note: 'Men with conditioned PE often have a disconnection between the genital area and the rest of the body. This exercise restores the neurological connection needed for control.',
  },

  kegel_basic: {
    id: 'kegel_basic', emoji: '💪', title: 'Kegel — Beginner',
    subtitle: 'Pelvic floor strengthening', duration: '10 min', xp: 10,
    steps: [
      { text: 'Identify your PC muscle: it\'s the one that stops the flow of urine. Find it without clenching your glutes or belly.', duration: 20 },
      { text: 'Contract this muscle for 3 seconds.', duration: 3 },
      { text: 'Release fully for 3 seconds. The release matters as much as the contraction.', duration: 3 },
      { text: 'Repeat 10 times, then rest for 30 seconds.', duration: 90 },
      { text: 'Do 2 more sets with 30 seconds of rest between each.', duration: 180 },
    ],
    note: 'A toned pelvic floor significantly improves ejaculatory control (strong clinical evidence). Daily consistency matters more than intensity.',
  },

  kegel_advanced: {
    id: 'kegel_advanced', emoji: '⚡', title: 'Kegel — Advanced',
    subtitle: 'Strength and endurance', duration: '12 min', xp: 15,
    steps: [
      { text: 'Set 1 — Slow contractions: contract 5s, release 5s. 10 reps.', duration: 100 },
      { text: 'Rest 30 seconds.', duration: 30 },
      { text: 'Set 2 — Fast contractions: contract and release quickly. 20 reps.', duration: 40 },
      { text: 'Rest 30 seconds.', duration: 30 },
      { text: 'Set 3 — Long hold: contract and hold for 10 seconds. 5 reps.', duration: 75 },
      { text: 'Learn to briefly contract this muscle just before the point of no return: it\'s an emergency brake.', duration: 20 },
    ],
    note: 'Combining slow, fast and held contractions builds both strength AND endurance. A voluntary contraction at the right moment can delay ejaculation.',
  },

  stop_start: {
    id: 'stop_start', emoji: '⏸️', title: 'Stop-Start technique',
    subtitle: 'Arousal control', duration: '15 min', xp: 15,
    steps: [
      { text: 'Begin solo stimulation at your own pace.', duration: 15 },
      { text: 'Slowly increase the intensity, tracking your arousal on the 1 to 10 scale.', duration: 30 },
      { text: 'When you reach 7/10, STOP. Stop all stimulation.', duration: 5 },
      { text: 'Breathe deeply. Wait until your level drops back to 4/10. Take all the time you need.', duration: 30 },
      { text: 'Resume. Repeat this stop-start cycle 3 times.', duration: 300 },
      { text: 'On the last resume, let yourself go if you wish. Notice the difference in control.', duration: 30 },
    ],
    note: 'The stop-start technique (Semans) trains your nervous system to recognize and tolerate high arousal without triggering ejaculation. 4 to 8 weeks of regular practice gives clear results.',
  },

  squeeze: {
    id: 'squeeze', emoji: '🤏', title: 'The Squeeze technique',
    subtitle: 'Advanced mastery', duration: '15 min', xp: 20,
    steps: [
      { text: 'Stimulate yourself until you approach the point of no return (8/10).', duration: 60 },
      { text: 'Just before, firmly squeeze the head of the penis between your thumb and two fingers, at the base of the glans, for 5 to 10 seconds.', duration: 10 },
      { text: 'The pressure slightly lowers arousal and the erection. This is normal and intended.', duration: 15 },
      { text: 'Wait 30 seconds, then resume stimulation.', duration: 30 },
      { text: 'Repeat the cycle 3 to 4 times before allowing yourself to finish.', duration: 240 },
      { text: 'This technique gives you a concrete, immediate tool to regain control.', duration: 20 },
    ],
    note: 'The squeeze (Masters & Johnson) mechanically interrupts the ejaculatory reflex. It\'s a powerful backup tool, to master alone before bringing it into sex.',
  },

  edging: {
    id: 'edging', emoji: '🌊', title: 'Progressive edging',
    subtitle: 'Endurance and tolerance', duration: '18 min', xp: 20,
    steps: [
      { text: 'The goal: stay as long as possible in the 7-8/10 zone without tipping over.', duration: 20 },
      { text: 'Raise your arousal to 7/10.', duration: 60 },
      { text: 'Hold at this level by adjusting intensity — slow down when you rise, resume when you drop.', duration: 300 },
      { text: 'Stay in this "plateau" zone for 10 minutes. It\'s demanding: that\'s exactly the training you want.', duration: 300 },
      { text: 'Finish when you decide, in control. Note how long you held.', duration: 30 },
    ],
    note: 'Edging extends the time spent in high arousal and gradually raises your threshold. It\'s the step that consolidates the control gained with stop-start.',
  },

  thought_log: {
    id: 'thought_log', emoji: '📝', title: 'Identify your thoughts',
    subtitle: 'CBT — Cognitive spotting', duration: '8 min', xp: 10,
    steps: [
      { text: 'Think back to a recent time you ejaculated too quickly. Without judging yourself.', duration: 30 },
      { text: 'What thoughts crossed your mind BEFORE and DURING? For example: "I\'m going to fail again", "She\'ll be disappointed", "I have to last".', duration: 45 },
      { text: 'Mentally note these thoughts. They are "automatic thoughts" — often catastrophic and anticipatory.', duration: 30 },
      { text: 'Notice: these thoughts increase your stress, hence your arousal, hence the very risk you fear. It\'s a vicious circle.', duration: 30 },
      { text: 'Recognizing this mechanism is the first step to defusing it. You\'ll come back to it in the next exercises.', duration: 20 },
    ],
    note: 'In CBT, psychogenic PE is fueled by anxious automatic thoughts. Clearly identifying them lets you then challenge them.',
  },

  cognitive_restructuring: {
    id: 'cognitive_restructuring', emoji: '🧠', title: 'Reframe your thoughts',
    subtitle: 'CBT — Cognitive restructuring', duration: '10 min', xp: 15,
    steps: [
      { text: 'Take an automatic thought you identified earlier, for example: "I\'m bound to fail".', duration: 30 },
      { text: 'Question it: is it a fact or a fear? What real evidence do I have? Is it true 100% of the time?', duration: 45 },
      { text: 'Form a realistic, soothing alternative: "I\'m making progress. Sex isn\'t an exam. My pleasure and my partner\'s don\'t depend only on duration."', duration: 45 },
      { text: 'Repeat this new thought. Feel the difference in your body: less tension.', duration: 30 },
      { text: 'Choose ONE anchor phrase to repeat before your next encounters.', duration: 30 },
    ],
    note: 'Replacing catastrophic thoughts with realistic ones reduces performance anxiety, and therefore the hyperarousal it causes. This is the heart of CBT.',
  },

  mindfulness_sensations: {
    id: 'mindfulness_sensations', emoji: '🎯', title: 'Anchoring in sensations',
    subtitle: 'Mindfulness against spectatoring', duration: '12 min', xp: 15,
    steps: [
      { text: '"Spectatoring" — watching yourself from the outside and judging — is the anxious man\'s #1 enemy. This exercise teaches you to stay IN your sensations.', duration: 30 },
      { text: 'Begin slow stimulation. Instead of thinking, mentally describe the pure physical sensations: warmth, contact, pressure.', duration: 90 },
      { text: 'As soon as your mind races ("it\'s too fast", "I must last"), gently return to the physical sensation. Without judging.', duration: 90 },
      { text: 'Go back and forth: when you notice you\'re thinking, return to the body. That\'s the training.', duration: 120 },
      { text: 'Finish while staying present. You just trained your attention — the skill that defuses anxiety.', duration: 30 },
    ],
    note: 'Mindfulness reduces spectatoring and brings attention back to real pleasure rather than fear of failure. Very effective on anxiety-driven PE.',
  },

  visualization: {
    id: 'visualization', emoji: '🌅', title: 'Positive visualization',
    subtitle: 'Imagined exposure', duration: '10 min', xp: 15,
    steps: [
      { text: 'Settle somewhere quiet, eyes closed, after a few slow breaths.', duration: 30 },
      { text: 'Imagine an encounter going well: you\'re relaxed, present, in control. Visualize the details.', duration: 90 },
      { text: 'If an image of failure pops up, don\'t fight it: calmly replace it with the positive image.', duration: 60 },
      { text: 'Link this scene to a feeling of calm in your body. Breathe slowly.', duration: 60 },
      { text: 'Repeat this visualization regularly. Your brain learns to associate intimacy with calm rather than stress.', duration: 30 },
    ],
    note: 'Imagined exposure reduces anticipatory anxiety. By mentally rehearsing controlled scenarios, you recondition your emotional response to intimacy.',
  },

  trigger_journal: {
    id: 'trigger_journal', emoji: '🔍', title: 'Trigger journal',
    subtitle: 'Mapping the situations', duration: '8 min', xp: 10,
    steps: [
      { text: 'Your PE is variable: it depends on context. The goal is to understand WHEN it shows up.', duration: 30 },
      { text: 'Think about the situations where it happens most: new partner? tiredness? stress? after a long break? alcohol?', duration: 60 },
      { text: 'Now spot the situations where it goes BETTER. What changes? (relaxation, confidence, familiarity...)', duration: 60 },
      { text: 'Identify your main trigger. That\'s the one you\'ll learn to defuse.', duration: 40 },
      { text: 'Understanding that your body works well in certain contexts proves the problem is changeable — therefore treatable.', duration: 30 },
    ],
    note: 'Situational PE shows the reflex isn\'t "hardwired" but triggered by identifiable factors. Targeting them allows fast progress.',
  },

  pmr_jacobson: {
    id: 'pmr_jacobson', emoji: '🌿', title: 'Muscle relaxation',
    subtitle: 'Jacobson method', duration: '12 min', xp: 10,
    steps: [
      { text: 'Lie down. This technique involves contracting then releasing each muscle group to reach deep relaxation.', duration: 30 },
      { text: 'Contract your fists and arms for 5s, then release at once. Feel the relaxation.', duration: 30 },
      { text: 'Contract your face and shoulders for 5s, release.', duration: 30 },
      { text: 'Contract your belly and glutes for 5s, release.', duration: 30 },
      { text: 'Contract your legs and feet for 5s, release.', duration: 30 },
      { text: 'Stay still for 2 minutes, savor the overall relaxation of your body.', duration: 120 },
    ],
    note: 'Progressive relaxation lowers tension and stress — major factors in situational PE. A relaxed body naturally delays ejaculation.',
  },

  communication: {
    id: 'communication', emoji: '💬', title: 'Talking with your partner',
    subtitle: 'Defusing the pressure', duration: '8 min', xp: 15,
    steps: [
      { text: 'Silence and fear of judgment amplify PE. Talking about it defuses it. This exercise prepares that conversation.', duration: 30 },
      { text: 'Choose a calm moment, outside the bedroom. Frame the idea: "I\'m working on something so we can enjoy our moments together even more."', duration: 45 },
      { text: 'You don\'t have to detail everything. The key: turn a shameful topic into a shared project.', duration: 30 },
      { text: 'Offer moments of intimacy WITHOUT a performance goal (see the Sensate Focus exercise). This removes the pressure.', duration: 45 },
      { text: 'An informed, involved partner becomes an ally, not a judge. It\'s a major lever for progress.', duration: 30 },
    ],
    note: 'In couples therapy, opening up the dialogue drastically reduces performance anxiety. Closeness replaces the fear of the other\'s gaze.',
  },

  sensate_focus: {
    id: 'sensate_focus', emoji: '🤝', title: 'Sensate Focus',
    subtitle: 'Intimacy without performance', duration: '20 min', xp: 20,
    steps: [
      { text: 'Sensate Focus (Masters & Johnson) is the reference couple exercise. Golden rule: NO goal of penetration or orgasm.', duration: 30 },
      { text: 'Step 1 — Take turns caressing each other\'s body, avoiding the genitals. The one receiving focuses only on the sensations.', duration: 300 },
      { text: 'No pressure to "succeed". The only aim is to rediscover the pleasure of touch, with no stakes.', duration: 60 },
      { text: 'Step 2 (later sessions) — Gradually include the genital areas, still with no performance goal.', duration: 300 },
      { text: 'Communicate what feels good. Reconnect with shared pleasure rather than performance.', duration: 120 },
      { text: 'Finish with no pressure to "conclude". Rediscovered intimacy lowers anxiety — and paradoxically improves control.', duration: 30 },
    ],
    note: 'Sensate Focus removes performance pressure, a major cause of PE. By separating intimacy from "success", it restores a calm sexuality and better control.',
  },

  conscious_masturb: {
    id: 'conscious_masturb', emoji: '🧠', title: 'Conscious masturbation',
    subtitle: 'Sensory reconditioning', duration: '15 min', xp: 15,
    steps: [
      { text: 'Settle somewhere quiet, no phone, no screen, no pornography.', duration: 15 },
      { text: 'Begin slow, intentional stimulation, without trying to ejaculate quickly. The goal is to explore sensations.', duration: 30 },
      { text: 'Bring your attention to the precise physical sensations — warmth, pressure, texture. Stay in your body.', duration: 60 },
      { text: 'If your mind seeks intense visual images or fantasies, gently return to the physical sensation. Without judging yourself.', duration: 30 },
      { text: 'Continue slowly for at least 10 minutes. If ejaculation approaches, slow down — but don\'t stop completely.', duration: 600 },
      { text: 'Finish. Whether you ejaculated or not, you reconnected your brain to real sensations. That\'s what matters.', duration: 20 },
    ],
    note: 'Conscious masturbation without pornography is the first step of neurological reconditioning. It teaches the brain to find pleasure in normal stimulation, without visual hyperstimulation.',
  },

  porn_reduction: {
    id: 'porn_reduction', emoji: '📉', title: 'Progressive reduction',
    subtitle: 'Behavioral reconditioning', duration: '5 min', xp: 10,
    steps: [
      { text: 'Mentally note your usual weekly pornography consumption. Be honest, without guilt.', duration: 20 },
      { text: 'The problem isn\'t pornography itself, it\'s the conditioning it created: your brain links arousal to fast hyperstimulation.', duration: 20 },
      { text: 'Set a goal to cut it by 50% this week. If you watch 6 times, aim for 3. Every day, aim for every other day.', duration: 20 },
      { text: 'Replace those moments with a Duramen session. Gradual substitution, not pure willpower.', duration: 15 },
      { text: 'At the end of the week, review with Alex. He\'ll adapt your program.', duration: 10 },
    ],
    note: 'Gradual reduction is more effective than abrupt stopping, which creates a rebound effect. The goal is to no longer depend on pornography to get aroused.',
  },

  medical_frame: {
    id: 'medical_frame', emoji: '🩺', title: 'Understanding your profile',
    subtitle: 'Framing & realistic expectations', duration: '6 min', xp: 10,
    steps: [
      { text: 'Your PE has been there from the start (primary). It often has a neurobiological component: a particular sensitivity of the ejaculatory reflex.', duration: 30 },
      { text: 'Good news: behavioral techniques work on this profile too. They just need more consistency and patience (8 to 16 weeks).', duration: 30 },
      { text: 'Important: a medical opinion (urologist or sex therapist) is recommended for your profile. Some medical treatments can effectively complement your program.', duration: 30 },
      { text: 'Duramen supports you on the entire behavioral and psychological side, alongside any medical follow-up.', duration: 20 },
      { text: 'Set realistic expectations: progress will be steady but gradual. Every week counts.', duration: 20 },
    ],
    note: 'Primary PE responds well to a combined approach: behavioral retraining (Duramen) + possible medical support. Consistency is the key to success.',
  },
}

export const PROGRAMS_EN = {
  sensory: {
    label: 'Sensory Hyperarousal',
    approach: 'Sensory & body-based',
    duration: '4 to 6 weeks',
    intro: 'Your body races before you can react. Your program teaches you to perceive and master your rising arousal, step by step.',
    phases: [
      { n: 1, title: 'Body awareness', emoji: '🧘', focus: 'Learn to read your body', exercises: ['breathing', 'body_scan', 'arousal_scale'] },
      { n: 2, title: 'Pelvic floor', emoji: '💪', focus: 'Build your control tool', exercises: ['kegel_basic', 'kegel_advanced'] },
      { n: 3, title: 'Active control', emoji: '⏸️', focus: 'Master the point of no return', exercises: ['stop_start', 'edging'] },
      { n: 4, title: 'Integration', emoji: '✨', focus: 'Consolidate and transfer', exercises: ['squeeze', 'sensate_focus'] },
    ],
  },
  cognitive: {
    label: 'Performance Anxiety',
    approach: 'CBT & mindfulness',
    duration: '4 to 6 weeks',
    intro: 'Your mind takes over during sex. Your program, based on cognitive behavioral therapy, teaches you to calm your mind and stay present.',
    phases: [
      { n: 1, title: 'Understanding anxiety', emoji: '🧠', focus: 'Identify the mechanism', exercises: ['breathing_478', 'thought_log'] },
      { n: 2, title: 'Cognitive restructuring', emoji: '💡', focus: 'Defuse the thoughts', exercises: ['cognitive_restructuring', 'mindfulness_sensations'] },
      { n: 3, title: 'Attentional re-anchoring', emoji: '🎯', focus: 'Stay in the body', exercises: ['body_scan', 'stop_start'] },
      { n: 4, title: 'Confidence & integration', emoji: '🌅', focus: 'Rebuild calm', exercises: ['visualization', 'sensate_focus'] },
    ],
  },
  situational: {
    label: 'Situational PE',
    approach: 'Contextual & relational',
    duration: '4 to 6 weeks',
    intro: 'Your PE depends on situations. Your program helps you identify your triggers, relax, and rebuild confidence in every context.',
    phases: [
      { n: 1, title: 'Identify the triggers', emoji: '🔍', focus: 'Understand your contexts', exercises: ['trigger_journal', 'pmr_jacobson'] },
      { n: 2, title: 'Calm & safety', emoji: '🌿', focus: 'Soothe the body', exercises: ['breathing', 'body_scan'] },
      { n: 3, title: 'Gradual exposure', emoji: '⏸️', focus: 'Regain control', exercises: ['stop_start', 'communication'] },
      { n: 4, title: 'Consolidation', emoji: '🤝', focus: 'Anchor the confidence', exercises: ['sensate_focus', 'visualization'] },
    ],
  },
  conditioned: {
    label: 'Conditioned PE',
    approach: 'Neurological reconditioning',
    duration: '8 to 12 weeks',
    intro: 'Your arousal has been conditioned to fast, visual stimulation. Your program starts with neurological reconditioning before the control techniques.',
    phases: [
      { n: 1, title: 'Reconditioning', emoji: '🔄', focus: 'Reconnect to real sensations', exercises: ['conscious_masturb', 'porn_reduction', 'body_reconnect'] },
      { n: 2, title: 'Body awareness', emoji: '🧘', focus: 'Read your body without a screen', exercises: ['breathing', 'arousal_scale'] },
      { n: 3, title: 'Control', emoji: '⏸️', focus: 'Master arousal', exercises: ['stop_start', 'kegel_basic'] },
      { n: 4, title: 'Integration', emoji: '✨', focus: 'Transfer to real life', exercises: ['squeeze', 'sensate_focus'] },
    ],
  },
  primary: {
    label: 'Primary PE',
    approach: 'Behavioral & medical',
    duration: '8 to 16 weeks',
    intro: 'Your PE has been there from the start. Your program builds solid behavioral foundations, alongside any medical follow-up.',
    phases: [
      { n: 1, title: 'Foundations & framing', emoji: '🩺', focus: 'Understand and start', exercises: ['medical_frame', 'breathing'] },
      { n: 2, title: 'Strengthening', emoji: '💪', focus: 'Build the pelvic floor', exercises: ['kegel_basic', 'kegel_advanced'] },
      { n: 3, title: 'Behavioral techniques', emoji: '⏸️', focus: 'Control tools', exercises: ['stop_start', 'squeeze'] },
      { n: 4, title: 'Mastery & maintenance', emoji: '✨', focus: 'Consolidate for the long run', exercises: ['edging', 'sensate_focus'] },
    ],
  },
}
