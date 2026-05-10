export const DRIFT_TRIGGERS = [
  { key: "porn", label: "Porn" },
  { key: "doom_scrolling", label: "Doom scrolling" },
  { key: "fantasy_loop", label: "Fantasy loop" },
  { key: "youtube_binge", label: "YouTube binge" },
  { key: "music_escape", label: "Music escape" },
  { key: "oversleeping", label: "Oversleeping" }
];

export const EXAM_SURVIVAL_MODE = {
  title: "Exam Survival Mode",
  startsAt: "2026-05-11",
  endsAt: "2026-06-27",
  subtitle: "Practicals, viva, and theory prep. Reduce life to what moves the exam season forward."
};

export const EXAM_SURVIVAL_SUBJECTS = [
  {
    key: "aptitude",
    title: "Aptitude",
    minimum: "60–90 mins daily",
    principle: "Face the problem. Do not escape it.",
    reinforcement: "Speed comes from repetition. One solved set is better than five saved resources."
  },
  {
    key: "dsa",
    title: "DSA",
    minimum: "1 concept or 2–3 problems",
    principle: "Solving is the work. Watching is not the work.",
    reinforcement: "Ego discomfort is not an emergency."
  },
  {
    key: "react",
    title: "React",
    minimum: "Build while learning",
    principle: "Execution over tutorials.",
    reinforcement: "A navbar built is worth more than a playlist finished."
  },
  {
    key: "german",
    title: "German",
    minimum: "20 mins maintenance",
    principle: "Protect continuity only.",
    reinforcement: "Keep the streak alive, but do not let it steal the day."
  }
];

export const SESSION_PRESETS = {
  aptitude: {
    key: "aptitude",
    label: "Aptitude exposure set",
    duration: 60
  },
  dsa: {
    key: "dsa",
    label: "DSA deep session",
    duration: 45
  },
  react: {
    key: "react",
    label: "React build session",
    duration: 45
  },
  german: {
    key: "german",
    label: "German continuity block",
    duration: 20
  },
  recovery: {
    key: "recovery",
    label: "Recovery sprint",
    duration: 15
  },
  low_energy: {
    key: "low_energy",
    label: "Low-energy restart",
    duration: 5
  }
};

export const RECOVERY_ACTIONS = {
  standard: [
    "Put phone away",
    "10 pushups",
    "15-minute focus sprint",
    "Cold water splash",
    "Silence mode",
    "Walk without headphones"
  ],
  low_energy: [
    "5-minute start",
    "Open editor only",
    "Solve 1 aptitude question",
    "Revise notes only",
    "Read one React section"
  ]
};

export const REALITY_CHECK_LINES = [
  "Avoidance increases fear.",
  "Watching is not building.",
  "You are protecting comfort, not the future."
];

export const DAILY_REALITY_OPTIONS = [
  ["skills", "Skills"],
  ["body", "Body"],
  ["project", "Project"],
  ["discipline", "Discipline"],
  ["nothing", "Nothing"]
];

export const GUIDE_SECTIONS = [
  {
    title: "Reality Check",
    copy: "You are not lacking [[talent]] or [[potential]]. The real leak is [[scattered energy]], ((overstimulation)), and [[inconsistent action]]."
  },
  {
    title: "Enemies",
    copy: "Track the exact triggers that pull you out of reality. Drift becomes beatable when it stops being vague."
  },
  {
    title: "Mantras",
    copy: "[[Execution over emotion.]] [[Finish before you escape.]] [[Silence builds power.]]"
  },
  {
    title: "Identity",
    copy: "A builder [[shows up]], [[finishes]], and [[repeats]]. This app exists to make that visible every day."
  }
];

export const GUIDE_ROADMAP = [
  {
    title: "Next 30 days",
    kicker: "Reset window",
    copy: "Wake up, reduce noise, face aptitude, ship visible work, and do not let mood negotiate with duty. The first 30 days are where self-trust begins to rebuild."
  },
  {
    title: "What your life demands",
    kicker: "Structure over chaos",
    copy: "Your life does not improve through comfort, fantasy, or one motivated burst. It improves when structure becomes normal. The more disciplined you become, the better your mind feels."
  },
  {
    title: "500 boring days",
    kicker: "Real breakthrough",
    copy: "Your breakthrough will not come from one big day, one tool, one course, or one idea. It will come from boring days of repeated execution. Show up, finish work, repeat."
  }
];

export const GROUNDED_CONTEXT = [
  {
    title: "Low confidence is a condition, not your identity",
    context: "When self-expression and execution feel suppressed, the answer is not to shrink. It is to rebuild confidence through repetition, finished tasks, and visible proof.",
    reminder: "Do not obey the low-confidence story. Build anyway."
  },
  {
    title: "A brilliant mind becomes dangerous when it is unstewarded",
    context: "A fast, imaginative, overstimulated mind can become visionary when directed, or self-destructive when left in fantasy loops and escape habits.",
    reminder: "Channel intensity into work, not into imaginary futures."
  },
  {
    title: "Pressure periods are tests, not permanent reality",
    context: "The hard phase is not proof that life is broken forever. It is a stress period that demands structure, humility, physical effort, and steadiness.",
    reminder: "Treat pressure as training. Build foundations anyway."
  },
  {
    title: "Your strongest remedy is still practical discipline",
    context: "Prayer, timing, and symbolism can steady the mind, but they do not replace sleep, exercise, silence, repetition, and execution.",
    reminder: "Return to the basics whenever you feel confused."
  }
];

