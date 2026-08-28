/** Central image registry — each Unsplash photo ID is used once across heroes, sections, products, and posts. */

function unsplash(photoId: string, width = 1200) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

export const storeImages = {
  seo: {
    ogDefault: unsplash("photo-1477884210327-81585499e712"),
  },
  pages: {
    home: {
      hero: unsplash("photo-1548199973-03cce0bbc87b", 2000),
      pets: {
        dog: unsplash("photo-1587300003388-59208cc962cb"),
        cat: unsplash("photo-1573865526739-10659fec78a5"),
        bird: unsplash("photo-1444464666168-49d633b86797"),
      },
    },
    about: {
      hero: unsplash("photo-1601758228041-f3b2795255f1", 2000),
      dogFood: unsplash("photo-1576201835542-44698d8e2a88"),
      bond: unsplash("photo-1516734215736-652b05dca385", 1600),
      counter: unsplash("photo-1623387648966-d7833319f6a9"),
      cat: unsplash("photo-1518791841217-8f162f1e1131"),
      bird: unsplash("photo-1505626040926-0225ef1f53ab"),
    },
    blog: {
      hero: unsplash("photo-1534361964485-19893678193e", 2000),
    },
    recipes: {
      hero: unsplash("photo-1589924691995-400dc9ecc119", 2000),
    },
    contact: {
      hero: unsplash("photo-1583337130417-3346a1be7dee", 2000),
      aside: unsplash("photo-1543466835-00a7907e34de"),
    },
  },
  products: {
    bowl: {
      main: unsplash("photo-1605568427561-40dd23c2acea"),
      gallery: unsplash("photo-1619983081563-cf47e7e4c8b2"),
    },
    ocean: unsplash("photo-1568640347023-a616a30bc3bd"),
    rope: unsplash("photo-1535294435445-d7249524ef2e"),
    lead: unsplash("photo-1598135753283-14fadfc6d352"),
    salmon: unsplash("photo-1495360010541-f48722b34f8d"),
    wand: unsplash("photo-1588943211346-0908a1e0cc40"),
    perch: unsplash("photo-1494947668418-7293327e2766"),
    millet: unsplash("photo-1533731094420-58294f43b496"),
    swing: unsplash("photo-1522926193341-e9ffd686c60f"),
    placeholder: unsplash("photo-1606211144581-f3695ca9c782"),
  },
  postCovers: {
    post_food: unsplash("photo-1552053831-71594a27632d", 1400),
    post_play: unsplash("photo-1514888286974-6c03e2ca1dba", 1400),
    post_perch: unsplash("photo-1552728089-57bdde30beb3", 1400),
    post_walk: unsplash("photo-1450778869180-41d0601e046e", 1400),
    post_label: unsplash("photo-1574158622682-e40e69881006", 1400),
    post_water: unsplash("photo-1507146423299-b42469158a56", 1400),
    post_second_cat: unsplash("photo-1546527868-ccb82539d66f", 1400),
    post_rain: unsplash("photo-1561030794-61e4c7d3a1c5", 1400),
    post_toys: unsplash("photo-1526336024174-e58f5cdd8e13", 1400),
    post_travel_bird: unsplash("photo-1615751072498-512b1d2592bc", 1400),
    post_summer_draft: unsplash("photo-1608098295264-3461b5f8b5e5", 1400),
    rec_topper: unsplash("photo-1558618666-fcd25c85cd64", 1400),
    rec_pumpkin: unsplash("photo-1511048938677-66ea6c628972", 1400),
    rec_millet: unsplash("photo-1444212475030-856c7502eeec", 1400),
    rec_yogurt: unsplash("photo-1437624351153-7ad1d0a6f267", 1400),
    rec_oat: unsplash("photo-1514884788935-48e963d8670e", 1400),
    rec_tuna: unsplash("photo-1499793983690-d1ea0c792678", 1400),
    rec_carrot: unsplash("photo-1628007580202-8fc9e9e1c9e4", 1400),
    rec_egg: unsplash("photo-1525253086316-d0c936c814f8", 1400),
    rec_herb: unsplash("photo-1544568100-847a948270b9", 1400),
    rec_broth: unsplash("photo-1541599463348-8746370770b2", 1400),
    rec_sardine_draft: unsplash("photo-153028170054-512a485993a6", 1400),
  },
} as const;

export function postCover(postId: string) {
  return storeImages.postCovers[postId as keyof typeof storeImages.postCovers] ?? storeImages.products.placeholder;
}
