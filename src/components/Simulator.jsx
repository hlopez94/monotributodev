import React,{useState} from 'react';
import {ArrowDown,ArrowRight,Plus,Trash,Info,ArrowCounterClockwise} from '@phosphor-icons/react';
import nodes from '../data/simulator/nodes.json';
import methods from '../data/simulator/methods.json';
import tariffs from '../data/simulator/tariffs.json';
import scenarios from '../data/simulator/scenarios.json';
import receivingPolicy from '../data/simulator/receiving-policy.json';
import {calculateJourney,formatAmount,tariffMatches,receivingIsFree,stageFromTariff} from '../lib/simulator.mjs';
import {SimulatorCatalog} from './SimulatorCatalog.jsx';
import {EntityLogo,EntitySelect} from './EntitySelect.jsx';
import {Sources,Contribution} from './Shared.jsx';
const node=id=>nodes.find(n=>n.id===id);
const methodName=id=>methods.find(m=>m.id===id)?.name??id;
const loadScenario=scenario=>({...scenario,scenarioNote:scenario.note,stages:scenario.stages.map(s=>stageFromTariff(tariffs.find(t=>t.id===s.tariffId),s.overrides,'example'))});
const blankStage=(from,currency)=>({from,currencyIn:currency,to:'otro',currencyOut:currency,method:'custom',networkName:'',rate:'1',fixed:'',percent:'',network:'0',other:'0',receiving:'',networkSeparate:false,tariffId:'',mode:'custom'});
function ValueField({label,index,value,onChange}){return <label>{label}<input type="text" inputMode="decimal" autoComplete="off" aria-label={`${label} · tramo ${index+1}`} value={value} placeholder="Sin dato" maxLength={24} onChange={e=>onChange(e.target.value)}/></label>;}

