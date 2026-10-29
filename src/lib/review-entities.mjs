import banks from '../data/banks.json' with {type:'json'};
import platforms from '../data/platforms.json' with {type:'json'};
export const reviewableEntities=[...banks.filter(b=>b.reviewable===true).map(b=>({...b,group:'bank-ar',subtitle:'Banco'})),...platforms.filter(p=>p.reviewable===true&&!banks.some(b=>b.id===p.id)).map(p=>({...p,subtitle:'Plataforma'}))];
const ids=new Set(reviewableEntities.map(e=>e.id));
export const isReviewableEntity=id=>ids.has(id);
