import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
export function ReviewDialog({children,onClose,busy=false,title='Compartir experiencia'}){
 const ref=useRef(null);
 useEffect(()=>{
  const dialog=ref.current,previousOverflow=document.body.style.overflow,previousFocus=document.activeElement;
  dialog.showModal();document.body.style.overflow='hidden';
  return()=>{dialog.close();document.body.style.overflow=previousOverflow;if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
 },[]);
 return createPortal(<dialog ref={ref} className="review-dialog" aria-labelledby="review-dialog-title" onCancel={e=>{e.preventDefault();if(!busy)onClose();}}>
  <div className="review-dialog-layout"><header className="review-dialog-header"><h2 id="review-dialog-title">{title}</h2><button type="button" className="text-button" onClick={onClose} disabled={busy} aria-label="Cerrar formulario de experiencia">Cerrar ×</button></header><div className="review-dialog-body">{children}</div></div>
 </dialog>,document.body);
}
