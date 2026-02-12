// Narrative banks for area progression.
// Keep these as data only so it is easy to expand without touching logic.

export const BANKS = {
  fantasy: {
    areaTypes: [
      { id: "ruins", names: ["Mossy Ruins", "Crumbling Courtyard", "Fern Covered Hall", "Broken Gate", "Stone Garden"] , targetRange: [80, 120] },
      { id: "tunnels", names: ["Breezy Tunnels", "Echo Passages", "Root Burrows", "Dripstone Walk", "Wind Cut Steps"] , targetRange: [85, 125] },
      { id: "library", names: ["Sunken Library", "Dust Archive", "Silent Stacks", "Ink Vault", "Silt Shelves"] , targetRange: [90, 135] },
      { id: "orchard", names: ["Ash Orchard", "Twilight Grove", "Cinder Trees", "Black Bark Row", "Fallen Fruit Path"] , targetRange: [75, 115] },
      { id: "cliffs", names: ["Crystal Steps", "Glitter Ridge", "Shard Stair", "Frost Spark Ledge", "Bright Edge"] , targetRange: [90, 130] }
    ],
    ambientA: [
      "Cold mist clings to broken stone",
      "The air smells wet and ancient",
      "Loose gravel shifts under your boots",
      "A distant drip keeps time",
      "Moths circle a faint glow",
      "The walls are slick with moss",
      "Wind threads through cracks like a whisper",
      "Something tiny skitters and stops"
    ],
    ambientB: [
      "You keep your breathing steady",
      "Your hands feel warm and ready",
      "Your focus lands like a lantern",
      "You listen for danger and for hope",
      "You move with quiet confidence",
      "You are here and that counts"
    ],
    landmarks: [
      "Ahead, a collapsed arch forms a low crawl",
      "A bent statue points deeper into the dark",
      "You spot fresh scratches on the stone",
      "A narrow stair descends into colder air",
      "Faint footprints disappear behind a pillar",
      "A broken banner flutters where there is no wind",
      "A cracked bridge spans a shallow drop",
      "A doorframe stands alone, like a warning"
    ],
    thresholds: [
      "You are just getting started here",
      "You are deeper now, and the place feels awake",
      "Halfway through, the silence grows heavier",
      "Close to the core, the air tightens",
      "The heart of the area is within reach"
    ],
    minorEnemies: [
      "Moss Slime", "Pebble Gremlin", "Fog Moth", "Creaky Vine", "Mud Sprite", "Rubble Rat",
      "Whisper Beetle", "Root Snare", "Silt Leech", "Gloom Tadpole"
    ],
    eliteEnemies: [
      "Stone Sentinel", "Gatekeeper Wisp", "Briar Knight", "Mire Stalker", "Cracked Golem"
    ],
    ambushEnemies: ["Skittering Raider", "Cave Stalker", "Hexed Wisp", "Rust Bandit", "Grim Sentry"],
    ambushLines: ["Ambush. Movement in the dark", "A sudden threat interrupts your work", "Warning signs flare. Contact incoming"],

    bosses: [
      "Old Stone Sentinel", "Slime Baron", "Warden of the Steps", "Ink Devourer", "Cinder Regent"
    ],
    bossDefeat: [
      "The ground settles as the threat fades",
      "A hush rolls through the area like relief",
      "The last echo breaks, and the path opens",
      "Your victory feels earned, not given"
    ],
    escapeLines: [
      "The foe slips into the cracks and vanishes",
      "It retreats into the fog, wounded but smug",
      "You blink, and it is gone, leaving only silence",
      "It scrambles away, promising trouble later"
    ],
    returnLines: [
      "A familiar presence returns, bitter and stronger",
      "You recognize it instantly, and it recognizes you",
      "It returns with fresh scars and fresh anger",
      "It steps from the dark like it never left"
    ],
    returnDefeat: [
      "This time, it does not escape",
      "You end the chase for good",
      "The area exhales as the threat finally falls"
    ]
  ,
    supportKinds: {
      rescue: { label: "Rescue", barLabel: "Rescue progress" },
      repair: { label: "Repair", barLabel: "Stability" },
      unlock: { label: "Unlock", barLabel: "Override" },
      assist: { label: "Assist", barLabel: "Support" }
    },
    supportComplete: [
      "You steady the situation and move on",
      "The people here are safer because of you",
      "You restore order and keep going"
    ],
    supportResume: ["Threat cleared. You return to the objective", "Area secured. Continue the mission", "The interruption ends. You press on", "You regroup and continue the work"],

    supportMissions: [
      { kind: "assist", title: "Assist: Teach breathing drills", detail: "Distant dripping echoes through broken stone. In Ink Vault, you must teach breathing drills before moving on." },
      { kind: "assist", title: "Assist: Disarm a lingering trap", detail: "Distant dripping echoes through silted steps. In Silent Stacks, you must disarm a lingering trap before moving on." },
      { kind: "repair", title: "Repair the warped doorframe", detail: "Water trickles beneath crumbled mortar. In Echo Passages, the warped doorframe threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the splintered dock", detail: "Mist curls around cracked tiles. In Silent Stacks, the splintered dock threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the warded archive vault", detail: "Pebbles skitter across cracked tiles. The warded archive vault blocks forward progress in Silent Stacks. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the broken bridge", detail: "Shadows stretch across wet cobbles. In Root Burrows, the broken bridge threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Light signal fires", detail: "Cold air settles in silted steps. In Stone Garden, you must light signal fires before moving on." },
      { kind: "unlock", title: "Unlock the collapsed vent", detail: "Vines creep along wet cobbles. The collapsed vent blocks forward progress in Mossy Ruins. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the sealed catacomb arch", detail: "Footsteps scrape across dripping ivy. The sealed catacomb arch blocks forward progress in Silent Stacks. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Raise a warning banner", detail: "Old magic crackles near twisted roots. In Silent Stacks, you must raise a warning banner before moving on." },
      { kind: "assist", title: "Assist: Fix a torn pack strap", detail: "Water trickles beneath old brasswork. In Fallen Atrium, you must fix a torn pack strap before moving on." },
      { kind: "assist", title: "Assist: Escort a healer", detail: "Distant dripping echoes through mossy pillars. In Echo Passages, you must escort a healer before moving on." },
      { kind: "rescue", title: "Rescue the stuck spelunker", detail: "Torchlight flickers over sunken beams. A beacon pings from Ink Vault. You locate a stuck spelunker and begin the extraction." },
      { kind: "rescue", title: "Rescue the bewildered bard", detail: "Torchlight flickers over rune-carved walls. A beacon pings from Fallen Atrium. You locate a bewildered bard and begin the extraction." },
      { kind: "unlock", title: "Unlock the stuck winch gate", detail: "Shadows stretch across rune-carved walls. The stuck winch gate blocks forward progress in Echo Passages. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the isolated monk", detail: "Shadows stretch across cracked tiles. A beacon pings from Echo Passages. You locate a isolated monk and begin the extraction." },
      { kind: "unlock", title: "Unlock the cursed cellar latch", detail: "Shadows stretch across broken stone. The cursed cellar latch blocks forward progress in Wind Cut Steps. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the sagging beam", detail: "Old magic crackles near broken stone. In Ink Vault, the sagging beam threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the sigil-bound cabinet", detail: "A low chant rises from splintered planks. The sigil-bound cabinet blocks forward progress in Fallen Atrium. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the blocked stairwell", detail: "Shadows stretch across sunken beams. The blocked stairwell blocks forward progress in Echo Passages. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the shattered ward stone", detail: "Moonlight spills onto cold iron. In Crumbling Courtyard, the shattered ward stone threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the fallen stone slab", detail: "Dust hangs heavy in shattered glass. The fallen stone slab blocks forward progress in Silent Stacks. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the sunken trapdoor", detail: "Shadows stretch across ancient shelves. The sunken trapdoor blocks forward progress in Crumbling Courtyard. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Help rebuild a fence", detail: "Torchlight flickers over ancient shelves. In Sunken Library, you must help rebuild a fence before moving on." },
      { kind: "assist", title: "Assist: Mediate a dispute", detail: "Pebbles skitter across shattered glass. In Root Burrows, you must mediate a dispute before moving on." },
      { kind: "rescue", title: "Rescue the storm-tossed sailor", detail: "Pebbles skitter across cold iron. A beacon pings from Sunken Library. You locate a storm-tossed sailor and begin the extraction." },
      { kind: "unlock", title: "Unlock the thorn-wrapped doorway", detail: "Moonlight spills onto crumbled mortar. The thorn-wrapped doorway blocks forward progress in Crumbling Courtyard. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the frightened villager", detail: "Distant dripping echoes through crumbled mortar. A beacon pings from Fallen Atrium. You locate a frightened villager and begin the extraction." },
      { kind: "repair", title: "Repair the failing lantern line", detail: "Pebbles skitter across fallen arches. In Fallen Atrium, the failing lantern line threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the faulty trap reset", detail: "A faint glow pulses from splintered planks. In Mossy Ruins, the faulty trap reset threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the jammed stone wheel", detail: "Cold air settles in mossy pillars. The jammed stone wheel blocks forward progress in Echo Passages. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Carry supplies uphill", detail: "Moonlight spills onto rune-carved walls. In Dripstone Walk, you must carry supplies uphill before moving on." },
      { kind: "rescue", title: "Rescue the stunned hunter", detail: "A soft wind sighs through ancient shelves. A beacon pings from Fallen Atrium. You locate a stunned hunter and begin the extraction." },
      { kind: "assist", title: "Assist: Tend a wounded ally", detail: "Shadows stretch across ancient shelves. In Dripstone Walk, you must tend a wounded ally before moving on." },
      { kind: "repair", title: "Repair the ruined camp stove", detail: "Pebbles skitter across broken stone. In Sunken Library, the ruined camp stove threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Guide a caravan", detail: "Mist curls around ancient shelves. In Fallen Atrium, you must guide a caravan before moving on." },
      { kind: "unlock", title: "Unlock the barred chapel door", detail: "Pebbles skitter across fallen arches. The barred chapel door blocks forward progress in Crumbling Courtyard. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the ivy-covered gate", detail: "Mist curls around mossy pillars. The ivy-covered gate blocks forward progress in Ink Vault. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the rusted portcullis", detail: "Moonlight spills onto ancient shelves. The rusted portcullis blocks forward progress in Flooded Cloister. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the hidden study hatch", detail: "Footsteps scrape across fallen arches. The hidden study hatch blocks forward progress in Silent Stacks. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the sealed crypt door", detail: "Distant dripping echoes through ancient shelves. The sealed crypt door blocks forward progress in Crumbling Courtyard. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the broken pulley crane", detail: "Distant dripping echoes through cold iron. In Wind Cut Steps, the broken pulley crane threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the chased farmer", detail: "Old magic crackles near mossy pillars. A beacon pings from Wind Cut Steps. You locate a chased farmer and begin the extraction." },
      { kind: "rescue", title: "Rescue the trapped scholar", detail: "Footsteps scrape across cracked tiles. A beacon pings from Crumbling Courtyard. You locate a trapped scholar and begin the extraction." },
      { kind: "assist", title: "Assist: Share rations with refugees", detail: "A faint glow pulses from twisted roots. In Dripstone Walk, you must share rations with refugees before moving on." },
      { kind: "rescue", title: "Rescue the stranded messenger", detail: "A soft wind sighs through fallen arches. A beacon pings from Ink Vault. You locate a stranded messenger and begin the extraction." },
      { kind: "repair", title: "Repair the tilted watchpost", detail: "A faint glow pulses from shattered glass. In Silent Stacks, the tilted watchpost threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the cornered scout", detail: "Mist curls around ancient shelves. A beacon pings from Mossy Ruins. You locate a cornered scout and begin the extraction." },
      { kind: "rescue", title: "Rescue the shipwrecked traveler", detail: "Pebbles skitter across sunken beams. A beacon pings from Crumbling Courtyard. You locate a shipwrecked traveler and begin the extraction." },
      { kind: "assist", title: "Assist: Warm someone by the fire", detail: "Vines creep along fallen arches. In Root Burrows, you must warm someone by the fire before moving on." },
      { kind: "unlock", title: "Unlock the ancient puzzle lock", detail: "Moonlight spills onto silted steps. The ancient puzzle lock blocks forward progress in Fallen Atrium. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the cracked rune gate", detail: "Vines creep along sunken beams. In Ink Vault, the cracked rune gate threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the shaky scaffold", detail: "Dust hangs heavy in fallen arches. In Fallen Atrium, the shaky scaffold threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Sing to steady nerves", detail: "Cold air settles in ancient shelves. In Wind Cut Steps, you must sing to steady nerves before moving on." },
      { kind: "repair", title: "Repair the damaged waterwheel", detail: "Dust hangs heavy in wet cobbles. In Echo Passages, the damaged waterwheel threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Reunite a family", detail: "Dust hangs heavy in sunken beams. In Silent Stacks, you must reunite a family before moving on." },
      { kind: "rescue", title: "Rescue the wounded knight", detail: "A raven circles above cracked tiles. A beacon pings from Crumbling Courtyard. You locate a wounded knight and begin the extraction." },
      { kind: "rescue", title: "Rescue the tangled druid", detail: "Distant dripping echoes through twisted roots. A beacon pings from Flooded Cloister. You locate a tangled druid and begin the extraction." },
      { kind: "repair", title: "Repair the fractured obelisk", detail: "A soft wind sighs through wet cobbles. In Fallen Atrium, the fractured obelisk threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the captured herbalist", detail: "Old magic crackles near crumbled mortar. A beacon pings from Mossy Ruins. You locate a captured herbalist and begin the extraction." },
      { kind: "repair", title: "Repair the damaged ferry raft", detail: "Shadows stretch across twisted roots. In Root Burrows, the damaged ferry raft threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the lost mapmaker", detail: "Torchlight flickers over rune-carved walls. A beacon pings from Ink Vault. You locate a lost mapmaker and begin the extraction." },
      { kind: "rescue", title: "Rescue the lost courier", detail: "A faint glow pulses from broken stone. A beacon pings from Fallen Atrium. You locate a lost courier and begin the extraction." },
      { kind: "rescue", title: "Rescue the wandering child", detail: "Shadows stretch across broken stone. A beacon pings from Crumbling Courtyard. You locate a wandering child and begin the extraction." },
      { kind: "repair", title: "Repair the snapped rope winch", detail: "Cold air settles in cracked tiles. In Echo Passages, the snapped rope winch threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the moss-choked passage", detail: "A low chant rises from rune-carved walls. The moss-choked passage blocks forward progress in Root Burrows. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the missing apprentice", detail: "Vines creep along cracked tiles. A beacon pings from Echo Passages. You locate a missing apprentice and begin the extraction." },
      { kind: "rescue", title: "Rescue the exhausted miner", detail: "Dust hangs heavy in crumbled mortar. A beacon pings from Silent Stacks. You locate a exhausted miner and begin the extraction." },
      { kind: "repair", title: "Repair the broken lift platform", detail: "A soft wind sighs through crumbled mortar. In Flooded Cloister, the broken lift platform threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the locked reliquary", detail: "Cold air settles in wet cobbles. The locked reliquary blocks forward progress in Echo Passages. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the frozen sluice gate", detail: "Moonlight spills onto rune-carved walls. The frozen sluice gate blocks forward progress in Fallen Atrium. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Map a safe route", detail: "Mist curls around cold iron. In Stone Garden, you must map a safe route before moving on." },
      { kind: "unlock", title: "Unlock the shuttered scribe room", detail: "Old magic crackles near sunken beams. The shuttered scribe room blocks forward progress in Stone Garden. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the cracked bell tower", detail: "A soft wind sighs through silted steps. In Flooded Cloister, the cracked bell tower threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the collapsed stair", detail: "Shadows stretch across twisted roots. In Mossy Ruins, the collapsed stair threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Check on an elder", detail: "A faint glow pulses from ancient shelves. In Dripstone Walk, you must check on an elder before moving on." },
      { kind: "repair", title: "Repair the leaking aqueduct", detail: "Footsteps scrape across dripping ivy. In Crumbling Courtyard, the leaking aqueduct threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the pinned blacksmith", detail: "A soft wind sighs through old brasswork. A beacon pings from Stone Garden. You locate a pinned blacksmith and begin the extraction." },
      { kind: "assist", title: "Assist: Purify tainted water", detail: "Cold air settles in dripping ivy. In Mossy Ruins, you must purify tainted water before moving on." },
      { kind: "assist", title: "Assist: Set up a shelter", detail: "A raven circles above mossy pillars. In Crumbling Courtyard, you must set up a shelter before moving on." },
      { kind: "rescue", title: "Rescue the frozen fisherman", detail: "Distant dripping echoes through shattered glass. A beacon pings from Stone Garden. You locate a frozen fisherman and begin the extraction." },
      { kind: "repair", title: "Repair the unstable crystal seal", detail: "Vines creep along splintered planks. In Wind Cut Steps, the unstable crystal seal threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the fainting guard", detail: "Shadows stretch across shattered glass. A beacon pings from Fallen Atrium. You locate a fainting guard and begin the extraction." },
      { kind: "rescue", title: "Rescue the panicked merchant", detail: "Pebbles skitter across cracked tiles. A beacon pings from Mossy Ruins. You locate a panicked merchant and begin the extraction." },
      { kind: "assist", title: "Assist: Prepare a healing draught", detail: "Water trickles beneath rune-carved walls. In Crumbling Courtyard, you must prepare a healing draught before moving on." },
      { kind: "assist", title: "Assist: Gather herbs for poultices", detail: "A raven circles above sunken beams. In Stone Garden, you must gather herbs for poultices before moving on." },
      { kind: "unlock", title: "Unlock the cramped crawlspace", detail: "Cold air settles in cracked tiles. The cramped crawlspace blocks forward progress in Flooded Cloister. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Bandage blistered hands", detail: "Cold air settles in wet cobbles. In Mossy Ruins, you must bandage blistered hands before moving on." },
      { kind: "rescue", title: "Rescue the injured ranger", detail: "A soft wind sighs through mossy pillars. A beacon pings from Flooded Cloister. You locate a injured ranger and begin the extraction." },
      { kind: "unlock", title: "Unlock the heavy iron hatch", detail: "A faint glow pulses from cracked tiles. The heavy iron hatch blocks forward progress in Crumbling Courtyard. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Train a militia", detail: "Moonlight spills onto fallen arches. In Stone Garden, you must train a militia before moving on." },
      { kind: "assist", title: "Assist: Calm a frightened beast", detail: "Old magic crackles near crumbled mortar. In Crumbling Courtyard, you must calm a frightened beast before moving on." },
      { kind: "repair", title: "Repair the crumbling parapet", detail: "Pebbles skitter across sunken beams. In Stone Garden, the crumbling parapet threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Deliver a sealed letter", detail: "A faint glow pulses from mossy pillars. In Stone Garden, you must deliver a sealed letter before moving on." },
      { kind: "unlock", title: "Unlock the buried shrine door", detail: "A low chant rises from old brasswork. The buried shrine door blocks forward progress in Stone Garden. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the secret tunnel grate", detail: "Torchlight flickers over old brasswork. The secret tunnel grate blocks forward progress in Stone Garden. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the caught beekeeper", detail: "Torchlight flickers over silted steps. A beacon pings from Fallen Atrium. You locate a caught beekeeper and begin the extraction." },
      { kind: "repair", title: "Repair the buckled walkway", detail: "Old magic crackles near crumbled mortar. In Sunken Library, the buckled walkway threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the torn canopy rig", detail: "A raven circles above dripping ivy. In Wind Cut Steps, the torn canopy rig threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the torn banner-signal", detail: "Footsteps scrape across mossy pillars. In Root Burrows, the torn banner-signal threatens your route. You start a careful fix." }
    ]

  },

  space: {
    areaTypes: [
      { id: "derelict", names: ["Derelict Corridor", "Quiet Hangar", "Rusted Airlock", "Shadow Deck", "Cold Cargo Bay"] , targetRange: [80, 120] },
      { id: "field", names: ["Debris Field", "Shattered Belt", "Micro Meteor Drift", "Glinting Scatter", "Broken Orbit"] , targetRange: [90, 130] },
      { id: "station", names: ["Signal Station", "Relay Hub", "Silent Node", "Antenna Spire", "Beacon Shell"] , targetRange: [90, 130] },
      { id: "nebula", names: ["Nebula Veil", "Ion Mist", "Static Bloom", "Aurora Wake", "Vapor Rift"] , targetRange: [90, 140] },
      { id: "vault", names: ["Data Vault", "Core Chamber", "Lockdown Sector", "Cold Server Row", "Cipher Room"] , targetRange: [90, 130] },
],
    ambientA: [
      "Static flickers across your visor",
      "The corridor hums with unstable energy",
      "Dust floats where gravity should hold it",
      "A warning tone repeats and then cuts out",
      "Your suit filters a metallic taste",
      "Condensation beads on cold panels",
      "A distant thump ripples through the hull",
      "Your instruments jitter and settle"
    ],
    ambientB: [
      "You confirm your heading and proceed",
      "You keep your movements deliberate",
      "You log your status and stay calm",
      "You move forward one clean step at a time",
      "You steady your hands and trust the plan",
      "You are still here, and that is progress"
    ],
    landmarks: [
      "A fractured bulkhead exposes sparking wires",
      "A sealed hatch shows fresh scorch marks",
      "A torn cable snakes into the ceiling",
      "A dim console blinks a single green light",
      "Your scanner pings a pocket of interference",
      "A gravity seam tugs at your boots",
      "A thin trail of frost points ahead",
      "A loose panel rattles like a warning"
    ],
    thresholds: [
      "Mission start confirmed",
      "You drift deeper into the sector",
      "Halfway through, the signal sharpens",
      "Near the core, the interference thickens",
      "Core proximity alert"
    ],
    minorEnemies: [
      "Ion Drift", "Debris Cluster", "Signal Echo", "Micro Meteor Swarm", "Static Leech", "Glitch Wisp",
      "Hull Mite", "Grav Ripple", "Noise Bloom", "Quantum Flea"
    ],
    eliteEnemies: [
      "Void Sentry", "Gravity Knot", "Echo Hunter", "Signal Eater", "Plasma Warden"
    ],
    ambushEnemies: ["Interference Drone", "Scrap Skitter", "Boarding Bug", "Static Warden", "Hull Leech"],
    ambushLines: ["Ambush. Contacts on sensors", "Interference spikes. Hostiles inbound", "Warning. Movement behind the bulkhead"],

    bosses: [
      "Void Sentinel", "Gravity Well Prime", "Signal Eater Prime", "Anomaly Overmind", "Core Guardian"
    ],
    bossDefeat: [
      "The sector stabilizes as the anomaly collapses",
      "Your sensors return to steady lines",
      "The interference clears, and the route unlocks",
      "You mark the log with a clean success"
    ],
    escapeLines: [
      "The anomaly destabilizes and slips into the dark",
      "It vents a burst of plasma and retreats beyond sensors",
      "Your lock breaks, and the contact disappears",
      "It warps away, leaving a bitter signal trace"
    ],
    returnLines: [
      "A flagged contact returns, angry and reinforced",
      "Your sensors light up, it is the same signature",
      "The escaped anomaly reappears, stronger than before",
      "A familiar echo returns, and it sounds hostile"
    ],
    returnDefeat: [
      "This time, the signature collapses for good",
      "Contact terminated. No escape route remains",
      "The sector stabilizes as the last trace fades"
    ]
  ,
    supportKinds: {
      rescue: { label: "Rescue", barLabel: "Rescue progress" },
      repair: { label: "Repair", barLabel: "Stability" },
      unlock: { label: "Unlock", barLabel: "Override" },
      assist: { label: "Assist", barLabel: "Support" }
    },
    supportComplete: [
      "Systems stabilize and the route clears",
      "You secure the area and push forward",
      "All clear. The path opens"
    ],
    supportResume: ["Threat cleared. You return to the objective", "Area secured. Continue the mission", "The interruption ends. You press on", "You regroup and continue the work"],

    supportMissions: [
      { kind: "rescue", title: "Rescue the trapped surveyor", detail: "A heat shimmer ripples above the grating. A beacon pings from Vented Catwalk. You locate a trapped surveyor and begin the extraction." },
      { kind: "rescue", title: "Rescue the injured pilot", detail: "A distant clang rings down the servo rails. A beacon pings from Static Trench. You locate a injured pilot and begin the extraction." },
      { kind: "rescue", title: "Rescue the sleeping stowaway", detail: "Dust floats through the pressure seals. A beacon pings from Silent Array. You locate a sleeping stowaway and begin the extraction." },
      { kind: "rescue", title: "Rescue the stunned drone operator", detail: "Dust floats through the vent shafts. A beacon pings from Cryo Deck. You locate a stunned drone operator and begin the extraction." },
      { kind: "unlock", title: "Unlock the shielded conduit door", detail: "A thin beam cuts across the servo rails. The shielded conduit door blocks forward progress in Cryo Deck. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the drifting battery pack", detail: "A distant clang rings down the hatch frame. In Silent Array, the drifting battery pack threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the satcom locker", detail: "A heat shimmer ripples above the deck plating. The satcom locker blocks forward progress in Cryo Deck. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the frayed cable trunk", detail: "Static skitters across the access tunnel. In Broken Airlock, the frayed cable trunk threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Deploy a rescue tether", detail: "A heat shimmer ripples above the fiber bundles. In Flicker Bay, you must deploy a rescue tether before moving on." },
      { kind: "assist", title: "Assist: Set up a triage pad", detail: "A muted alarm repeats near the grating. In Signal Spire, you must set up a triage pad before moving on." },
      { kind: "rescue", title: "Rescue the stranded engineer", detail: "Sparks dance around the ladder rungs. A beacon pings from Derelict Corridor. You locate a stranded engineer and begin the extraction." },
      { kind: "rescue", title: "Rescue the radiation-sick tech", detail: "A thin beam cuts across the control spines. A beacon pings from Dust Ring. You locate a radiation-sick tech and begin the extraction." },
      { kind: "unlock", title: "Unlock the bio-lab lock", detail: "Frost blooms along the vent shafts. The bio-lab lock blocks forward progress in Signal Spire. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Share a ration gel", detail: "A low hum vibrates through the servo rails. In Dust Ring, you must share a ration gel before moving on." },
      { kind: "assist", title: "Assist: Escort civilians", detail: "Frost blooms along the comms mast. In Broken Airlock, you must escort civilians before moving on." },
      { kind: "rescue", title: "Rescue the suffocating mechanic", detail: "Mag boots thump on the bulkheads. A beacon pings from Vented Catwalk. You locate a suffocating mechanic and begin the extraction." },
      { kind: "assist", title: "Assist: Check radiation badges", detail: "Emergency lights strobe over the deck plating. In Gravwell Steps, you must check radiation badges before moving on." },
      { kind: "repair", title: "Repair the broken drone dock", detail: "Warning icons pulse on the ladder rungs. In Signal Spire, the broken drone dock threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the stuck pressure valve", detail: "A thin beam cuts across the grating. In Broken Airlock, the stuck pressure valve threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the drone bay shutter", detail: "A faint ping bounces off the cargo struts. The drone bay shutter blocks forward progress in Silent Array. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Patch a cracked visor", detail: "A faint ping bounces off the reactor shielding. In Signal Spire, you must patch a cracked visor before moving on." },
      { kind: "unlock", title: "Unlock the encrypted bulkhead", detail: "A heat shimmer ripples above the bulkheads. The encrypted bulkhead blocks forward progress in Cryo Deck. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the cornered cadet", detail: "A thin beam cuts across the bulkheads. A beacon pings from Flicker Bay. You locate a cornered cadet and begin the extraction." },
      { kind: "repair", title: "Repair the broken sensor mast", detail: "Emergency lights strobe over the ladder rungs. In Dust Ring, the broken sensor mast threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the cargo container seals", detail: "Frost blooms along the bulkheads. The cargo container seals blocks forward progress in Static Trench. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the override console", detail: "A heat shimmer ripples above the ladder rungs. The override console blocks forward progress in Hollow Hangar. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the cargo bay clamps", detail: "Sparks dance around the pressure seals. The cargo bay clamps blocks forward progress in Broken Airlock. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the stasis pod clasp", detail: "A faint ping bounces off the cargo struts. The stasis pod clasp blocks forward progress in Gravwell Steps. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the jammed stabilizer", detail: "A coolant fog rolls past the servo rails. In Cryo Deck, the jammed stabilizer threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the leaking coolant line", detail: "Mag boots thump on the ladder rungs. In Silent Array, the leaking coolant line threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the glitched door servo", detail: "A heat shimmer ripples above the vent shafts. In Vented Catwalk, the glitched door servo threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Seal a micro-leak", detail: "A distant clang rings down the ladder rungs. In Cryo Deck, you must seal a micro-leak before moving on." },
      { kind: "assist", title: "Assist: Rotate a watch shift", detail: "Static skitters across the ladder rungs. In Hollow Hangar, you must rotate a watch shift before moving on." },
      { kind: "repair", title: "Repair the damaged solar array", detail: "Mag boots thump on the pressure seals. In Static Trench, the damaged solar array threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the leaking suit worker", detail: "Static skitters across the vent shafts. A beacon pings from Gravwell Steps. You locate a leaking suit worker and begin the extraction." },
      { kind: "unlock", title: "Unlock the med bay cabinet lock", detail: "Static skitters across the access tunnel. The med bay cabinet lock blocks forward progress in Hollow Hangar. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Reboot an AI helper", detail: "Sparks dance around the pressure seals. In Static Trench, you must reboot an AI helper before moving on." },
      { kind: "unlock", title: "Unlock the reactor access gate", detail: "A faint ping bounces off the comms mast. The reactor access gate blocks forward progress in Broken Airlock. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the frozen coolant pump", detail: "A muted alarm repeats near the grating. In Cryo Deck, the frozen coolant pump threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the bridge security panel", detail: "Static skitters across the cargo struts. The bridge security panel blocks forward progress in Derelict Corridor. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Resuscitate a comrade", detail: "A thin beam cuts across the pressure seals. In Cryo Deck, you must resuscitate a comrade before moving on." },
      { kind: "rescue", title: "Rescue the holo-medic in distress", detail: "A faint ping bounces off the conduit lattice. A beacon pings from Derelict Corridor. You locate a holo-medic in distress and begin the extraction." },
      { kind: "assist", title: "Assist: Clean an air filter", detail: "A muted alarm repeats near the ladder rungs. In Gravwell Steps, you must clean an air filter before moving on." },
      { kind: "unlock", title: "Unlock the gravity lift cage", detail: "A heat shimmer ripples above the deck plating. The gravity lift cage blocks forward progress in Cryo Deck. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the security door", detail: "A muted alarm repeats near the pressure seals. The security door blocks forward progress in Vented Catwalk. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Teach breathing drills", detail: "Dust floats through the cargo struts. In Orbit Vault, you must teach breathing drills before moving on." },
      { kind: "repair", title: "Repair the burnt circuit rack", detail: "A coolant fog rolls past the hatch frame. In Gravwell Steps, the burnt circuit rack threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the shattered viewport brace", detail: "Sparks dance around the access tunnel. In Cryo Deck, the shattered viewport brace threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the quiet android", detail: "Sparks dance around the fiber bundles. A beacon pings from Signal Spire. You locate a quiet android and begin the extraction." },
      { kind: "repair", title: "Repair the misaligned thruster gimbal", detail: "Warning icons pulse on the vent shafts. In Cryo Deck, the misaligned thruster gimbal threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the maintenance hatch ring", detail: "A coolant fog rolls past the comms mast. The maintenance hatch ring blocks forward progress in Flicker Bay. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the ruptured airlock seal", detail: "A low hum vibrates through the vent shafts. In Flicker Bay, the ruptured airlock seal threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the air duct grate", detail: "Mag boots thump on the deck plating. The air duct grate blocks forward progress in Derelict Corridor. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the signal-hunted rookie", detail: "A faint ping bounces off the pressure seals. A beacon pings from Cryo Deck. You locate a signal-hunted rookie and begin the extraction." },
      { kind: "assist", title: "Assist: Warm someone from hypothermia", detail: "A distant clang rings down the hatch frame. In Vented Catwalk, you must warm someone from hypothermia before moving on." },
      { kind: "assist", title: "Assist: Guide a drone swarm", detail: "A distant clang rings down the access tunnel. In Orbit Vault, you must guide a drone swarm before moving on." },
      { kind: "assist", title: "Assist: Re-route power safely", detail: "A low hum vibrates through the cargo struts. In Silent Array, you must re-route power safely before moving on." },
      { kind: "rescue", title: "Rescue the shipboard botanist", detail: "Emergency lights strobe over the bulkheads. A beacon pings from Broken Airlock. You locate a shipboard botanist and begin the extraction." },
      { kind: "assist", title: "Assist: Secure loose cargo", detail: "Sensor noise crackles near the access tunnel. In Orbit Vault, you must secure loose cargo before moving on." },
      { kind: "unlock", title: "Unlock the sealed hatch", detail: "A faint ping bounces off the comms mast. The sealed hatch blocks forward progress in Dust Ring. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Carry med supplies", detail: "Warning icons pulse on the hatch frame. In Dust Ring, you must carry med supplies before moving on." },
      { kind: "assist", title: "Assist: Log a safe route", detail: "A heat shimmer ripples above the control spines. In Vented Catwalk, you must log a safe route before moving on." },
      { kind: "rescue", title: "Rescue the injured scientist", detail: "A faint ping bounces off the control spines. A beacon pings from Cryo Deck. You locate a injured scientist and begin the extraction." },
      { kind: "unlock", title: "Unlock the data vault lock", detail: "Dust floats through the servo rails. The data vault lock blocks forward progress in Dust Ring. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the sputtering recycler", detail: "A distant clang rings down the control spines. In Orbit Vault, the sputtering recycler threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the panicked technician", detail: "A low hum vibrates through the grating. A beacon pings from Flicker Bay. You locate a panicked technician and begin the extraction." },
      { kind: "repair", title: "Repair the warped docking ring", detail: "A coolant fog rolls past the fiber bundles. In Derelict Corridor, the warped docking ring threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the stalled lift motor", detail: "A distant clang rings down the pressure seals. In Broken Airlock, the stalled lift motor threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the flickering HUD panel", detail: "A low hum vibrates through the ladder rungs. In Cryo Deck, the flickering HUD panel threatens your route. You start a careful fix." },
      { kind: "repair", title: "Repair the bent antenna boom", detail: "A heat shimmer ripples above the cargo struts. In Cryo Deck, the bent antenna boom threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the cryo-thawed passenger", detail: "A thin beam cuts across the vent shafts. A beacon pings from Signal Spire. You locate a cryo-thawed passenger and begin the extraction." },
      { kind: "rescue", title: "Rescue the stuck cargo handler", detail: "A faint ping bounces off the vent shafts. A beacon pings from Derelict Corridor. You locate a stuck cargo handler and begin the extraction." },
      { kind: "unlock", title: "Unlock the hangar shutter", detail: "A coolant fog rolls past the deck plating. The hangar shutter blocks forward progress in Hollow Hangar. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the overheated conduit", detail: "Warning icons pulse on the ladder rungs. In Orbit Vault, the overheated conduit threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the quarantine gate", detail: "Dust floats through the fiber bundles. The quarantine gate blocks forward progress in Gravwell Steps. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the jammed lift panel", detail: "A low hum vibrates through the cargo struts. The jammed lift panel blocks forward progress in Derelict Corridor. You work the mechanism patiently." },
      { kind: "repair", title: "Repair the worn maglock", detail: "A low hum vibrates through the bulkheads. In Derelict Corridor, the worn maglock threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the captured navigator", detail: "Dust floats through the vent shafts. A beacon pings from Broken Airlock. You locate a captured navigator and begin the extraction." },
      { kind: "repair", title: "Repair the cracked gravity plate", detail: "Emergency lights strobe over the control spines. In Vented Catwalk, the cracked gravity plate threatens your route. You start a careful fix." },
      { kind: "unlock", title: "Unlock the maintenance ladder access", detail: "Dust floats through the deck plating. The maintenance ladder access blocks forward progress in Vented Catwalk. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the pressure door", detail: "A coolant fog rolls past the control spines. The pressure door blocks forward progress in Static Trench. You work the mechanism patiently." },
      { kind: "unlock", title: "Unlock the weapon locker seal", detail: "Frost blooms along the servo rails. The weapon locker seal blocks forward progress in Signal Spire. You work the mechanism patiently." },
      { kind: "rescue", title: "Rescue the lost map AI", detail: "Mag boots thump on the fiber bundles. A beacon pings from Gravwell Steps. You locate a lost map AI and begin the extraction." },
      { kind: "repair", title: "Repair the corrupted nav beacon", detail: "Sensor noise crackles near the reactor shielding. In Cryo Deck, the corrupted nav beacon threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the isolated miner", detail: "A muted alarm repeats near the grating. A beacon pings from Silent Array. You locate a isolated miner and begin the extraction." },
      { kind: "unlock", title: "Unlock the server room latch", detail: "Static skitters across the conduit lattice. The server room latch blocks forward progress in Silent Array. You work the mechanism patiently." },
      { kind: "assist", title: "Assist: Calm a panicked crew", detail: "Dust floats through the conduit lattice. In Static Trench, you must calm a panicked crew before moving on." },
      { kind: "repair", title: "Repair the failing power node", detail: "Warning icons pulse on the servo rails. In Orbit Vault, the failing power node threatens your route. You start a careful fix." },
      { kind: "rescue", title: "Rescue the fractured medic", detail: "A coolant fog rolls past the reactor shielding. A beacon pings from Flicker Bay. You locate a fractured medic and begin the extraction." },
      { kind: "repair", title: "Repair the offline comms relay", detail: "A muted alarm repeats near the pressure seals. In Derelict Corridor, the offline comms relay threatens your route. You start a careful fix." },
      { kind: "assist", title: "Assist: Assemble a field kit", detail: "Emergency lights strobe over the hatch frame. In Derelict Corridor, you must assemble a field kit before moving on." },
      { kind: "rescue", title: "Rescue the sealed EVA diver", detail: "A low hum vibrates through the cargo struts. A beacon pings from Cryo Deck. You locate a sealed EVA diver and begin the extraction." },
      { kind: "assist", title: "Assist: Calibrate a scanner", detail: "A distant clang rings down the reactor shielding. In Hollow Hangar, you must calibrate a scanner before moving on." },
      { kind: "assist", title: "Assist: Decode a distress ping", detail: "A low hum vibrates through the ladder rungs. In Gravwell Steps, you must decode a distress ping before moving on." },
      { kind: "rescue", title: "Rescue the fainting courier", detail: "A thin beam cuts across the cargo struts. A beacon pings from Broken Airlock. You locate a fainting courier and begin the extraction." },
      { kind: "assist", title: "Assist: Mark hazards", detail: "Frost blooms along the deck plating. In Hollow Hangar, you must mark hazards before moving on." },
      { kind: "rescue", title: "Rescue the lost maintenance bot", detail: "A distant clang rings down the pressure seals. A beacon pings from Cryo Deck. You locate a lost maintenance bot and begin the extraction." },
      { kind: "assist", title: "Assist: Restore comms etiquette", detail: "A thin beam cuts across the comms mast. In Silent Array, you must restore comms etiquette before moving on." },
      { kind: "assist", title: "Assist: Stabilize oxygen flow", detail: "Emergency lights strobe over the bulkheads. In Broken Airlock, you must stabilize oxygen flow before moving on." },
      { kind: "rescue", title: "Rescue the beacon-chasing scout", detail: "Sensor noise crackles near the pressure seals. A beacon pings from Cryo Deck. You locate a beacon-chasing scout and begin the extraction." }
    ]

  }
}

export function pick(list){
  return list[Math.floor(Math.random() * list.length)]
}
