export const DRIFT_TRIGGERS = [
  { key: "porn", label: "Porn" },
  { key: "doom_scrolling", label: "Doom scrolling" },
  { key: "fantasy_loop", label: "Fantasy loop" },
  { key: "youtube_binge", label: "YouTube binge" },
  { key: "music_escape", label: "Music escape" },
  { key: "oversleeping", label: "Oversleeping" }
];

export const RECOVERY_ACTIONS = [
  "Put phone away",
  "10 pushups",
  "5 min breathing",
  "15 min focused task",
  "Silence mode",
  "Cold water splash",
  "Walk without headphones"
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

export const STRICT_TASKS = [
  {
    key: "big_goal_completed",
    title: "Big Goal complete",
    description: "The one thing that makes today real."
  },
  {
    key: "study_build_completed",
    title: "Study / Build complete",
    description: "Visible output over imagined productivity."
  },
  {
    key: "exercise_completed",
    title: "Exercise complete",
    description: "Move the body before the mind weakens."
  }
];

export const MINIMUM_DAY_TASKS = [
  {
    key: "minimum_build_completed",
    title: "15 min build",
    description: "One meaningful study/build action."
  },
  {
    key: "minimum_pushups_completed",
    title: "10 pushups",
    description: "Move, even if motivation is low."
  },
  {
    key: "minimum_no_porn_completed",
    title: "No porn",
    description: "Protect the mind from collapse."
  },
  {
    key: "minimum_sleep_before_midnight_completed",
    title: "Sleep before midnight",
    description: "A cleaner reset for tomorrow."
  }
];
