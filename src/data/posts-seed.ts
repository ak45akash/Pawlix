import type { ContentPost, ContentKind } from "@/types/catalog";
import { postCover } from "@/config/images";
import { estimateReadingMinutes } from "@/lib/html";

function makePost(input: {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  petTypeIds: string[];
  publishedAt: string;
  published?: boolean;
  featured?: boolean;
  servings?: string;
  prepMinutes?: number | null;
  cookMinutes?: number | null;
  focusKeyword?: string;
}): ContentPost {
  const published = input.published ?? true;
  return {
    id: input.id,
    kind: input.kind,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    body: input.body,
    coverImage: input.coverImage,
    petTypeIds: input.petTypeIds,
    published,
    featured: input.featured ?? false,
    readingMinutes: estimateReadingMinutes(input.body),
    servings: input.servings ?? "",
    prepMinutes: input.prepMinutes ?? null,
    cookMinutes: input.cookMinutes ?? null,
    seoTitle: `${input.title} | Pawlix`,
    seoDescription: input.excerpt,
    focusKeyword: input.focusKeyword ?? input.slug.replace(/-/g, " "),
    publishedAt: input.publishedAt,
    updatedAt: input.publishedAt,
    archived: false,
  };
}

export const seedPosts: ContentPost[] = [
  makePost({
    id: "post_food",
    kind: "blog",
    title: "How we choose what goes on the shelf",
    slug: "how-we-choose-food",
    excerpt: "Short lists, readable labels, and recipes we would feed at home.",
    coverImage: postCover("post_food"),
    petTypeIds: ["pet_dog", "pet_cat", "pet_bird"],
    featured: true,
    publishedAt: "2026-08-18T10:00:00.000Z",
    body: `<p>Pawlix keeps a short catalogue on purpose. We would rather stock one food we trust than twenty that look busy on a shelf. The shop floor is small, the storeroom is honest, and every bag has to earn the space it takes.</p>
<p>Most of the questions we get are the same: is this complete, is the protein named, will my dog actually eat it. We answer those before we place an order. If a brand cannot explain a recipe in a minute, it does not belong here.</p>
<h2>What we look for</h2>
<ul>
<li>A named protein near the top of the ingredient list — chicken, fish, lamb — not a vague “meat meal”.</li>
<li>No artificial colour or flavour. Pets do not need a kibble that looks like a sweet.</li>
<li>A feeding guide that matches real bowl sizes, not fantasy portions.</li>
<li>A mill or kitchen we can describe, even if we have only visited through a supplier.</li>
</ul>
<h2>How a product arrives</h2>
<p>We start with a sample, not a pallet. Someone on the team feeds it at home for a week. We watch stool, appetite, and whether the bag is easy to reseal. Only then do we talk about price and how many units will fit next to the counter.</p>
<p>Inventory is shared between the website and the shop. If a recipe is out, it is out everywhere. We would rather show an empty tile than pretend we can ship what is not on the shelf.</p>
<h2>What we skip</h2>
<p>We skip foods that hide sugar, that lean on marketing animals instead of ingredients, and that change formula without saying so. We also skip “limited edition” bags that will vanish before a customer finishes the first one. Everyday feeding should be boring in the best way: the same recipe, the same bag, the same bowl.</p>
<p>If you are switching food, do it slowly. Mix a little of the new into the usual meal over a week. Write to us if a recipe does not sit well — we would rather take it back than have it sit in a cupboard.</p>`,
  }),
  makePost({
    id: "post_play",
    kind: "blog",
    title: "A calmer indoor play hour for cats",
    slug: "indoor-play-for-cats",
    excerpt: "Ten minutes of chase, a pause, then a small meal — that is usually enough.",
    coverImage: postCover("post_play"),
    petTypeIds: ["pet_cat"],
    featured: true,
    publishedAt: "2026-08-22T09:00:00.000Z",
    body: `<p>Cats do not need a toy chest. They need a short burst of hunt, then a reason to settle. A house that looks full of toys is often a house where nothing gets used, because every lure is equally available and equally dull.</p>
<p>The pattern that works in our flats is simple: one wand, one quiet room, and a meal waiting when the game ends. You do not have to fill an hour. Ten focused minutes beat a scattered evening of tossing whatever is on the sofa.</p>
<h2>A simple sequence</h2>
<ol>
<li>Two or three minutes of wand play, keeping the lure on the floor as if it were prey, not a firework.</li>
<li>A pause so they can stalk. Let the wand go still. Cats hunt in bursts.</li>
<li>A last chase toward a feeding spot — a bowl, a lick mat, or a puzzle with a few kibbles.</li>
<li>Put the wand away. Out of sight is what makes tomorrow interesting.</li>
</ol>
<h2>What to keep in the drawer</h2>
<p>One wand with a replaceable lure is enough. Rotate the lure, not the whole cupboard: a feather one week, a felt mouse the next. String should be short enough that it cannot wrap a neck. If a toy has a bell that drives you mad, it will not last — choose something you can live with at 10pm.</p>
<p>Scratching posts belong in the path they already use, not in a corner you wish they would visit. A tired cat after play is more likely to scratch the post beside the sofa than the expensive tree by the window.</p>
<h2>When they will not play</h2>
<p>Some cats hunt at dawn and want nothing at dusk. Try a different time before you buy more toys. A slightly hungry cat plays better than one who has just finished a bowl. If play always ends in overstimulation — grabbing, biting — shorten the session and move straight to food.</p>
<p>Keep the evening predictable. The same room, the same wand, the same small meal. That is how indoor life feels like a hunt instead of a waiting room.</p>`,
  }),
  makePost({
    id: "post_perch",
    kind: "blog",
    title: "Setting up a perch that actually gets used",
    slug: "setting-up-a-bird-perch",
    excerpt: "Height, texture, and a clear flight path matter more than extra toys.",
    coverImage: postCover("post_perch"),
    petTypeIds: ["pet_bird"],
    featured: true,
    publishedAt: "2026-08-12T09:00:00.000Z",
    body: `<p>Birds use the room they can see. A perch facing the kitchen often beats a crowded play gym in a corner. We see this in the shop when a swing sits untouched beside a simple rod that looks at the door.</p>
<p>The mistake is stacking everything on one pole: swing, bells, ladder, food. The bird then has nowhere to land without making a noise. Give them a quiet perch and a busy one, a little apart.</p>
<h2>Placement</h2>
<p>Keep one natural-wood perch at chest height, out of draughts, with a swing nearby rather than stacked on the same pole. Avoid the middle of a walkway if people brush past. Birds like to watch, not to be startled from behind.</p>
<p>Windows are good for light and risky for heat. Morning sun on a perch is lovely; afternoon glass can cook. If you would not sit there in August, neither should they.</p>
<h2>Texture and diameter</h2>
<p>Feet need variety. A single dowel of one thickness is how sores start. Mix a natural branch with a slightly thicker standing perch. Sanded, splinter-free wood is enough — no need for sandpaper perches as daily standing spots.</p>
<p>Food and water should not sit under the favourite perch. Droppings find the bowl. Place dishes to the side, and refresh water whenever you would want a clean glass yourself.</p>
<h2>Flight</h2>
<p>Even a small room needs a clear line from perch to perch. Move the tall plant if it blocks that line. Clipped or not, birds still hop and glide. A cluttered airspace is why a beautiful cage goes unused while they sit on a curtain rod.</p>
<p>Start with less. One good perch, one swing, one foraging dish. Add a toy only when the first set is already part of the day.</p>`,
  }),
  makePost({
    id: "post_walk",
    kind: "blog",
    title: "Walking a city dog without the rush",
    slug: "walking-a-city-dog",
    excerpt: "Shorter loops, more sniffing, and a lead that does not turn the pavement into a tug of war.",
    coverImage: postCover("post_walk"),
    petTypeIds: ["pet_dog"],
    featured: true,
    publishedAt: "2026-08-24T08:00:00.000Z",
    body: `<p>A city walk is not a countryside hike. It is a strip of pavement, other dogs, food stalls, and a dog who would like to read every gatepost. If you treat it as exercise only, both of you will pull.</p>
<p>We sell leads that are meant to be held loosely. If your shoulder aches after ten minutes, the walk is too fast or the fitting is wrong — not a character flaw in the dog.</p>
<h2>Let them sniff</h2>
<p>Sniffing is how a dog finishes the walk in their head. Two slow blocks with pauses often tire them more than a brisk kilometre. Pick a quiet lane for the first five minutes so they can start, then join the busier road if you must.</p>
<h2>Gear that stays boring</h2>
<p>A well-fitted harness and a lead you can shorten at a crossing is enough. Retractable leads are hard on pavements full of ankles. We keep leather and webbing that you can grab quickly without a plastic handle fighting you.</p>
<p>Check the harness once a month. Puppies outgrow holes; adults change shape after a diet. A twisted chest strap is why a dog suddenly “hates” the walk.</p>
<h2>Heat and water</h2>
<p>Chandigarh summer pavement holds heat after sunset. Touch the road with the back of your hand. If you would not stand on it barefoot, shorten the loop or wait. Carry water even for a short outing in April and May.</p>
<p>End the walk the way you started: a pause at the door, a chance to shake off, then water at home. That close is part of the walk, not an afterthought.</p>`,
  }),
  makePost({
    id: "post_label",
    kind: "blog",
    title: "Reading a food bag in under a minute",
    slug: "reading-a-food-bag",
    excerpt: "Skip the front panel. The ingredient list and feeding guide tell you what you need.",
    coverImage: postCover("post_label"),
    petTypeIds: ["pet_dog", "pet_cat"],
    featured: false,
    publishedAt: "2026-08-19T11:00:00.000Z",
    body: `<p>The front of a bag is advertising. The back is the recipe. We teach this at the counter because a calm customer is one who can ignore a cartoon animal and still leave with the right food.</p>
<p>Turn the bag around. You are looking for three things: what the animal is made of, how much to feed, and whether the recipe is complete for that life stage.</p>
<h2>Ingredients, in order</h2>
<p>The first few lines matter most. A named meat or fish should appear early. Grains are not villains; unnamed sugars and colours are more useful to worry about. If you cannot pronounce half the list, that is not automatically bad — vitamins have long names — but a short list is easier to trust.</p>
<h2>Feeding guides lie a little</h2>
<p>Guides assume an average dog who does not steal from the table. Start at the low end of the range. Adjust after a fortnight by looking at the waist, not the bowl. Cats are even more individual; wet food changes the maths because it is mostly water.</p>
<h2>Life stage</h2>
<p>Puppy, adult, and senior are not marketing moods. A growing dog needs a recipe meant for growth. An adult cat does not need kitten food as a default. If a bag says “all life stages”, ask us whether it actually suits your animal, or whether it is a compromise.</p>
<p>Bring the bag you already use, even if it is empty. Comparing two backs is faster than describing a memory of the flavour.</p>`,
  }),
  makePost({
    id: "post_water",
    kind: "blog",
    title: "Water bowls that actually get used",
    slug: "water-bowls-that-get-used",
    excerpt: "Placement, metal, and a rinse you would accept for yourself.",
    coverImage: postCover("post_water"),
    petTypeIds: ["pet_dog", "pet_cat", "pet_bird"],
    featured: false,
    publishedAt: "2026-08-11T09:00:00.000Z",
    body: `<p>Food gets all the conversation. Water is what keeps a kitchen from turning into a clinic visit. We still see bowls that have sat cloudy since Tuesday, parked next to a bin, or so small that whiskers hit the rim.</p>
<p>Cats in particular will walk away from a bowl that smells of yesterday’s food. Dogs will drink from it and you will not know until the floor is sticky.</p>
<h2>Where to put it</h2>
<p>Not beside the food if you can help it. Many animals prefer water a few steps away. Keep it out of the main walkway so it is not kicked, and off thick rugs that stay wet. A tiled corner with a wipeable mat is enough.</p>
<h2>What the bowl is made of</h2>
<p>Stainless steel rinses clean. Ceramic is fine if it is glazed and heavy enough not to skate. Plastic holds scratches that hold film. For birds, a shallow dish that can come out of the cage twice a day beats a clever bottle you forget to scrub.</p>
<h2>The daily habit</h2>
<p>Empty, rinse, refill. Once a day at minimum; twice in summer. If you would not drink it, do not leave it. Ice cubes are a hot-weather extra, not a substitute for a clean bowl.</p>
<p>If drinking suddenly drops, look at the bowl first, then the weather, then a vet. A new metal dish has fixed more “picky drinkers” than a new flavour of food.</p>`,
  }),
  makePost({
    id: "post_second_cat",
    kind: "blog",
    title: "Introducing a second cat without a week of noise",
    slug: "introducing-a-second-cat",
    excerpt: "Separate rooms, swapped scent, and meals on either side of a door.",
    coverImage: postCover("post_second_cat"),
    petTypeIds: ["pet_cat"],
    featured: false,
    publishedAt: "2026-08-08T09:00:00.000Z",
    body: `<p>Two cats in a video look like a finished household. The week before that video is usually a closed door and a lot of patience. Rushing a face-to-face meeting is how you get a resident cat who stops using the litter tray.</p>
<p>We are not behaviourists, but we have packed enough starter kits to know the sequence that keeps both animals eating.</p>
<h2>Scent before sight</h2>
<p>Keep the new cat in a quiet room with food, water, litter, and a hiding place. Swap blankets after a day. Feed both cats on either side of the door so the sound of bowls becomes ordinary.</p>
<h2>Sight through a gap</h2>
<p>A slightly open door, a baby gate, or a cracked carrier lets them look without a full chase. Short sessions. If someone growls and leaves, that is information, not failure. Stop while it is still almost fine.</p>
<h2>Shared space</h2>
<p>When they share a room, keep two of everything: trays, bowls, resting spots. Vertical space — a window perch, a shelf — matters more than an extra toy. Play with wands separately at first so neither has to compete for your hands.</p>
<p>Expect a fortnight, not an afternoon. The goal is two animals who can ignore each other in the same kitchen. Friendship is optional. Peace is not.</p>`,
  }),
  makePost({
    id: "post_rain",
    kind: "blog",
    title: "Rainy day enrichment that is not a pile of toys",
    slug: "rainy-day-enrichment",
    excerpt: "Snuffle, lick, and a short training game when the pavement is a river.",
    coverImage: postCover("post_rain"),
    petTypeIds: ["pet_dog", "pet_cat"],
    featured: false,
    publishedAt: "2026-08-06T09:00:00.000Z",
    body: `<p>Monsoon weeks shrink a dog’s world to a hallway. Cats mind less, but they still notice when you are home and restless. The answer is not a new basket of toys. It is one or two jobs that take time.</p>
<h2>For dogs</h2>
<p>A snuffle mat or a towel with kibble rolled in it turns dinner into ten minutes of work. A lick mat with a spoon of yogurt or mashed pumpkin occupies a mouth that would otherwise chew a shoe. Keep portions inside the daily food, not on top of it, or you will wonder why the waist disappeared in August.</p>
<p>Five minutes of indoor retrieves down a corridor is enough. Use a soft toy, not a ball that marks the wall. Stop before they get silly. Rain makes floors slippery.</p>
<h2>For cats</h2>
<p>A paper bag with the handles cut off, a cardboard box, and a wand session before the evening meal. That is a rainy day. Puzzle feeders help if you are away at a desk. Rotate which box is out so it stays slightly novel.</p>
<h2>What not to do</h2>
<p>Do not fill the day with snacks to ease your guilt. Do not force a soaked walk “for their own good” if the dog hates rain — a short toilet trip and indoor work is kinder. Towel them off and keep a dry mat by the door so the rest of the house stays calm.</p>`,
  }),
  makePost({
    id: "post_toys",
    kind: "blog",
    title: "Why we keep toys in rotation",
    slug: "toy-rotation",
    excerpt: "Three toys out, the rest in a cupboard. Novelty is a schedule, not a shopping list.",
    coverImage: postCover("post_toys"),
    petTypeIds: ["pet_dog", "pet_cat"],
    featured: false,
    publishedAt: "2026-08-04T09:00:00.000Z",
    body: `<p>A toy that has lived on the floor for a month is furniture. Animals walk past furniture. The shop is full of people buying a fourth rope because the third “stopped working”. Usually it is still in the living room, faded and always available.</p>
<p>Rotation is the cheapest enrichment we know. You already own the toys. You are only changing when they appear.</p>
<h2>A simple cupboard</h2>
<p>Keep three toys available. Put the rest in a closed box. Every week, swap one. For cats, the wand can stay if the lure changes. For dogs, swap the chew and the fetch toy on different days so they are not both “on” at once.</p>
<h2>Safety is the boring part</h2>
<p>Check ropes for loose threads, stuffed toys for split seams, and rubber for missing chunks. Throw away what you would not let a toddler gum. A toy that is loved to pieces is a success, not a reason to leave stuffing on the rug.</p>
<h2>Play is a shared job</h2>
<p>Some toys need you. Wands and tugs do not work in a heap. Chews and puzzles can occupy a solo afternoon. Mix both so you are not the only entertainment, and so you are not irrelevant either.</p>
<p>If you want to buy something new, pick a category you do not already have — a lick mat if you only own balls, a wand if you only own mice — then put something old away to make room.</p>`,
  }),
  makePost({
    id: "post_travel_bird",
    kind: "blog",
    title: "Moving a bird through a noisy city",
    slug: "traveling-with-a-bird",
    excerpt: "A covered carrier, a short trip, and a familiar perch at the other end.",
    coverImage: postCover("post_travel_bird"),
    petTypeIds: ["pet_bird"],
    featured: false,
    publishedAt: "2026-08-02T09:00:00.000Z",
    body: `<p>Vet visits and house moves are the usual reasons a bird leaves the flat. The street is loud, the auto is sudden, and a cage that felt safe at home becomes a box in traffic. A little packing makes the difference between a ruffled arrival and a bird who will not come out.</p>
<h2>The carrier</h2>
<p>Use a carrier the bird already knows, not a brand-new crate on the morning of the trip. Leave it out a week early with a familiar perch and a millet spray. Cover three sides so the world is less of a film. Keep one side open enough for air.</p>
<h2>On the road</h2>
<p>Hold the carrier level. Do not rest it on a vibrating floor if you can keep it on your lap. Talk less; your stress is audible. Avoid incense, perfume, and a cabin full of other animals if there is another time slot.</p>
<h2>At the other end</h2>
<p>Set up the regular perch and water before you open the door. Dim the room. Let them come out when they are ready. A favourite food after a trip is useful; a new toy is not. Save novelty for a calm day.</p>
<p>If the journey is long, ask the clinic how they prefer birds to arrive. Some would rather you wait in the vehicle than sit in a barking waiting room. That is not fussiness. It is how you keep a small animal from spending the visit at the ceiling.</p>`,
  }),
  makePost({
    id: "post_summer_draft",
    kind: "blog",
    title: "Notes on summer feeding",
    slug: "notes-on-summer-feeding",
    excerpt: "A draft for the monsoon circular: appetite drops, water matters, and rich toppers can wait.",
    coverImage: postCover("post_summer_draft"),
    petTypeIds: ["pet_dog", "pet_cat", "pet_bird"],
    published: false,
    featured: false,
    publishedAt: "2026-08-27T09:00:00.000Z",
    body: `<p>This is still a draft for the shop circular. Do not publish until we add the clinic quote on heat and wet food.</p>
<p>Appetite often dips in peak summer. That is not always illness. Offer meals in the cooler hours, keep water honest, and do not stack oily toppers on a dog who is already panting after a short walk.</p>
<h2>Still to confirm</h2>
<ul>
<li>Whether we recommend a routine switch to wet food in May, or only as a topper.</li>
<li>Storage notes for opened pouches in a humid kitchen.</li>
<li>A line for birds: millet and fresh water, not leftover fruit sitting warm.</li>
</ul>
<p>Finish this after the Friday buying meeting. Mention the steel bowls we restocked. Cut anything that sounds like a lecture.</p>`,
  }),
  makePost({
    id: "rec_topper",
    kind: "recipe",
    title: "Warm chicken bowl topper",
    slug: "warm-chicken-bowl-topper",
    excerpt: "A spoon of shredded chicken and rice over kibble — for dogs who need a little encouragement.",
    coverImage: postCover("rec_topper"),
    petTypeIds: ["pet_dog"],
    featured: true,
    servings: "2 bowls",
    prepMinutes: 10,
    cookMinutes: 15,
    publishedAt: "2026-08-16T09:00:00.000Z",
    body: `<p>This is a topper, not a full meal. Mix a spoon through the usual bowl so the recipe stays familiar. Dogs who have been unwell, who are bored of kibble, or who eat too fast often do better with a warm spoonful on top rather than a brand-new bag.</p>
<p>Use plain chicken and plain rice. The point is smell and moisture, not a Sunday roast. Leftover gravy, onion, garlic, and salted stock do not belong in this pan.</p>
<h2>Ingredients</h2>
<ul>
<li>80g cooked chicken, shredded, skin and bones removed</li>
<li>40g plain cooked white rice</li>
<li>A splash of the unsalted cooking water, cooled until just warm</li>
</ul>
<h2>Method</h2>
<ol>
<li>Cover the chicken with water and simmer until cooked through. Skim the foam. There should be no pink.</li>
<li>Lift the meat out, shred it finely, and discard bones if you started from a piece on the bone.</li>
<li>Stir in the rice and a spoon of the cooled cooking water so it looks like a loose mash, not a soup.</li>
<li>Taste the temperature on your wrist. Warm, not hot. Spoon two tablespoons over each bowl of the regular food and mix.</li>
</ol>
<h2>Notes from the counter</h2>
<p>Count the chicken as part of the day’s food, not an extra meal, or the waist will go first. Store leftovers in the fridge for a day only. Reheat gently with a splash of water; do not serve from a rolling boil.</p>
<p>If your dog has a prescribed diet, ask the clinic before you add anything. A topper is still an ingredient list.</p>`,
  }),
  makePost({
    id: "rec_pumpkin",
    kind: "recipe",
    title: "Pumpkin lick bites",
    slug: "pumpkin-lick-bites",
    excerpt: "Frozen pumpkin coins for cats and small dogs. Keep them pea-sized.",
    coverImage: postCover("rec_pumpkin"),
    petTypeIds: ["pet_dog", "pet_cat"],
    featured: true,
    servings: "12 bites",
    prepMinutes: 8,
    cookMinutes: 0,
    publishedAt: "2026-08-20T09:00:00.000Z",
    body: `<p>Plain pumpkin is enough. No sweetener, no spice, no pie filling. Unsweetened puree from a tin is fine if the only ingredient is pumpkin. Fresh steamed pumpkin, mashed smooth, is better if you have the extra ten minutes.</p>
<p>These are a warm-weather occupation, not a meal. They melt. Serve on a washable mat, not on the sofa.</p>
<h2>Ingredients</h2>
<ul>
<li>120g unsweetened pumpkin puree</li>
<li>1 tsp water if the puree is stiff</li>
</ul>
<h2>Method</h2>
<ol>
<li>Stir until completely smooth. Lumps become icy surprises.</li>
<li>Spoon small coins — pea to almond size for cats, a little larger for dogs — onto a tray lined with baking paper.</li>
<li>Freeze until firm, then move to a sealed box. They keep for a week before they pick up freezer smells.</li>
<li>Offer one or two on a lick mat or in a shallow dish. Wait until they finish before offering more.</li>
</ol>
<h2>Why this stays simple</h2>
<p>Pumpkin is useful when stools are a bit loose, but it is not medicine. If the tummy is actually unwell, skip the treats and call the clinic. For cats, keep the pieces small enough that they lick rather than gulp a frozen lump.</p>
<p>Do not add cinnamon, nutmeg, or yogurt unless you already know that animal handles dairy. The recipe works because it is boring.</p>`,
  }),
  makePost({
    id: "rec_millet",
    kind: "recipe",
    title: "Millet forage scatter",
    slug: "millet-forage-scatter",
    excerpt: "A dry mix for birds to work through, not gulp. Serve in a shallow dish.",
    coverImage: postCover("rec_millet"),
    petTypeIds: ["pet_bird"],
    featured: true,
    servings: "1 dish",
    prepMinutes: 5,
    cookMinutes: 0,
    publishedAt: "2026-08-14T09:00:00.000Z",
    body: `<p>Foraging slows a meal down. Keep the mix simple so you can see what was eaten. A heap of mixed seed in a deep cup is how the favourite bits go first and the rest becomes mess on the floor.</p>
<p>This scatter is for a well bird on a usual diet. It is not a complete food. Think of it as the difference between a bowl and a job.</p>
<h2>Ingredients</h2>
<ul>
<li>2 tbsp millet</li>
<li>1 tbsp hulled oats, dry</li>
<li>A pinch of dried greens, crumbled</li>
</ul>
<h2>Method</h2>
<ol>
<li>Toss the dry ingredients in a bowl so the greens are not all in one clump.</li>
<li>Scatter in a shallow dish, a paper tray, or across a clean towel on a table they already use.</li>
<li>Stay nearby the first times. Some birds fling everything once, then learn to pick.</li>
<li>Refresh daily. Discard anything damp, soiled, or left in a warm room for hours.</li>
</ol>
<h2>Housekeeping</h2>
<p>Foraging is messy. That is the point. Put a tray under the dish. Do not mix in avocado, chocolate, salt, or leftover human snacks. If you add fresh herb, use a tiny amount and take away what they ignore.</p>
<p>Pair this with the usual balanced food so they are not living on millet. The scatter is the afternoon, not the whole day.</p>`,
  }),
  makePost({
    id: "rec_yogurt",
    kind: "recipe",
    title: "Yogurt lick mat",
    slug: "yogurt-lick-mat",
    excerpt: "A thin smear of plain yogurt that turns five minutes into a quiet pause.",
    coverImage: postCover("rec_yogurt"),
    petTypeIds: ["pet_dog", "pet_cat"],
    featured: true,
    servings: "1 mat",
    prepMinutes: 5,
    cookMinutes: 0,
    publishedAt: "2026-08-21T09:00:00.000Z",
    body: `<p>A lick mat is a piece of rubber, not a recipe, until you put something on it. Plain unsweetened yogurt is the version we send people home with. It is cold, it smells interesting, and it takes time to finish.</p>
<p>Not every animal handles dairy. Start with a teaspoon. If you already know yogurt ends in a messy kitchen, skip this and use pumpkin instead.</p>
<h2>Ingredients</h2>
<ul>
<li>2 tsp plain unsweetened yogurt (no xylitol, no flavourings)</li>
<li>Optional: a few crumbs of the regular kibble pressed in</li>
</ul>
<h2>Method</h2>
<ol>
<li>Rinse the mat so yesterday’s smear is gone. A sour mat is why people “give up on lick mats”.</li>
<li>Spread the yogurt thinly. Thick blobs are gone in three licks and then you have a bored dog.</li>
<li>Press a few kibbles in if you want more time. Freeze the mat for ten minutes in summer.</li>
<li>Put it on the floor, not the sofa. Wash after.</li>
</ol>
<h2>Portions</h2>
<p>This is part of the day’s calories. It is not an extra breakfast. For cats, use even less — a smear they can finish without a dairy protest later.</p>`,
  }),
  makePost({
    id: "rec_oat",
    kind: "recipe",
    title: "Apple oat biscuits",
    slug: "apple-oat-biscuits",
    excerpt: "A small baked biscuit for dogs. No raisins, no sweetener, no cookie spices.",
    coverImage: postCover("rec_oat"),
    petTypeIds: ["pet_dog"],
    featured: false,
    servings: "20 small biscuits",
    prepMinutes: 15,
    cookMinutes: 25,
    publishedAt: "2026-08-17T09:00:00.000Z",
    body: `<p>These are training-sized, not bakery-sized. If a biscuit takes more than two crunches, it is too big for a pocket and too rich for a walk. We keep the ingredient list short so you can bake without a special flour.</p>
<p>Apple is the wetness. Oats are the body. Egg holds it. That is the whole idea.</p>
<h2>Ingredients</h2>
<ul>
<li>100g finely grated apple, squeezed of extra juice (no seeds, no core)</li>
<li>120g oat flour, or oats blitzed in a jar</li>
<li>1 egg</li>
</ul>
<h2>Method</h2>
<ol>
<li>Heat the oven to 180°C. Line a tray.</li>
<li>Mix apple, oats, and egg into a dough you can roll. Add a spoon of oats if it sticks, a drop of water if it cracks.</li>
<li>Roll to about 5mm and cut small coins with a cap or knife.</li>
<li>Bake 20–25 minutes until dry to the touch. Cool completely before they go in a tin.</li>
</ol>
<h2>Storage</h2>
<p>Keep in a closed tin for three or four days, or freeze. Raisins, nutmeg, and xylitol never go in this dough. If your dog is on a strict diet, treat these as food, not as free snacks on the loop around the park.</p>`,
  }),
  makePost({
    id: "rec_tuna",
    kind: "recipe",
    title: "Tuna flake sprinkle",
    slug: "tuna-flake-sprinkle",
    excerpt: "A teaspoon of drained tuna over a cat’s usual meal. Water-packed, no onion, no oil bath.",
    coverImage: postCover("rec_tuna"),
    petTypeIds: ["pet_cat"],
    featured: true,
    servings: "1 bowl",
    prepMinutes: 3,
    cookMinutes: 0,
    publishedAt: "2026-08-15T09:00:00.000Z",
    body: `<p>Cats who turn away from a bowl often come back for smell. A little tuna water or a flake on top can open a meal without replacing the complete food they actually need.</p>
<p>Use tuna in water, not in spiced oil, not a sandwich mix, not a leftover curry. Drain well. The salt in some tins is why this stays a sprinkle.</p>
<h2>Ingredients</h2>
<ul>
<li>1 tsp drained tuna in water</li>
<li>Optional: ½ tsp of the tuna water if the food is very dry</li>
</ul>
<h2>Method</h2>
<ol>
<li>Drain the tuna. Flake it with a fork until it is almost a crumble.</li>
<li>Warm the regular food slightly if it is fridge-cold — not hot, just not icy.</li>
<li>Scatter the teaspoon on top. Do not hide a whole tin in the bowl.</li>
</ol>
<h2>How often</h2>
<p>A few times a week is plenty. Daily tuna as a main meal is how you drift off a balanced diet. If your cat only eats when tuna is involved, talk to a clinic about whether the base food needs changing, rather than stacking more fish.</p>
<p>Cover and refrigerate an opened tin for a day, then throw it away. Fish left on the counter is not a topping. It is a smell.</p>`,
  }),
  makePost({
    id: "rec_carrot",
    kind: "recipe",
    title: "Carrot cooling cubes",
    slug: "carrot-cooling-cubes",
    excerpt: "Frozen carrot and water cubes for dogs to push around a bowl on a hot afternoon.",
    coverImage: postCover("rec_carrot"),
    petTypeIds: ["pet_dog"],
    featured: false,
    servings: "8 cubes",
    prepMinutes: 10,
    cookMinutes: 8,
    publishedAt: "2026-08-13T09:00:00.000Z",
    body: `<p>These are a game as much as a snack. A cube in a bowl of water gives a dog something to knock, lick, and chase without another biscuit. Steam the carrot first so it is not a raw baton that comes back up.</p>
<h2>Ingredients</h2>
<ul>
<li>1 small carrot, peeled and sliced</li>
<li>Water to cover, then extra to fill an ice tray</li>
</ul>
<h2>Method</h2>
<ol>
<li>Steam or simmer the carrot until a fork slips in. Cool.</li>
<li>Chop into small pieces. No coins large enough to lodge.</li>
<li>Divide into an ice tray, top with water, freeze.</li>
<li>Pop one cube into a bowl of fresh water in the shade. Supervise the first times — enthusiastic dogs splash.</li>
</ol>
<h2>Notes</h2>
<p>This does not replace a walk, and it does not cool a dog who is already overheating. If they are panting hard, get them into shade and offer still water, not a game. Skip onion, masala, and leftover sabzi. The cube is carrot and water only.</p>`,
  }),
  makePost({
    id: "rec_egg",
    kind: "recipe",
    title: "Egg and rice recovery bowl",
    slug: "egg-and-rice-recovery-bowl",
    excerpt: "A bland bowl for dogs coming back to food. Plain, warm, and temporary.",
    coverImage: postCover("rec_egg"),
    petTypeIds: ["pet_dog"],
    featured: false,
    servings: "1 meal",
    prepMinutes: 5,
    cookMinutes: 20,
    publishedAt: "2026-08-10T09:00:00.000Z",
    body: `<p>This is the bowl we talk about when a dog is returning to food after a mild off day, and the clinic has said bland is fine. It is not a diagnosis and it is not a long-term diet. If there is vomiting, blood, or a dog who will not drink, you are in clinic territory, not recipe territory.</p>
<h2>Ingredients</h2>
<ul>
<li>60g white rice, cooked very soft</li>
<li>1 egg, scrambled dry in a pan with no butter, oil, chilli, or salt</li>
</ul>
<h2>Method</h2>
<ol>
<li>Cook the rice in extra water until it is almost porridge. Cool until warm.</li>
<li>Scramble the egg until set, then chop it small.</li>
<li>Fold egg through rice. Serve a small portion. Wait. Offer more only if it stays down.</li>
</ol>
<h2>Back to normal food</h2>
<p>After the clinic’s timeline, mix this with the usual food over a few days. Staying on egg and rice for weeks is how deficiencies start. No onion tadka, no milk, no bone. Boring is the feature.</p>`,
  }),
  makePost({
    id: "rec_herb",
    kind: "recipe",
    title: "Herb forage cup",
    slug: "herb-forage-cup",
    excerpt: "A pinch of parsley or coriander in a cup of dry mix for birds who like to rummage.",
    coverImage: postCover("rec_herb"),
    petTypeIds: ["pet_bird"],
    featured: false,
    servings: "1 cup",
    prepMinutes: 6,
    cookMinutes: 0,
    publishedAt: "2026-08-09T09:00:00.000Z",
    body: `<p>Fresh herb is a texture, not a salad bar. A pinch, washed and dry, mixed through a little millet, is plenty. Wet handfuls of coriander left in a warm cage become sludge.</p>
<h2>Ingredients</h2>
<ul>
<li>1 tbsp millet or the usual seed mix</li>
<li>A pinch of washed, thoroughly dried parsley or coriander leaf, chopped fine</li>
</ul>
<h2>Method</h2>
<ol>
<li>Wash the herb. Dry it in a cloth until it does not drip.</li>
<li>Chop very small. Mix through the millet in a cup or shallow dish.</li>
<li>Offer for a short session, then take away leftovers.</li>
</ol>
<h2>What to avoid</h2>
<p>No avocado, no onion, no garlic greens, no salt, no oily leftovers. If the bird ignores the herb, do not increase the amount — go back to plain millet. Fresh food is a supplement to a complete diet, not a replacement for pellets or a formulated mix.</p>`,
  }),
  makePost({
    id: "rec_broth",
    kind: "recipe",
    title: "Bone broth ice",
    slug: "bone-broth-ice",
    excerpt: "A teaspoon of unsalted chicken broth, frozen, for dogs who need a smell to start drinking.",
    coverImage: postCover("rec_broth"),
    petTypeIds: ["pet_dog"],
    featured: false,
    servings: "10 teaspoons",
    prepMinutes: 10,
    cookMinutes: 90,
    publishedAt: "2026-08-07T09:00:00.000Z",
    body: `<p>Broth in this house means chicken bones simmered in water, cooled, fat lifted, and no salt. Cubes from a supermarket carton are usually too salty. If you cannot taste a clean, bland sip, do not freeze it for a dog.</p>
<p>This is a flavour in water, not a meal. One small cube in a bowl is enough.</p>
<h2>Ingredients</h2>
<ul>
<li>Chicken bones from a plain roast, meat mostly eaten, no onion or masala</li>
<li>Water to cover</li>
</ul>
<h2>Method</h2>
<ol>
<li>Cover bones with water. Simmer gently about 90 minutes. Skim.</li>
<li>Strain. Cool, then lift off the set fat.</li>
<li>Taste. If it is salty or spiced, throw it away. Do not “dilute” a heavily seasoned stock and hope.</li>
<li>Freeze in teaspoon portions. Drop one into a water bowl.</li>
</ol>
<h2>Caution</h2>
<p>Cooked bones themselves are not for chewing. Only the strained liquid. Dogs with kidney issues or a prescribed diet need a clinic’s yes before broth becomes a habit. When in doubt, use warm water and a clean bowl instead.</p>`,
  }),
  makePost({
    id: "rec_sardine_draft",
    kind: "recipe",
    title: "Sardine mash for picky cats",
    slug: "sardine-mash-draft",
    excerpt: "Draft: mash a sardine through complete food. Waiting on the sodium note from the clinic.",
    coverImage: postCover("rec_sardine_draft"),
    petTypeIds: ["pet_cat"],
    published: false,
    featured: false,
    servings: "1 bowl",
    prepMinutes: 5,
    cookMinutes: 0,
    publishedAt: "2026-08-26T09:00:00.000Z",
    body: `<p>Draft only. Do not publish until we confirm which tins we will stock — water-packed sardines without extra salt, bones mashed, no tomato sauce.</p>
<p>The idea is a teaspoon of mashed sardine through the usual complete food for cats who sniff and walk away. It must stay a teaspoon. Fish as a lifestyle is not the plan.</p>
<h2>Still to write</h2>
<ul>
<li>Exact tin spec and why tomato sauce is out.</li>
<li>How often in a week.</li>
<li>A line that this is not a urinary-care diet.</li>
</ul>
<p>Leave in drafts until the Friday tasting. If the tin we like is too salty, kill the recipe.</p>`,
  }),
];
