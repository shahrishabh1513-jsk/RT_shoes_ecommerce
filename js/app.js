'use strict';
/* RT Shoes: layout, cart, wishlist, search, filters, animations, pages. Frontend demo only. */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const byId=id=>PRODUCTS.find(p=>p.id===+id);
const D=document.body.dataset,app=$('#app');
let cart=LS.get('rt_cart',[]).filter(i=>byId(i.id)),wish=LS.get('rt_wish',[]).filter(byId),user=LS.get('rt_user',null);
let rerender=()=>{};
const TILE=['#6db3ff','#ffd95a','#ff7b72','#b9a3ff','#6fe3a5'];
const IC={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',heart:'<path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21.6l8.8-8.6a5.2 5.2 0 0 0 0-7.4z"/>',bag:'<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>'};
const ic=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const stars=p=>`<span class="rt" aria-label="${p.rating} out of 5">★ ${p.rating.toFixed(1)} <em>(${p.reviews.toLocaleString('en-IN')})</em></span>`;
const priceHTML=p=>`<div class="price"><b>${inr(p.price)}</b><s>${inr(p.originalPrice)}</s><span class="pc">${p.discount}% off</span></div>`;
const skel=n=>Array.from({length:n},()=>'<div class="skel"></div>').join('');
const sizesHTML=(p,def=true)=>`<div class="sz" role="group" aria-label="Size">${p.sizes.map((s,i)=>`<button type="button" class="${def&&!i?'on':''}" data-s="${s}">UK ${s}</button>`).join('')}</div>`;
const sizePick=root=>{const g=$('.sz',root);g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',g).forEach(x=>x.classList.toggle('on',x===b))});return()=>$('.on',g)?.dataset.s};

/* ---------- cards ---------- */
const card=(p,i=0)=>`<article class="card reveal" style="--d:${(i%8)*70}ms;--t:${TILE[p.id%5]}">
<a class="tile" href="product-details.html?id=${p.id}" aria-label="${p.brand} ${p.name}"><span class="off">${p.discount}%<br>OFF</span><img loading="lazy" src="${p.images[0]}" alt="${p.brand} ${p.name}"></a>
<button class="heart ${wish.includes(p.id)?'on':''}" data-act="wish" data-id="${p.id}" aria-label="Toggle wishlist">${ic('heart')}</button>
<div class="info"><small>${p.brand} · ${p.gender}</small><h3><a href="product-details.html?id=${p.id}">${p.name}</a></h3>${stars(p)}${priceHTML(p)}
<div class="acts"><button class="btn sm" data-act="add" data-id="${p.id}">Add to bag</button><button class="btn sm ghost" data-act="qv" data-id="${p.id}">Quick view</button></div></div></article>`;
const fill=(el,list,max=8)=>{if(!el)return;el.innerHTML=skel(Math.min(list.length,max));setTimeout(()=>{el.innerHTML=list.map(card).join('');observe()},RM?0:320)};
const empty=(t,m,l='Continue shopping',h='men.html')=>`<div class="empty"><h3>${t}</h3><p>${m}</p><a class="btn" href="${h}">${l}</a></div>`;

/* ---------- state ---------- */
const badges=()=>{const n=cart.reduce((a,i)=>a+i.qty,0);[['#bc',n],['#bw',wish.length]].forEach(([s,v])=>{const e=$(s);e.textContent=v;e.classList.toggle('has',v>0)})};
const save=()=>{LS.set('rt_cart',cart);LS.set('rt_wish',wish);badges();drawers();rerender()};
const toast=m=>{const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),2600)};
const totals=()=>{let mrp=0,pay=0,n=0;cart.forEach(i=>{const p=byId(i.id);mrp+=p.originalPrice*i.qty;pay+=p.price*i.qty;n+=i.qty});const del=pay&&pay<2999?99:0;return{mrp,disc:mrp-pay,pay,del,total:pay+del,n}};
const summary=t=>`<dl class="sum"><div><dt>Subtotal (${t.n} items)</dt><dd>${inr(t.mrp)}</dd></div><div><dt>Discount</dt><dd class="g">−${inr(t.disc)}</dd></div><div><dt>Delivery</dt><dd>${t.del?inr(t.del):'Free'}</dd></div><div class="tt"><dt>Total</dt><dd>${inr(t.total)}</dd></div></dl>`;
const line=(it,i)=>{const p=byId(it.id);return `<div class="ln"><a class="lt" style="--t:${TILE[p.id%5]}" href="product-details.html?id=${p.id}"><img src="${p.images[0]}" alt=""></a><div><b>${p.name}</b><small>${p.brand} · UK ${it.size}</small><div class="qty"><button data-act="dec" data-i="${i}" aria-label="Decrease quantity">−</button><span>${it.qty}</span><button data-act="inc" data-i="${i}" aria-label="Increase quantity">+</button></div></div><div class="lr"><b>${inr(p.price*it.qty)}</b><button class="lk" data-act="rm" data-i="${i}">Remove</button></div></div>`};
const wline=id=>{const p=byId(id);return `<div class="ln"><a class="lt" style="--t:${TILE[p.id%5]}" href="product-details.html?id=${p.id}"><img src="${p.images[0]}" alt=""></a><div><b>${p.name}</b><small>${p.brand}</small><div class="price"><b>${inr(p.price)}</b></div></div><div class="lr"><button class="btn sm" data-act="add" data-id="${p.id}">Add to bag</button><button class="lk" data-act="wish" data-id="${p.id}">Remove</button></div></div>`};
function drawers(){const t=totals();
 $('#db-cart').innerHTML=cart.length?cart.map(line).join(''):empty('Your bag is empty','Pick a pair you like and it will show up here.');
 $('#df-cart').innerHTML=cart.length?summary(t)+'<a class="btn w" href="cart.html">View bag and check out</a>':'';
 $('#db-wish').innerHTML=wish.length?wish.map(wline).join(''):empty('No saved shoes yet','Tap the heart on any pair to save it.','Browse shoes','offers.html');
 $('#df-wish').innerHTML=wish.length?'<a class="btn w" href="wishlist.html">Open wishlist</a>':''}
