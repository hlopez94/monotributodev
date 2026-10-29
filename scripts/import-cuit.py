"""Importa el XLSX oficial conservado en docs/research, sin dependencias externas."""
from pathlib import Path
import zipfile,xml.etree.ElementTree as ET,json
root=Path(__file__).resolve().parent.parent
source=root/'docs/research/arca-cuit-paises-2026-10-29.xlsx'
ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(source) as z:
 strings=[''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',ns)]
 rows=[]
 legend={}
 raw_rows=[]
 for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//s:row',ns)[1:]:
  cells={}
  for c in row.findall('s:c',ns):
   v=c.find('s:v',ns); val=v.text if v is not None else ''
   cells[''.join(ch for ch in c.get('r','') if ch.isalpha())]=strings[int(val)] if c.get('t')=='s' and val else val
  raw_rows.append(cells)
  if cells.get('E') and cells.get('F'): legend[cells['E']]=cells['F'].strip().upper()
 for cells in raw_rows:
  cuit=cells.get('A',''); country=cells.get('B',''); kind=cells.get('C','')
  if not cuit.isdigit() or len(cuit)!=11 or not country: raise ValueError(f'Fila inválida: {cells}')
  rows.append({'cuit':cuit,'country':country,'officialName':country,'personType':legend[kind]})
(root/'src/data/cuit-countries.json').write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':'))+'\n')
print(f'{len(rows)} registros oficiales importados; {len(set(r["country"] for r in rows))} denominaciones de país/jurisdicción.')
