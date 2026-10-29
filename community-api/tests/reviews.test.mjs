import test from 'node:test';import assert from 'node:assert/strict';
import {validateReview} from '../src/reviews.mjs';
const base={entity:'santander',route:'wise-santander',date:'2026-10-28',speed:4,ease:null,support:3,transferHours:24,releaseHours:2,status:'completed',comment:'Todo online',browserId:'01234567-89ab-cdef-0123-456789abcdef',idempotencyKey:'12345678-89ab-cdef-0123-456789abcdef'};
test('valida entidad, puntuaciones, duraciones y fechas',()=>{assert.equal(validateReview(base).speed,4);for(const patch of [{speed:6},{speed:0},{entity:'inventado'},{route:'nexo-int-santander'},{date:'2099-01-01'},{date:'2026-02-31'},{transferHours:-1},{comment:'x'.repeat(1001)}])assert.throws(()=>validateReview({...base,...patch}));});
test('operacion pendiente no aporta tiempo final',()=>{const r=validateReview({...base,status:'pending'});assert.equal(r.transferHours,null);assert.equal(r.releaseHours,null)});
test('requiere al menos una puntuacion y consentimiento no se presume',()=>{assert.throws(()=>validateReview({...base,speed:null,ease:null,support:null}));});
