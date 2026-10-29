export const normalize = s => String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function simulate({serviceAmount,receiptFee=0,transferFee=0,intermediaryFee=0}) {
 const values=[serviceAmount,receiptFee,transferFee,intermediaryFee];
 if(values.some(n=>!Number.isSafeInteger(n)||n<0)||serviceAmount===0) throw new Error('Ingresá importes válidos, con hasta dos decimales.');
 if(receiptFee+transferFee+intermediaryFee>serviceAmount) throw new Error('Los gastos no pueden superar el importe del servicio.');
 return {invoiceAmount:serviceAmount,platformNet:serviceAmount-receiptFee,argentinaNet:serviceAmount-receiptFee-transferFee-intermediaryFee};
}
export function resolveRoute(originId,bankId,data){
 const bank=data.banks.find(b=>b.id===bankId)??null;
 const platform=data.platforms.find(p=>p.id===originId)??null;
 const route=data.routes.find(r=>r.origin===originId&&r.bank===bankId);
 return {bank,platform,status:route?.status??'missing',instructions:route?.instructions??[],sources:route?.sources??[],note:route?.note??'Todavía no tenemos esta combinación documentada. Podés solicitar información o compartir tu experiencia.'};
}
export function searchCountries(rows,query,personType=''){
 const q=normalize(query).trim();
 return rows.filter(r=>(!personType||r.personType===personType)&&(!q||normalize(r.country+' '+r.officialName+' '+r.cuit).includes(q)));
}
export function buildIssueUrl({kind='solicitar-info',entityId='',routeId='',topic=''}){
 const allowed=['experiencia','solicitar-info','corregir-info','problema-sitio'];
 const u=new URL('https://github.com/hlopez94/monotributodev/issues/new');
 u.searchParams.set('template',(allowed.includes(kind)?kind:'solicitar-info')+'.yml');
 u.searchParams.set('title',`[${kind}] ${[entityId,routeId,topic].filter(Boolean).join(' · ')}`.slice(0,200));
 if(entityId||routeId) u.searchParams.set('ruta',[entityId,routeId].filter(Boolean).join(' / ').slice(0,160));
 return u.toString();
}
export function classifyIncome(kind){return kind==='exportacion'?'E':kind==='local'?'C':null;}
export const money=(cents,currency='USD')=>new Intl.NumberFormat('es-AR',{style:'currency',currency,maximumFractionDigits:2}).format(cents/100);

export function bankFields(bank){
 return [
  {label:'Moneda y país',value:'USD · Argentina'},
  {label:'Beneficiario',value:'Tu nombre completo como figura en el banco'},
  {label:'Banco receptor',value:bank?.legalName??null},
  {label:'SWIFT / BIC',value:bank?.swift??null,copy:true},
  {label:'Cuenta del beneficiario',value:bank?.accountField??null},
  {label:'Banco corresponsal en USD',value:bank?.correspondent??null}
 ];
}
export function payoutDocumentation(origin,sender){
 const needsStatement=sender==='own';
 return {needsStatement,wallbitStatement:origin==='wallbit',verifyRelationship:!['own','payer'].includes(sender)};
}
