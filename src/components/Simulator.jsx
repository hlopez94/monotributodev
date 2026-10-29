import React,{useState} from 'react';
import {Plus,ArrowRight,Info} from '@phosphor-icons/react';
import nodes from '../data/simulator/nodes.json';
import methods from '../data/simulator/methods.json';
import tariffs from '../data/simulator/tariffs.json';
import {availableMovements} from '../lib/movements.mjs';
import scenarios from '../data/simulator/scenarios.json';
import receivingPolicy from '../data/simulator/receiving-policy.json';
import quoteSources from '../data/simulator/quote-sources.json';
import {calculateJourney,formatAmount,tariffMatches,stageFromTariff} from '../lib/simulator.mjs';
import {resolveAutomaticStage,expenseLines,resetAutomaticStage} from '../lib/automatic-simulator.mjs';
import {useQuotes} from '../hooks/useQuotes.js';
import {QuoteBar} from './QuoteBar.jsx';
import {SimulatorStep} from './SimulatorStep.jsx';
import {SimulatorCatalog} from './SimulatorCatalog.jsx';
import {EntityLogo,EntitySelect} from './EntitySelect.jsx';
import {Sources,Contribution} from './Shared.jsx';
const node=id=>nodes.find(n=>n.id===id);
const makeStage=tariff=>({...stageFromTariff(tariff),reference:tariff,overrides:{}});
const loadScenario=scenario=>({...scenario,stages:scenario.stages.map(s=>makeStage(tariffs.find(t=>t.id===s.tariffId)))});
const blankStage=(from,currency)=>({from,currencyIn:currency,to:'otro',currencyOut:currency,method:'custom',rate:'1',fixed:'',percent:'',network:'0',other:'0',receiving:'',networkSeparate:false,tariffId:'',overrides:{}});

