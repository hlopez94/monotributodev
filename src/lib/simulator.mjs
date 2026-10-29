import currencyDefinitions from '../data/simulator/currencies.json' with {type:'json'};
const SCALE=1000000n;
export const currencies=currencyDefinitions.map(c=>c.id);
const precision=code=>currencyDefinitions.find(c=>c.id===code).decimals;
export function parseDecimal(value,maxDecimals=6){
 const text=String(value??'').trim().replace(',','.');
 if(!new RegExp(`^\\d{1,15}(\\.\\d{1,${maxDecimals}})?$`).test(text))throw new Error('Completá los valores con números válidos, sin separador de miles.');
 const [whole,fraction='']=text.split('.');return BigInt(whole)*SCALE+BigInt(fraction.padEnd(6,'0'));
}
const divide=(n,d)=>(n+d/2n)/d;
const roundRationalCurrency=(numerator,denominator,currency)=>{const step=10n**BigInt(6-precision(currency));return divide(numerator,denominator*step)*step;};
export function calculateJourney({amount,currency,origin,stages}){
 if(!currencies.includes(currency))throw new Error('Elegí una moneda inicial válida.');
 let balance=parseDecimal(amount,precision(currency));if(balance===0n)throw new Error('El importe inicial debe ser mayor que cero.');
 const initialAmount=balance;let node=origin,currentCurrency=currency;const results=[];
 for(const [index,s] of stages.entries()){
  try{
   if(s.from!==node||s.currencyIn!==currentCurrency)throw new Error('El origen o la moneda no coinciden con la salida anterior.');
   if(!s.to||!currencies.includes(s.currencyOut))throw new Error('Completá destino y moneda de salida.');
   const rate=parseDecimal(s.rate);if(rate===0n)throw new Error('La cotización debe ser mayor que cero.');
   if(s.currencyIn===s.currencyOut&&rate!==SCALE)throw new Error('La misma moneda no requiere conversión: usá una cotización de 1.');
   const percent=parseDecimal(s.percent);if(percent>100n*SCALE)throw new Error('El porcentaje no puede superar 100.');
   const fixed=parseDecimal(s.fixed,precision(currentCurrency)),network=parseDecimal(s.network,precision(currentCurrency)),other=parseDecimal(s.other,precision(currentCurrency));
   const proportional=roundRationalCurrency(balance*percent,100n*SCALE,currentCurrency);
   const minimum=parseDecimal(s.percentMinimum??'0',precision(currentCurrency));
   const percentFee=proportional>minimum?proportional:minimum;
   const fee=fixed+percentFee+other+(s.networkSeparate?0n:network);
   if(fee>balance)throw new Error('Los gastos superan el importe disponible.');
   const afterFees=balance-fee;
   const converted=roundRationalCurrency(afterFees*rate,SCALE,s.currencyOut);
   const receiving=parseDecimal(s.receiving,precision(s.currencyOut));
   if(receiving>converted)throw new Error('El cargo receptor supera el importe convertido.');
   const output=converted-receiving;
   results.push({...s,input:balance,percentFee,fixedFee:fixed,networkFee:network,otherFee:other,totalDeducted:fee,externalCost:s.networkSeparate?network:0n,afterFees,converted,receivingFee:receiving,output});
   balance=output;currentCurrency=s.currencyOut;node=s.to;
  }catch(error){throw new Error(`Tramo ${index+1}: ${error.message}`);}
 }
 return {initialAmount,initialCurrency:currency,stages:results,finalAmount:balance,finalCurrency:currentCurrency,finalNode:node};
}
export function formatAmount(value,currency){
 const decimals=precision(currency);let fraction=(value%SCALE).toString().padStart(6,'0').slice(0,decimals);
 if(decimals>2)fraction=fraction.replace(/0+$/,'').padEnd(2,'0');
 return `${currency} ${(value/SCALE).toLocaleString('es-AR')},${fraction}`;
}
export function tariffMatches(tariff,{from,currency}){return tariff.from===from&&tariff.currencyIn===currency;}
export function receivingIsFree(stage,eligible,nodes){return Boolean(eligible&&stage.method==='swift'&&stage.currencyOut==='USD'&&nodes.find(n=>n.id===stage.to)?.group==='bank-ar');}
export function stageFromTariff(tariff,overrides={},mode='reference'){
 return {tariffId:tariff.id,from:tariff.from,to:tariff.to,currencyIn:tariff.currencyIn,currencyOut:tariff.currencyOut,method:tariff.method,networkName:tariff.networkName??'',rate:tariff.rate??'',...Object.fromEntries(Object.entries(tariff.fees).map(([key,value])=>[key,value??''])),networkSeparate:false,...overrides,mode};
}