export const INTERNAL_WARNING_SIGNS = [
  {
    trigger: "I'll start tomorrow.",
    meaning: "Escapism is activating. The delay loop has started.",
    correction: "Do the task now for 5 minutes minimum. Break the pattern immediately."
  },
  {
    trigger: "Let me just watch one tutorial first.",
    meaning: "Tutorial hell is beginning. Consumption is replacing effort.",
    correction: "Open the editor first. Attempt the task before consuming more input."
  },
  {
    trigger: "I have a great new startup idea.",
    meaning: "Avoidance of current incomplete work.",
    correction: "Write the idea in one line, park it, and return to what was already in front of you."
  },
  {
    trigger: "I don't feel motivated today.",
    meaning: "Emotional execution mode is taking over.",
    correction: "Motivation is irrelevant. Sit down, open the task, and stay for 2 minutes."
  },
  {
    trigger: "Everyone else is ahead of me.",
    meaning: "Comparison trap. Your attention is leaving your own path.",
    correction: "Close the comparison source. Compare only against yesterday's version of yourself."
  },
  {
    trigger: "Long music session with headphones.",
    meaning: "Dopamine escape is in progress.",
    correction: "Remove headphones. Sit in silence for 5 minutes. Re-enter the real task."
  },
  {
    trigger: "Opening the phone immediately after waking.",
    meaning: "Your best mental hours are being hijacked.",
    correction: "Keep the phone away from the bed. Protect the first hour after waking."
  }
];

export const RETURN_TO_ACTION = [
  "Execution over emotion.",
  "Finish before you escape.",
  "Silence builds power.",
  "One completed task is worth more than ten imagined futures.",
  "When confused, return to sleep, movement, silence, and work."
];

export const DAY_RULES = {
  monday: {
    title: "Monday grounding",
    colorToWear: "White or light colors",
    mantra: "Om Som Somaya Namah",
    deityOrPrayer: "Pray to Shiva",
    fastingRecommended: true,
    avoidNonVeg: true,
    offeringNotes: [],
    avoidNotes: ["Anger", "Overstimulation", "Doom scrolling"],
    focusNotes: ["Emotional calmness", "Hydration", "Gentle discipline"]
  },
  tuesday: {
    title: "Tuesday action",
    colorToWear: "Simple red",
    mantra: "Hanuman Chalisa or Om Hanumate Namah",
    deityOrPrayer: "Pray to Hanuman",
    fastingRecommended: false,
    avoidNonVeg: false,
    offeringNotes: [],
    avoidNotes: ["Excuses", "Wasted energy", "Weak starts"],
    focusNotes: ["Hard tasks first", "Action without delay", "Physical intensity"]
  },
  wednesday: {
    title: "Wednesday clarity",
    colorToWear: "Green or light green",
    mantra: "Om Bum Budhaya Namah",
    deityOrPrayer: "Pray for clarity and focus",
    fastingRecommended: false,
    avoidNonVeg: false,
    offeringNotes: [],
    avoidNotes: ["Scattered work", "Gossip", "Messy workspace"],
    focusNotes: ["Organization", "Deep study", "Focused communication"]
  },
  thursday: {
    title: "Thursday stability",
    colorToWear: "Soft yellow or cream",
    mantra: "Keep prayer simple and grounding",
    deityOrPrayer: "Focus on gratitude and humility",
    fastingRecommended: false,
    avoidNonVeg: false,
    offeringNotes: [],
    avoidNotes: ["Intellectual arrogance", "Talking more than doing"],
    focusNotes: ["Wisdom", "Teaching yourself clearly", "Structure"]
  },
  friday: {
    title: "Friday softness",
    colorToWear: "Clean light clothes",
    mantra: "Keep the mind calm and grateful",
    deityOrPrayer: "Simple prayer for peace",
    fastingRecommended: false,
    avoidNonVeg: false,
    offeringNotes: [],
    avoidNotes: ["Overindulgence", "Late-night stimulation"],
    focusNotes: ["Balance", "Emotional steadiness", "Clean habits"]
  },
  saturday: {
    title: "Saturday discipline",
    colorToWear: "Simple dark blue",
    mantra: "Om Sham Shanishcharaya Namah",
    deityOrPrayer: "Pray with humility and correction in mind",
    fastingRecommended: true,
    avoidNonVeg: true,
    offeringNotes: ["Black sesame", "Mustard oil", "Feed dogs/crows if possible"],
    avoidNotes: ["Arrogance", "Laziness", "Ego reactions"],
    focusNotes: ["Humility", "Deep cleaning", "Focused work"]
  },
  sunday: {
    title: "Sunday reset",
    colorToWear: "Clean and simple",
    mantra: "Keep prayer light and sincere",
    deityOrPrayer: "Use the day for inner order",
    fastingRecommended: false,
    avoidNonVeg: false,
    offeringNotes: [],
    avoidNotes: ["Mindless consumption", "Chaotic planning"],
    focusNotes: ["Review", "Reset", "Prepare the next week"]
  }
};

export const PAGE_TABS = [
  ["today", "Today"],
  ["history", "History"],
  ["guide", "Guide"],
  ["settings", "Settings"]
];
