import test from 'node:test';
import assert from 'node:assert/strict';
const load=()=>import('../src/lib/simulator.mjs');
const stage=(extra={})=>({from:'cripto',to:'wallbit',currencyIn:'USDC',currencyOut:'USD',method:'crypto',rate:'1',fixed:'0',percent:'0',network:'5',networkSeparate:false,other:'0',receiving:'0',...extra});
test('cripto red y posterior conversión ARS usan el saldo de cada tramo',async()=>{
 const {calculateJourney}=await load();const r=calculateJourney({amount:'2000',currency:'USDC',origin:'cripto',stages:[stage(),stage({from:'wallbit',to:'banco-ar',currencyIn:'USD',currencyOut:'ARS',method:'local',network:'0',rate:'1560'})]});
 assert.equal(r.stages[0].output,1995000000n);assert.equal(r.finalAmount,3112200000000n);assert.equal(r.finalCurrency,'ARS');
});
test('red descontada y 1,5% SWIFT redondeado a centavos',async()=>{
 const {calculateJourney}=await load();const r=calculateJourney({amount:'2000',currency:'USDC',origin:'cripto',stages:[stage(),stage({from:'wallbit',to:'santander',currencyIn:'USD',currencyOut:'USD',method:'swift',network:'0',percent:'1.5'})]});
 assert.equal(r.stages[1].percentFee,29930000n);assert.equal(r.finalAmount,1965070000n);
});
test('Wise fijo y gas externo pagado aparte no reducen dos veces el saldo',async()=>{
 const {calculateJourney}=await load();assert.equal(calculateJourney({amount:'2000',currency:'USD',origin:'wise',stages:[stage({from:'wise',to:'santander',currencyIn:'USD',network:'0',fixed:'24.95'})]}).finalAmount,1975050000n);
 const r=calculateJourney({amount:'2000',currency:'USDC',origin:'cripto',stages:[stage({networkSeparate:true})]});assert.equal(r.finalAmount,2000000000n);assert.equal(r.stages[0].externalCost,5000000n);
});
test('rechaza negativos, vacíos, falta de cotización, gastos excesivos y discontinuidad',async()=>{
 const {calculateJourney}=await load();const run=(s=stage(),amount='2000')=>calculateJourney({amount,currency:'USDC',origin:'cripto',stages:[s]});
 for(const value of ['', '-1','NaN','1e3','1.1234567'])assert.throws(()=>run(stage(),value));
 for(const change of [{rate:''},{rate:'0'},{fixed:''},{percent:'101'},{fixed:'2001'},{from:'wise'},{currencyIn:'EUR'}])assert.throws(()=>run(stage(change)));
 assert.equal(run(stage({network:'2000'})).finalAmount,0n);
});
test('respeta precisión cripto, redondeo de conversión y no inventa ganancia misma moneda',async()=>{
 const {calculateJourney,formatAmount}=await load();
 assert.equal(calculateJourney({amount:'0.123456',currency:'USDC',origin:'cripto',stages:[stage({network:'0',rate:'1'})]}).finalAmount,120000n);
 assert.throws(()=>calculateJourney({amount:'10',currency:'USD',origin:'wise',stages:[stage({from:'wise',currencyIn:'USD',currencyOut:'USD',rate:'2',network:'0'})]}));
 assert.equal(formatAmount(1965070000n,'USD'),'USD 1.965,07');
});
test('todos los ejemplos JSON se calculan y tarifas referencian nodos válidos',async()=>{
 const {readFile}=await import('node:fs/promises');
 const json=async name=>JSON.parse(await readFile(new URL('../src/data/simulator/'+name+'.json',import.meta.url),'utf8'));
 const [nodes,tariffs,scenarios,currencies]=await Promise.all(['nodes','tariffs','scenarios','currencies'].map(json));
 for(const n of nodes)for(const code of n.currencies)assert.ok(currencies.some(c=>c.id===code));
 const {calculateJourney,stageFromTariff,receivingIsFree}=await load();
 for(const t of tariffs){assert.ok(nodes.some(n=>n.id===t.from));assert.ok(nodes.some(n=>n.id===t.to));assert.ok(t.sources.length);}
 for(const scenario of scenarios){
  const stages=scenario.stages.map(s=>{const row=stageFromTariff(tariffs.find(t=>t.id===s.tariffId),s.overrides,'example');return {...row,receiving:receivingIsFree(row,true,nodes)?'0':row.receiving};});
  assert.doesNotThrow(()=>calculateJourney({...scenario,stages}),scenario.id);
 }
});
test('recepción gratis solo SWIFT USD con encuadre y banco argentino',async()=>{
 const {receivingIsFree}=await load();const nodes=[{id:'santander',group:'bank-ar'},{id:'usa',group:'bank-us'}];const s=stage({to:'santander',currencyOut:'USD',method:'swift'});
 assert.equal(receivingIsFree(s,true,nodes),true);
 for(const changed of [{method:'wire'},{currencyOut:'ARS'},{to:'usa'}])assert.equal(receivingIsFree({...s,...changed},true,nodes),false);
 assert.equal(receivingIsFree(s,false,nodes),false);
});
test('redondea una sola vez en límites de centavo para conversión y porcentaje',async()=>{
 const {calculateJourney}=await load();
 const converted=calculateJourney({amount:'0.009999',currency:'USDC',origin:'cripto',stages:[stage({network:'0',rate:'0.5'})]});
 assert.equal(converted.finalAmount,0n);
 const fee=calculateJourney({amount:'0.01',currency:'USD',origin:'wise',stages:[stage({from:'wise',currencyIn:'USD',currencyOut:'USD',network:'0',percent:'49.99999'})]});
 assert.equal(fee.stages[0].percentFee,0n);assert.equal(fee.finalAmount,10000n);
});
