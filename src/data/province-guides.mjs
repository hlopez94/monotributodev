// Solo carga: los contenidos editables viven en archivos JSON, uno por jurisdicción.
const files=import.meta.glob('./provinces/*.json',{eager:true,import:'default'});
export const provinceGuides=Object.fromEntries(Object.values(files).filter(guide=>guide.id).map(guide=>[guide.id,guide]));