function addCart(id,size,qty=1){const p=byId(id);size=+size||p.sizes[0];const f=cart.find(i=>i.id===p.id&&i.size===size);f?f.qty+=qty:cart.push({id:p.id,size,qty});save();toast(`Added ${p.name} (UK ${size}) to bag`);const b=$('#bagbtn');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}
function toggleWish(id){const has=wish.includes(id);wish=has?wish.filter(x=>x!==id):[...wish,id];$$(`[data-act="wish"][data-id="${id}"]`).forEach(b=>{b.classList.toggle('on',!has);b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')});save();toast(has?'Removed from wishlist':'Saved to wishlist')}
const chg=(i,d)=>{cart[i].qty+=d;if(cart[i].qty<1)cart.splice(i,1);save()};

/* ---------- overlays ---------- */
const openDrawer=n=>{closeAll();drawers();$('#d-'+n).classList.add('on');$('#scrim').classList.add('on')};
const closeAll=()=>{$$('.drw,.mdl,.srch,#scrim').forEach(e=>e.classList.remove('on'));document.body.classList.remove('menu')};
const modal=h=>{closeAll();const m=$('#mdl');$('.box',m).innerHTML=`<button class="ico x" data-act="close" aria-label="Close">${ic('x')}</button>${h}`;m.classList.add('on');return $('.box',m)};
function quickView(id){const p=byId(id),b=modal(`<div class="qv"><div class="tile" style="--t:${TILE[p.id%5]};margin:0"><img src="${p.images[0]}" alt="${p.name}"></div><div><small>${p.brand} · ${p.category}</small><h2>${p.name}</h2>${stars(p)}${priceHTML(p)}<p class="dsc">${p.description}</p>${sizesHTML(p)}<div class="row"><button class="btn" id="qa">Add to bag</button><a class="btn ghost" href="product-details.html?id=${p.id}">Full details</a></div></div></div>`);
 const get=sizePick(b);$('#qa',b).onclick=()=>{addCart(p.id,get());closeAll()}}
function authModal(){
 if(user){const b=modal(`<div class="au"><h2>Hi, ${user.name}</h2><p class="dsc">${user.email}</p><button class="btn" id="lo">Log out</button><p class="demo">Frontend demo: your details are stored only in this browser.</p></div>`);$('#lo',b).onclick=()=>{user=null;LS.set('rt_user',null);closeAll();toast('Logged out')};return}
 let reg=false;const b=modal('<div class="au"></div>');
 const draw=()=>{$('.au',b).innerHTML=`<h2>${reg?'Create account':'Log in'}</h2><form id="af" class="au" novalidate>${reg?'<input name="n" placeholder="Full name" autocomplete="name" required>':''}<input name="e" type="email" placeholder="Email" autocomplete="email" required><input name="p" type="password" placeholder="Password (6+ characters)" autocomplete="${reg?'new':'current'}-password" required><button class="btn">${reg?'Create account':'Log in'}</button></form><button class="lk" id="sw">${reg?'Already have an account? Log in':'New here? Create an account'}</button><p class="demo">Frontend demo: there is no server or real authentication. Details stay in this browser.</p>`;
  $('#sw',b).onclick=()=>{reg=!reg;draw()};
  $('#af',b).onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),em=(f.get('e')||'').trim();
   if(!/^\S+@\S+\.\S+$/.test(em))return toast('Enter a valid email address');if((f.get('p')||'').length<6)return toast('Password needs 6+ characters');if(reg&&!(f.get('n')||'').trim())return toast('Enter your name');
   user={name:(f.get('n')||em.split('@')[0]).trim(),email:em};LS.set('rt_user',user);closeAll();toast(`Welcome, ${user.name}`)}};draw()}
function checkoutModal(){const t=totals(),b=modal(`<div class="au"><h2>Checkout</h2>${summary(t)}<p class="demo">Frontend demo: no payment is taken and no order is sent anywhere.</p><button class="btn" id="po">Place demo order</button></div>`);
 $('#po',b).onclick=()=>{cart=[];save();$('.au',b).innerHTML='<h2>Demo order placed</h2><p class="dsc">This is a front-end demonstration, so nothing was charged or shipped.</p><a class="btn" href="index.html">Back to home</a>'}}
function searchUI(){closeAll();$('#srch').classList.add('on');$('#sq').value='';$('#sr').innerHTML='';setTimeout(()=>$('#sq').focus(),60)}
const searchRes=q=>{const w=q.toLowerCase().split(/\s+/).filter(Boolean);if(!w.length)return'';const r=PRODUCTS.filter(p=>w.every(x=>`${p.name} ${p.brand} ${p.category} ${p.gender}`.toLowerCase().includes(x)));
 return r.length?r.slice(0,8).map(p=>`<a class="sr" href="product-details.html?id=${p.id}"><span class="lt" style="--t:${TILE[p.id%5]}"><img src="${p.images[0]}" alt=""></span><span><b>${p.name}</b><br><small>${p.brand} · ${p.gender} · ${p.category}</small></span><b>${inr(p.price)}</b></a>`).join('')+`<a class="btn ghost" href="offers.html?q=${encodeURIComponent(q)}">See all ${r.length} results</a>`:'<div class="empty"><p>No shoes found. Try a brand, a name or a category.</p></div>'};

/* ---------- chrome ---------- */
function chrome(){
 const cur=location.pathname.split('/').pop()||'index.html';
 const L=[['index.html','Home'],['index.html#brands','Brands',1],['men.html','Men'],['women.html','Women'],['kids.html','Kids'],['index.html#latest','New Arrivals'],['offers.html','Offers']];
 const nav=L.map(([h,l,s])=>`<li class="${s?'has-sub':''}"><a href="${h}" class="${h===cur||(s&&D.brand)?'on':''}">${l}</a>${s?`<div class="sub">${Object.keys(BR).map(b=>`<a href="${b.toLowerCase()}.html">${b}</a>`).join('')}</div>`:''}</li>`).join('');
 document.body.insertAdjacentHTML('afterbegin',`<div id="loader"><img src="assets/logos/logo.png" alt="RT Shoes"><i></i></div><div id="prog"></div>
<header class="hdr"><div class="wrap"><a class="logo" href="index.html"><img src="assets/logos/logo.png" alt="RT Shoes home"></a><nav class="nav" aria-label="Main"><ul>${nav}</ul></nav>
<div class="hacts"><button class="ico" data-act="search" aria-label="Search">${ic('search')}</button><button class="ico" data-act="open" data-id="wish" aria-label="Wishlist">${ic('heart')}<b class="bdg" id="bw"></b></button><button class="ico" id="bagbtn" data-act="open" data-id="cart" aria-label="Shopping bag">${ic('bag')}<b class="bdg" id="bc"></b></button><button class="ico" data-act="user" aria-label="Account">${ic('user')}</button><button class="ico burger" data-act="menu" aria-label="Menu">${ic('menu')}</button></div></div></header>`);
 const dr=(id,t)=>`<aside class="drw" id="d-${id}" aria-label="${t}"><div class="dh"><h3>${t}</h3><button class="ico" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="db" id="db-${id}"></div><div class="df" id="df-${id}"></div></aside>`;
 app.insertAdjacentHTML('afterend',`<footer class="ft"><div class="wrap"><div class="fg"><div><img src="assets/logos/logo.png" alt="RT Shoes"><p class="dsc">Step into your style. Nike, Skechers, Crocs and Campus in one place.</p><div class="soc"><a href="#" aria-label="Instagram" data-act="soc">IG</a><a href="#" aria-label="Facebook" data-act="soc">FB</a><a href="#" aria-label="X" data-act="soc">X</a><a href="#" aria-label="YouTube" data-act="soc">YT</a></div></div>
<div><h4>Shop</h4><a href="men.html">Men</a><a href="women.html">Women</a><a href="kids.html">Kids</a><a href="offers.html">Offers</a></div>
<div><h4>Brands</h4>${Object.keys(BR).map(b=>`<a href="${b.toLowerCase()}.html">${b}</a>`).join('')}</div>
<div><h4>Help</h4><a href="#" data-act="info" data-t="About us: RT Shoes is a demo multi-brand footwear store.">About us</a><a href="#" data-act="info" data-t="Contact: support@rtshoes.example (demo address).">Contact us</a><a href="#" data-act="info" data-t="Customer support is a demo placeholder.">Customer support</a><a href="#" data-act="info" data-t="Privacy: this demo stores data only in your browser.">Privacy policy</a><a href="#" data-act="info" data-t="Terms: demo site, no real sales take place.">Terms &amp; conditions</a><a href="#" data-act="info" data-t="Returns: 7-day easy returns (demo policy).">Return policy</a></div></div>
<div class="cp"><span>© 2026 RT Shoes. All rights reserved.</span><span>Frontend demo: no real payments or accounts.</span></div></div></footer>
<div id="scrim"></div>${dr('cart','Your bag')}${dr('wish','Wishlist')}
<div class="mdl" id="mdl" role="dialog" aria-modal="true"><div class="box"></div></div>
<div class="srch" id="srch" role="dialog" aria-label="Search"><div class="box"><div class="srow">${ic('search')}<input id="sq" placeholder="Search shoes, brands or categories" autocomplete="off"><button class="ico" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="sres" id="sr"></div></div></div>
<div class="toasts" id="toasts" aria-live="polite"></div><button id="top" data-act="top" aria-label="Back to top">↑</button>`);
 $('#sq').addEventListener('input',e=>$('#sr').innerHTML=searchRes(e.target.value));
 $('#sq').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())location.href='offers.html?q='+encodeURIComponent(e.target.value.trim())});
}
const act={search:searchUI,menu:()=>document.body.classList.toggle('menu'),open:el=>openDrawer(el.dataset.id),close:closeAll,wish:el=>toggleWish(+el.dataset.id),add:el=>addCart(+el.dataset.id,el.dataset.size),qv:el=>quickView(+el.dataset.id),inc:el=>chg(+el.dataset.i,1),dec:el=>chg(+el.dataset.i,-1),rm:el=>{cart.splice(+el.dataset.i,1);save()},user:authModal,checkout:checkoutModal,top:()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}),soc:()=>toast('Social links are placeholders in this demo'),info:el=>toast(el.dataset.t)};
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');
 if(el){e.preventDefault();act[el.dataset.act]?.(el);return}
 if(e.target.matches('#scrim,#mdl,#srch'))return closeAll();
 const a=e.target.closest('a[href]');
 if(a&&!a.target&&a.origin===location.origin&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&(a.pathname!==location.pathname||a.search!==location.search)){e.preventDefault();document.documentElement.classList.add('leaving');setTimeout(()=>location.href=a.href,RM?0:260)}
 else if(a)document.body.classList.remove('menu')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
