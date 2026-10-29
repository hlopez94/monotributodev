import estimates from '../data/simulator/automatic-estimates.json' with {type:'json'};
import {parseDecimal,receivingIsFree,stageFromTariff} from './simulator.mjs';
const decimal=value=>{const whole=value/1000000n;const fraction=(value%1000000n).toString().padStart(6,'0').replace(/0+$/,'');return whole.toString()+(fraction?'.'+fraction:'');};
const inverse=value=>decimal((1000000000000n+parseDecimal(value)/2n)/parseDecimal(value));
export function marketRate(input,output,quotes,basis='crypto'){
 if(['USDC','USDT'].includes(input)&&['USDC','USDT'].includes(output)&&input!==output)return {rate:'1',kind:'assumption',label:'Stablecoins 1:1 supuesto; confirmar conversión del receptor'};
 if(['USDC','USDT'].includes(input)&&output==='ARS')return marketRate('USD','ARS',quotes,basis);
 if(input==='EUR'&&output==='EURx')return {rate:'1',kind:'assumption',label:'EUR/EURx 1:1 referencia de saldo interno; confirmar acreditación'};
 if(input==='EURx'&&output==='EURC')return {rate:'1',kind:'assumption',label:'EURx/EURC 1:1 supuesto de swap; precio efectivo por confirmar'};
 if((input==='EUR'&&output==='EURC')||(input==='EURC'&&output==='EUR'))return {rate:'1',kind:'assumption',label:'EUR/EURC 1:1 supuesto; confirmar precio efectivo'};
 if(input===output)return {rate:'1',kind:'same',label:'Misma moneda'};
 if(['USDC','USDT'].includes(input)&&output==='USD')return {rate:'1',kind:'assumption',label:'Stablecoin/USD 1:1 supuesto'};
 if(input==='USD'&&['USDC','USDT'].includes(output))return {rate:'1',kind:'assumption',label:'USD/stablecoin 1:1 supuesto'};
 if(input==='EUR'&&output==='USD'&&quotes.eurusd)return {...quotes.eurusd,kind:'market',label:'EUR/USD diario de referencia'};
 if(input==='USD'&&output==='EUR'&&quotes.eurusd)return {...quotes.eurusd,rate:inverse(quotes.eurusd.rate),kind:'market',label:'USD/EUR diario de referencia'};
 const q=quotes[basis];
 if(input==='USD'&&output==='ARS'&&q)return {...q,rate:q.buy,kind:'market',label:`${basis==='mep'?'MEP':'Cripto'} · compra · referencia`};
 if(input==='ARS'&&output==='USD'&&q)return {...q,rate:inverse(q.sell),kind:'market',label:`${basis==='mep'?'MEP':'Cripto'} · venta · referencia`};
 return {rate:'',kind:'missing',label:'Cotización no disponible'};
}
const feeLabels={fixed:'Costo fijo',percent:'Comisión porcentual',network:'Red',other:'Otros / corresponsales',receiving:'Cargo receptor'};
export function resolveAutomaticStage(raw,{quotes,basis='crypto',eligible=true,nodes}){
 const stage={...raw},overrides=raw.overrides??{},omissions=[],assumptions=[];
 for(const field of Object.keys(feeLabels)){
  if(field==='receiving'&&receivingIsFree(stage,eligible,nodes)){stage[field]='0';continue;}
  if(Object.hasOwn(overrides,field)){stage[field]=overrides[field];continue;}
  if(raw[field]!==''&&raw[field]!==undefined&&raw[field]!==null){stage[field]=raw[field];continue;}
  const estimate=estimates.entries.find(e=>e.tariffIds.includes(raw.tariffId)&&e.field===field);
  if(estimate){stage[field]=estimate.value;assumptions.push({...estimate,field});}
  else{stage[field]='0';omissions.push({field,label:feeLabels[field],currency:field==='receiving'?raw.currencyOut:raw.currencyIn});}
 }
 const quote=Object.hasOwn(overrides,'rate')?{rate:overrides.rate,kind:'manual',label:'Cotización manual'}:marketRate(stage.currencyIn,stage.currencyOut,quotes,basis);
 stage.rate=quote.rate;
 stage.percentMinimum=overrides.percentMinimum??raw.percentMinimum??'0';
 stage.networkSeparate=overrides.networkSeparate??raw.networkSeparate??false;
 return {stage,quote,omissions,assumptions,partial:omissions.length>0};
}
export function expenseLines(stage){
 return [
  {key:'fixed',label:'Fijo',amount:stage.fixedFee,currency:stage.currencyIn},
  {key:'percent',label:'Comisión',amount:stage.percentFee,currency:stage.currencyIn},
  {key:'network',label:'Red',amount:stage.networkFee,currency:stage.currencyIn,separate:stage.networkSeparate},
  {key:'other',label:'Otros / corresponsales',amount:stage.otherFee,currency:stage.currencyIn},
  {key:'receiving',label:'Receptor',amount:stage.receivingFee,currency:stage.currencyOut}
 ].filter(line=>typeof line.amount==='bigint'&&line.amount>0n);
}

export function resetAutomaticStage(raw,tariff){return tariff?{...stageFromTariff(tariff),overrides:{}}:{...raw,overrides:{}};}
