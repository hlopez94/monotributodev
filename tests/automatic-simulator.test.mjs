import test from 'node:test';
import assert from 'node:assert/strict';
const load=()=>import('../src/lib/automatic-simulator.mjs');
const quotes={eurusd:{rate:'1.113',asOf:'2026-10-29',source:'Frankfurter',status:'network'},mep:{buy:'1563.2',sell:'1565.4',asOf:'2026-10-29T18:00:00Z',source:'DolarApi',status:'network'},crypto:{buy:'1651.35',sell:'1653.93',asOf:'2026-10-29T18:00:00Z',source:'DolarApi',status:'network'}};
test('precarga tipo comprador/vendedor correcto y EUR USD sin escribir cotización',async()=>{
 const {marketRate}=await load();assert.equal(marketRate('EUR','USD',quotes,'mep').rate,'1.113');assert.equal(marketRate('USD','ARS',quotes,'mep').rate,'1563.2');assert.equal(marketRate('USD','ARS',quotes,'crypto').rate,'1651.35');assert.ok(Number(marketRate('ARS','USD',quotes,'mep').rate)<1/1563.2);
});
test('pasos conocidos se calculan precargados; desconocidos explicitan costos omitidos',async()=>{
 const {resolveAutomaticStage}=await load();const {stageFromTariff,calculateJourney}=await import('../src/lib/simulator.mjs');
 const {default:tariffs}=await import('../src/data/simulator/tariffs.json',{with:{type:'json'}});
 const {default:nodes}=await import('../src/data/simulator/nodes.json',{with:{type:'json'}});
 const resolve=id=>resolveAutomaticStage({...stageFromTariff(tariffs.find(t=>t.id===id)),overrides:{}},{quotes,basis:'crypto',eligible:true,nodes});
 const crypto=resolve('crypto-wallbit-usdc-erc20'),usd=resolve('wallbit-santander');
 assert.equal(crypto.stage.network,'5');assert.equal(usd.stage.percent,'1');assert.equal(usd.stage.receiving,'0');assert.equal(usd.omissions.length,0);
 assert.doesNotThrow(()=>calculateJourney({amount:'2000',origin:'cripto',currency:'USDC',stages:[crypto.stage,usd.stage]}));
 const ach=resolve('wise-wallbit-ach');assert.ok(ach.omissions.length>0);assert.equal(ach.partial,true);
 const ars=resolve('wallbit-ars');assert.equal(ars.stage.rate,'1651.35');assert.equal(ars.partial,true);
});
test('actualización de mercado no pisa ajustes manuales ni confunde cargos0 con faltantes',async()=>{
 const {resolveAutomaticStage,expenseLines}=await load();
 const stage={from:'wallbit',to:'banco-ar',currencyIn:'USD',currencyOut:'ARS',method:'local',rate:'',fixed:'',percent:'0',network:'0',other:'0',receiving:'',overrides:{rate:'1500',fixed:'7',receiving:'0'}};
 const r=resolveAutomaticStage(stage,{quotes,basis:'crypto',eligible:true,nodes:[]});assert.equal(r.stage.rate,'1500');assert.equal(r.stage.fixed,'7');assert.equal(r.partial,false);
 assert.deepEqual(expenseLines({fixedFee:0n,percentFee:0n,networkFee:0n,otherFee:0n,receivingFee:0n,currencyIn:'USD',currencyOut:'ARS'}),[]);
 const lines=expenseLines({fixedFee:1000000n,percentFee:0n,networkFee:5000000n,networkSeparate:true,otherFee:0n,receivingFee:0n,currencyIn:'USDC',currencyOut:'USD'});assert.equal(lines.length,2);assert.ok(lines.some(x=>x.separate));
});
test('reactivar encuadre de recepción gratuita no conserva un cargo manual incompatible',async()=>{
 const {resolveAutomaticStage}=await load();
 const raw={from:'wise',to:'santander',method:'swift',currencyIn:'USD',currencyOut:'USD',fixed:'24.95',percent:'0',network:'0',other:'0',receiving:'',overrides:{receiving:'10'}};
 const result=resolveAutomaticStage(raw,{quotes,eligible:true,nodes:[{id:'santander',group:'bank-ar'}]});assert.equal(result.stage.receiving,'0');
});
test('volver a automático en un paso personalizado conserva el recorrido posterior',async()=>{
 const {resetAutomaticStage,resolveAutomaticStage}=await load();assert.equal(typeof resetAutomaticStage,'function');
 const raw={from:'wise',to:'wallbit',currencyIn:'USD',currencyOut:'USD',method:'ach',rate:'1',fixed:'',percent:'',network:'0',other:'0',receiving:'',overrides:{fixed:'1',percent:'0',receiving:'0'}};
 const reset=resetAutomaticStage(raw);assert.equal(reset.to,'wallbit');assert.equal(reset.method,'ach');assert.equal(reset.currencyOut,'USD');assert.deepEqual(reset.overrides,{});
 const nodes=[{id:'santander',group:'bank-ar'}];const first=resolveAutomaticStage(reset,{quotes,basis:'crypto',eligible:true,nodes});
 const next={from:'wallbit',to:'santander',currencyIn:'USD',currencyOut:'USD',method:'swift',rate:'1',fixed:'0',percent:'1',network:'0',other:'0',receiving:'0'};
 const {calculateJourney}=await import('../src/lib/simulator.mjs');assert.doesNotThrow(()=>calculateJourney({amount:'2000',currency:'USD',origin:'wise',stages:[first.stage,next]}));
});
test('Wise distingue envío USD SWIFT, conversión direccional y recepción sin duplicar cargos',async()=>{
 const {resolveAutomaticStage}=await load();const {stageFromTariff,calculateJourney}=await import('../src/lib/simulator.mjs');
 const {default:tariffs}=await import('../src/data/simulator/tariffs.json',{with:{type:'json'}});
 const {default:nodes}=await import('../src/data/simulator/nodes.json',{with:{type:'json'}});
 const resolve=id=>{const tariff=tariffs.find(t=>t.id===id);assert.ok(tariff,`Falta ${id}`);return resolveAutomaticStage(stageFromTariff(tariff),{quotes:{...quotes,eurusd:{rate:'1.1164'}},eligible:true,nodes});};
 const swift=resolve('wise-santander');assert.equal(swift.stage.fixed,'7.28');assert.equal(swift.stage.receiving,'0');
 const eur=resolve('wise-eur-usd');assert.equal(eur.stage.percent,'0.458');assert.equal(eur.partial,false);
 const result=calculateJourney({amount:'1000',origin:'wise',currency:'EUR',stages:[eur.stage,swift.stage]});assert.equal(result.finalAmount,1104010000n);
 const usd=resolve('wise-usd-eur');assert.equal(usd.stage.percent,'0.289');assert.equal(usd.partial,false);assert.notEqual(usd.stage.rate,eur.stage.rate);
 assert.equal(resolve('receive-wise-usd-swift').stage.receiving,'6.11');assert.equal(resolve('receive-wise-eur-swift').stage.receiving,'2.39');
 assert.equal(resolve('receive-wise-usd-swift').partial,true);
});
test('Payoneer y Deel separan rangos, mínimos de retiro y mínimos de comisión',async()=>{
 const {resolveAutomaticStage}=await load();const {stageFromTariff,calculateJourney}=await import('../src/lib/simulator.mjs');
 const {default:tariffs}=await import('../src/data/simulator/tariffs.json',{with:{type:'json'}});const {default:nodes}=await import('../src/data/simulator/nodes.json',{with:{type:'json'}});
 const resolve=id=>{const t=tariffs.find(t=>t.id===id);assert.ok(t,`Falta ${id}`);return resolveAutomaticStage(stageFromTariff(t),{quotes,eligible:true,nodes});};
 const payo=resolve('payoneer-banco-ar');assert.equal(payo.partial,true);assert.ok(payo.omissions.some(o=>o.field==='percent'));assert.notEqual(payo.stage.fixed,'1.50');assert.equal(resolve('payoneer-santander').stage.percent,'3.3');
 const conversion=resolve('payoneer-eur-usd');assert.equal(conversion.stage.percent,'0.5');assert.equal(conversion.partial,false);
 const deel=resolve('deel-payoneer');const run=amount=>calculateJourney({amount,currency:'USD',origin:'deel',stages:[deel.stage]});assert.throws(()=>run('49.99'),/mínimo.*50/);assert.equal(run('50').stages[0].percentFee,12000000n);assert.equal(run('2000').stages[0].percentFee,20000000n);
 const swift=resolve('deel-santander');assert.ok(swift.omissions.some(o=>o.field==='fixed'));assert.throws(()=>calculateJourney({amount:'99',currency:'USD',origin:'deel',stages:[swift.stage]}),/mínimo.*100/);
 const wise=resolve('deel-wise');assert.equal(wise.stage.fixed,'0');assert.equal(wise.stage.percent,'0');assert.equal(wise.partial,true);
});
