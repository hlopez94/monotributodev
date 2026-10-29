import React,{useState} from 'react';
import {Info,ArrowSquareOut} from '@phosphor-icons/react';
import provinces from '../data/provinces.json';
import common from '../data/provinces/common.json';
import {provinceGuides} from '../data/province-guides.mjs';
import {provincePresentation} from '../lib/provinces.mjs';
import {Sources,Contribution,Status} from './Shared.jsx';

function Procedure({section,provinceId,topic,steps=section.steps}){
 return <article className="province-procedure">
  <div className="entity-title"><h3>{section.title}</h3><Status value={section.status}/></div>
  <p>{section.intro}</p>
  {steps.length>0&&<ol className="instructions">{steps.map(step=><li key={step}>{step}</li>)}</ol>}
  <Sources links={section.sources}/><Contribution topic={`iibb-${provinceId}-${topic}`} missing={section.status==='missing'}/>
 </article>;
}

export function ProvinceGuide(){
 const [province,setProvince]=useState('buenos-aires'),[activity,setActivity]=useState('export'),[registered,setRegistered]=useState('yes'),[employed,setEmployed]=useState('no'),[regime,setRegime]=useState('unknown');
 const p=provinces.find(x=>x.id===province),guide=provinceGuides[province];
 const presentation=provincePresentation(guide,regime,activity);
 return <>
  <p className="eyebrow">MONOTRIBUTO E INGRESOS BRUTOS</p><h1>Tu actividad es global.<br/><span>Tu provincia también cuenta.</span></h1>
  <p className="lead">Qué revisar para salir del simplificado cuando corresponde, registrar el tratamiento de exportaciones y presentar IIBB según tu régimen.</p>
  <div className="notice province-warning"><Info size={24}/><div><strong>Puede haber errores. Ayudanos a mejorar la guía.</strong><p>{common.warning}</p><Contribution topic={`iibb-${province}`}/></div></div>
  <div className="province-grid">
   <form onSubmit={e=>e.preventDefault()}>
    <label>Domicilio fiscal<select value={province} onChange={e=>{setProvince(e.target.value);setRegime('unknown')}}>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label>Régimen provincial actual<select value={regime} onChange={e=>setRegime(e.target.value)}><option value="unknown">No estoy seguro / quiero revisar</option><option value="simplified">Simplificado / Monotributo Unificado</option><option value="general">Régimen general · contribuyente local</option><option value="not-registered">No inscripto / no alcanzado / exento</option><option value="cm">Convenio Multilateral</option></select></label>
    <label>Actividad<select value={activity} onChange={e=>setActivity(e.target.value)}><option value="export">Solo exportación de servicios</option><option value="mixed">Ingresos locales y del exterior</option></select></label>
    <label>¿Ya tenés monotributo nacional?<select value={registered} onChange={e=>setRegistered(e.target.value)}><option value="yes">Sí</option><option value="no">No, voy a empezar</option></select></label>
    <label>¿También trabajás en relación de dependencia?<select value={employed} onChange={e=>setEmployed(e.target.value)}><option value="no">No</option><option value="yes">Sí</option></select></label>
    <small>Usamos tus respuestas solo en este navegador. La selección no determina tu inscripción ni tramita cambios.</small>
   </form>
   <section className="province-results" aria-label={`Guía de ${p.name}`}>
    <div className="entity-title"><h2>{p.name}</h2><Status value={guide.status}/></div>
    <p>{guide.scope}</p><p className="province-reviewed">{guide.reviewedAt?`Fuentes consultadas: ${guide.reviewedAt.split('-').reverse().join('/')}. La fecha no garantiza vigencia posterior.`:'Todavía no tenemos un procedimiento verificado para esta provincia.'}</p>
    <a href={p.agencyUrl} target="_blank" rel="noreferrer">Portal del organismo / provincia <ArrowSquareOut size={15}/></a>
    {presentation.mixed&&<div className="notice"><Info size={22}/><p>Con ingresos mixtos, separá los locales de las exportaciones. No apliques una exclusión de actividad exclusiva ni supongas que el total de IIBB queda en cero.</p></div>}
    {regime==='cm'?<div className="notice"><Info size={22}/><p>Ya seleccionaste Convenio Multilateral. Los cambios registrales se revisan por ese régimen: los trámites locales de simplificado de abajo no deben aplicarse automáticamente.</p></div>:null}
    <Procedure section={guide.regime} provinceId={province} topic="regimen"/>
    <Procedure section={guide.exports} provinceId={province} topic="exportaciones"/>
    {presentation.monthlyMode==='cm'?<Procedure section={common.cm} provinceId={province} topic="cm"/>:presentation.monthlyMode==='general'?<Procedure section={guide.monthly} provinceId={province} topic="ddjj" steps={presentation.monthlySteps}/>:<article className="province-procedure"><h3>3. Confirmá si corresponde presentar DDJJ</h3><p>{common.regimeMessages[regime]}</p><Sources links={guide.monthly.sources}/><Contribution topic={`iibb-${province}-ddjj`} missing={guide.monthly.status==='missing'}/></article>}
    <div className="notice"><Info size={23}/><div><strong>Impuesto cero ≠ facturación cero</strong><p>{common.monthlyNotZero}</p></div></div>
    <details className="national-checklist"><summary>Monotributo nacional: altas y parámetros</summary>
     {registered==='no'&&<p>Antes del primer cobro, revisá CUIT, clave fiscal, domicilio fiscal electrónico, actividad y alta en el régimen que corresponda. La categoría responde a tus parámetros reales; no recomendamos empezar siempre en A.</p>}
     {employed==='yes'&&<p>Informá la relación de dependencia al realizar el alta: puede afectar componentes previsionales. Confirmá los requisitos con ARCA.</p>}
     <p>Controlá parámetros y escalas vigentes. ARCA informa recategorización en febrero y agosto.</p><Sources ids={['arca','recategorizacion']}/>
    </details>
   </section>
  </div>
  <div className="notice"><Info size={24}/><p>Salir del unificado, obtener una exención, cesar IIBB y pedir una alícuota de retención 0% son gestiones distintas. No son requisitos universales para emitir Factura E.</p></div>
 </>;
}
