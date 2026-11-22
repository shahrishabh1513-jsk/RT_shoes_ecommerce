'use strict';
/* =====================================================================
   RT SHOES SETTINGS - edit store details, delivery rules and coupons here
   ===================================================================== */
const SHOP={
 name:'RT Shoes',
 email:'support@rtshoes.example',      // shown on invoices
 phone:'+91 00000 00000',              // shown on invoices
 address:'RT Shoes, India',            // store address printed on invoices
 freeShipAbove:2999,                   // free delivery when the bag is at or above this amount
 shipFee:99,                           // delivery charge below that amount
 codFee:49,                            // extra fee for Cash on delivery
 etaDays:4,                            // estimated delivery in days
 trackStepSeconds:30,                  // demo tracking: seconds between each tracking step
 upi:{vpa:'rtshoes@upi',name:'RT Shoes'}, // UPI ID used for the payment QR code. CHANGE THIS to your own UPI ID
 /* Coupons. type: 'percent' | 'flat' | 'ship' (free delivery)
    optional rules: min (minimum bag value), max (cap on a percent coupon),
    brands:['Nike'], genders:['Kids'], first:true (first order only), pay:'prepaid' (Card or UPI only) */
 coupons:[
  {code:'RTWELCOME',desc:'10% off your first order (up to ₹500)',type:'percent',value:10,max:500,first:true},
  {code:'STEP200',desc:'₹200 off on orders above ₹2,999',type:'flat',value:200,min:2999},
  {code:'BIGSTEP20',desc:'20% off on orders above ₹7,999 (up to ₹1,500)',type:'percent',value:20,max:1500,min:7999},
  {code:'COMET15',desc:'15% off Comet sneakers (up to ₹800)',type:'percent',value:15,max:800,brands:['Comet']},
  {code:'JUSTRUN300',desc:'₹300 off Nike above ₹4,999',type:'flat',value:300,min:4999,brands:['Nike']},
  {code:'SKXCOMFY12',desc:'12% off Skechers (up to ₹700)',type:'percent',value:12,max:700,brands:['Skechers']},
  {code:'CAMPUS100',desc:'₹100 off Campus shoes above ₹999',type:'flat',value:100,min:999,brands:['Campus']},
  {code:'MINIKICKS',desc:'₹250 off kids shoes above ₹1,999',type:'flat',value:250,min:1999,genders:['Kids']},
  {code:'PAYSMART5',desc:'Extra 5% off when you pay by Card or UPI (up to ₹400)',type:'percent',value:5,max:400,pay:'prepaid'},
  {code:'FREEDEL',desc:'Free delivery on any order',type:'ship'}
 ]
};
