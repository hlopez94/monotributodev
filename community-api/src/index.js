import {validateReview} from './reviews.mjs';
const json=(obj,status=200,headers={})=>Response.json(obj,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
async function fingerprint(value,secret){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
async function boundedJson(request){if(Number(request.headers.get('Content-Length'))>8192)throw new Error('El envío es demasiado grande.');const reader=request.body?.getReader();if(!reader)throw new Error('Falta contenido.');let chunks=[],n=0;for(;;){const {done,value}=await reader.read();if(done)break;n+=value.length;if(n>8192){await reader.cancel();throw new Error('El envío es demasiado grande.');}chunks.push(value);}const all=new Uint8Array(n);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length;}return JSON.parse(new TextDecoder().decode(all));}
async function verification(data,env,hostname){
 if(typeof data.token!=='string'||!data.token||data.token.length>2048||!env.TURNSTILE_SECRET)return false;
 try{const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:data.token}),signal:AbortSignal.timeout(10000)});if(!r.ok)return false;const v=await r.json();return v.success===true&&v.action==='review'&&v.hostname===hostname;}catch{return false;}
}
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');const allowed=(env.ALLOWED_ORIGINS||'').split(',');
 const headers=origin&&allowed.includes(origin)?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{};
 if(request.method==='OPTIONS')return new Response(null,{status:origin&&allowed.includes(origin)?204:403,headers:{...headers,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 const url=new URL(request.url);
 try{
 if(request.method==='GET'&&url.pathname==='/health')return json({ok:true},200,headers);
 if(request.method==='GET'&&url.pathname==='/reviews'){
 const entity=url.searchParams.get('entity');if(!entity||entity.length>50)return json({error:'Elegí una entidad.'},400,headers);
 const reviews=await env.DB.prepare("SELECT id,entity,route,experience_date AS date,speed,ease,support,transfer_hours AS transferHours,release_hours AS releaseHours,operation_status AS operationStatus,comment FROM reviews WHERE entity=? AND status='approved' ORDER BY experience_date DESC LIMIT 30").bind(entity).all();
 const stats=await env.DB.prepare("SELECT COUNT(*) AS count,AVG(speed) AS speed,COUNT(speed) AS speedCount,AVG(ease) AS ease,COUNT(ease) AS easeCount,AVG(support) AS support,COUNT(support) AS supportCount,MIN(experience_date) AS firstDate,MAX(experience_date) AS lastDate FROM reviews WHERE entity=? AND status='approved'").bind(entity).first();return json({reviews:reviews.results,stats},200,headers);
 }
 if(request.method!=='POST'||!['/reviews','/reports'].includes(url.pathname))return json({error:'No encontrado.'},404,headers);
 if(!origin||!allowed.includes(origin))return json({error:'Origen no permitido.'},403,headers);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Formato no admitido.'},415,headers);
 const data=await boundedJson(request);
 const review=url.pathname==='/reviews'?validateReview(data):null;
 if(data.consent!==true)return json({error:'Confirmá que no compartís datos privados.'},400,headers);
 if(!await verification(data,env,new URL(origin).hostname))return json({error:'No se pudo validar la verificación. Intentá de nuevo.'},403,headers);
 if(!env.HASH_SECRET)return json({error:'Servicio no configurado.'},503,headers);
 const day=new Date().toISOString().slice(0,10),ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const limiter=await fingerprint(ip+':'+day,env.HASH_SECRET);
 await env.DB.prepare('DELETE FROM limits WHERE expires_at < ?').bind(new Date().toISOString()).run();
 const limit=await env.DB.prepare('INSERT INTO limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<5 RETURNING count').bind(limiter,new Date(Date.now()+2*86400000).toISOString()).first();
 if(!limit)return json({error:'Se alcanzó el límite de aportes de hoy. Probá mañana.'},429,headers);
 if(url.pathname==='/reports'){
 if(typeof data.reviewId!=='string'||data.reviewId.length>50)return json({error:'Opinión inválida.'},400,headers);
 const exists=await env.DB.prepare("SELECT id FROM reviews WHERE id=? AND status='approved'").bind(data.reviewId).first();if(!exists)return json({error:'Opinión no encontrada.'},404,headers);
 await env.DB.prepare('INSERT INTO reports(id,review_id,created_at) VALUES (?,?,?)').bind(crypto.randomUUID(),data.reviewId,new Date().toISOString()).run();return json({status:'received'},201,headers);
 }
 const browserHash=await fingerprint(review.browserId,env.HASH_SECRET);
 const old=await env.DB.prepare('SELECT id FROM reviews WHERE id=? OR (entity=? AND browser_hash=?)').bind(review.idempotencyKey,review.entity,browserHash).first();
 if(old)return json(old.id===review.idempotencyKey?{status:'received'}:{error:'Ya enviaste una opinión para esta entidad desde este navegador.'},old.id===review.idempotencyKey?200:409,headers);
 try{await env.DB.prepare('INSERT INTO reviews(id,entity,route,experience_date,speed,ease,support,transfer_hours,release_hours,operation_status,comment,browser_hash,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(review.idempotencyKey,review.entity,review.route,review.date,review.speed,review.ease,review.support,review.transferHours,review.releaseHours,review.status,review.comment,browserHash,new Date().toISOString()).run();}catch(e){if(String(e).includes('UNIQUE'))return json({error:'Ese aporte ya fue recibido.'},409,headers);throw e;}
 return json({status:'received',message:'Gracias. Tu experiencia se publicará después de revisión.'},201,headers);
 }catch(e){if(e instanceof SyntaxError||/Elegí|válid|puntuaci|fecha|duración|comentario|Identificador|grande|contenido|Ruta|Estado|Ingresá/i.test(e.message))return json({error:e.message},400,headers);console.error('community-api request failed');return json({error:'No pudimos procesar el aporte. Intentá más tarde.'},503,headers);}
}};
