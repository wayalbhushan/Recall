# Design system — binding

Concept: a printed exam paper. Quiet, institutional, precise.
The user is a student the night before a test.

## Tokens (define in globals.css as CSS variables, use via Tailwind arbitrary values)
--paper    #F5F4F0   page background
--card     #FFFFFF   surfaces
--ink      #1A1D24   primary text
--ink-soft #5A6070   secondary text, labels
--rule     #DEDCD5   1px borders
--primary  #243B6B   buttons, focus rings, selected state
--mark     #C4362B   wrong answers and errors ONLY
--correct  #2F6B4E   correct answers ONLY

Red and green are semantic only. Never decorative.

## Type
IBM Plex Serif  — quiz title only
IBM Plex Sans   — all UI and body
IBM Plex Mono   — question numbers, option letters (A/B/C/D), scores, metadata
Scale: 12 / 14 / 16 / 20 / 28 / 40. Body 16px / 1.6. Display 1.15.

## Geometry
- Border radius: 4px everywhere. No exceptions.
- Borders, not shadows. One subtle shadow max, on the active question card.
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 only.
- Max content width 720px, centred.

## Signature
Answer options are an OMR-style bubble row: a mono letter in a 24px circle,
filled solid with --primary when selected. Results screen uses a left
marking margin, like a graded paper.

## Motion
120ms fade on state change. Nothing else. No spring, no stagger, no pulse.

## Copy
Sentence case. Active voice. Buttons name the action ("Generate quiz",
not "Submit"). Errors say what happened and what to do — they never
apologise and never say "Oops". Empty states invite an action.

## BANNED — these read as AI-generated. Do not produce any of them.
- Gradients of any kind. Especially purple/indigo/pink.
- rounded-lg, rounded-xl, rounded-2xl, rounded-full on cards or buttons
- shadow-lg, shadow-xl, glow effects, glassmorphism, backdrop-blur
- Emoji anywhere in the UI
- Sparkle / wand / magic icons, or the word "magic"
- Pill-shaped badges as decoration
- Centred marketing hero with an oversized headline
- Dark mode (out of scope)
- Icons on every element. Icons only where a word would not be faster.
- Tailwind default greys (bg-gray-50 etc). Use the tokens.
- animate-pulse skeletons that don't match real content shape
