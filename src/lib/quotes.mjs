import sources from '../data/simulator/quote-sources.json' with {type:'json'};
import initialSnapshot from '../data/simulator/quote-snapshot.json' with {type:'json'};
const price=value=>{if(typeof value!=='number'||!Number.isFinite(value)||value<=0||value>1e9)throw new Error('Cotización inválida.');const text=value.toFixed(6).replace(/\.?0+$/,'');if(Number(text)<=0)throw new Error('Cotización inválida.');return text;};
const date=value=>{if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)||!Number.isFinite(Date.parse(value)))throw new Error('Fecha inválida.');return value;};
export function parseQuote(key,data){
 if(!sources[key]||!data||typeof data!=='object')throw new Error('Proveedor inválido.');
 const info={source:sources[key].name,sourceUrl:sources[key].docs,status:'network'};
 if(key==='eurusd'){
  if(data.base!=='EUR')throw new Error('Par inválido.');
  return {...info,rate:price(data.rates?.USD),asOf:date(data.date)};
 }
 if(data.moneda!=='USD'||data.casa!==(key==='mep'?'bolsa':'cripto'))throw new Error('Par inválido.');
 return {...info,buy:price(data.compra),sell:price(data.venta),asOf:date(data.fechaActualizacion)};
}
export function quoteIsStale(key,quote,now=Date.now()){return !quote?.asOf||now-Date.parse(quote.asOf)>sources[key].maxAgeHours*3600000||Date.parse(quote.asOf)>now+86400000;}
export async function fetchQuoteBook({snapshot=initialSnapshot,fetcher=fetch}={}){
 const pairs=await Promise.all(Object.keys(sources).map(async key=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try{
   const response=await fetcher(sources[key].url,{signal:controller.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
   if(!response.ok)throw new Error('No disponible.');
   return [key,parseQuote(key,await response.json())];
  }catch{return [key,snapshot[key]?{...snapshot[key],status:'saved'}:null];}
  finally{clearTimeout(timer);}
 }));
 return Object.fromEntries(pairs);
}
let cached=initialSnapshot,lastFetch=0,pending;
export function getInitialQuotes(){return cached;}
export function getQuotes(force=false){
 if(pending)return pending;
 if(!force&&Date.now()-lastFetch<15*60000)return Promise.resolve(cached);
 pending=fetchQuoteBook({snapshot:cached}).then(book=>{cached=book;lastFetch=Date.now();return book;}).finally(()=>{pending=undefined;});return pending;
}
export function quoteDate(quote){
 if(!quote?.asOf)return 'Sin fecha';
 if(/^\d{4}-\d{2}-\d{2}$/.test(quote.asOf))return quote.asOf.split('-').reverse().join('/');
 return new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Buenos_Aires',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(quote.asOf));
}
