import React,{useEffect,useState} from 'react';
import {Star,ArrowRight} from '@phosphor-icons/react';
import {CommunityReviews} from './CommunityReviews.jsx';

const API=import.meta.env.VITE_COMMUNITY_API||'';
const SITEKEY=import.meta.env.VITE_TURNSTILE_SITEKEY||'';

export function DirectoryReviews({entityId,navigate}){
 const [stats,setStats]=useState(null),[error,setError]=useState(false),[open,setOpen]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{
  const controller=new AbortController();
  if(!API){setError(true);return;}
  fetch(API+'/reviews?entity='+encodeURIComponent(entityId),{signal:controller.signal})
   .then(async r=>{if(!r.ok)throw Error();return r.json()})
   .then(data=>setStats(data.stats))
   .catch(err=>{if(err.name!=='AbortError')setError(true)});
  return()=>controller.abort();
 },[entityId]);
 return <div className="directory-community">
  <div className="directory-scores" aria-label="Puntuaciones de la comunidad">
   <div className="directory-score-heading"><Star size={18} weight="fill" aria-hidden="true"/><strong>La comunidad</strong><small>{stats?`${stats.count} ${stats.count===1?'experiencia':'experiencias'}`:error?'No disponible':'Cargando…'}</small></div>
   {stats?.count>0?<div className="directory-score-values">{[['speed','Velocidad'],['ease','Facilidad'],['support','Atención']].map(([key,label])=><span key={key}>{label} <strong>{stats[key]===null?'Sin puntuar':Number(stats[key]).toFixed(1)+' / 5'}</strong><small>{stats[key+'Count']} votos</small></span>)}</div>:<p className="muted">{error?'No pudimos cargar las puntuaciones. Probá de nuevo más tarde.':stats?'Todavía sin opiniones. Compartí la primera.':'Consultando experiencias publicadas.'}</p>}
  </div>
  <div className="directory-review-action"><button className="text-button" onClick={()=>navigate('comunidad',entityId)}>Leer opiniones</button><button className="primary" disabled={!API||!SITEKEY} onClick={()=>{setMessage('');setOpen(true)}}>Compartir experiencia <ArrowRight size={17}/></button></div>
  {message&&<p className="notice" role="status">{message}</p>}
  {open&&<CommunityReviews initialEntity={entityId} dialogOnly onClose={result=>{setOpen(false);if(result)setMessage(result)}}/>}
 </div>;
}
