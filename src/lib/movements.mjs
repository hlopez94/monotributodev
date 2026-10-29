import catalog from '../data/simulator/capabilities.json' with {type:'json'};
import tariffs from '../data/simulator/tariffs.json' with {type:'json'};
const signature=t=>[t.from,t.to,t.currencyIn,t.currencyOut,t.method,t.networkName??'',t.method==='crypto'?(t.asset??(['USDC','USDT'].includes(t.currencyIn)?t.currencyIn:t.currencyOut)):'' ].join('|');
export function availableMovements({from,currency},capabilities=catalog.platforms,references=tariffs){
 const result=references.filter(t=>t.from===from&&t.currencyIn===currency),seen=new Set(result.map(signature));
 const origin=capabilities.find(p=>p.id===from);if(!origin)return result;
 for(const send of origin.send.filter(s=>s.currencyIn===currency))for(const destination of capabilities){
  if(destination.id===from)continue;
  for(const receive of destination.receive.filter(r=>r.method===send.method&&r.currency===send.currency)){
   if(['USD','EUR','ARS'].includes(send.currency)&&currency!==send.currency&&receive.currencyOut!==send.currency)continue;
   const unknownNetwork=send.method==='crypto'&&(!send.networks||!receive.networks);
   const networks=send.method==='crypto'?(unknownNetwork?['A confirmar']:send.networks.filter(n=>receive.networks.includes(n))):[null];
   for(const networkName of networks){
    const t={from,to:destination.id,currencyIn:currency,currencyOut:receive.currencyOut,method:send.method,networkName,asset:send.method==='crypto'?send.currency:undefined};
    if(seen.has(signature(t)))continue;seen.add(signature(t));
    const minimums=[send.minimumAmount,...(currency===receive.currency?[receive.minimumAmount]:[])].filter(Boolean);
    const minimumAmount=minimums.length?minimums.reduce((a,b)=>Number(a)>Number(b)?a:b):undefined;
    result.push({...t,id:'dynamic:'+signature(t),name:`${from} → ${destination.id}`,rate:null,status:'partial',generated:true,minimumAmount,reviewedAt:catalog.reviewedAt,
     fees:{fixed:null,percent:null,network:send.method==='crypto'?null:'0',other:null,...send.fees,receiving:receive.receiving??null},
     pricingNotice:unknownNetwork?'Red por confirmar en ambas plataformas.':'Métodos compatibles; confirmar habilitación, país y titular en ambas cuentas.',
     note:[send.condition,receive.condition,'La compatibilidad técnica no garantiza la aprobación. Costos desconocidos se omiten y se señalan. '+(send.currency!==receive.currencyOut?'La moneda o activo acreditado cambia al recibir: confirmar equivalencia y cambio efectivo.':'')].filter(Boolean).join(' '),
     sources:[...origin.sources,...destination.sources].filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i)});
   }
  }
 }
 return result;
}
export const movementById=(id,context)=>availableMovements(context).find(t=>t.id===id);
