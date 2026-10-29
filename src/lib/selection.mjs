const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
export const isOtherOption=o=>['otro','custom'].includes(o.id)||/^otr[oa](?:s?\b)/.test(normalize(o.name));
export function sortOptions(options){return [...options].sort((a,b)=>Number(isOtherOption(a))-Number(isOtherOption(b))||a.name.localeCompare(b.name,'es',{sensitivity:'base',numeric:true})||String(a.subtitle??'').localeCompare(String(b.subtitle??''),'es'));}
export function filterOptions(options,query){const sorted=sortOptions(options),q=normalize(query).trim();if(!q)return sorted;const matches=sorted.filter(o=>normalize(o.name+' '+(o.subtitle??'')).includes(q));return matches.length?matches:sorted.filter(isOtherOption);}
