import React from 'react';
import {ArrowClockwise} from '@phosphor-icons/react';
import {quoteDate,quoteIsStale} from '../lib/quotes.mjs';
const number=value=>new Intl.NumberFormat('es-AR',{maximumFractionDigits:6}).format(Number(value));
export function QuoteBar({book,basis,onBasis,loading,refresh}){
 return <div className="automatic-quotes">
  <div className="quote-values" aria-label="Cotizaciones de referencia">{[['eurusd','EUR/USD',book.eurusd?.rate],['mep','MEP · compra',book.mep?.buy],['crypto','Cripto · compra',book.crypto?.buy]].map(([key,label,value])=><div key={key} className="quote-chip"><span>{label} <strong>{value?number(value):'Sin dato'}</strong></span><small>{quoteDate(book[key])}{quoteIsStale(key,book[key])?' · Desactualizada':book[key]?.status==='saved'?' · Guardada':key==='eurusd'?' · Diaria':''}</small></div>)}</div>
  <div className="quote-actions"><span>USD → ARS:</span><div className="quote-basis"><button type="button" aria-pressed={basis==='crypto'} onClick={()=>onBasis('crypto')}>Cripto</button><button type="button" aria-pressed={basis==='mep'} onClick={()=>onBasis('mep')}>MEP</button></div><button type="button" className="icon-button" aria-label="Actualizar cotizaciones" onClick={refresh} disabled={loading}><ArrowClockwise size={17}/></button>{loading&&<span className="quote-loading" role="status">Actualizando…</span>}</div>
 </div>;
}