export function Simulator({active=true}){
 const [journey,setJourney]=useState(()=>loadScenario(scenarios[0])),[eligible,setEligible]=useState(true),[basis,setBasis]=useState('crypto'),[adding,setAdding]=useState(false),[destinationSearch,setDestinationSearch]=useState('');
 const {book,loading,refresh}=useQuotes(active);
 const resolved=journey.stages.map(raw=>resolveAutomaticStage(raw,{quotes:book,basis,eligible,nodes}));
 const partials=[];let result,error;
 try{
  result=calculateJourney({...journey,stages:[]});
  for(let i=0;i<resolved.length;i++){
   if(!resolved[i].stage.rate)throw new Error(`Paso ${i+1}: no tenemos cotización para este par. Elegí un movimiento con referencia disponible o ajustalo opcionalmente.`);
   result=calculateJourney({...journey,stages:resolved.slice(0,i+1).map(r=>r.stage)});partials.push(result.stages[i]);
  }
 }catch(e){error=e.message;result=null;}
 const omissionCount=resolved.reduce((count,r)=>count+r.omissions.length,0),estimated=resolved.some(r=>r.assumptions.length);
 const end=journey.stages.at(-1),context={from:end?.to??journey.origin,currency:end?.currencyOut??journey.currency};
 const suggestions=availableMovements(context);
 const visibleSuggestions=suggestions.filter(t=>(node(t.to).name+' '+t.method+' '+(t.asset??'')+' '+t.currencyOut).toLocaleLowerCase().includes(destinationSearch.toLocaleLowerCase().trim()));
 const replaceStage=(index,next,preserve=false)=>setJourney(current=>({...current,stages:[...current.stages.slice(0,index),next,...(preserve?current.stages.slice(index+1):[])]}));
 const changeField=(index,key,value)=>setJourney(current=>({...current,stages:current.stages.map((s,i)=>i===index?{...s,overrides:{...s.overrides,[key]:value}}:s)}));
 const changeStart=(key,value)=>{setAdding(false);setJourney(current=>({...current,[key]:value,...(key==='origin'?{currency:node(value).currencies[0]}:{}),stages:[]}));};
 function add(tariff){setJourney(current=>({...current,stages:[...current.stages,tariff?makeStage(tariff):blankStage(context.from,context.currency)]}));setAdding(false);}
 return <div className="automatic-simulator">
  <p className="eyebrow">SIMULADOR DE COBROS</p><h1>Elegí el recorrido. <span>Los números, ya cargados.</span></h1>
  <p className="automatic-intro">Ingresá el monto y sumá pasos. Costos y cambios precargados; podés ajustarlos si querés.</p>
  <QuoteBar book={book} basis={basis} onBasis={setBasis} loading={loading} refresh={refresh}/>
  <div className="automatic-presets" aria-label="Recorridos sugeridos">{scenarios.map(s=><button type="button" key={s.id} onClick={()=>{setJourney(loadScenario(s));setAdding(false);}}>{s.name}</button>)}</div>
  <div className="automatic-layout">
   <div className="automatic-builder">
    <div className="automatic-start"><EntitySelect label="Dónde empezás" value={journey.origin} onChange={value=>changeStart('origin',value)} options={nodes.map(n=>({...n,subtitle:n.currencies.join(' · ')}))}/><label>Moneda<select aria-label="Moneda inicial" value={journey.currency} onChange={e=>changeStart('currency',e.target.value)}>{node(journey.origin).currencies.map(c=><option key={c}>{c}</option>)}</select></label><label>Cuánto recibís<input type="text" inputMode="decimal" aria-label="Cuánto recibís" maxLength={24} value={journey.amount} onChange={e=>setJourney({...journey,amount:e.target.value})}/></label></div>
    <div className="automatic-steps">{journey.stages.map((raw,index)=><SimulatorStep key={`${journey.id??'custom'}-${index}`} raw={raw} resolved={resolved[index]} index={index} calculated={partials[index]} eligible={eligible}
     onMovement={value=>replaceStage(index,value==='custom'?blankStage(raw.from,raw.currencyIn):makeStage(availableMovements({from:raw.from,currency:raw.currencyIn}).find(t=>t.id===value)))}
     onCustomTopology={patch=>replaceStage(index,{...blankStage(raw.from,raw.currencyIn),to:raw.to,currencyOut:raw.currencyOut,method:raw.method,...patch})}
     onField={(key,value)=>changeField(index,key,value)} onReset={()=>replaceStage(index,raw.reference?makeStage(raw.reference):resetAutomaticStage(raw,tariffs.find(t=>t.id===raw.tariffId)),true)}
     onRemove={()=>setJourney({...journey,stages:journey.stages.slice(0,index)})}/>)}</div>
    <button type="button" className="automatic-add" aria-expanded={adding} disabled={journey.stages.length>=8} onClick={()=>{setAdding(!adding);setDestinationSearch('');}}><Plus size={17}/>Agregar paso</button>
    {adding&&<div className="automatic-options" aria-label="Movimientos disponibles"><p className="automatic-options-context">Desde {node(context.from).name} · {context.currency}. Destinos según métodos de envío y recepción; confirmá disponibilidad en ambas cuentas.</p><label className="automatic-destination-search">Buscar destino<input type="search" aria-label="Buscar destino compatible" value={destinationSearch} onChange={e=>setDestinationSearch(e.target.value)} placeholder="Wise, Lemon, banco…"/></label>{!suggestions.length&&<p className="automatic-options-context">Todavía no tenemos capacidades de salida documentadas para este origen y moneda. Podés configurar otro movimiento.</p>}{visibleSuggestions.map(t=><button type="button" key={t.id} onClick={()=>add(t)}><EntityLogo entity={node(t.to)}/><span><strong>{node(t.to).name}</strong><small>{methods.find(m=>m.id===t.method)?.name}{t.asset?' · '+t.asset:''}{t.networkName?' · '+t.networkName:''} · {t.currencyOut}</small></span><ArrowRight size={16}/></button>)}<button type="button" onClick={()=>add(null)}><Plus size={20}/><span><strong>Otro movimiento</strong><small>Ajuste avanzado opcional</small></span></button></div>}
    <small className="automatic-hint">Cambiar destino, método u origen reemplaza los pasos siguientes. Cambiar el monto conserva el recorrido.</small>
   </div>
   <aside className="automatic-result"><p className="eyebrow">{omissionCount?'ESTIMACIÓN PARCIAL':'RESULTADO APROXIMADO'}</p><div aria-live="polite">{error?<p role="alert">{error}</p>:journey.stages.length?<><p className="automatic-final">{formatAmount(result.finalAmount,result.finalCurrency)}</p><p className="automatic-destination">en {node(result.finalNode).name}</p></>:<p>Sumá un paso para calcular el saldo.</p>}</div>
    {omissionCount>0&&<p className="automatic-partial"><Info size={16}/><span>{omissionCount} {omissionCount===1?'cargo sin cotizar':'cargos sin cotizar'}. Este saldo todavía no los descuenta.</span></p>}
    {estimated&&<p className="automatic-assumption">Incluye costos estimados del catálogo, no precios garantizados.</p>}
    <p className="automatic-rate-note">Las cotizaciones son referencias de mercado. No representan el precio final de Wise o Wallbit.</p>
    {partials.some(s=>expenseLines(s).length>0)&&<details className="automatic-expenses"><summary>Gastos por paso</summary>{partials.map((s,i)=>{const lines=expenseLines(s);return lines.length?<div key={i}><strong>Paso {i+1}</strong>{lines.map(line=><p key={line.key}><span>{line.label}{line.separate?' (aparte)':''}</span><span>{formatAmount(line.amount,line.currency)}</span></p>)}</div>:null;})}<small>Solo cargos mayores a cero. No sumamos monedas diferentes; gas aparte no reduce el envío.</small></details>}
   </aside>
  </div>
  <details className="automatic-methodology"><summary>Fuentes, supuestos y condiciones</summary><p>El monto es lo único que necesitás escribir para usar las rutas propuestas. Si una tarifa no tiene referencia, el cálculo se marca parcial y ese cargo queda explícitamente sin incluir. Los ajustes manuales son opcionales y no se pisan al actualizar cotizaciones.</p><label className="checkbox"><input type="checkbox" checked={eligible} onChange={e=>setEligible(e.target.checked)}/>Persona humana residente, acreditando SWIFT en mi cuenta USD en Argentina.</label><p>{receivingPolicy.note}</p><Sources links={receivingPolicy.sources}/><p>EUR/USD es una referencia diaria; MEP y cripto usan el precio comprador para simular USD→ARS. ARS→USD usa el vendedor. Una referencia MEP no representa un retiro directo de la plataforma ni confirma ingreso por MLC. Las cotizaciones guardadas conservan la fecha original; se consulta de nuevo al abrir el simulador, con caché de quince minutos.</p><Sources links={Object.values(quoteSources).map(s=>({name:s.name,url:s.docs}))}/><p>Solo se consultan cotizaciones públicas. No enviamos tus montos ni tu recorrido a esos proveedores. El saldo final no determina la factura: usá el importe real del servicio y verificá la valuación fiscal que corresponda. La conversión stablecoin/USD 1:1 y las tarifas estimadas son supuestos.</p><Sources ids={['arca','bcra']}/></details>
  <SimulatorCatalog/><Contribution topic="simulador-automatico"/>
 </div>;
}
