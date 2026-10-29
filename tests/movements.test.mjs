import test from 'node:test';import assert from 'node:assert/strict';
import {availableMovements} from '../src/lib/movements.mjs';
import {stageFromTariff} from '../src/lib/simulator.mjs';import {resolveAutomaticStage} from '../src/lib/automatic-simulator.mjs';
import nodes from '../src/data/simulator/nodes.json' with {type:'json'};
test('Wallbit USD cruza recepción Wise y conserva tarifas conocidas sin duplicarlas',()=>{
 const list=availableMovements({from:'wallbit',currency:'USD'});assert.ok(list.some(t=>t.to==='wise'&&t.method==='ach'));assert.ok(list.some(t=>t.to==='wise'&&t.method==='wire'));assert.equal(list.filter(t=>t.id==='wallbit-santander').length,1);assert.ok(!list.some(t=>t.to==='wise'&&t.method==='crypto'));
 const usd=availableMovements({from:'wise',currency:'USD'});assert.ok(!usd.some(t=>t.currencyIn==='EUR'));assert.ok(!usd.some(t=>t.method==='crypto'));assert.ok(!usd.some(t=>t.to==='wallbit'&&t.method==='swift'));
});
test('cripto requiere activo y red comunes; Lemon y Takenos reciben con identidad correcta',()=>{
 const list=availableMovements({from:'cripto',currency:'USDC'});assert.ok(list.some(t=>t.to==='lemon'&&t.networkName==='Base'&&t.currencyOut==='USDT'));assert.ok(list.some(t=>t.to==='takenos'&&t.networkName==='Polygon'&&t.currencyOut==='USD'));assert.ok(!list.some(t=>t.to==='wise'));assert.ok(!list.some(t=>t.to==='takenos'&&t.networkName==='Base'));
 const caps=[{id:'a',send:[{method:'crypto',currency:'USDC',currencyIn:'USDC',networks:['Base']}],receive:[],sources:[]},{id:'b',send:[],receive:[{method:'crypto',currency:'USDT',currencyOut:'USDT',networks:['Base']},{method:'crypto',currency:'USDC',currencyOut:'USDC',networks:['Polygon']}],sources:[]}];assert.deepEqual(availableMovements({from:'a',currency:'USDC'},caps,[]),[]);
});
test('rutas generadas tienen ID estable, fuentes, parciales y nunca inventan cargos gratis',()=>{
 const context={from:'wallbit',currency:'USD'},list=availableMovements(context);assert.deepEqual(list.map(t=>t.id),availableMovements(context).map(t=>t.id));assert.equal(new Set(list.map(t=>t.id)).size,list.length);
 const route=list.find(t=>t.to==='lemon'&&t.method==='crypto');assert.ok(route.sources.length);const resolved=resolveAutomaticStage(stageFromTariff(route),{quotes:{},nodes});assert.ok(resolved.partial);assert.ok(resolved.omissions.length);
});
test('Nexo SEPA recibe EUR y compra de EURC permanece separada',()=>{
 const list=availableMovements({from:'wise',currency:'EUR'});for(const to of ['nexo-int','nexo-ar']){assert.ok(list.some(t=>t.to===to&&t.method==='sepa'&&t.currencyOut==='EURx'));assert.ok(!list.some(t=>t.to===to&&t.currencyOut==='EURC'));assert.ok(availableMovements({from:to,currency:'EURx'}).some(t=>t.method==='conversion'&&t.currencyOut==='EURC'));}
});
test('capacidades referencian nodos, métodos y monedas válidos y JSON legible',async()=>{
 const {default:catalog}=await import('../src/data/simulator/capabilities.json',{with:{type:'json'}});const {default:methods}=await import('../src/data/simulator/methods.json',{with:{type:'json'}});
 for(const p of catalog.platforms){const n=nodes.find(n=>n.id===p.id);assert.ok(n);assert.ok(p.sources.length);for(const s of p.send){assert.ok(n.currencies.includes(s.currencyIn));assert.ok(methods.some(m=>m.id===s.method));}for(const r of p.receive){assert.ok(n.currencies.includes(r.currencyOut));assert.ok(methods.some(m=>m.id===r.method));}}
});
test('SWIFT generado conserva corresponsales desconocidos y excluye doble conversión fiat',()=>{
 const swift=availableMovements({from:'wallbit',currency:'USD'}).find(t=>t.to==='wise'&&t.method==='swift');assert.equal(swift.fees.other,null);
 const local=availableMovements({from:'takenos',currency:'USD'});assert.ok(!local.some(t=>t.to==='wallbit'&&t.method==='local'));assert.ok(local.some(t=>t.to==='banco-ar'&&t.method==='local'));
});
test('todas las combinaciones propuestas calculan con monedas de saldo válidas',async()=>{
 const {calculateJourney}=await import('../src/lib/simulator.mjs');const quotes={eurusd:{rate:'1.1164'},crypto:{buy:'1650',sell:'1655'}};
 for(const origin of nodes)for(const currency of origin.currencies)for(const t of availableMovements({from:origin.id,currency})){
  assert.ok(nodes.find(n=>n.id===t.to)?.currencies.includes(t.currencyOut),t.id);
  const r=resolveAutomaticStage(stageFromTariff(t),{quotes,nodes});assert.doesNotThrow(()=>calculateJourney({amount:'10000',currency,origin:origin.id,stages:[r.stage]}),t.id);
 }
});
