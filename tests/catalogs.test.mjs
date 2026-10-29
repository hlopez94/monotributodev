import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const json=async name=>JSON.parse(await readFile(new URL('../src/data/'+name+'.json',import.meta.url),'utf8'));
test('catálogos JSON conservan IDs y referencias de rutas/fuentes',async()=>{
 const [banks,platforms,routes,sources]=await Promise.all(['banks','platforms','routes','sources'].map(json));
 for(const list of [banks,platforms]) assert.equal(new Set(list.map(e=>e.id)).size,list.length);
 assert.equal(banks.find(b=>b.id==='santander').swift,'BSCHARBAXXX');
 for(const route of routes){assert.ok(banks.some(b=>b.id===route.bank));assert.ok(platforms.some(p=>p.id===route.origin));}
 for(const e of [...banks,...platforms,...routes])for(const id of e.sources)assert.ok(sources[id],`fuente desconocida ${id}`);
});
test('24 jurisdicciones y cinco fichas enlazadas sin prometer cero universal',async()=>{
 const provinces=await json('provinces');assert.equal(provinces.length,24);assert.equal(new Set(provinces.map(p=>p.id)).size,24);
 for(const province of provinces){
  const id=province.id;
  const guide=await json('provinces/'+id);assert.equal(guide.id,id);assert.equal(guide.status,province.status);
  if(guide.status!=='missing')assert.ok(guide.reviewedAt);
  for(const section of ['regime','exports','monthly']){
   assert.ok(guide[section].steps.length||guide[section].status==='missing');
   assert.ok(guide[section].sources.length||guide[section].status==='missing');
   for(const s of guide[section].sources)assert.equal(new URL(s.url).protocol,'https:');
  }
  assert.equal(guide.monthly.appliesTo,'general');
 }
});
test('DDJJ local solo con régimen general; CM y desconocido no heredan esos pasos',async()=>{
 const {provincePresentation}=await import('../src/lib/provinces.mjs');
 const guide={monthly:{steps:['paso local'],status:'partial'}};
 assert.equal(provincePresentation(guide,'general','export').monthlyMode,'general');
 assert.deepEqual(provincePresentation(guide,'general','export').monthlySteps,['paso local']);
 for(const regime of ['unknown','simplified','not-registered'])assert.deepEqual(provincePresentation(guide,regime,'export').monthlySteps,[]);
 assert.equal(provincePresentation(guide,'cm','export').monthlyMode,'cm');
 assert.deepEqual(provincePresentation(guide,'cm','export').monthlySteps,[]);
 assert.equal(provincePresentation(guide,'general','mixed').mixed,true);
 assert.equal(provincePresentation(null,'general','export').monthlyMode,'missing');
});
