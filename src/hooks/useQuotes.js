import {useEffect,useState} from 'react';
import {getInitialQuotes,getQuotes} from '../lib/quotes.mjs';
export function useQuotes(enabled){
 const [book,setBook]=useState(getInitialQuotes),[loading,setLoading]=useState(false);
 useEffect(()=>{
  if(!enabled)return;
  let active=true;setLoading(true);
  getQuotes().then(value=>{if(active)setBook(value);}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[enabled]);
 async function refresh(){setLoading(true);try{setBook(await getQuotes(true));}finally{setLoading(false);}}
 return {book,loading,refresh};
}
