import test from 'node:test';import assert from 'node:assert/strict';
const load=()=>import('../src/lib/quotes.mjs');
test('valida el par, importes y fecha de proveedor sin inventar actualidad',async()=>{
 const {parseQuote}=await load();
 assert.equal(parseQuote('eurusd',{base:'EUR',date:'2026-10-29',rates:{USD:1.113}}).rate,'1.113');
 const row=parseQuote('mep',{moneda:'USD',casa:'bolsa',compra:1563.2,venta:1565.4,fechaActualizacion:'2026-10-29T18:00:00Z'});assert.equal(row.buy,'1563.2');assert.equal(row.asOf,'2026-10-29T18:00:00Z');
 for(const value of [0,-1,Infinity,'bad'])assert.throws(()=>parseQuote('crypto',{moneda:'USD',casa:'cripto',compra:value,venta:1653,fechaActualizacion:'2026-10-29T18:00:00Z'}));
 assert.throws(()=>parseQuote('mep',{moneda:'USD',casa:'cripto',compra:1,venta:2,fechaActualizacion:'bad'}));
});
test('fallo de un proveedor conserva snapshot por par sin pisar respuestas válidas',async()=>{
 const {fetchQuoteBook}=await load();const snapshot={eurusd:{rate:'1.1',asOf:'2026-10-28',source:'saved'},mep:{buy:'1500',sell:'1510',asOf:'2026-10-28',source:'saved'},crypto:{buy:'1600',sell:'1610',asOf:'2026-10-28',source:'saved'}};
 const result=await fetchQuoteBook({snapshot,fetcher:async url=>{
  if(url.includes('bolsa'))return {ok:true,json:async()=>({moneda:'USD',casa:'bolsa',compra:1563.2,venta:1565.4,fechaActualizacion:'2026-10-29T18:00:00Z'})};
  throw new Error('offline');
 }});
 assert.equal(result.mep.buy,'1563.2');assert.equal(result.mep.status,'network');assert.equal(result.crypto.buy,'1600');assert.equal(result.crypto.status,'saved');assert.equal(result.crypto.asOf,'2026-10-28');assert.equal(result.eurusd.rate,'1.1');
});
test('timeout conserva los datos guardados y su fecha original',async t=>{
 const {fetchQuoteBook}=await load();t.mock.timers.enable({apis:['setTimeout']});
 const snapshot={eurusd:{rate:'1.1',asOf:'2026-10-28'},mep:{buy:'1500',sell:'1510',asOf:'2026-10-28'},crypto:{buy:'1600',sell:'1610',asOf:'2026-10-28'}};
 const pending=fetchQuoteBook({snapshot,fetcher:async(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('timeout'))))});
 t.mock.timers.tick(8001);const result=await pending;assert.equal(result.eurusd.status,'saved');assert.equal(result.eurusd.asOf,'2026-10-28');assert.equal(result.crypto.buy,'1600');
});
test('caché comparte peticiones, respeta quince minutos y permite forzar actualización',async t=>{
 const {getQuotes}=await load();let calls=0;
 t.mock.timers.enable({apis:['Date','setTimeout'],now:new Date('2026-10-29T19:00:00Z')});
 t.mock.method(globalThis,'fetch',async url=>{calls++;return {ok:true,json:async()=>url.includes('frankfurter')?{base:'EUR',date:'2026-10-29',rates:{USD:1.113}}:{moneda:'USD',casa:url.includes('bolsa')?'bolsa':'cripto',compra:1500,venta:1510,fechaActualizacion:'2026-10-29T19:00:00Z'}};});
 const first=getQuotes(true),second=getQuotes();await Promise.all([first,second]);assert.equal(calls,3);
 await getQuotes();assert.equal(calls,3);t.mock.timers.tick(15*60000+1);await getQuotes();assert.equal(calls,6);await getQuotes(true);assert.equal(calls,9);
});
test('marca antigüedad por proveedor sin renovar fechas ni tratar fecha futura como actual',async()=>{
 const {quoteIsStale}=await load();const now=Date.parse('2026-10-29T19:00:00Z');
 assert.equal(quoteIsStale('crypto',{asOf:new Date(now-6*3600000).toISOString()},now),false);
 assert.equal(quoteIsStale('crypto',{asOf:new Date(now-6*3600000-1).toISOString()},now),true);
 assert.equal(quoteIsStale('eurusd',{asOf:'2026-10-27'},now),false);
 assert.equal(quoteIsStale('eurusd',{asOf:'2026-11-01'},now),true);
});
