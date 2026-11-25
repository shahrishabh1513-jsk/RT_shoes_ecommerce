'use strict';

const BR = {
  Nike: { c: '#ffe500', tag: 'responsive cushioning and sport-ready grip', line: 'Built for the way you move.', intro: 'Running shoes with responsive cushioning for daily miles, from first runs to long weekends.' },
  Skechers: { c: '#3d8bff', tag: 'soft, memory-foam comfort', line: 'Comfort that keeps up.', intro: 'Running and walking footwear with cushioned insoles, made for long days on your feet.' },
  Campus: { c: '#ff7a1a', tag: 'durable, great-value everyday performance', line: 'Sporty for every budget.', intro: 'India-loved running and sports shoes with strong grip and all-day comfort at friendly prices.' },
  Comet: { c: '#ff5fa2', tag: 'clean, modern sneaker styling', line: 'Sneakers with a point of view.', intro: 'Minimal, colour-led sneakers designed for everyday style.' }
};

const IMG_DIR = 'assets/products/';

function shoeSVG(t, a, b) {
  const w = '#f3f3f3', L = 'stroke="' + w + '" stroke-width="5" stroke-linecap="round"';
  const laces = '<path d="M150 66l22 14M138 80l22 14M126 92l22 12" ' + L + '/>';

  const S = {
    r: '<path d="M22 150h276q6 22-14 22H52q-30 0-30-22z" fill="' + w + '"/><path d="M30 150l12-70q4-14 20-10l44 14q34-20 46-58l22 8q10 64 78 76 40 8 48 40z" fill="' + a + '"/><path d="M54 138q100 14 238-20-6 18-238 28z" fill="' + b + '"/>' + laces,

    s: '<path d="M20 146h282q4 28-20 28H46q-26 0-26-28z" fill="' + w + '"/><path d="M28 146l8-64q2-12 18-10l50 10q36-4 62-28l26 6q8 44 58 54 52 8 54 32z" fill="' + a + '"/><path d="M238 114q40 6 54 32h-60z" fill="' + b + '"/><path d="M28 146h274" stroke="' + b + '" stroke-width="5"/>' + laces,

    c: '<path d="M28 150Q20 96 76 76Q130 58 190 78Q300 86 302 140Q304 168 270 168H52Q30 168 28 150z" fill="' + a + '"/><path d="M44 112Q40 62 100 58" stroke="' + b + '" stroke-width="12" fill="none" stroke-linecap="round"/><g fill="rgba(0,0,0,.35)"><circle cx="150" cy="104" r="7"/><circle cx="180" cy="112" r="7"/><circle cx="210" cy="120" r="7"/><circle cx="240" cy="128" r="7"/><circle cx="160" cy="132" r="7"/><circle cx="192" cy="140" r="7"/><circle cx="224" cy="146" r="7"/></g>',

    l: '<path d="M24 154h276q8 20-12 20H44q-22 0-20-20z" fill="' + w + '"/><path d="M44 154Q64 86 130 90Q200 96 280 150z" fill="' + a + '"/><path d="M92 148Q110 106 156 106" stroke="' + b + '" stroke-width="14" fill="none" stroke-linecap="round"/>',

    k: '<path d="M24 150h272q8 24-12 24H44q-22 0-20-24z" fill="#262626"/><path d="M30 150l10-62q2-12 18-10l44 10q40-6 70-30l20 6q12 46 66 56 40 8 36 30z" fill="' + a + '"/><rect x="112" y="96" width="76" height="18" rx="5" fill="' + b + '" transform="rotate(-14 150 105)"/>'
  };

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190"><ellipse cx="160" cy="178" rx="132" ry="8" fill="rgba(0,0,0,.28)"/>' + S[t] + '</svg>';
}

const svgURI = (t, a, b) => 'data:image/svg+xml;utf8,' + encodeURIComponent(shoeSVG(t, a, b));

