import {isReviewableEntity} from '../../src/lib/review-entities.mjs';
import routes from '../../src/data/routes.json' with {type:'json'};
const routeIds=new Set(routes.map(r=>r.origin+'-'+r.bank));
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function validateReview(data){
 if(!data||typeof data!=='object'||!isReviewableEntity(data.entity))throw new Error('Elegí una entidad válida.');
 if(data.route&&(!routeIds.has(data.route)||!data.route.split('-').includes(data.entity)))throw new Error('Ruta no válida para la entidad.');
 if(typeof data.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!Number.isFinite(Date.parse(data.date))||new Date(data.date).toISOString().slice(0,10)!==data.date||data.date>new Date().toISOString().slice(0,10)||data.date<'2020-01-01')throw new Error('La fecha de experiencia no es válida.');
 const out={entity:data.entity,route:data.route||null,date:data.date};let scores=0;
 for(const key of ['speed','ease','support']){let v=data[key];if(v===''||v===undefined)v=null;if(v!==null&&(!Number.isInteger(v)||v<1||v>5))throw new Error('Las puntuaciones van de 1 a 5.');out[key]=v;if(v!==null)scores++;}
 if(!scores)throw new Error('Ingresá al menos una puntuación.');
 if(!['completed','pending','rejected'].includes(data.status))throw new Error('Estado de operación no válido.');out.status=data.status;
 for(const key of ['transferHours','releaseHours']){let n=data[key];if(n===''||n===undefined)n=null;if(n!==null&&(!Number.isFinite(n)||n<0||n>8760))throw new Error('La duración debe estar entre 0 y 8760 horas.');out[key]=out.status==='completed'?n:null;}
 if(typeof data.comment!=='string'||data.comment.length>1000)throw new Error('El comentario debe tener hasta 1000 caracteres.');out.comment=data.comment.trim();
 for(const key of ['browserId','idempotencyKey'])if(!uuid.test(data[key]||''))throw new Error('Identificador de envío no válido.');
 return {...out,browserId:data.browserId,idempotencyKey:data.idempotencyKey};
}
