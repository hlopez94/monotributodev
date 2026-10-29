import React,{useEffect,useId,useRef,useState} from 'react';
import {Bank,Wallet,CaretDown,Check} from '@phosphor-icons/react';
import brandSources from '../../public/brands/sources.json';

export function EntityLogo({entity,kind='platform'}){
 const [failed,setFailed]=useState(false);
 const identity=entity.logoId??entity.id;
 const brand=identity.startsWith('nexo-')?'nexo':identity;
 const asset=brandSources.assets.find(a=>a.id===brand&&a.file);
 const Icon=kind==='bank'||entity.group?.startsWith('bank')?Bank:Wallet;
 return <span className="entity-logo" aria-hidden="true">{asset&&!failed?<img key={asset.file} src={`${import.meta.env.BASE_URL}brands/${asset.file}`} alt="" onError={()=>setFailed(true)}/>:<Icon size={23}/>}</span>;
}

export function EntitySelect({label,options,value,onChange,kind='platform'}){
 const id=useId(),root=useRef(null),trigger=useRef(null),typeahead=useRef({text:'',time:0});
 const selected=options.findIndex(o=>o.id===value);
 const [open,setOpen]=useState(false),[active,setActive]=useState(Math.max(0,selected));
 const current=options[selected]??options[0];
 useEffect(()=>{
  if(!open)return;
  const outside=e=>{if(!root.current?.contains(e.target))setOpen(false)};
  document.addEventListener('pointerdown',outside);
  return ()=>document.removeEventListener('pointerdown',outside);
 },[open]);
 useEffect(()=>{if(open)root.current?.querySelector('[data-active="true"]')?.scrollIntoView({block:'nearest'});},[open,active]);
 const choose=index=>{onChange(options[index].id);setOpen(false);trigger.current?.focus()};
 function keydown(e){
  if(e.key==='Tab'){setOpen(false);return;}
  if(e.key==='Escape'){e.preventDefault();setOpen(false);return;}
  if(['Enter',' '].includes(e.key)){e.preventDefault();if(open)choose(active);else{setActive(Math.max(0,selected));setOpen(true)}return;}
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
   e.preventDefault();setOpen(true);
   setActive(i=>e.key==='Home'?0:e.key==='End'?options.length-1:!open?Math.max(0,selected):Math.max(0,Math.min(options.length-1,i+(e.key==='ArrowDown'?1:-1))));return;
  }
  if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
   const now=Date.now();const text=now-typeahead.current.time<700?typeahead.current.text+e.key:e.key;
   typeahead.current={text,time:now};
   const index=options.findIndex(o=>o.name.toLocaleLowerCase().startsWith(text.toLocaleLowerCase()));
   if(index>=0){e.preventDefault();setActive(index);setOpen(true);}
  }
 }
 const content=o=><><EntityLogo key={o.id} entity={o} kind={kind}/><span className="entity-option-copy"><strong>{o.name}</strong><span>{o.subtitle}</span></span></>;
 return <div className="entity-select-control" ref={root} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}>
  <span id={`${id}-label`} className="selector-label">{label}</span>
  <button type="button" className={'entity-select-trigger'+(open?' is-open':'')} ref={trigger} role="combobox" aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open} aria-haspopup="listbox" aria-controls={`${id}-list`} aria-activedescendant={open?`${id}-option-${active}`:undefined} onKeyDown={keydown} onClick={()=>{setActive(Math.max(0,selected));setOpen(!open)}}>
   <span id={`${id}-value`} className="entity-selected">{content(current)}</span><CaretDown size={18} className="select-caret"/>
  </button>
  {open&&<ul className="entity-options" id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}>{options.map((o,i)=><li id={`${id}-option-${i}`} key={o.id} role="option" aria-selected={o.id===value} data-active={i===active} className="entity-option" onPointerMove={()=>setActive(i)} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(i)}>{content(o)}{o.id===value&&<Check size={19} weight="bold" className="option-check"/>}</li>)}</ul>}
 </div>;
}
