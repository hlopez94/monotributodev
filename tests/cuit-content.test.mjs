import test from 'node:test';import assert from 'node:assert/strict';
import rows from '../src/data/cuit-countries.json' with {type:'json'};
test('importación oficial íntegra y CUIT textual',()=>{assert.equal(rows.length,899);for(const r of rows){assert.match(r.cuit,/^\d{11}$/);assert.ok(r.personType);}});
test('CUIT de EEUU respeta tipo de sujeto de la tabla oficial de ARCA',()=>{assert.equal(rows.find(r=>r.cuit==='55000002126').personType,'PERSONA JURIDICA');assert.equal(rows.find(r=>r.cuit==='50000002124').personType,'PERSONA HUMANA');});