export function Simulator(){
 const [journey,setJourney]=useState(()=>loadScenario(scenarios[0]));
 const [eligible,setEligible]=useState(true);
 const changeCost=(index,key,value)=>setJourney(current=>({...current,stages:current.stages.map((s,i)=>i===index?{...s,[key]:value,mode:'custom'}:s)}));
 const replaceStage=(index,next,preserveFollowing=false)=>setJourney(current=>({...current,stages:[...current.stages.slice(0,index),next,...(preserveFollowing?current.stages.slice(index+1):[])]}));
 const changeStart=(key,value)=>setJourney(current=>({...current,[key]:value,...(key==='origin'?{currency:node(value).currencies[0]}:{}),stages:[],scenarioNote:''}));
 const effective=journey.stages.map(s=>({...s,receiving:receivingIsFree(s,eligible,nodes)?'0':s.receiving}));
 let result,error;const partials=[];
 try{
  result=calculateJourney({...journey,stages:[]});
  for(let i=0;i<effective.length;i++){result=calculateJourney({...journey,stages:effective.slice(0,i+1)});partials.push(result.stages[i]);}
 }catch(e){error=e.message;result=null;}
 const end=journey.stages.at(-1),context={from:end?.to??journey.origin,currency:end?.currencyOut??journey.currency};
 function addStage(){const suggestion=tariffs.find(t=>tariffMatches(t,context));setJourney(current=>({...current,stages:[...current.stages,suggestion?stageFromTariff(suggestion):blankStage(context.from,context.currency)]}));}
 return <>
  <p className="eyebrow">ANTES DE TRANSFERIR</p><h1>Armá el recorrido.<br/><span>Calculá cuánto llega.</span></h1>
  <p className="lead">Sumá movimientos, comisiones y conversiones. Cada tramo usa lo que quedó del anterior. Todo es una estimación editable.</p>
  <div className="scenario-buttons" aria-label="Ejemplos de recorridos">{scenarios.map(s=><button type="button" key={s.id} onClick={()=>setJourney(loadScenario(s))}>{s.name}<ArrowRight size={15}/></button>)}</div>
  {journey.scenarioNote&&<p className="scenario-note"><strong>Ejemplo cargado como base; podés modificarlo.</strong> {journey.scenarioNote}</p>}
  <SimulatorCatalog/>
  <div className="journey-layout">
   <form className="journey-editor" onSubmit={e=>e.preventDefault()}>
    <section className="journey-start"><p className="eyebrow">PUNTO DE PARTIDA</p><div className="journey-start-fields">
     <EntitySelect label="¿Dónde está el dinero?" value={journey.origin} onChange={value=>changeStart('origin',value)} options={nodes.map(n=>({...n,subtitle:n.currencies.join(' · ')}))}/>
     <label>Moneda inicial<select value={journey.currency} onChange={e=>changeStart('currency',e.target.value)}>{node(journey.origin).currencies.map(c=><option key={c}>{c}</option>)}</select></label>
     <label>Importe inicial<input aria-label="Importe inicial" type="text" inputMode="decimal" maxLength={24} value={journey.amount} onChange={e=>setJourney({...journey,amount:e.target.value})}/></label>
    </div><small>Sin separadores de miles. Cambiar origen o moneda inicia un recorrido nuevo; cambiar el importe conserva los tramos.</small></section>
    {journey.stages.map((s,index)=>{
     const tariff=tariffs.find(t=>t.id===s.tariffId),free=receivingIsFree(s,eligible,nodes),calculated=partials[index];
     const selectMovement=value=>replaceStage(index,value==='custom'?blankStage(s.from,s.currencyIn):stageFromTariff(tariffs.find(t=>t.id===value)));
     return <React.Fragment key={index}><div className="journey-connector" aria-hidden="true"><ArrowDown size={22}/></div><section className="transfer-block" aria-label={`Tramo ${index+1}`}>
      <div className="transfer-heading"><span className="transfer-number">{index+1}</span><EntityLogo entity={node(s.from)}/><strong>{node(s.from).name}</strong><ArrowRight size={19}/><strong>{node(s.to).name}</strong><button type="button" className="icon-button remove-stage" aria-label={`Quitar tramo ${index+1} y los siguientes`} onClick={()=>setJourney({...journey,stages:journey.stages.slice(0,index)})}><Trash size={18}/></button></div>
      <label>Movimiento<select aria-label={`Movimiento · tramo ${index+1}`} value={s.tariffId||'custom'} onChange={e=>selectMovement(e.target.value)}>{tariffs.filter(t=>tariffMatches(t,{from:s.from,currency:s.currencyIn})).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}<option value="custom">Configurar un movimiento personalizado</option></select></label>
      {!tariff&&<div className="transfer-custom-fields"><EntitySelect label={`Destino · tramo ${index+1}`} value={s.to} onChange={value=>replaceStage(index,{...blankStage(s.from,s.currencyIn),to:value,currencyOut:node(value).currencies[0],rate:node(value).currencies[0]===s.currencyIn?'1':''})} options={nodes.map(n=>({...n,subtitle:n.currencies.join(' · ')}))}/><label>Método<select aria-label={`Método · tramo ${index+1}`} value={s.method} onChange={e=>replaceStage(index,{...blankStage(s.from,s.currencyIn),to:s.to,currencyOut:s.currencyOut,rate:s.currencyIn===s.currencyOut?'1':'',method:e.target.value})}>{methods.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label><label>Moneda de salida<select aria-label={`Moneda de salida · tramo ${index+1}`} value={s.currencyOut} onChange={e=>replaceStage(index,{...blankStage(s.from,s.currencyIn),to:s.to,method:s.method,currencyOut:e.target.value,rate:e.target.value===s.currencyIn?'1':''})}>{node(s.to).currencies.map(c=><option key={c}>{c}</option>)}</select></label></div>}
      <div className="transfer-meta"><span>{methodName(s.method)}{s.networkName?` · ${s.networkName}`:''}</span><span>{s.currencyIn} → {s.currencyOut}</span><span className={'status '+(s.mode==='example'?'partial':'')}>{s.mode==='example'?'Ejemplo editable':s.mode==='custom'?'Valores personalizados':'Referencia parcial'}</span></div>
      <div className="transfer-fees">
       <ValueField index={index} label={`Costo fijo (${s.currencyIn})`} value={s.fixed} onChange={v=>changeCost(index,'fixed',v)}/>
       <ValueField index={index} label="Comisión porcentual (%)" value={s.percent} onChange={v=>changeCost(index,'percent',v)}/>
       {s.method==='crypto'&&<ValueField index={index} label={`Red · equivalente en ${s.currencyIn}`} value={s.network} onChange={v=>changeCost(index,'network',v)}/>}
       <ValueField index={index} label={`Otros / corresponsales (${s.currencyIn})`} value={s.other} onChange={v=>changeCost(index,'other',v)}/>
      </div>
      {s.method==='crypto'&&<><label className="network-payment">Costo de red<select aria-label={`Pago de red · tramo ${index+1}`} value={s.networkSeparate?'separate':'deduct'} onChange={e=>changeCost(index,'networkSeparate',e.target.value==='separate')}><option value="deduct">Descontado del importe enviado</option><option value="separate">Pagado aparte · no reduce el envío</option></select></label><small>Si pagás gas en ETH u otro activo, ingresá su equivalente en {s.currencyIn}. No se consulta el precio del gas.</small>{!tariff&&<label>Red utilizada<input aria-label={`Red utilizada · tramo ${index+1}`} value={s.networkName} onChange={e=>changeCost(index,'networkName',e.target.value)}/></label>}</>}
      {s.currencyIn!==s.currencyOut&&<div className="transfer-conversion"><ValueField index={index} label={`Cotización: 1 ${s.currencyIn} en ${s.currencyOut}`} value={s.rate} onChange={v=>changeCost(index,'rate',v)}/><small>Usá el valor que efectivamente te ofrecen, incluido el spread. La equivalencia 1:1 entre stablecoin y USD también es un supuesto.</small></div>}
      {free?<p className="receiving-free"><strong>Recepción bancaria: USD 0.</strong> Comisión propia de acreditación bajo el encuadre seleccionado. Cargos del exterior van por separado.</p>:<ValueField index={index} label={`Cargo receptor (${s.currencyOut})`} value={s.receiving} onChange={v=>changeCost(index,'receiving',v)}/>}
      {calculated&&<div className="transfer-output"><span>Entra <strong>{formatAmount(calculated.input,s.currencyIn)}</strong></span><ArrowRight size={20}/><span>Sale <strong>{formatAmount(calculated.output,s.currencyOut)}</strong></span></div>}
      <details className="transfer-details"><summary>Tarifa, cálculo y fuentes</summary><p>El porcentaje se calcula sobre lo que entra. Después se descuentan costo fijo, red descontada y otros; el saldo se convierte y luego se resta el cargo receptor. Redondeamos cada tramo según su moneda.</p>{tariff?<><p>{tariff.note}</p><small>Referencia consultada: {tariff.reviewedAt}. Otros cargos en cero son un supuesto del escenario, no una garantía.</small><Sources links={tariff.sources}/><button type="button" className="text-button" onClick={()=>replaceStage(index,stageFromTariff(tariff),true)}><ArrowCounterClockwise size={16}/>Restaurar referencia del catálogo</button></>:<p>Movimiento sin tarifa ni compatibilidad verificada. Completá los costos y confirmá con los proveedores antes de operar.</p>}{free&&<Sources links={receivingPolicy.sources}/>}<Contribution topic={'tarifa-'+(s.tariffId||s.from+'-'+s.to+'-'+s.method)}/></details>
     </section></React.Fragment>;
    })}
    <button type="button" className="add-movement" disabled={journey.stages.length>=8} onClick={addStage}><Plus size={20}/>Agregar movimiento</button>
    <small>Hasta 8 tramos. Cambiar un movimiento, destino, método o moneda reemplaza los tramos posteriores, que dependen de su salida. Editar sus importes los conserva.</small>
   </form>
   <aside className="journey-summary"><p className="eyebrow">TU RECORRIDO</p><h2>Así va quedando</h2>
    <div className="journey-path"><p><strong>{node(journey.origin).name}</strong><span>{journey.currency} · {journey.amount||'—'}</span></p>{journey.stages.map((s,i)=><React.Fragment key={i}><ArrowDown size={20}/><p><strong>{node(s.to).name}</strong><span>{partials[i]?formatAmount(partials[i].output,s.currencyOut):'Completá los valores'}</span></p></React.Fragment>)}</div>
    <div className="journey-total" aria-live="polite">{error?<p role="alert">{error}</p>:journey.stages.length?<><p className="eyebrow">SALDO FINAL ESTIMADO</p><p className="journey-final">{formatAmount(result.finalAmount,result.finalCurrency)}</p></>:<p>Agregá un movimiento para empezar a calcular.</p>}</div>
    {partials.length>0&&<details className="summary-breakdown"><summary>Ver gastos por tramo</summary>{partials.map((s,i)=><div key={i}><strong>Tramo {i+1} · {s.currencyIn}</strong><p>Fijo: {formatAmount(s.fixedFee,s.currencyIn)}<br/>Porcentaje: {formatAmount(s.percentFee,s.currencyIn)}<br/>Red: {formatAmount(s.networkFee,s.currencyIn)}{s.networkSeparate?' (aparte)':''}<br/>Otros: {formatAmount(s.otherFee,s.currencyIn)}<br/>Receptor: {formatAmount(s.receivingFee,s.currencyOut)}</p></div>)}<small>No sumamos gastos de monedas distintas. Los pagados aparte son un desembolso adicional y no reducen el saldo final.</small></details>}
    <small>Las tarifas y cotizaciones pueden cambiar. No es una oferta ni garantiza acreditación o cumplimiento normativo.</small>
   </aside>
  </div>
  <div className="notice"><Info size={25}/><div><strong>Comisión del banco receptor y cargos del exterior son distintos.</strong><label className="checkbox receiving-eligibility"><input type="checkbox" checked={eligible} onChange={e=>setEligible(e.target.checked)}/>Simular como persona humana residente, con acreditación SWIFT en mi cuenta USD en Argentina.</label><p>{receivingPolicy.note}</p><Sources links={receivingPolicy.sources}/></div></div>
  <div className="notice"><Info size={24}/><div><strong>El saldo final no determina la factura.</strong><p>Para facturar, usá el importe real del servicio antes de gastos. Este simulador no determina la valuación fiscal de cripto ni descuenta Monotributo o IIBB. Una ruta técnicamente posible no confirma que corresponda al circuito de exportación de servicios.</p><Sources ids={['arca','bcra']}/></div></div>
  <Contribution topic="simulador-movimientos"/>
 </>;
}