/* colour word -> [swatch colour, filter group] */
const CW = {
  forest: ['#1f5f3a', 'Green'],
  olive: ['#6b7a2f', 'Green'],
  lime: ['#b8f23a', 'Green'],
  green: ['#2fbf71', 'Green'],
  black: ['#1b1b1b', 'Black'],
  charcoal: ['#3b3b3b', 'Grey'],
  greyscale: ['#777', 'Grey'],
  platinum: ['#d0d0d0', 'Grey'],
  nimbus: ['#c9ccd1', 'Grey'],
  grey: ['#8d8d8d', 'Grey'],
  gray: ['#8d8d8d', 'Grey'],
  snow: ['#fafafa', 'White'],
  white: ['#f3f3f3', 'White'],
  navy: ['#1f2a6b', 'Blue'],
  malibu: ['#5bc0eb', 'Blue'],
  ice: ['#bfe3ff', 'Blue'],
  sky: ['#7cc4ff', 'Blue'],
  aqua: ['#2fd0d0', 'Blue'],
  blue: ['#2f6df6', 'Blue'],
  crimson: ['#c1272d', 'Red'],
  red: ['#e63b36', 'Red'],
  tropical: ['#ff7aa8', 'Pink'],
  rose: ['#e8a0b4', 'Pink'],
  pink: ['#ff5fa2', 'Pink'],
  coral: ['#ff7f6b', 'Orange'],
  orange: ['#ff7a1a', 'Orange'],
  bumblebee: ['#f2c200', 'Yellow'],
  mustard: ['#d9a400', 'Yellow'],
  yellow: ['#ffe500', 'Yellow'],
  wheat: ['#d8c08a', 'Brown'],
  chestnut: ['#7a4b2f', 'Brown'],
  affogato: ['#5a3a28', 'Brown'],
  beige: ['#d9c3a0', 'Brown'],
  purple: ['#6a3fd0', 'Purple']
};

const CKEYS = Object.keys(CW);

const parts = l =>
  String(l).toLowerCase().split(/[\/-]/).map(s => CKEYS.find(k => s.includes(k))).filter(Boolean);

const swatchBG = l => {
  const p = parts(l).map(k => CW[k][0]);
  return p.length > 1
    ? `linear-gradient(135deg,${p[0]} 50%,${p[1]} 50%)`
    : (p[0] || '#8d8d8d');
};

const COLOR_GROUPS = [
  'Black', 'White', 'Grey', 'Blue', 'Red', 'Green',
  'Pink', 'Orange', 'Yellow', 'Brown', 'Purple'
];

const SIZES = {
  Men: [6, 7, 8, 9, 10, 11],
  Women: [3, 4, 5, 6, 7, 8],
  Kids: [11, 12, 13, 1, 2, 3]
};

const SK = 'https://www.skechers.in/';
const FK = 'https://dl.flipkart.com/s/';
const CP = 'https://www.campusshoes.com/products/';
const CM = 'https://www.wearcomet.com/products/';
const NK = 'https://www.nike.in/';

