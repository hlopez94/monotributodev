import {writeFile} from 'node:fs/promises';
import {fetchQuoteBook} from '../src/lib/quotes.mjs';
const book=await fetchQuoteBook();
if(Object.values(book).some(quote=>!quote||quote.status!=='network'))throw new Error('No se actualizó el snapshot: falta una respuesta válida. Se conserva el archivo anterior.');
const snapshot=Object.fromEntries(Object.entries(book).map(([key,quote])=>[key,{...quote,status:'saved'}]));
await writeFile(new URL('../src/data/simulator/quote-snapshot.json',import.meta.url),JSON.stringify(snapshot,null,2)+'\n');
console.log('Snapshot actualizado con fechas originales de cada proveedor.');