addEventListener('pageshow',()=>document.documentElement.classList.remove('leaving'));

/* ---------- animations ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const t=e.target;t.classList.add('in');io.unobserve(t);setTimeout(()=>t.classList.add('done'),1100)}}),{threshold:.1,rootMargin:'0px 0px -30px 0px'});
function observe(){$$('.reveal:not(.in)').forEach(el=>RM?el.classList.add('in','done'):io.observe(el))}
let tk=false;
const onScroll=()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
 $('#prog').style.width=(h>0?y/h*100:0)+'%';$('.hdr').classList.toggle('sm',y>40);$('#top').classList.toggle('on',y>600);
 if(!RM)$$('[data-par]').forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom>-200&&r.top<innerHeight+200)el.style.transform=`translate3d(0,${(r.top*el.dataset.par).toFixed(1)}px,0)`});tk=false})};
addEventListener('scroll',onScroll,{passive:true});
if(!RM&&matchMedia('(hover:hover)').matches){let c=null;
 document.addEventListener('pointermove',e=>{const k=e.target.closest?.('.card.done');if(c&&c!==k)c.style.transform='';c=k;if(!k)return;const r=k.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;k.style.transform=`perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) translateY(-4px)`});
 document.addEventListener('pointerleave',()=>{if(c)c.style.transform=''},true)}

/* ---------- pages ---------- */
function home(){
 const pop=[...PRODUCTS].sort((a,b)=>b.rating*b.reviews-a.rating*a.reviews).slice(0,8);
 const lat=PRODUCTS.filter(p=>p.isNew).sort((a,b)=>b.id-a.id).slice(0,8);
 const tr=PRODUCTS.filter(p=>p.isTrending).sort((a,b)=>b.rating-a.rating).slice(0,8);
 const SL=[1,12,23,34].map(byId);
 const mq=['Up to 60% off','Summer footwear collection','New season, new steps','Premium brands. Better prices.'].map(t=>`<span>${t}</span>`).join('');
 app.innerHTML=`<section class="hero"><span class="dot" style="width:14px;height:14px;left:6%;top:18%"></span><span class="dot" style="width:8px;height:8px;left:46%;top:12%;animation-delay:-2s"></span>
<div class="wrap"><div class="hl"><h1><span class="y">Step into</span>your style</h1><p>Discover the latest footwear from the world's leading brands.</p><div class="row"><a class="btn" href="offers.html">Shop now</a><a class="btn ghost" href="#brands">Explore brands</a></div></div>
<div class="stage" id="stage" style="--sc:${BR.Nike.c}"><div class="ring"></div><div class="glow" data-par=".04"></div>
${SL.map((p,i)=>`<a class="slide ${i?'':'on'}" href="product-details.html?id=${p.id}" aria-label="${p.brand} ${p.name}"><img src="${p.images[0]}" alt="${p.brand} ${p.name}"><span class="chip-i"><small>${p.brand}</small><b>${p.name}</b><span class="rt">${inr(p.price)} · ${p.discount}% off</span></span></a>`).join('')}
<div class="dots">${SL.map((p,i)=>`<button class="${i?'':'on'}" data-sl="${i}" aria-label="Show ${p.brand} slide"></button>`).join('')}</div></div></div></section>
<div class="mq" aria-hidden="true"><div>${mq}${mq}${mq}${mq}</div></div>
<section class="sec" id="brands"><div class="wrap"><div class="sh reveal"><h2>Featured <span>brands</span></h2></div><div class="bgrid">${SL.map((p,i)=>`<a class="bcard reveal" style="--b:${BR[p.brand].c};--d:${i*90}ms" href="${p.brand.toLowerCase()}.html"><div><small>${BR[p.brand].line}</small><h3>${p.brand}</h3></div><img loading="lazy" src="${p.images[0]}" alt=""><span class="btn sm">Explore collection</span></a>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><div class="sh reveal"><h2>Popular <span>products</span></h2><a class="more" href="offers.html">View all</a></div><div class="grid" id="g-pop"></div></div></section>
<section class="sec"><div class="wrap"><div class="sh reveal"><h2>Shop by <span>category</span></h2></div><div class="cats">${[['Men',3,'men.html'],['Women',6,'women.html'],['Kids',10,'kids.html']].map(([t,id,h],i)=>`<a class="cat reveal" style="--t:${TILE[i]};--d:${i*100}ms" href="${h}"><img loading="lazy" src="${byId(id).images[0]}" alt=""><h3>Shop ${t}</h3></a>`).join('')}</div></div></section>
<section class="sec" id="latest"><div class="wrap"><div class="sh reveal"><h2>Latest <span>arrivals</span></h2><a class="more" href="offers.html">See more</a></div><div class="grid" id="g-new"></div></div></section>
<section class="sec"><div class="wrap"><div class="promos">
<a class="pr sh2 s7 reveal" href="offers.html"><h3>Up to <span>60% off</span></h3><p class="dsc">Premium brands. Better prices.</p><span class="btn">Shop the sale</span><div class="pl" data-par="-.05"><img loading="lazy" src="${byId(2).images[0]}" alt=""></div></a>
<a class="pr ye s5 reveal" style="--d:100ms" href="offers.html"><h3>Summer footwear collection</h3><span class="btn">Shop now</span><div class="pl" data-par="-.04"><img loading="lazy" src="${byId(23).images[0]}" alt=""></div></a>
<a class="pr ye s5 reveal" href="women.html"><h3>New season, new steps</h3><span class="btn">Shop women</span><div class="pl" data-par="-.05"><img loading="lazy" src="${byId(6).images[0]}" alt=""></div></a>
<a class="pr sh2 s7 reveal" style="--d:100ms" href="offers.html"><h3>Premium brands. <span>Better prices.</span></h3><span class="btn">Explore offers</span><div class="pl" data-par="-.04"><img loading="lazy" src="${byId(3).images[0]}" alt=""></div></a></div></div></section>
<section class="sec"><div class="wrap"><div class="sh reveal"><h2>Trending <span>collection</span></h2></div><div class="grid" id="g-tr"></div></div></section>
<section class="sec"><div class="wrap"><div class="news reveal"><div><h2>Get 10% off your first pair</h2><p>Join the list for new drops and offers. Demo form: nothing is sent.</p></div><form id="nf" novalidate><input type="email" name="e" placeholder="Your email" aria-label="Email address" required><button class="btn">Subscribe</button></form></div></div></section>`;
 fill($('#g-pop'),pop);fill($('#g-new'),lat);fill($('#g-tr'),tr);
 $('#nf').onsubmit=e=>{e.preventDefault();const v=e.target.e.value.trim();if(!/^\S+@\S+\.\S+$/.test(v))return toast('Enter a valid email address');LS.set('rt_news',v);e.target.reset();toast('Subscribed. Check your inbox (demo)')};
 const st=$('#stage'),sl=$$('.slide',st),ds=$$('[data-sl]',st);let n=0,tm;
 const go=i=>{n=(i+sl.length)%sl.length;sl.forEach((s,k)=>s.classList.toggle('on',k===n));ds.forEach((d,k)=>d.classList.toggle('on',k===n));st.style.setProperty('--sc',BR[SL[n].brand].c)};
 const run=()=>{clearInterval(tm);tm=setInterval(()=>go(n+1),5000)};
 ds.forEach(d=>d.onclick=()=>{go(+d.dataset.sl);run()});st.onmouseenter=()=>clearInterval(tm);st.onmouseleave=run;run();
 if(!RM)$('.mq div').style.animationPlayState='running';onScroll()}

function list(){
 const B=D.brand,G=D.gender,P=new URLSearchParams(location.search),info=BR[B];
 if(B)document.body.style.setProperty('--b',info.c);
 const base=PRODUCTS.filter(p=>(!B||p.brand===B)&&(!G||p.gender===G));
 const maxP=Math.ceil(Math.max(...base.map(p=>p.price))/500)*500;
 const f={q:P.get('q')||'',g:P.get('g')||'',b:'',cat:'',col:'',sz:'',r:0,max:maxP,s:D.sort||'pop'};
 const title=B||G||(f.q?'Search':'Offers');
 const intro=B?info.intro:G?`Browse ${G.toLowerCase()}'s footwear from Nike, Skechers, Crocs and Campus.`:'Every pair, with the biggest discounts first. Filter by brand, size, colour and price.';
 const hero=base.find(p=>p.id===(B?{Nike:1,Skechers:12,Crocs:23,Campus:34}[B]:G==='Men'?3:G==='Women'?6:G==='Kids'?10:2))||base[0];
 document.title=`${title} | RT Shoes`;
 const opt=(a,l)=>a.map(x=>`<option value="${x}">${x}</option>`).join('');
 const cats=[...new Set(base.map(p=>p.category))],cols=Object.keys(COLORS),szs=[...new Set(base.flatMap(p=>p.sizes))].sort((a,b)=>a-b);
 app.innerHTML=`<section class="lh"><div class="wrap"><div><h1 class="${B?'':'ol'}">${title}</h1><p>${intro}</p>${B?`<p class="y"><b>${info.line}</b></p>`:''}</div><img src="${hero.images[0]}" alt=""></div></section>
<section class="wrap"><div class="bar">${G?'':`<div class="bar" id="tabs" style="margin:0">${['','Men','Women','Kids'].map(g=>`<button class="tab" data-g="${g}">${g||'All'}</button>`).join('')}</div>`}
<input class="fld q" id="fq" type="search" placeholder="Search by name, brand or category" aria-label="Search" value="${f.q.replace(/"/g,'&quot;')}">
<select class="fld" id="fs" aria-label="Sort"><option value="pop">Popularity</option><option value="new">Newest first</option><option value="lh">Price: low to high</option><option value="hl">Price: high to low</option><option value="rate">Highest rated</option><option value="off">Biggest discount</option></select></div>
<div class="bar" style="margin-top:0">${B?'':`<select class="fld" id="fb" aria-label="Brand"><option value="">All brands</option>${opt(Object.keys(BR))}</select>`}
<select class="fld" id="fc" aria-label="Category"><option value="">All categories</option>${opt(cats)}</select>
<select class="fld" id="fo" aria-label="Colour"><option value="">Any colour</option>${opt(cols)}</select>
<select class="fld" id="fz" aria-label="Size"><option value="">Any size</option>${szs.map(s=>`<option value="${s}">UK ${s}</option>`).join('')}</select>
<select class="fld" id="fr" aria-label="Rating"><option value="0">Any rating</option><option value="4">4★ and up</option><option value="4.5">4.5★ and up</option></select>
<label class="rg">Up to <input type="range" id="fp" min="500" max="${maxP}" step="100" value="${maxP}"> <b id="fv" class="y"></b></label><button class="btn sm ghost" id="rs">Reset</button></div>
<p class="cnt" id="cnt"></p><div class="grid" id="lg" style="margin-bottom:20px"></div></section>`;
 const S={pop:(a,b)=>b.reviews-a.reviews,lh:(a,b)=>a.price-b.price,hl:(a,b)=>b.price-a.price,new:(a,b)=>b.isNew-a.isNew||b.id-a.id,rate:(a,b)=>b.rating-a.rating||b.reviews-a.reviews,off:(a,b)=>b.discount-a.discount};
 const sync=()=>{$('#fq').value=f.q;$('#fs').value=f.s;$('#fc').value=f.cat;$('#fo').value=f.col;$('#fz').value=f.sz;$('#fr').value=f.r;$('#fp').value=f.max;$('#fv').textContent=inr(f.max);$('#fb')&&($('#fb').value=f.b);$$('.tab').forEach(t=>t.classList.toggle('on',t.dataset.g===f.g))};
 let first=true;
 const apply=()=>{const w=f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const r=base.filter(p=>(!f.g||p.gender===f.g)&&(!f.b||p.brand===f.b)&&(!f.cat||p.category===f.cat)&&(!f.col||p.colors.includes(f.col))&&(!f.sz||p.sizes.includes(+f.sz))&&p.rating>=+f.r&&p.price<=f.max&&w.every(x=>`${p.name} ${p.brand} ${p.category} ${p.gender}`.toLowerCase().includes(x))).sort(S[f.s]);
  $('#fv').textContent=inr(f.max);$('#cnt').textContent=`${r.length} ${r.length===1?'pair':'pairs'} found`;
  const g=$('#lg'),draw=()=>{g.innerHTML=r.length?r.map(card).join(''):`<div class="empty"><h3>No shoes match</h3><p>Try removing a filter or searching for something else.</p><button class="btn" id="rs2">Reset filters</button></div>`;observe();$('#rs2')&&($('#rs2').onclick=reset)};
  if(first){first=false;g.innerHTML=skel(8);setTimeout(draw,RM?0:320)}else draw()};
 const reset=()=>{Object.assign(f,{q:'',g:G||'',b:'',cat:'',col:'',sz:'',r:0,max:maxP,s:D.sort||'pop'});sync();apply()};
 const bind=(id,k,ev='change')=>{const e=$(id);e&&e.addEventListener(ev,()=>{f[k]=e.value;apply()})};
 bind('#fq','q','input');bind('#fs','s');bind('#fb','b');bind('#fc','cat');bind('#fo','col');bind('#fz','sz');bind('#fr','r');bind('#fp','max','input');
 $('#rs').onclick=reset;$('#tabs')&&$('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(b){f.g=b.dataset.g;sync();apply()}});
 sync();apply()}

function product(){
 const p=byId(new URLSearchParams(location.search).get('id'))||PRODUCTS[0];
 document.title=`${p.name} | RT Shoes`;let qty=1,col=p.colors[0];
 const rel=PRODUCTS.filter(x=>x.id!==p.id&&(x.brand===p.brand||x.category===p.category)).sort((a,b)=>(b.brand===p.brand&&b.gender===p.gender)-(a.brand===p.brand&&a.gender===p.gender)||b.rating-a.rating).slice(0,4);
 app.innerHTML=`<section class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="${p.brand.toLowerCase()}.html">${p.brand}</a> / ${p.name}</nav>
<div class="pdg"><div class="gal"><div class="tile big" style="--t:${TILE[p.id%5]}"><img id="gi" src="${p.images[0]}" alt="${p.brand} ${p.name}"></div><div class="thumbs" id="th"></div></div>
<div class="pi"><small>${p.brand} · ${p.gender} · ${p.category}</small><h1>${p.name}</h1>${stars(p)}${priceHTML(p)}<p class="dsc">${p.description}</p>
<h4>Colour: <span id="cn">${col}</span></h4><div class="cols">${p.colors.map((c,i)=>`<button class="sw ${i?'':'on'}" data-c="${c}" style="--c:${COLORS[c]}" aria-label="${c}"></button>`).join('')}</div>
<h4>Size (UK)</h4>${sizesHTML(p,false)}<h4>Quantity</h4><div class="qty big"><button id="qm" aria-label="Decrease">−</button><span id="qn">1</span><button id="qp" aria-label="Increase">+</button></div>
<div class="row"><button class="btn" id="pa">Add to bag</button><button class="btn ghost" id="pb">Buy now</button><button class="ico heart ${wish.includes(p.id)?'on':''}" data-act="wish" data-id="${p.id}" aria-label="Toggle wishlist">${ic('heart')}</button></div>
<ul class="dlv"><li>Free delivery on orders above ${inr(2999)} (otherwise ${inr(99)})</li><li>Delivered in 3-5 working days</li><li>7-day easy returns and exchanges</li><li>Cash on delivery available (demo)</li></ul></div></div>
<div class="sec"><div class="sh"><h2>Related <span>products</span></h2></div><div class="grid" id="rel"></div></div></section>`;
 const th=$('#th'),draw=()=>{th.innerHTML=p.images.map((s,i)=>`<button class="${i?'':'on'}" data-i="${i}" aria-label="Image ${i+1}"><img src="${s}" alt=""></button>`).join('');$('#gi').src=p.images[0]};draw();
 th.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',th).forEach(x=>x.classList.toggle('on',x===b));$('#gi').src=p.images[+b.dataset.i]};
 $('.cols').onclick=e=>{const b=e.target.closest('.sw');if(!b)return;col=b.dataset.c;$$('.sw').forEach(x=>x.classList.toggle('on',x===b));$('#cn').textContent=col;p.images=p.gen(col);draw()};
 const get=sizePick($('.pi'));
 $('#qm').onclick=()=>$('#qn').textContent=qty=Math.max(1,qty-1);$('#qp').onclick=()=>$('#qn').textContent=qty=Math.min(10,qty+1);
 const need=()=>{const s=get();if(!s)toast('Choose a size first');return s};
 $('#pa').onclick=()=>{const s=need();s&&addCart(p.id,s,qty)};
 $('#pb').onclick=()=>{const s=need();if(s){addCart(p.id,s,qty);location.href='cart.html'}};
 fill($('#rel'),rel,4)}

function cartPage(){rerender=()=>{const t=totals();
 app.innerHTML=`<section class="wrap"><h1 style="font-size:clamp(36px,5vw,64px);margin-top:36px">Shopping <span class="y">bag</span></h1>${cart.length?`<div class="cartg"><div>${cart.map(line).join('')}<p style="margin-top:20px"><a class="btn ghost" href="offers.html">Continue shopping</a></p></div><aside class="box2"><h3>Order summary</h3>${summary(t)}<button class="btn w" data-act="checkout">Checkout</button><p class="demo">Frontend demo: checkout does not take payment. Free delivery above ${inr(2999)}.</p></aside></div>`:empty('Your bag is empty','Pick a pair you like and it will show up here.')}</section>`};rerender()}
function wishPage(){rerender=()=>{app.innerHTML=`<section class="wrap"><h1 style="font-size:clamp(36px,5vw,64px);margin:36px 0">My <span class="y">wishlist</span></h1><div class="grid" id="wg">${wish.length?wish.map(id=>card(byId(id))).join(''):empty('No saved shoes yet','Tap the heart on any pair to save it here.','Browse shoes','offers.html')}</div></section>`;observe()};rerender()}

/* ---------- init ---------- */
chrome();badges();drawers();
({home,list,product,cart:cartPage,wishlist:wishPage})[D.page]?.();
observe();onScroll();
const hide=()=>$('#loader').classList.add('off');
addEventListener('load',()=>setTimeout(hide,RM?0:600));setTimeout(hide,3500);
})();