const RAW = [

  /* ---------- MEN ---------- */
  { id: 1, brand: 'Skechers', name: 'GO RUN Glide-Step Arch Fit', gender: 'Men', category: 'Running Shoes', price: 7499, mrp: 9999, rating: 4.2, colors: ['Navy', 'Olive', 'Grey', 'White/Black'], image: 'assets/products/RTS1.png', gallery: [], flag: 'new', link: SK + 'go-run-glide-step-arch-fit/221120-NVY.html' },
  { id: 2, brand: 'Skechers', name: 'GO RUN Pure', gender: 'Men', category: 'Running Shoes', price: 4999, mrp: 6999, rating: 4.1, colors: ['Navy', 'Blue/Grey', 'Black'], image: 'assets/products/RTS2.png', gallery: [], flag: '', link: FK + 'mMkJ0jNNNN' },
  { id: 3, brand: 'Skechers', name: 'GO RUN Elevate Outdoors', gender: 'Men', category: 'Running Shoes', price: 6499, mrp: 8499, rating: 4.2, colors: ['Black', 'Blue', 'Wheat/Black'], image: 'assets/products/RTS3.png', gallery: [], flag: 'hot', link: FK + 'mMvax0NNNN' },
  { id: 4, brand: 'Skechers', name: 'Terrenex', gender: 'Men', category: 'Sneakers', price: 5999, mrp: 7999, rating: 4.0, colors: ['Black', 'Charcoal/Orange', 'Navy/Lime'], image: 'assets/products/RTS4.png', gallery: [], flag: '', link: FK + 'SKqURtuuuN' },
  { id: 5, brand: 'Skechers', name: 'GO WALK Flex', gender: 'Men', category: 'Walking Shoes', price: 4499, mrp: 5999, rating: 4.3, colors: ['White/Navy', 'Charcoal/Red', 'Navy'], image: 'assets/products/RTS5.png', gallery: [], flag: 'new', link: FK + 'mnjrWyNNNN' },
  { id: 6, brand: 'Nike', name: 'Quest 6', gender: 'Men', category: 'Running Shoes', price: 5495, mrp: 6995, rating: 4.3, colors: ['Black/White-Iron Grey', 'White/Black-Pure Platinum'], image: 'assets/products/RTS6.png', gallery: [], flag: 'hot', link: FK + 'SKTsaJuuuN' },
  { id: 7, brand: 'Nike', name: 'Revolution 7', gender: 'Men', category: 'Running Shoes', price: 4495, mrp: 5495, rating: 4.2, colors: ['Black/Hyper Crimson-Astronomy Blue-Sail', 'Black/White', 'Lt Armory Blue/Black-Star Blue'], image: 'assets/products/RTS7.png', gallery: [], flag: '', link: FK + 'SK33XwuuuN' },
  { id: 8, brand: 'Nike', name: 'Quest 7', gender: 'Men', category: 'Running Shoes', price: 6295, mrp: 7495, rating: 4.1, colors: ['Black/Red Orbit-White-Anthracite', 'White/Wolf Grey-Vast Grey'], image: 'assets/products/RTS8.png', gallery: [], flag: 'new', link: FK + 'SKPqCMuuuN' },
  { id: 9, brand: 'Campus', name: 'Abacus', gender: 'Men', category: 'Running Shoes', price: 1299, mrp: 1999, rating: 4.2, colors: ['Light Green/Black', 'Blue/Red', 'Light Sky/Royal Blue'], image: 'assets/products/RTS9.png', gallery: [], flag: '', link: FK + 'm2s2MxNNNN' },
  { id: 10, brand: 'Campus', name: 'Hurricane', gender: 'Men', category: 'Running Shoes', price: 1199, mrp: 1799, rating: 4.3, colors: ['Grey'], image: 'assets/products/RTS10.png', gallery: [], flag: 'hot', link: FK + 'SLMsutuuuN' },
  { id: 11, brand: 'Campus', name: 'Deccan', gender: 'Men', category: 'Running Shoes', price: 1499, mrp: 2199, rating: 4.5, colors: ['Black/Red', 'Navy/Mustard', 'Light Grey/Dark Grey'], image: 'assets/products/RTS11.png', gallery: [], flag: 'hot', link: FK + 'm2lFlGNNNN' },
  { id: 12, brand: 'Campus', name: 'Vesper', gender: 'Men', category: 'Running Shoes', price: 1399, mrp: 2099, rating: 4.1, colors: ['Ice Blue/Navy', 'Black/Mustard', 'Light Grey/Dark Grey'], image: 'assets/products/RTS12.png', gallery: [], flag: 'new', link: FK + 'SLcNuIuuuN' },
  { id: 13, brand: 'Campus', name: 'Stave', gender: 'Men', category: 'Running Shoes', price: 1599, mrp: 2399, rating: 4.4, colors: ['Black/Red', 'Black/Light Grey', 'Forest Green/Light Blue'], image: 'assets/products/RTS13.png', gallery: [], flag: '', link: FK + 'SLGAdVuuuN' },
  { id: 14, brand: 'Comet', name: 'X Lows', gender: 'Men', category: 'Sneakers', price: 3499, mrp: 4499, rating: 4.6, colors: ['Chestnut', 'Snow', 'Greyscale'], image: 'assets/products/RTS14.png', gallery: [], flag: 'hot', link: CM + 'x-lows-greyscale' },
  { id: 15, brand: 'Comet', name: 'Aeon v2', gender: 'Men', category: 'Sneakers', price: 3999, mrp: 4999, rating: 4.4, colors: ['Bumblebee', 'Nimbus', 'Affogato'], image: 'assets/products/RTS15.png', gallery: [], flag: 'new', link: CM + 'aeon-v2-bumblebee' },

  /* ---------- WOMEN ---------- */
  { id: 16, brand: 'Comet', name: 'Aeres Rosé', gender: 'Women', category: 'Sneakers', price: 3799, mrp: 4799, rating: 4.5, colors: ['Rose'], image: 'assets/products/RTS16.png', gallery: [], flag: 'new', link: CM + 'aeres-rose' },
  { id: 17, brand: 'Comet', name: 'X Lows Malibu', gender: 'Women', category: 'Sneakers', price: 3499, mrp: 4499, rating: 4.5, colors: ['Malibu'], image: 'assets/products/RTS17.png', gallery: [], flag: 'hot', link: CM + 'x-lows-malibu' },
  { id: 18, brand: 'Campus', name: 'Salt CS', gender: 'Women', category: 'Sneakers', price: 1499, mrp: 2299, rating: 4.3, colors: ['White'], image: 'assets/products/RTS18.png', gallery: [], flag: '', link: CP + 'salt-cs-wht-l-purple-womens-sneakers' },
  { id: 19, brand: 'Campus', name: 'Rapid CR', gender: 'Women', category: 'Running Shoes', price: 1299, mrp: 1999, rating: 4.2, colors: ['Blue'], image: 'assets/products/RTS19.png', gallery: [], flag: 'new', link: CP + 'rapid-cr-blue-black-womens-running-shoes' },
  { id: 20, brand: 'Campus', name: 'Butter', gender: 'Women', category: 'Sneakers', price: 1399, mrp: 2099, rating: 4.3, colors: ['White'], image: 'assets/products/RTS20.png', gallery: [], flag: '', link: CP + 'butter-wht-r-slate-women-sports-shoes' },
  { id: 21, brand: 'Campus', name: 'Gisel', gender: 'Women', category: 'Walking Shoes', price: 1099, mrp: 1699, rating: 4.2, colors: ['Pink'], image: 'assets/products/RTS21.png', gallery: [], flag: '', link: CP + 'gisel-l-pink-peach-womens-walking-shoes' },
  { id: 22, brand: 'Campus', name: 'Fino CR', gender: 'Women', category: 'Running Shoes', price: 1199, mrp: 1799, rating: 4.1, colors: ['Beige'], image: 'assets/products/RTS22.png', gallery: [], flag: '', link: CP + 'fino-cr-seed-pearl-ntrl-womens-running-shoes' },
  { id: 23, brand: 'Campus', name: 'Frelor', gender: 'Women', category: 'Running Shoes', price: 1299, mrp: 1899, rating: 4.2, colors: ['White/Sky'], image: 'assets/products/RTS23.png', gallery: [], flag: 'hot', link: CP + 'frelor-wht-sky-ride-womens-running-shoes' },
  { id: 24, brand: 'Nike', name: 'Uplift SC', gender: 'Women', category: 'Lifestyle Footwear', price: 5995, mrp: 7495, rating: 4.3, colors: ['Tropical Pink'], image: 'assets/products/RTS24.png', gallery: [], flag: 'new', link: NK + 'nike-uplift-sc-women-s-shoes/p/27763466' },
  { id: 25, brand: 'Nike', name: 'Run Defy (Black)', gender: 'Women', category: 'Running Shoes', price: 4495, mrp: 5495, rating: 4.2, colors: ['Black'], image: 'assets/products/RTS25.png', gallery: [], flag: '', link: NK + 'nike-run-defy-women-s-road-running-shoes/p/24788602' },
  { id: 26, brand: 'Nike', name: 'Run Defy (White)', gender: 'Women', category: 'Running Shoes', price: 4495, mrp: 5495, rating: 3.9, colors: ['White'], image: 'assets/products/RTS26.png', gallery: [], flag: '', link: NK + 'nike-run-defy-women-s-road-running-shoes/p/26001286' },
  { id: 27, brand: 'Nike', name: 'Promina', gender: 'Women', category: 'Walking Shoes', price: 5495, mrp: 6995, rating: 4.3, colors: ['Football Grey'], image: 'assets/products/RTS27.png', gallery: [], flag: 'hot', link: NK + 'nike-promina-women-s-walking-shoes/p/27764078' },
  { id: 28, brand: 'Skechers', name: 'SKX Aero Spark', gender: 'Women', category: 'Sneakers', price: 4999, mrp: 6499, rating: 3.9, colors: ['Coral'], image: 'assets/products/RTS28.png', gallery: [], flag: 'new', link: SK + 'skx-aero-spark/172200-CRL.html' },
  { id: 29, brand: 'Skechers', name: 'GO WALK Distance Walker', gender: 'Women', category: 'Walking Shoes', price: 4999, mrp: 6499, rating: 4.0, colors: ['Aqua'], image: 'assets/products/RTS29.png', gallery: [], flag: '', link: SK + 'go-walk-distance-walker---mor/125129-AQUA.html' },
  { id: 30, brand: 'Skechers', name: 'Viper Court Reload Pickleball', gender: 'Women', category: 'Sports Shoes', price: 5499, mrp: 6999, rating: 4.3, colors: ['Blue/White'], image: 'assets/products/RTS30.png', gallery: [], flag: '', link: SK + 'skechers-viper-court-reload-pickleball-shoes/172101-BLW.html' },

  /* ---------- KIDS ---------- */
  { id: 31, brand: 'Skechers', name: 'Comfy Sprints', gender: 'Kids', category: 'Casual Shoes', price: 3299, mrp: 4299, rating: 4.1, colors: ['White/Navy'], image: 'assets/products/RTS31.png', gallery: [], flag: 'new', link: SK + 'comfy-sprints/404210N-WNV.html' },
  { id: 32, brand: 'Skechers', name: 'Meteor-Lights Krendo', gender: 'Kids', category: 'Sneakers', price: 3799, mrp: 4999, rating: 4.1, colors: ['Black/Blue'], image: 'assets/products/RTS32.png', gallery: [], flag: '', link: SK + 'skechers-meteor-lights-krendo/401495N-BKBL.html' },
  { id: 33, brand: 'Skechers', name: 'Elite Sport', gender: 'Kids', category: 'Sports Shoes', price: 3299, mrp: 4299, rating: 4.3, colors: ['Orange'], image: 'assets/products/RTS33.png', gallery: [], flag: 'hot', link: SK + 'skechers-elite-sport/303650LI-CRL.html' },
  { id: 34, brand: 'Campus', name: 'Flyro Kids', gender: 'Kids', category: 'Sports Shoes', price: 999, mrp: 1499, rating: 4.1, colors: ['Pink'], image: 'assets/products/RTS34.png', gallery: [], flag: 'new', link: CP + 'flyro-kids-v-l-pink-s-grn-kids-running-shoes' },
  { id: 35, brand: 'Campus', name: 'Molly', gender: 'Kids', category: 'Sports Shoes', price: 899, mrp: 1399, rating: 4.2, colors: ['Grey'], image: 'assets/products/RTS35.png', gallery: [], flag: '', link: CP + 'molly-l-gry-navy-child-running-shoes' },
  { id: 36, brand: 'Campus', name: 'Aerix', gender: 'Kids', category: 'Sports Shoes', price: 999, mrp: 1499, rating: 4.2, colors: ['Blue'], image: 'assets/products/RTS36.png', gallery: [], flag: 'hot', link: CP + 'aerix-k-r-slate-blu-bell-kids-running-shoes' }

];

/* ---------- build (no need to edit below) ---------- */

const PRODUCTS = RAW.map(r => {
  const [a, b] = parts(r.colors[0]).map(k => CW[k][0]);

  const fb = svgURI(
    /Sneaker|Casual|Lifestyle/.test(r.category) ? 's' : 'r',
    a || '#8d8d8d',
    b || '#ffffff'
  );

  const imgs = [r.image, ...(r.gallery || [])]
    .filter(Boolean)
    .map(f => /^(https?:|data:|assets\/)/.test(f) ? f : IMG_DIR + f);

  const cg = [
    ...new Set(r.colors.flatMap(c => parts(c).map(k => CW[k][1])))
  ];

  return {
    ...r,
    originalPrice: r.mrp,
    discount: Math.round((r.mrp - r.price) / r.mrp * 100),
    reviews: 0,
    sizes: SIZES[r.gender],
    cgroups: cg,
    fb,
    images: imgs.length ? imgs : [fb],
    isNew: r.flag === 'new',
    isTrending: r.flag === 'hot',
    description: `${r.brand} ${r.name} is made for ${r.category.toLowerCase()} with ${BR[r.brand].tag}. A breathable upper, flexible outsole and cushioned footbed keep every step light.`
  };
});