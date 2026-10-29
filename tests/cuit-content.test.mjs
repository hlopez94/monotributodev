import test from 'node:test';import assert from 'node:assert/strict';
import rows from '../src/data/cuit-countries.json' with {type:'json'};
test('importación oficial íntegra y CUIT textual',()=>{assert.equal(rows.length,899);for(const r of rows){assert.match(r.cuit,/^\d{11}$/);assert.ok(r.personType);}});
