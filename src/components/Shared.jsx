import React,{useState} from 'react';
import {ArrowSquareOut,Check,Copy,ArrowRight} from '@phosphor-icons/react';
import sources from '../data/sources.json';
import {buildIssueUrl} from '../lib/domain.mjs';
export function Sources({ids=[],links=[]}) {
 const entries=[...new Map([...ids.map(id=>sources[id]).filter(Boolean),...links].map(s=>[s.url,s])).values()];
 return <div className="sources">{entries.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.name}<ArrowSquareOut size={14}/></a>)}</div>;
}
export function Contribution({entityId='',routeId='',topic='',missing=false}){return <a className="contribution" href={buildIssueUrl({kind:missing?'solicitar-info':'corregir-info',entityId,routeId,topic})} target="_blank" rel="noreferrer">{missing?'SIN INFO · APORTÁ':'¿Podemos mejorar esta info? Aportá acá.'}<ArrowSquareOut size={15}/></a>}
export function CopyButton({value}) {const [state,setState]=useState('');return <button className="icon-button" aria-label={`Copiar ${value}`} onClick={async()=>{try{await navigator.clipboard.writeText(value);setState('Copiado');}catch{setState('No se pudo copiar. Seleccioná el texto.');}}}>{state==='Copiado'?<Check size={17}/>:<Copy size={17}/>}<span aria-live="polite">{state}</span></button>}
export function Button({children,...props}){return <button className="primary" {...props}>{children}<ArrowRight size={20}/></button>}
export function Status({value}){return <span className={'status '+value}>{value==='verified'?'Documentado':value==='partial'?'Info parcial':'Sin info'}</span>}
