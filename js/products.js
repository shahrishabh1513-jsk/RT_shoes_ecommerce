'use strict';
/* RT Shoes product database: 44 unique products, 11 per brand.
   Sample catalogue data for a frontend demo. Vector shoe art is generated below. */
const COLORS={Black:'#1b1b1b',White:'#f3f3f3',Red:'#e63b36',Blue:'#2f6df6',Yellow:'#ffe500',Orange:'#ff7a1a',Green:'#2fbf71',Pink:'#ff5fa2',Grey:'#8d8d8d',Navy:'#1f2a6b',Purple:'#6a3fd0',Lime:'#b8f23a'};
const BR={
 Nike:{c:'#ffe500',tag:'responsive cushioning and sport-ready grip',line:'Built for the way you move.',intro:'Performance runners and court-ready sneakers with responsive cushioning, from first-mile trainers to everyday classics.'},
 Skechers:{c:'#3d8bff',tag:'soft, memory-foam comfort',line:'Comfort that keeps up.',intro:'Walking-first footwear with cushioned insoles and easy slip-on designs made for long days on your feet.'},
 Crocs:{c:'#5be37d',tag:'lightweight, breathable Croslite comfort',line:'Come as you are.',intro:'Iconic clogs, slides and comfort sneakers in playful colours. Light, washable and ready for anything.'},
 Campus:{c:'#ff7a1a',tag:'durable, great-value everyday performance',line:'Sporty for every budget.',intro:'India-loved sports and casual shoes with strong grip and all-day comfort at prices that make sense.'}
};
function shoeSVG(t,a,b){
 const w='#f3f3f3',L='stroke="'+w+'" stroke-width="5" stroke-linecap="round"';
 const laces='<path d="M150 66l22 14M138 80l22 14M126 92l22 12" '+L+'/>';
 const S={
  r:'<path d="M22 150h276q6 22-14 22H52q-30 0-30-22z" fill="'+w+'"/><path d="M30 150l12-70q4-14 20-10l44 14q34-20 46-58l22 8q10 64 78 76 40 8 48 40z" fill="'+a+'"/><path d="M54 138q100 14 238-20-6 18-238 28z" fill="'+b+'"/>'+laces,
  s:'<path d="M20 146h282q4 28-20 28H46q-26 0-26-28z" fill="'+w+'"/><path d="M28 146l8-64q2-12 18-10l50 10q36-4 62-28l26 6q8 44 58 54 52 8 54 32z" fill="'+a+'"/><path d="M238 114q40 6 54 32h-60z" fill="'+b+'"/><path d="M28 146h274" stroke="'+b+'" stroke-width="5"/>'+laces,
  c:'<path d="M28 150Q20 96 76 76Q130 58 190 78Q300 86 302 140Q304 168 270 168H52Q30 168 28 150z" fill="'+a+'"/><path d="M44 112Q40 62 100 58" stroke="'+b+'" stroke-width="12" fill="none" stroke-linecap="round"/><g fill="rgba(0,0,0,.35)"><circle cx="150" cy="104" r="7"/><circle cx="180" cy="112" r="7"/><circle cx="210" cy="120" r="7"/><circle cx="240" cy="128" r="7"/><circle cx="160" cy="132" r="7"/><circle cx="192" cy="140" r="7"/><circle cx="224" cy="146" r="7"/></g>',
  l:'<path d="M24 154h276q8 20-12 20H44q-22 0-20-20z" fill="'+w+'"/><path d="M44 154Q64 86 130 90Q200 96 280 150z" fill="'+a+'"/><path d="M92 148Q110 106 156 106" stroke="'+b+'" stroke-width="14" fill="none" stroke-linecap="round"/>',
  k:'<path d="M24 150h272q8 24-12 24H44q-22 0-20-24z" fill="#262626"/><path d="M30 150l10-62q2-12 18-10l44 10q40-6 70-30l20 6q12 46 66 56 40 8 36 30z" fill="'+a+'"/><rect x="112" y="96" width="76" height="18" rx="5" fill="'+b+'" transform="rotate(-14 150 105)"/>'
 };
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190"><ellipse cx="160" cy="178" rx="132" ry="8" fill="rgba(0,0,0,.28)"/>'+S[t]+'</svg>';
}
const svgURI=(t,a,b)=>'data:image/svg+xml;utf8,'+encodeURIComponent(shoeSVG(t,a,b));
const REAL={daco:'assets/products/nike-violet.png',packo:'assets/products/nike-lunar.png',pngegg:'assets/products/nike-night.png'};
const SIZES={Men:[6,7,8,9,10,11],Women:[3,4,5,6,7,8],Kids:[11,12,13,1,2,3]};
/* name|gender|category|price|originalPrice|rating|type|colour1|colour2  (prices in INR) */
const RAW={
Nike:`Zoom Violet Runner|Men|Running Shoes|7495|9995|4.8|daco|Purple|Blue
Lunar Tempo Runner|Men|Running Shoes|6495|8995|4.6|packo|Red|Blue
Zoom Structure Night|Men|Sports Shoes|8295|10995|4.7|pngegg|Navy|Lime
Court Classic Low|Men|Sneakers|4995|6495|4.4|s|White|Black
Street Walk Trainer|Men|Walking Shoes|3995|5495|4.3|s|Grey|Orange
Pulse Stride|Women|Running Shoes|5995|7995|4.6|r|Pink|White
Air Bloom Casual|Women|Casual Shoes|4495|5995|4.5|s|White|Pink
Studio Flex Sneaker|Women|Sneakers|5495|6995|4.5|s|Lime|Black
Citywalk Lite|Women|Walking Shoes|3795|4995|4.2|r|Grey|Pink
Junior Dash Runner|Kids|Sports Shoes|2995|3995|4.4|r|Blue|Yellow
Little Court Sneaker|Kids|Sneakers|2695|3495|4.3|s|White|Red`,
Skechers:`Go Walk Cloud|Men|Walking Shoes|4499|5999|4.7|r|Grey|Blue
Max Cushion Runner|Men|Running Shoes|5299|6999|4.6|r|Black|Lime
Arch Fit Classic|Men|Casual Shoes|4799|6299|4.5|s|Navy|White
Street Court Sport|Men|Sports Shoes|3999|5499|4.3|s|White|Navy
Slip-In Stride|Women|Walking Shoes|4599|5999|4.7|r|Pink|Grey
Glide Step Lifestyle|Women|Lifestyle Footwear|3899|4999|4.4|l|Purple|White
Uno Air Sneaker|Women|Sneakers|5199|6799|4.6|s|White|Pink
Flex Appeal Casual|Women|Casual Shoes|3699|4799|4.3|s|Green|White
Lights Kids Runner|Kids|Sports Shoes|2799|3699|4.5|r|Blue|Yellow
Scout School Shoe|Kids|School Shoes|2299|2999|4.4|k|Black|Grey
Twinkle Toes Sneaker|Kids|Sneakers|2499|3299|4.2|s|Pink|White`,
Crocs:`Classic Clog|Men|Casual Shoes|3495|4495|4.7|c|Navy|Grey
Literide Pacer|Men|Walking Shoes|3995|4995|4.4|r|Black|Green
Echo Wave Slip-On|Men|Sneakers|4295|5495|4.3|s|Grey|Orange
Swiftwater Sport Sandal|Men|Sports Shoes|2995|3995|4.4|l|Blue|Black
Bayaband Clog|Women|Lifestyle Footwear|3295|4295|4.6|c|Pink|White
Brooklyn Platform|Women|Casual Shoes|3995|5295|4.5|l|Black|Yellow
Literide Cloud Walker|Women|Walking Shoes|3695|4695|4.5|r|Purple|White
Echo Street Sneaker|Women|Sneakers|4195|5395|4.2|s|White|Pink
Classic Kids Clog|Kids|Everyday Footwear|2299|2999|4.8|c|Green|Yellow
Bubble Splash Clog|Kids|Casual Shoes|2199|2899|4.5|c|Orange|Blue
Mini Scout Sneaker|Kids|Sneakers|2399|3199|4.3|s|Blue|White`,
Campus:`Rush Runner|Men|Running Shoes|1299|1999|4.3|r|Blue|Lime
Stride Pro Walk|Men|Walking Shoes|1199|1799|4.2|r|Grey|Orange
Urban Pace Casual|Men|Casual Shoes|1499|2199|4.1|s|Navy|White
Arena Sport|Men|Sports Shoes|1399|2099|4.4|r|Black|Yellow
Zip Racer|Women|Running Shoes|1199|1899|4.2|r|Pink|Purple
Breeze Walk|Women|Walking Shoes|999|1599|4.1|r|Purple|White
Everyday Lite Sneaker|Women|Sneakers|1299|1899|4.3|s|White|Pink
Soft Step Lifestyle|Women|Lifestyle Footwear|899|1499|4.0|l|Green|White
Junior Sprint|Kids|Sports Shoes|899|1399|4.2|r|Red|Black
School Smart Black|Kids|School Shoes|799|1199|4.3|k|Black|White
Play Day Sneaker|Kids|Sneakers|849|1299|4.1|s|Blue|Yellow`};
const PRODUCTS=[];
Object.entries(RAW).forEach(([brand,txt])=>txt.split('\n').forEach((row,i)=>{
 const [name,gender,category,price,mrp,rating,type,c1,c2]=row.split('|');
 const id=PRODUCTS.length+1,real=REAL[type];
 const gen=col=>{const a=COLORS[col]||COLORS[c1],t=real?'r':type;return[real||svgURI(t,a,COLORS[c2]),svgURI(t,COLORS[c2],a),svgURI(t,a,'#ffffff')]};
 PRODUCTS.push({id,brand,name,category,gender,price:+price,originalPrice:+mrp,discount:Math.round((mrp-price)/mrp*100),rating:+rating,reviews:80+(id*137)%1400,
  sizes:SIZES[gender],colors:[...new Set([c1,c2,'Black'])],gen,images:gen(c1),isNew:i%4===1,isTrending:i%5===2,
  description:`${name} is made for ${category.toLowerCase()} with ${BR[brand].tag}. A breathable upper, flexible outsole and cushioned footbed keep every step light, from the first mile to the last.`});
}));
