'use strict';
(() => {
  const R = window.RT; if (!R) return;
  const { $, $$, LS, inr, toast } = R, D = document.body.dataset, app = $('#app');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];
  const PAYL = { card: 'Credit / debit card', upi: 'UPI / QR code', cod: 'Cash on delivery' };
  const STEPS = [['Order placed', 'We have received your order'], ['Confirmed', 'The seller confirmed your order'], ['Packed', 'Your shoes are packed'], ['Shipped', 'Handed over to the courier'], ['Out for delivery', 'The delivery partner is on the way'], ['Delivered', 'Delivered to your address']];
  const orders = () => LS.get('rt_orders', []);
  const date = t => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const clock = t => new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const luhn = n => { let s = 0, d = false; for (let i = n.length - 1; i >= 0; i--) { let k = +n[i]; if (d) { k *= 2; if (k > 9) k -= 9 } s += k; d = !d } return n.length >= 13 && s % 10 === 0 };
  const newId = () => { const d = new Date(); return 'RT' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase() };
  const stage = o => Math.min(STEPS.length - 1, Math.floor((Date.now() - o.ts) / 1000 / SHOP.trackStepSeconds));

  /* ================= CHECKOUT ================= */
  function checkout() {
    if (!R.getCart().length) { app.innerHTML = `<section class="wrap">${R.empty('Your bag is empty', 'Add a pair before checking out.', 'Browse shoes', 'offers.html')}</section>`; return }
    const u = R.user, sv = LS.get('rt_addr', {});
    const S = { step: 1, method: 'card', a: { name: sv.name || (u && u.name) || '', phone: sv.phone || '', email: sv.email || (u && u.email) || '', address: sv.address || '', city: sv.city || '', state: sv.state || '', pin: sv.pin || '' } };
    R.setMethod(S.method); document.title = 'Checkout | RT Shoes';
    app.innerHTML = `<section class="wrap"><h1 class="ph1">Check<span class="y">out</span></h1><ol class="stp" id="stp"><li>Delivery</li><li>Payment</li></ol><div class="cartg"><div id="cs"></div><aside class="box2" id="cside"></aside></div></section>`;
    const marks = () => $$('#stp li').forEach((l, i) => l.className = i + 1 < S.step ? 'done' : i + 1 === S.step ? 'on' : '');
    const upiLink = () => `upi://pay?pa=${SHOP.upi.vpa}&pn=${encodeURIComponent(SHOP.upi.name)}&am=${R.totals(S.method).total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('RT Shoes order')}`;
    const sideDraw = () => { const t = R.totals(S.method); $('#cside').innerHTML = `<h3>Order summary</h3><div class="mini">${R.getCart().map(i => { const p = R.byId(i.id); return `<div><span>${esc(p.brand)} ${esc(p.name)} · UK ${i.size} × ${i.qty}</span><b>${inr(p.price * i.qty)}</b></div>` }).join('')}</div>${R.couponBox(t)}${R.summary(t)}`; R.wireCoupon($('#cpbox'), () => { sideDraw(); if (S.step === 2) payRefresh() }) };
    const fld = (n, l, x = '', cls = '') => `<label class="f ${cls}">${l}<input name="${n}" ${x} value="${esc(S.a[n])}"><small class="err" data-e="${n}"></small></label>`;
    function step1() {
      S.step = 1; marks();
      $('#cs').innerHTML = `<form class="box2 fgrid" id="af" novalidate><h3 class="w2">Delivery details</h3>
${fld('name', 'Full name', 'autocomplete="name"')}${fld('phone', 'Mobile number', 'type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit number"')}
${fld('email', 'Email address', 'type="email" autocomplete="email"', 'w2')}
<label class="f w2">Address (house no, street, area)<textarea name="address" rows="3" autocomplete="street-address">${esc(S.a.address)}</textarea><small class="err" data-e="address"></small></label>
${fld('city', 'City', 'autocomplete="address-level2"')}
<label class="f">State<select name="state"><option value="">Select state</option>${STATES.map(s => `<option ${S.a.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select><small class="err" data-e="state"></small></label>
${fld('pin', 'Pincode', 'inputmode="numeric" maxlength="6" autocomplete="postal-code" placeholder="6 digits"')}
<div class="w2 row"><a class="btn ghost" href="cart.html">Back to bag</a><button class="btn" type="submit">Continue to payment</button></div></form>`;
      const f = $('#af');
      f.onsubmit = e => {
        e.preventDefault(); const v = Object.fromEntries(new FormData(f)); Object.keys(v).forEach(k => v[k] = String(v[k]).trim());
        const er = {}; if (v.name.length < 2) er.name = 'Enter your full name'; if (!/^[6-9]\d{9}$/.test(v.phone)) er.phone = 'Enter a valid 10-digit mobile number'; if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Enter a valid email address';
        if (v.address.length < 10) er.address = 'Enter your full address'; if (v.city.length < 2) er.city = 'Enter your city'; if (!v.state) er.state = 'Select your state'; if (!/^[1-9]\d{5}$/.test(v.pin)) er.pin = 'Enter a valid 6-digit pincode';
        $$('[data-e]', f).forEach(x => x.textContent = er[x.dataset.e] || '');
        const bad = Object.keys(er)[0]; if (bad) { $(`[name=${bad}]`, f).focus(); return }
        S.a = v; LS.set('rt_addr', v); step2(); scrollTo({ top: 0, behavior: R.RM ? 'auto' : 'smooth' })
      }
    }
    const hints = { card: 'Visa, Mastercard, RuPay', upi: 'Scan the QR with any UPI app', cod: `Pay when it arrives (+${inr(SHOP.codFee)} fee)` };
    function payPanel() {
      const m = S.method, p = $('#pp');
      if (m === 'card') p.innerHTML = `<div class="fgrid"><label class="f w2">Card number<input id="cn" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23"><small class="err" data-e="cn"></small></label><label class="f w2">Name on card<input id="cnm" autocomplete="cc-name"><small class="err" data-e="cnm"></small></label><label class="f">Expiry (MM/YY)<input id="cex" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"><small class="err" data-e="cex"></small></label><label class="f">CVV<input id="cvv" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4"><small class="err" data-e="cvv"></small></label></div><p class="demo">Demo only: no card is charged and card details are never saved. Test number: 4242 4242 4242 4242.</p>`;
      if (m === 'upi') p.innerHTML = `<div class="upi"><div id="qr" class="qr"></div><div class="upit"><b id="qamt"></b><p>UPI ID: <code>${esc(SHOP.upi.vpa)}</code></p><a class="btn sm ghost" id="upil" href="#">Open UPI app</a><label class="chk"><input type="checkbox" id="paid"> I have completed the payment</label><small class="err" data-e="paid"></small></div></div><p class="demo">Demo only: payments are not verified. A real store needs a payment gateway and a server.</p>`;
      if (m === 'cod') p.innerHTML = `<p class="dsc">Pay in cash or UPI to the delivery partner when your order arrives. A cash on delivery fee of ${inr(SHOP.codFee)} is added to your total.</p>`;
      const cn = $('#cn'); if (cn) cn.oninput = () => cn.value = cn.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
      const cx = $('#cex'); if (cx) cx.oninput = () => { let d = cx.value.replace(/\D/g, '').slice(0, 4); cx.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d };
      payRefresh()
    }
    function payRefresh() {
      const t = R.totals(S.method); $('#pbtn').textContent = `Place order · ${inr(t.total)}`;
      if (S.method === 'upi') {
        $('#qamt').textContent = `Scan to pay ${inr(t.total)}`; $('#upil').href = upiLink(); const q = $('#qr'); q.innerHTML = '';
        if (window.QRCode) new QRCode(q, { text: upiLink(), width: 180, height: 180 }); else q.innerHTML = '<small>QR could not load. Use the UPI ID.</small>'
      }
    }
    function step2() {
      S.step = 2; marks();
      $('#cs').innerHTML = `<div class="box2"><h3>Payment method</h3><div class="pays" role="radiogroup" aria-label="Payment method">${Object.entries(PAYL).map(([k, l]) => `<label class="pay ${S.method === k ? 'on' : ''}"><input type="radio" name="pm" value="${k}" ${S.method === k ? 'checked' : ''}><b>${l}</b><small>${hints[k]}</small></label>`).join('')}</div><div id="pp"></div>
<p class="demo">Delivering to <b>${esc(S.a.name)}</b>, ${esc(S.a.city)} - ${esc(S.a.pin)}. <button class="lk" id="ed">Edit</button></p><div class="row"><button class="btn ghost" id="bk">Back</button><button class="btn" id="pbtn">Place order</button></div></div>`;
      $$('[name=pm]').forEach(r => r.onchange = () => { S.method = r.value; R.setMethod(S.method); $$('.pay').forEach(x => x.classList.toggle('on', $('input', x).checked)); payPanel(); sideDraw() });
      $('#bk').onclick = $('#ed').onclick = step1; $('#pbtn').onclick = place; payPanel(); sideDraw()
    }
    const err = (k, m) => { const e = $(`[data-e=${k}]`); if (e) e.textContent = m || '' };
    function place() {
      const m = S.method; let last4 = null, ok = true;
      if (m === 'card') {
        const n = $('#cn').value.replace(/\D/g, ''), ex = $('#cex').value, mm = +ex.slice(0, 2), yy = 2000 + +ex.slice(3), now = new Date();
        err('cn', luhn(n) ? '' : 'Enter a valid card number'); err('cnm', $('#cnm').value.trim().length >= 2 ? '' : 'Enter the name on the card');
        const exOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(ex) && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1)); err('cex', exOk ? '' : 'Enter a valid expiry date');
        const cvOk = /^\d{3,4}$/.test($('#cvv').value); err('cvv', cvOk ? '' : 'Enter the CVV'); ok = luhn(n) && $('#cnm').value.trim().length >= 2 && exOk && cvOk; last4 = n.slice(-4)
      }
      if (m === 'upi') { ok = $('#paid').checked; err('paid', ok ? '' : 'Tick this after you have paid') }
      if (!ok) return toast('Please fix the highlighted fields');
      const t = R.totals(m), b = $('#pbtn'); b.disabled = true;
      const o = {
        id: newId(), ts: Date.now(), customer: S.a, items: R.getCart().map(i => { const p = R.byId(i.id); return { id: p.id, name: p.name, brand: p.brand, size: i.size, qty: i.qty, price: p.price, mrp: p.originalPrice, img: p.images[0] } }),
        payment: { method: m, label: PAYL[m], last4, status: m === 'cod' ? 'Pay on delivery' : 'Paid (demo)' },
        totals: { mrp: t.mrp, disc: t.disc, pay: t.pay, n: t.n, code: t.cdisc ? t.code : null, cdisc: t.cdisc, del: t.del, cod: t.cod, total: t.total }
      };
      LS.set('rt_orders', [o, ...orders()]); LS.set('rt_coupon', null); R.setCart([]); location.href = `order.html?id=${o.id}&new=1`
    }
    step1(); sideDraw()
  }

  /* ================= INVOICE: print, PDF, share ================= */
  const money = n => 'Rs. ' + Math.round(n).toLocaleString('en-IN');
  const invHTML = o => {
    const c = o.customer; return `<div class="inv"><div class="ih"><div><h2>RT SHOES</h2><p>${esc(SHOP.address)}<br>${esc(SHOP.email)} · ${esc(SHOP.phone)}</p></div><div class="ir"><h3>INVOICE</h3><p>Invoice no: INV-${o.id}<br>Order ID: ${o.id}<br>Date: ${date(o.ts)}</p></div></div>
<div class="ib"><div><b>Bill to / Ship to</b><p>${esc(c.name)}<br>${esc(c.address)}<br>${esc(c.city)}, ${esc(c.state)} - ${esc(c.pin)}<br>Phone: ${esc(c.phone)}<br>${esc(c.email)}</p></div><div><b>Payment</b><p>${o.payment.label}${o.payment.last4 ? ' ending ' + o.payment.last4 : ''}<br>Status: ${o.payment.status}</p></div></div>
<table><thead><tr><th>#</th><th>Item</th><th>Size</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>${o.items.map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.brand)} ${esc(it.name)}</td><td>UK ${it.size}</td><td>${it.qty}</td><td>${inr(it.price)}</td><td>${inr(it.price * it.qty)}</td></tr>`).join('')}</tbody></table>${R.summary(o.totals)}
<p class="fine">Prices are inclusive of all applicable taxes. This is a computer-generated invoice from a demo store.</p></div>`};
  function printInv(o) { let a = $('#printarea'); if (!a) { a = document.createElement('div'); a.id = 'printarea'; document.body.append(a) } a.innerHTML = invHTML(o); window.print() }
  function buildPDF(o) {
    const d = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), c = o.customer, t = o.totals;
    d.setFillColor(255, 229, 0); d.rect(0, 0, 210, 30, 'F'); d.setTextColor(0); d.setFont('helvetica', 'bold'); d.setFontSize(24); d.text('RT SHOES', 14, 19); d.setFontSize(12); d.text('INVOICE', 196, 14, { align: 'right' }); d.setFont('helvetica', 'normal'); d.setFontSize(9); d.text('Step into your style', 196, 21, { align: 'right' });
    let y = 42; d.setFontSize(10); d.setFont('helvetica', 'bold'); d.text('Invoice no', 14, y); d.text('Order ID', 70, y); d.text('Date', 130, y); d.setFont('helvetica', 'normal'); d.text('INV-' + o.id, 14, y + 5); d.text(o.id, 70, y + 5); d.text(date(o.ts), 130, y + 5);
    y += 16; d.setFont('helvetica', 'bold'); d.text('Bill to / Ship to', 14, y); d.text('Payment', 120, y); d.setFont('helvetica', 'normal');
    const ad = d.splitTextToSize(`${c.name}\n${c.address}\n${c.city}, ${c.state} - ${c.pin}\nPhone: ${c.phone}\nEmail: ${c.email}`, 95); d.text(ad, 14, y + 5);
    d.text(d.splitTextToSize(`${o.payment.label}${o.payment.last4 ? ' ending ' + o.payment.last4 : ''}\nStatus: ${o.payment.status}`, 70), 120, y + 5); y += 5 + Math.max(ad.length, 3) * 4.6 + 6;
    const head = () => { d.setFillColor(20, 20, 20); d.rect(14, y, 182, 8, 'F'); d.setTextColor(255, 229, 0); d.setFont('helvetica', 'bold'); d.text('#', 16, y + 5.5); d.text('Item', 24, y + 5.5); d.text('Size', 118, y + 5.5); d.text('Qty', 138, y + 5.5); d.text('Price', 172, y + 5.5, { align: 'right' }); d.text('Amount', 194, y + 5.5, { align: 'right' }); y += 8; d.setTextColor(0); d.setFont('helvetica', 'normal') }; head();
    o.items.forEach((it, i) => { const nm = d.splitTextToSize(`${it.brand} ${it.name}`, 88), h = nm.length * 4.6 + 3; if (y + h > 270) { d.addPage(); y = 20; head() } d.text(String(i + 1), 16, y + 5); d.text(nm, 24, y + 5); d.text('UK ' + it.size, 118, y + 5); d.text(String(it.qty), 138, y + 5); d.text(money(it.price), 172, y + 5, { align: 'right' }); d.text(money(it.price * it.qty), 194, y + 5, { align: 'right' }); y += h + 1; d.setDrawColor(220); d.line(14, y, 196, y) });
    y += 8; if (y > 230) { d.addPage(); y = 20 }
    const row = (l, v, b) => { d.setFont('helvetica', b ? 'bold' : 'normal'); d.setFontSize(b ? 12 : 10); d.text(l, 130, y); d.text(v, 194, y, { align: 'right' }); y += b ? 8 : 6 };
    row(`Subtotal (${t.n} items)`, money(t.mrp)); row('Discount', '- ' + money(t.disc)); if (t.cdisc) row(`Coupon (${t.code})`, '- ' + money(t.cdisc)); row('Delivery', t.del ? money(t.del) : 'Free'); if (t.cod) row('Cash on delivery fee', money(t.cod)); d.setDrawColor(0); d.line(130, y - 3, 196, y - 3); row('Total', money(t.total), true);
    d.setFont('helvetica', 'normal'); d.setFontSize(8); d.setTextColor(110); d.text('Prices are inclusive of all applicable taxes. Computer-generated invoice from a demo store.', 14, 285); return d
  }
  const pdfOK = () => { if (window.jspdf) return true; toast('The PDF tool could not load. Use Print bill and choose Save as PDF.'); return false };
  const dlPDF = o => { if (pdfOK()) buildPDF(o).save(`RT-Invoice-${o.id}.pdf`) };
  const link = o => new URL(`order.html?id=${o.id}`, location.href).href;
  async function sharePDF(o) {
    if (!pdfOK()) return; const f = new File([buildPDF(o).output('blob')], `RT-Invoice-${o.id}.pdf`, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: `RT Shoes invoice ${o.id}`, text: `My RT Shoes order ${o.id}` }); return } catch (e) { if (e.name === 'AbortError') return } }
    const txt = `RT Shoes order ${o.id}\nTotal: ${money(o.totals.total)}\nTrack: ${link(o)}`;
    const b = R.modal(`<div class="au"><h2>Share invoice</h2><p class="dsc">Your device cannot attach a PDF here, so download it first, then send it with any option below.</p><button class="btn" id="s1">Download PDF</button><a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(txt)}">Share on WhatsApp</a><a class="btn ghost" href="mailto:?subject=${encodeURIComponent('RT Shoes invoice ' + o.id)}&body=${encodeURIComponent(txt)}">Share by email</a><button class="btn ghost" id="s2">Copy tracking link</button></div>`);
    $('#s1', b).onclick = () => dlPDF(o); $('#s2', b).onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(link(o)) : Promise.reject()).then(() => toast('Tracking link copied'), () => toast(link(o))) }
  }

  /* ================= TRACKING ================= */
  const trackHTML = o => {
    const s = stage(o), done = s === STEPS.length - 1, st = SHOP.trackStepSeconds * 1000;
    return `<div class="live">${done ? '<span class="okb">Delivered</span>' : '<span class="pulse"></span>Live tracking'}</div><h3 class="tt2">${STEPS[s][0]}</h3><p class="dsc">${STEPS[s][1]}. Estimated delivery: <b>${date(o.ts + SHOP.etaDays * 864e5)}</b></p><div class="pbar"><i id="pb"></i></div>
<ol class="trk">${STEPS.map(([t, d], i) => `<li class="${i < s || (done && i === s) ? 'done' : i === s ? 'now' : ''}"><i>${i <= s ? '✓' : i + 1}</i><div><b>${t}</b><small>${i <= s ? clock(o.ts + i * st) : d}</small></div></li>`).join('')}</ol>`
  };
  const pct = o => Math.min(100, (Date.now() - o.ts) / (SHOP.trackStepSeconds * 1000 * (STEPS.length - 1)) * 100);
  function live(o) { const box = $('#trk'); if (!box) return; let last = -1; const tick = () => { const s = stage(o); if (s !== last) { last = s; box.innerHTML = trackHTML(o) } const b = $('#pb'); if (b) b.style.width = pct(o) + '%'; if (s === STEPS.length - 1) clearInterval(iv) }; const iv = setInterval(tick, 1000); tick() }

  /* ================= ORDER PAGE ================= */
  function orderPage() {
    const q = new URLSearchParams(location.search), o = orders().find(x => x.id === q.get('id'));
    if (!o) { app.innerHTML = `<section class="wrap">${R.empty('Order not found', 'Orders are saved in the browser they were placed in.', 'View my orders', 'orders.html')}</section>`; return }
    document.title = `Order ${o.id} | RT Shoes`; const c = o.customer;
    app.innerHTML = `<section class="wrap"><div class="okbar">${q.get('new') ? `<h1 class="ph1">Thank <span class="y">you!</span></h1><p class="dsc">Your order is placed, ${esc(c.name.split(' ')[0])}. A confirmation would be emailed to ${esc(c.email)} on a live store.</p>` : `<h1 class="ph1">Order <span class="y">details</span></h1>`}<p class="oid">Order ID <b>${o.id}</b> · ${date(o.ts)}</p></div>
<div class="cartg"><div><div class="box2" id="trk"></div><div class="box2" style="margin-top:20px"><h3>Items</h3>${o.items.map(it => `<div class="ln"><a class="lt" style="--t:${R.TILE[it.id % 5]}" href="product-details.html?id=${it.id}"><img src="${it.img}" alt=""></a><div><b>${esc(it.name)}</b><small>${esc(it.brand)} · UK ${it.size} · Qty ${it.qty}</small></div><div class="lr"><b>${inr(it.price * it.qty)}</b></div></div>`).join('')}</div></div>
<aside><div class="box2"><h3>Bill</h3>${R.summary(o.totals)}<p class="demo">${o.payment.label}${o.payment.last4 ? ' ending ' + o.payment.last4 : ''} · ${o.payment.status}</p><div class="actc"><button class="btn w" id="a1">Print bill</button><button class="btn w ghost" id="a2">Download PDF invoice</button><button class="btn w ghost" id="a3">Share invoice</button></div></div>
<div class="box2" style="margin-top:20px"><h3>Delivering to</h3><p class="dsc">${esc(c.name)}<br>${esc(c.address)}<br>${esc(c.city)}, ${esc(c.state)} - ${esc(c.pin)}<br>${esc(c.phone)}</p></div><p style="margin-top:20px"><a class="btn ghost" href="offers.html">Continue shopping</a></p></aside></div></section>`;
    $('#a1').onclick = () => printInv(o); $('#a2').onclick = () => dlPDF(o); $('#a3').onclick = () => sharePDF(o); live(o)
  }

  /* ================= ORDERS LIST ================= */
  function ordersPage() {
    document.title = 'My orders | RT Shoes';
    app.innerHTML = `<section class="wrap"><h1 class="ph1">Track <span class="y">order</span></h1><form class="box2 tf" id="tf" novalidate><label class="f">Order ID<input name="i" placeholder="RT260101-ABCDE" autocomplete="off"></label><label class="f">Mobile number<input name="p" inputmode="numeric" maxlength="10" placeholder="Used at checkout"></label><button class="btn" type="submit">Track</button><small class="err" id="te"></small></form><h2 class="sub2">My orders</h2><div id="ol"></div></section>`;
    $('#tf').onsubmit = e => {
      e.preventDefault(); const f = new FormData(e.target), id = String(f.get('i')).trim().toUpperCase(), p = String(f.get('p')).trim(), o = orders().find(x => x.id === id && x.customer.phone === p);
      if (o) location.href = `order.html?id=${o.id}`; else $('#te').textContent = 'No order found in this browser with that ID and mobile number.'
    };
    const draw = () => { const l = orders(); $('#ol').innerHTML = l.length ? l.map(o => `<article class="box2 oc"><div><b>${o.id}</b><small>${date(o.ts)} · ${o.totals.n} item${o.totals.n > 1 ? 's' : ''} · ${inr(o.totals.total)}</small><div class="stt">${STEPS[stage(o)][0]}</div></div><div class="row"><a class="btn sm" href="order.html?id=${o.id}">Track and details</a><button class="btn sm ghost" data-inv="${o.id}">Invoice PDF</button></div></article>`).join('') : R.empty('No orders yet', 'Your orders will appear here after checkout.', 'Start shopping', 'offers.html') };
    draw(); setInterval(draw, 5000); $('#ol').onclick = e => { const b = e.target.closest('[data-inv]'); if (b) dlPDF(orders().find(x => x.id === b.dataset.inv)) }
  }

  ({ checkout, order: orderPage, orders: ordersPage })[D.page]?.();
  R.observe();
})();
