// CINEGENY Academy — structured, image-rich curriculum on AI filmmaking.
// Content is plain data so it renders without extra build tooling. Image blocks
// render as captioned illustration slots that can be swapped for real assets later.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'tip'; text: string }
  | { type: 'img'; alt: string; caption: string }
  | { type: 'prompt'; label?: string; text: string }

export interface Lesson {
  slug: string
  title: string
  minutes: number
  summary: string
  body: Block[]
}

export interface Module {
  title: string
  lessons: Lesson[]
}

export interface Level {
  id: string
  badge: string
  title: string
  subtitle: string
  modules: Module[]
}

export const LEVELS: Level[] = [
  {
    id: 'bootcamp',
    badge: 'Free · 7 days',
    title: 'The 7-Day Claude Filmmaking Bootcamp',
    subtitle:
      'The fastest way in: go from a blank page to a finished AI film in one week. Each day is one focused session with worked examples, illustrations and ready-to-copy prompt templates you can paste straight into Claude and your AI tools.',
    modules: [
      {
        title: 'Your 7-day path — from first scene to finished film',
        lessons: [
          {
            slug: 'day-1-your-first-ai-scene',
            title: 'Day 1 — Your first AI scene: describe it, get a full shot plan',
            minutes: 22,
            summary:
              'Talk to Claude like a director and turn a one-line idea into a complete, shoot-ready shot plan.',
            body: [
              { type: 'p', text: 'Today you produce your first real deliverable: a complete shot plan for one scene. You will not generate a single image yet — and that is on purpose. The films that work are planned before they are generated. By the end of this session you will have a numbered list of shots, each with a size, angle, movement, lighting and a one-line intention.' },
              { type: 'h', text: 'What you will build today' },
              { type: 'ul', items: [
                'A one-sentence goal for your scene (your compass).',
                'A beat list: entry, turn, exit.',
                'A numbered shot plan with size, angle, movement, light and intent per shot.',
                'A reusable prompt you can rerun for every future scene.',
              ] },
              { type: 'h', text: 'Talk to Claude like a director' },
              { type: 'p', text: 'Claude is brilliant when you give it a role, a goal, constraints and a format. Vague asks ("write me a scene") give generic results. Specific asks ("you are a director of photography, give me a 6-shot plan for a tense kitchen argument, eye-level, natural light, output as a table") give you something you can actually shoot.' },
              { type: 'ul', items: [
                'Role — who Claude should act as (director, DP, editor).',
                'Goal — the single change the scene must deliver.',
                'Constraints — tone, location, number of shots, look.',
                'Format — list, table, or shot cards, so the answer is usable.',
              ] },
              { type: 'img', alt: 'A four-part diagram: Role, Goal, Constraints, Format feeding into a clean shot list', caption: 'The four ingredients of a director-grade prompt. Miss one and the output drifts toward generic.' },
              { type: 'h', text: 'The method: idea to shot plan' },
              { type: 'ol', items: [
                'Write your scene goal in one sentence ("Maya finds the letter and decides to leave").',
                'List three beats: how we enter, the turning moment, how we leave.',
                'Ask Claude for a shot plan that delivers those beats.',
                'Read each shot and cut anything that does not advance focus, feeling, or story.',
              ] },
              { type: 'prompt', label: 'Prompt — idea to shot plan', text: 'You are an experienced film director and cinematographer.\nTurn my scene idea into a shot-ready plan.\n\nScene idea: <one or two sentences>\nTone: <e.g. tense, tender, playful>\nLocation: <where it happens>\nLength: about <N> shots\n\nReturn a numbered shot list. For each shot give:\n- Shot size (e.g. wide, medium, close-up)\n- Camera angle (low / eye-level / high)\n- Camera movement (static, slow push-in, pan, tracking)\n- Lighting and mood in one line\n- Intention: what the audience should feel or learn\n\nThen add one sentence on the single emotional change the scene delivers.' },
              { type: 'h', text: 'How to read your shot plan' },
              { type: 'p', text: 'A good plan starts wider to orient the audience and pushes closer as the stakes rise. Look for a clear "turn" shot — usually a close-up on the decision or discovery. If every shot is the same size, the scene will feel flat; vary the rhythm.' },
              { type: 'img', alt: 'A numbered 6-shot plan from wide establishing to close-up on a decision', caption: 'A typical six-shot scene: orient wide, build in mediums, land the turn on a close-up.' },
              { type: 'prompt', label: 'Prompt — refine a single shot', text: 'Here is shot <N> from my plan:\n<paste the shot>\n\nGive me three alternative versions of this shot that each raise the tension a little more. For each, change only one variable (size, angle, movement, or light) and explain in one line why it works better.' },
              { type: 'h', text: 'Common Day 1 mistakes' },
              { type: 'ul', items: [
                'Skipping the goal sentence — the plan wanders with no compass.',
                'Asking for too many shots — 5 to 8 is plenty for one scene.',
                'No turn beat — the scene becomes two half-scenes with no change.',
                'Accepting the first answer — always ask for one refinement pass.',
              ] },
              { type: 'tip', text: 'Save your favourite prompts in a notes file. By Day 7 you will have a personal prompt library that makes every new project faster.' },
              { type: 'p', text: 'Your task today: pick one tiny moment (someone receives bad news, a first meeting, a goodbye) and produce a complete shot plan with the prompts above. That plan is the seed of everything you build this week.' },
            ],
          },
          {
            slug: 'day-2-ai-visuals-and-characters',
            title: 'Day 2 — AI visuals & characters: generate cinematic images and animate them',
            minutes: 24,
            summary:
              'Write cinematic image prompts, keep a character looking the same across shots, then bring stills to life.',
            body: [
              { type: 'p', text: 'With a shot plan in hand, today you turn shots into images — and keep your character recognisable from shot to shot. Consistency is the number-one thing that separates an amateur AI reel from a believable film, so we focus on it hard.' },
              { type: 'h', text: 'The image-first workflow' },
              { type: 'p', text: 'Generate a strong still for each shot first, then animate the best ones. Stills are fast and cheap to iterate; video is slow and expensive. Locking your look in stills saves you hours later.' },
              { type: 'h', text: 'Anatomy of a cinematic image prompt' },
              { type: 'ul', items: [
                'Subject — who or what, with a few defining details.',
                'Action / pose — what they are doing right now.',
                'Shot — size and angle (medium close-up, low angle).',
                'Lens & light — 35mm, soft window light, golden hour.',
                'Mood & palette — melancholic, teal and amber.',
                'Style & aspect — photoreal cinematic, 16:9.',
              ] },
              { type: 'img', alt: 'A labelled breakdown of a cinematic image prompt with each ingredient highlighted', caption: 'Every strong image prompt answers the same six questions. Keep the order and your results stay consistent.' },
              { type: 'prompt', label: 'Prompt — cinematic still', text: 'Cinematic film still. <subject with 2-3 details>, <action/pose>.\nShot: <size + angle, e.g. medium close-up, slightly low angle>.\nLens & light: <e.g. 35mm, soft directional window light, shallow depth of field>.\nMood & palette: <e.g. quiet tension, teal and amber>.\nStyle: photorealistic, filmic color, fine grain, 16:9.\nNegative: no text, no watermark, no distortion, no extra limbs.' },
              { type: 'h', text: 'Keeping a character consistent' },
              { type: 'p', text: 'Write a character sheet once and reuse the exact same description in every prompt. Treat it like a copy-paste block: identical wording produces a far more identical face than retyping from memory.' },
              { type: 'ol', items: [
                'Define the character in fixed words (age, hair, face, build, signature wardrobe).',
                'Generate a clean reference portrait you are happy with.',
                'Paste the identical character block into every later prompt.',
                'Where your tool supports it, feed the reference image back in for each new shot.',
              ] },
              { type: 'prompt', label: 'Prompt — character sheet', text: 'Create a reusable character description I can paste into every shot.\n\nCharacter: <name>\nFix these forever: approximate age, hair (color/length/style), face shape and notable features, build, skin tone, and one signature wardrobe item.\n\nWrite it as a single dense paragraph of concrete visual details (no backstory, no adjectives like beautiful). I will paste this exact paragraph into all my image prompts to keep the character consistent.' },
              { type: 'tip', text: 'Lock wardrobe and hair early. Changing a jacket or hairstyle between shots is the fastest way to break the illusion that it is the same person.' },
              { type: 'h', text: 'From still to motion' },
              { type: 'p', text: 'Once a still is locked, animate it with a short, motivated movement. Simple moves (slow push-in, gentle parallax, subtle wind) generate far more reliably than complex action. Describe the motion, the duration, and what stays still.' },
              { type: 'prompt', label: 'Prompt — image to video motion brief', text: 'Animate this still into a <N>-second clip.\nCamera: <slow push-in / gentle pan left / static with parallax>.\nSubject motion: <small, natural — e.g. breathing, a slow turn of the head, hair moving in a light breeze>.\nKeep: composition, lighting and the character identical to the still.\nMood: <same as the still>. No abrupt moves, no morphing, no warping of the face.' },
              { type: 'h', text: 'Common Day 2 mistakes' },
              { type: 'ul', items: [
                'Re-describing the character from memory each time (the face drifts).',
                'Over-animating — big actions cause warping; keep motion small.',
                'Skipping the negative prompt, then fighting text and extra limbs.',
                'Animating weak stills — fix the image first, animate second.',
              ] },
              { type: 'p', text: 'Your task today: generate a locked reference for your main character, then a cinematic still for two shots from your Day 1 plan, and animate the strongest one.' },
            ],
          },
          /* BOOTCAMP_LESSONS_END */
        ],
      },
    ],
  },
  {
    id: 'level-1',
    badge: 'Level 1',
    title: 'Foundations of AI Filmmaking',
    subtitle:
      'A complete beginner-to-confident path. No prior experience required — by the end you can plan, shoot, and edit a short film with AI tools.',
    modules: [
      {
        title: 'Module 1 — Thinking in pictures',
        lessons: [
          {
            slug: 'visual-storytelling',
            title: 'Visual storytelling: telling a story without telling it',
            minutes: 14,
            summary:
              'Why film is a visual language, and how to make every frame carry meaning.',
            body: [
              { type: 'p', text: 'Film is not "writing with a camera" — it is storytelling through images, motion, and sound. Before you touch any AI tool, you need to think the way a director thinks: every shot should answer the question "what does the audience feel and understand right now?"' },
              { type: 'h', text: 'Show, don\'t tell' },
              { type: 'p', text: 'A character who is nervous can say "I am nervous" — or they can fail to light a cigarette three times. The second version is cinema. Whenever you are tempted to explain something with dialogue, ask whether an image could do it better.' },
              { type: 'img', alt: 'Two side-by-side frames: a person stating they are nervous vs. fumbling with a lighter', caption: 'The same beat told two ways. The image on the right makes the audience feel it instead of being told.' },
              { type: 'h', text: 'The three questions for every shot' },
              { type: 'ol', items: [
                'What is the audience supposed to look at? (focus and composition)',
                'What should they feel? (mood, color, pace)',
                'What do they now know that they did not before? (story progression)',
              ] },
              { type: 'tip', text: 'If a shot does not advance at least one of those three things, cut it. Strong films are made in the deletion, not the addition.' },
              { type: 'h', text: 'Story is change' },
              { type: 'p', text: 'A scene works when something changes: a relationship, a goal, a piece of knowledge, an emotional state. "Nothing happens, but beautifully" is the most common beginner trap. Plan the change first, then design the images that deliver it.' },
            ],
          },
          {
            slug: 'breaking-down-a-scene',
            title: 'Breaking a story into scenes and beats',
            minutes: 16,
            summary: 'Turn an idea into a shot-ready structure using scenes, beats, and a one-line goal per scene.',
            body: [
              { type: 'p', text: 'A scene is a unit of story that happens in one place and time and contains one main change. A beat is the smallest unit of change inside a scene. Learning to see beats is what separates random pretty clips from a film that flows.' },
              { type: 'h', text: 'Write a goal line for every scene' },
              { type: 'p', text: 'Before generating anything, write a single sentence per scene: "Maya discovers the letter and decides to leave." That sentence is your compass. If a generated shot does not serve it, you regenerate.' },
              { type: 'img', alt: 'A scene card with goal line, location, beats list, and mood keyword', caption: 'A simple scene card. Fill one out per scene before you generate a single image.' },
              { type: 'h', text: 'The beat list' },
              { type: 'ul', items: [
                'Entry beat — how we arrive in the scene and what the situation is.',
                'Turn beat — the moment something shifts (the discovery, the argument, the choice).',
                'Exit beat — the new situation we leave the scene on.',
              ] },
              { type: 'tip', text: 'Most beginner scenes are missing a clear turn beat. If you cannot name the turn, the scene is probably two half-scenes — split it or strengthen it.' },
            ],
          },
        ],
      },
      {
        title: 'Module 2 — The grammar of the shot',
        lessons: [
          {
            slug: 'shot-sizes',
            title: 'Choosing your shots: from extreme wide to extreme close-up',
            minutes: 18,
            summary: 'The shot-size vocabulary and exactly when to use each one.',
            body: [
              { type: 'p', text: 'Shot size is the single most powerful storytelling control you have. It tells the audience how close, emotionally and physically, they are to a moment.' },
              { type: 'h', text: 'The core sizes' },
              { type: 'ul', items: [
                'Extreme wide (establishing): where are we, how big is the world. Great for openings and scale.',
                'Wide / full: the whole body in context. Good for action and blocking.',
                'Medium: waist up. The workhorse of dialogue.',
                'Close-up: face fills the frame. Emotion, decisions, reactions.',
                'Extreme close-up: an eye, a hand, an object. Tension and detail.',
              ] },
              { type: 'img', alt: 'A vertical ladder of the five shot sizes on the same subject', caption: 'The shot-size ladder. Moving down the ladder increases intimacy and intensity.' },
              { type: 'h', text: 'How to choose' },
              { type: 'p', text: 'Match size to emotional distance. Start a scene wider to orient the audience, then push closer as stakes rise. Save your tightest shots for your most important moments — if everything is a close-up, nothing is.' },
              { type: 'tip', text: 'When prompting an AI tool, always state the shot size explicitly ("medium close-up, eye-level"). Vague prompts default to generic medium shots and your edit will feel flat.' },
            ],
          },
          {
            slug: 'camera-angles-movement',
            title: 'Angles and movement: where the camera sits and how it moves',
            minutes: 17,
            summary: 'High vs low angles, eye-level, and the meaning of pans, tilts, pushes, and tracking.',
            body: [
              { type: 'h', text: 'Angle = power' },
              { type: 'ul', items: [
                'Low angle (looking up): makes a subject powerful, heroic, or threatening.',
                'High angle (looking down): makes a subject small, vulnerable, observed.',
                'Eye-level: neutral, honest, relatable.',
                'Dutch tilt (tilted horizon): unease, disorientation — use sparingly.',
              ] },
              { type: 'img', alt: 'Same character shot from low, eye-level, and high angle', caption: 'Angle changes how we judge a character before they say a word.' },
              { type: 'h', text: 'Movement with intent' },
              { type: 'p', text: 'A slow push-in builds tension or revelation. A tracking shot follows energy and keeps us with a character. A handheld feel adds rawness. Movement should be motivated — by emotion or by a subject in motion — never just because you can.' },
              { type: 'tip', text: 'For AI video, simple, motivated moves (slow push-in, gentle parallax) generate far more reliably than complex crane moves. Start simple.' },
            ],
          },
          {
            slug: 'composition',
            title: 'Composition: arranging the frame',
            minutes: 15,
            summary: 'Rule of thirds, headroom, leading lines, balance, and negative space.',
            body: [
              { type: 'p', text: 'Composition is how you arrange everything inside the frame to guide the eye and create feeling.' },
              { type: 'ul', items: [
                'Rule of thirds: place key elements on the third-lines, not dead center (unless you want symmetry on purpose).',
                'Headroom and look-room: leave space in the direction a subject faces or moves.',
                'Leading lines: roads, rails, hallways pull the eye toward your subject.',
                'Negative space: emptiness creates loneliness, calm, or tension.',
                'Balance: distribute visual weight so the frame does not feel lopsided (unless that is the point).',
              ] },
              { type: 'img', alt: 'A frame with rule-of-thirds grid overlay and leading lines marked', caption: 'A thirds grid with leading lines. Notice how the eye travels to the subject automatically.' },
              { type: 'tip', text: 'Describe composition in prompts: "subject on left third, deep hallway leading right, lots of negative space above." Specific composition language is one of the biggest quality upgrades you can make.' },
            ],
          },
        ],
      },
      {
        title: 'Module 3 — Light, color, and art direction',
        lessons: [
          {
            slug: 'lighting-basics',
            title: 'Lighting: shaping mood with light and shadow',
            minutes: 16,
            summary: 'Key/fill/back light, hard vs soft, and how light direction creates emotion.',
            body: [
              { type: 'h', text: 'Three-point lighting' },
              { type: 'ul', items: [
                'Key light: the main light, sets the look and direction.',
                'Fill light: softens shadows so detail survives.',
                'Back/rim light: separates the subject from the background.',
              ] },
              { type: 'img', alt: 'Diagram of key, fill, and back light around a subject', caption: 'The classic three-point setup — the mental model behind most cinematic looks.' },
              { type: 'h', text: 'Hard vs soft, and direction' },
              { type: 'p', text: 'Hard light (small source) gives sharp, dramatic shadows. Soft light (large source) flatters and calms. Side light reveals texture and drama; flat front light hides it. Underlight feels eerie; toplight feels oppressive.' },
              { type: 'tip', text: 'In prompts, lighting words do heavy lifting: "soft window light from camera left, warm practical lamps, deep shadows." Name the source, direction, and quality.' },
            ],
          },
          {
            slug: 'color-art-direction',
            title: 'Color and art direction: building a world that feels intentional',
            minutes: 18,
            summary: 'Color palettes, color contrast, production design, props, wardrobe, and visual consistency.',
            body: [
              { type: 'p', text: 'Art direction is everything the audience sees that is not the actors: sets, props, wardrobe, textures, and color. It is what makes a film feel like a designed world rather than random footage.' },
              { type: 'h', text: 'Build a palette' },
              { type: 'p', text: 'Pick a small color palette and stick to it. Teal-and-orange, muted earth tones, cold blues — a consistent palette makes a film feel authored. Use color contrast to make your subject pop against the background.' },
              { type: 'img', alt: 'A film still beside its extracted 5-color palette swatches', caption: 'Pull a palette from a reference you love, then design your shots toward it.' },
              { type: 'h', text: 'Consistency is everything' },
              { type: 'ul', items: [
                'Define your world in a short "art bible": era, location, mood, palette, key props.',
                'Reuse the same descriptors across every prompt so the world stays coherent.',
                'Wardrobe and props should reinforce character — the worn jacket, the new phone.',
              ] },
              { type: 'tip', text: 'Inconsistency is the #1 tell of amateur AI film. A written art bible you paste into every prompt is the cheapest fix for it.' },
            ],
          },
        ],
      },
      {
        title: 'Module 4 — Prompting and image sequencing',
        lessons: [
          {
            slug: 'prompting-basics',
            title: 'Prompting fundamentals: getting the image you actually pictured',
            minutes: 20,
            summary: 'The anatomy of a strong prompt and a repeatable prompt template.',
            body: [
              { type: 'p', text: 'A prompt is a shot description. The more like a real shot description it reads, the better your results.' },
              { type: 'h', text: 'A reliable prompt template' },
              { type: 'ol', items: [
                'Subject + action: who/what and what they are doing.',
                'Shot size + angle: "medium close-up, low angle, eye-level".',
                'Setting + time: location, time of day, weather.',
                'Lighting: source, direction, quality.',
                'Mood + color: palette and emotional tone.',
                'Style/lens: "35mm, shallow depth of field, cinematic".',
              ] },
              { type: 'img', alt: 'A labeled prompt broken into its six components', caption: 'Every strong prompt is the same six ingredients in order. Memorize the order.' },
              { type: 'tip', text: 'Change one variable at a time when iterating. If you change five things between generations, you will never learn what actually helped.' },
            ],
          },
          {
            slug: 'image-sequencing',
            title: 'Image sequencing and continuity: making separate shots feel like one scene',
            minutes: 19,
            summary: 'How to order shots so they cut together cleanly, with screen direction and the 180° rule.',
            body: [
              { type: 'p', text: 'A scene is many shots that must feel like a single continuous reality. This is the part beginners most often get wrong: each shot looks fine alone, but they do not flow.' },
              { type: 'h', text: 'The 180° rule and screen direction' },
              { type: 'p', text: 'Keep your camera on one side of the action line so characters stay on consistent sides of the frame. If A looks right at B in one shot, B should look left at A in the reverse. Break this and the audience feels disoriented without knowing why.' },
              { type: 'img', alt: 'Top-down diagram of the 180-degree line between two characters', caption: 'Stay on one side of the line so eyelines and movement stay consistent across cuts.' },
              { type: 'h', text: 'Continuity checklist for AI shots' },
              { type: 'ul', items: [
                'Same wardrobe, hair, and props across every shot of the scene.',
                'Consistent lighting direction and time of day.',
                'Matching screen direction for movement and eyelines.',
                'A consistent character description block reused in every prompt.',
              ] },
              { type: 'h', text: 'Coverage: shoot more than you need' },
              { type: 'p', text: 'Generate a wide, mediums, and close-ups of the same beat. Having "coverage" lets you fix pacing and continuity in the edit instead of being stuck with one angle.' },
              { type: 'tip', text: 'Lock a "character sheet" (a fixed paragraph describing your character) and paste it identically into every shot prompt. Consistency in equals consistency out.' },
            ],
          },
        ],
      },
      {
        title: 'Module 5 — Editing and sound',
        lessons: [
          {
            slug: 'editing-rhythm',
            title: 'Editing and rhythm: assembling shots into a scene',
            minutes: 17,
            summary: 'Cutting on action, pacing, the J-cut and L-cut, and finding the rhythm of a scene.',
            body: [
              { type: 'h', text: 'The cut is invisible when it is motivated' },
              { type: 'ul', items: [
                'Cut on action: cut during a movement and it feels seamless.',
                'Cut on emotion: hold a beat longer to let a feeling land before cutting.',
                'Pace with tension: shorter shots accelerate; longer shots breathe.',
              ] },
              { type: 'img', alt: 'A timeline showing shot lengths shrinking as a scene builds tension', caption: 'Shot length is rhythm. Tightening cuts as the scene escalates is a classic technique.' },
              { type: 'h', text: 'J-cuts and L-cuts' },
              { type: 'p', text: 'Let sound lead or trail the picture. Hearing the next scene before you see it (J-cut), or carrying a voice over the next image (L-cut), makes edits feel smooth and professional.' },
            ],
          },
          {
            slug: 'sound-design',
            title: 'Sound: the half of film you cannot see',
            minutes: 14,
            summary: 'Dialogue, ambience, sound effects, and music — and why sound carries emotion.',
            body: [
              { type: 'p', text: 'Audiences forgive imperfect images far more than bad sound. Sound is often half of the emotional impact of a scene.' },
              { type: 'ul', items: [
                'Dialogue: clear and intelligible above all.',
                'Ambience (room tone): the invisible "presence" that makes a space feel real.',
                'Sound effects: footsteps, doors, cloth — they sell physical reality.',
                'Music: sets emotion, but should support the scene, not smother it.',
              ] },
              { type: 'img', alt: 'A four-layer audio timeline: dialogue, ambience, effects, music', caption: 'Think in layers. A believable scene usually has all four working together.' },
              { type: 'tip', text: 'Add quiet room tone under every scene. Total silence feels broken; subtle ambience makes everything feel grounded.' },
            ],
          },
          {
            slug: 'first-short-film',
            title: 'Project: make your first 60-second film',
            minutes: 25,
            summary: 'Put it all together in a guided, end-to-end mini production.',
            body: [
              { type: 'p', text: 'Now you apply everything. Keep it tiny on purpose — one location, one or two characters, one clear change.' },
              { type: 'ol', items: [
                'Write a one-sentence goal line for your single scene.',
                'List 3 beats: entry, turn, exit.',
                'Plan 6–8 shots using varied shot sizes and at least one push-in.',
                'Write a character sheet and an art bible block to reuse in every prompt.',
                'Generate coverage (wide + mediums + close-ups) for each beat.',
                'Edit for rhythm, cutting on action; add ambience, effects, and light music.',
                'Watch it muted, then with eyes closed — fix whichever half is weaker.',
              ] },
              { type: 'tip', text: 'Finish it. A finished 60-second film teaches you more than ten unfinished "epics". Ship, then level up.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'level-2',
    badge: 'Level 2',
    title: 'Advanced & Technical Production',
    subtitle:
      'For creators who have made a short and want control, consistency, and polish. Deep prompt engineering, character/world consistency, grading, VFX, and a professional pipeline.',
    modules: [
      {
        title: 'Module 1 — Advanced prompt engineering',
        lessons: [
          {
            slug: 'prompt-refinement',
            title: 'Prompt refinement: precision, weighting, and negative prompts',
            minutes: 22,
            summary: 'Token weighting, emphasis, ordering effects, and using negative prompts to remove artifacts.',
            body: [
              { type: 'p', text: 'At this level, prompting becomes engineering. Small, deliberate changes produce predictable results, and you keep a log of what works.' },
              { type: 'h', text: 'Order, emphasis, and weighting' },
              { type: 'ul', items: [
                'Front-load what matters: most models weight earlier tokens more heavily.',
                'Emphasis/weighting (where supported): increase the influence of critical terms instead of repeating them randomly.',
                'Group related descriptors: keep lighting words together, composition words together — scattered terms dilute each other.',
              ] },
              { type: 'img', alt: 'Two generations of the same prompt, one front-loaded, showing stronger adherence', caption: 'Re-ordering the same words changes the result. Put the non-negotiables first.' },
              { type: 'h', text: 'Negative prompts' },
              { type: 'p', text: 'Negative prompts remove what you do not want: extra fingers, warped faces, text artifacts, oversaturation. Build a reusable negative-prompt block and refine it over time.' },
              { type: 'tip', text: 'Keep a prompt journal: prompt, seed, settings, and a 1–5 rating. Your journal becomes your most valuable asset — far more than any single prompt.' },
            ],
          },
          {
            slug: 'seeds-parameters',
            title: 'Seeds, samplers, and parameters: controlled, repeatable output',
            minutes: 20,
            summary: 'How seeds, steps, guidance scale, and samplers affect images, and how to iterate scientifically.',
            body: [
              { type: 'h', text: 'The seed is your save point' },
              { type: 'p', text: 'A fixed seed reproduces the same generation. Lock a seed once you find a composition you like, then tweak the prompt to refine while keeping the overall layout.' },
              { type: 'ul', items: [
                'Steps: more steps = more detail/coherence up to a point, then diminishing returns.',
                'Guidance scale (CFG): higher follows the prompt more strictly but can look harsh; lower is more creative but looser.',
                'Sampler/scheduler: affects texture and convergence — pick one and standardize.',
                'Resolution/aspect ratio: choose your cinematic aspect early (e.g., 2.39:1 or 16:9).',
              ] },
              { type: 'img', alt: 'A grid varying CFG and steps for the same seed and prompt', caption: 'A parameter sweep on a fixed seed. This is how you learn a model instead of guessing.' },
              { type: 'tip', text: 'Change one parameter at a time across a grid. A 4×4 sweep teaches you a model faster than 100 random generations.' },
            ],
          },
        ],
      },
      {
        title: 'Module 2 — Consistency at scale',
        lessons: [
          {
            slug: 'character-consistency',
            title: 'Character consistency: the same person across a whole film',
            minutes: 24,
            summary: 'Reference images, character sheets, identity locks, and techniques to keep faces and wardrobe stable.',
            body: [
              { type: 'p', text: 'The biggest technical challenge in AI film is keeping a character identical across dozens of shots. Solve this and your work jumps to professional level.' },
              { type: 'ul', items: [
                'Master reference: lock a definitive front + 3/4 + profile reference set of your character.',
                'Character sheet: a fixed, detailed text block (age, face, hair, build, wardrobe) pasted into every prompt unchanged.',
                'Identity tools: use reference-image / face-lock / character-reference features where your tool supports them.',
                'Seed discipline: reuse seeds and reference strength settings that proved stable.',
              ] },
              { type: 'img', alt: 'A character reference sheet with front, three-quarter, and profile views plus wardrobe notes', caption: 'A proper character sheet. This is the source of truth you protect at all costs.' },
              { type: 'tip', text: 'Decide wardrobe and hairstyle once and never describe them differently. A single changed adjective ("messy" vs "tousled") can shift the identity.' },
            ],
          },
          {
            slug: 'world-consistency',
            title: 'World and environment consistency',
            minutes: 18,
            summary: 'Keeping locations, time of day, and palette stable across an entire sequence.',
            body: [
              { type: 'p', text: 'Worlds drift even faster than characters. A hallway changes length, a window moves, the time of day shifts mid-conversation. Treat locations like characters with their own reference sheets.' },
              { type: 'ul', items: [
                'Location sheet: establishing reference + key angles + lighting notes.',
                'Lock time-of-day and weather descriptors for the whole scene.',
                'Reuse the palette block from your art bible everywhere.',
                'Generate an establishing shot first, then derive matching coverage from it.',
              ] },
              { type: 'img', alt: 'A location reference board with establishing view and angle variations', caption: 'A location board keeps a single space coherent across every angle you generate.' },
            ],
          },
        ],
      },
      {
        title: 'Module 3 — Finishing: grading, upscaling, VFX',
        lessons: [
          {
            slug: 'color-grading',
            title: 'Color grading: the final 20% that looks like 80%',
            minutes: 19,
            summary: 'Primary vs secondary grading, matching shots, LUTs, and building a consistent film look.',
            body: [
              { type: 'h', text: 'Grade in two passes' },
              { type: 'ol', items: [
                'Primary: balance exposure and white balance so every shot matches.',
                'Secondary: shape mood — push shadows cool, warm the highlights, isolate and adjust skin tones.',
              ] },
              { type: 'img', alt: 'Before and after of a graded shot with scopes shown', caption: 'Match first, then style. Use scopes, not just your eyes, to keep shots consistent.' },
              { type: 'h', text: 'A consistent look' },
              { type: 'p', text: 'Develop or choose a LUT/look and apply it across the film, then hand-tune per shot. Consistency of grade is a huge part of what makes footage feel like one film.' },
              { type: 'tip', text: 'Grade on a calibrated screen and check skin tones on the vectorscope. Monitors lie; scopes do not.' },
            ],
          },
          {
            slug: 'upscaling-cleanup',
            title: 'Upscaling, interpolation, and artifact cleanup',
            minutes: 16,
            summary: 'Getting to delivery resolution, smoothing motion, and removing AI artifacts.',
            body: [
              { type: 'ul', items: [
                'Upscale to your delivery resolution (e.g., 1080p/4K) with a quality upscaler, not naive scaling.',
                'Frame interpolation can smooth motion or hit a target frame rate — use carefully to avoid the "soap opera" look.',
                'Clean up flicker, warping, and temporal instability with stabilization and denoise passes.',
                'Fix faces/hands selectively with inpainting rather than regenerating whole shots.',
              ] },
              { type: 'img', alt: 'A zoomed crop before and after artifact cleanup and upscaling', caption: 'Targeted cleanup on the crop that matters beats regenerating the entire shot.' },
            ],
          },
          {
            slug: 'vfx-compositing',
            title: 'VFX and compositing: layering elements convincingly',
            minutes: 21,
            summary: 'Masking, keying, integrating elements, and matching light and grain.',
            body: [
              { type: 'p', text: 'Compositing combines multiple sources into one believable image: a generated character over a generated background, an added effect, a sky replacement.' },
              { type: 'ul', items: [
                'Match perspective, scale, and camera motion between layers.',
                'Match light direction and color so elements share the same world.',
                'Add matching grain and slight blur so a sharp element does not "float".',
                'Use masks and roto to place elements in front of and behind subjects.',
              ] },
              { type: 'img', alt: 'A composite breakdown showing background, subject, effect, and grain layers', caption: 'A composite is only as convincing as its weakest match — light, grain, and motion must agree.' },
              { type: 'tip', text: 'The secret to believable compositing is imperfection: add the same noise, blur, and chromatic aberration the rest of the frame has.' },
            ],
          },
        ],
      },
      {
        title: 'Module 4 — The professional pipeline',
        lessons: [
          {
            slug: 'production-pipeline',
            title: 'Building a repeatable production pipeline',
            minutes: 22,
            summary: 'From script to delivery: organizing assets, versions, naming, and a workflow that scales.',
            body: [
              { type: 'p', text: 'A pipeline is the difference between finishing one short and being able to produce consistently. It is mostly organization.' },
              { type: 'ol', items: [
                'Pre-production: script, scene cards, character/location sheets, art bible, prompt journal.',
                'Generation: shot list with per-shot prompts, seeds, and settings; generate coverage.',
                'Assembly: organized folders, strict naming (scene_shot_take_version), an editorial timeline.',
                'Finishing: grade, sound, upscale, VFX, titles.',
                'Delivery: export presets, aspect ratio, loudness normalization, archive of project + assets.',
              ] },
              { type: 'img', alt: 'A pipeline diagram from script through delivery with asset folders', caption: 'A clear pipeline turns a chaotic project into a repeatable, scalable process.' },
              { type: 'tip', text: 'Name and version everything from day one. "final_FINAL_v3_real.mp4" is a symptom; a naming convention is the cure.' },
            ],
          },
          {
            slug: 'quality-optimization',
            title: 'Quality optimization and quality control',
            minutes: 18,
            summary: 'A QC checklist, common failure modes, and how to systematically raise quality.',
            body: [
              { type: 'h', text: 'A QC pass before you call it done' },
              { type: 'ul', items: [
                'Continuity: wardrobe, props, eyelines, screen direction across every cut.',
                'Identity: the character is unmistakably the same person throughout.',
                'Grade: shots match; skin tones are natural; no shot jumps out.',
                'Motion: no jarring flicker, warping, or interpolation artifacts.',
                'Audio: dialogue clear, ambience present, levels normalized.',
                'Story: the central change still reads clearly at full speed.',
              ] },
              { type: 'img', alt: 'A QC checklist overlaid on a near-final timeline', caption: 'Run the same QC checklist every time. Consistency in process produces consistency in quality.' },
              { type: 'tip', text: 'Get fresh eyes. You stop seeing your own film after the tenth viewing — one honest test viewer catches what you cannot.' },
            ],
          },
        ],
      },
    ],
  },
]

export function getLesson(levelId: string, slug: string) {
  const level = LEVELS.find((l) => l.id === levelId)
  if (!level) return null
  for (const mod of level.modules) {
    const lesson = mod.lessons.find((ls) => ls.slug === slug)
    if (lesson) return { level, module: mod, lesson }
  }
  return null
}

export function totalMinutes(level: Level) {
  return level.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.minutes, 0),
    0,
  )
}

export function lessonCount(level: Level) {
  return level.modules.reduce((sum, m) => sum + m.lessons.length, 0)
}
