import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,resolveRoute,searchCountries,buildIssueUrl,classifyIncome} from '../src/lib/domain.mjs';
import {banks,platforms,routes} from '../src/data/catalog.mjs';
test('factura no se reduce por costos de cobro y transferencia',()=>{
 assert.deepEqual(simulate({serviceAmount:200000,receiptFee:2000,transferFee:3000,intermediaryFee:0}),{invoiceAmount:200000,platformNet:198000,argentinaNet:195000});
});
test('rechaza importes invalidos y permite neto cero',()=>{
 for(const n of [-1,NaN,Infinity,1.5]) assert.throws(()=>simulate({serviceAmount:n}));
 assert.throws(()=>simulate({serviceAmount:100,transferFee:101}));
 assert.equal(simulate({serviceAmount:100,transferFee:100}).argentinaNet,0);
});
test('cambiar destino no hereda banco ni SWIFT',()=>{
 assert.equal(resolveRoute('wise','santander',{banks,platforms,routes}).bank.swift,'BSCHARBAXXX');
 assert.equal(resolveRoute('wise','bbva',{banks,platforms,routes}).bank.swift,'BFRPARBA');
 assert.equal(resolveRoute('nexo-int','icbc',{banks,platforms,routes}).status,'missing');
 assert.equal(resolveRoute('wise','inventado',{banks,platforms,routes}).bank,null);
});
test('CUIT conserva tipos de persona y busqueda sin tildes',()=>{
 const rows=[{country:'País de ejemplo',personType:'PERSONA HUMANA',cuit:'00000000001'},{country:'País de ejemplo',personType:'PERSONA JURIDICA',cuit:'00000000002'}];
 assert.equal(searchCountries(rows,'pais','').length,2);
 assert.equal(searchCountries(rows,'00000000002','')[0].personType,'PERSONA JURIDICA');
 assert.equal(searchCountries(rows,'pais','PERSONA HUMANA').length,1);
});
test('issue solo recibe contexto editorial, no datos financieros',()=>{
 const u=new URL(buildIssueUrl({kind:'experiencia',entityId:'wise',routeId:'wise-santander',amount:3000,cuit:'secreto'}));
 assert.equal(u.searchParams.get('template'),'experiencia.yml');
 assert.equal(u.searchParams.has('amount'),false);assert.equal(u.href.includes('secreto'),false);
});
test('tipo de factura depende de ingreso y no de la via',()=>{
 assert.equal(classifyIncome('exportacion','ars'),'E');
 assert.equal(classifyIncome('exportacion','cripto'),'E');
 assert.equal(classifyIncome('activos-propios','swift'),null);
});
test('entidades verificadas tienen fuente y rutas incompletas no inventan pasos',()=>{
 for(const entity of [...banks,...platforms]) if(entity.status==='verified') assert.ok(entity.sources.length);
 const r=resolveRoute('nexo-int','icbc',{banks,platforms,routes}); assert.equal(r.instructions.length,0);
});
