import test from 'node:test';
import assert from 'node:assert/strict';
import {createCommunityId} from '../src/lib/community-id.mjs';

test('genera UUID v4 compatibles con el API aunque randomUUID no esté disponible (HTTP)',()=>{
 const browserCrypto={getRandomValues:array=>crypto.getRandomValues(array)};
 const ids=Array.from({length:100},()=>createCommunityId(browserCrypto));
 assert.equal(new Set(ids).size,100);
 for(const id of ids)assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('usa randomUUID nativo cuando está disponible',()=>{
 assert.equal(createCommunityId({randomUUID:()=> 'native-id'}),'native-id');
});
