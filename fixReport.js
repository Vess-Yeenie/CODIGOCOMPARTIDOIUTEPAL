const fs=require('fs');
const path='STRUCTURE/SCRIPTS/menu.js';
let lines=fs.readFileSync(path,'utf8').split(/\r?\n/);
// find start
let start=-1;
for(let i=0;i<lines.length;i++){
    if(lines[i].includes('async function openReportModal')){start=i;break;}
}
if(start===-1){console.error('function not found');process.exit(1);}
// find matching closing brace by counting braces
let depth=0;let end=-1;
for(let i=start;i<lines.length;i++){
  let line=lines[i];
  for(let ch of line){
    if(ch==='{' ) depth++;
    else if(ch==='}') depth--;
  }
  if(depth===0){ end=i; break; }
}
if(end===-1){console.error('closing brace not found');process.exit(1);}
console.log('replacing lines',start+1,'to',end+1);
const newFunc = [
'async function openReportModal() {',
'    try {',
'        const response = await fetch(\'http://localhost:3000/report\');',
'        const logs = await response.json();',
'        const usersMap = {};',
'        logs.forEach(log => {',
'            const user = log.nombre || \'Usuario desconocido\';',
'            if (!usersMap[user]) usersMap[user] = [];',
'            usersMap[user].push(log.fecha);',
'        });',
'        let reportHTML = \'<h3>Reporte de Accesos de Usuarios</h3>\';',
'        Object.entries(usersMap).forEach(([user, fechas]) => {',
'            reportHTML += `<div class="report-user"><strong>${user}</strong><ul>`;',
'            fechas.forEach(f => reportHTML += `<li>${f}</li>`);',
'            reportHTML += `</ul></div>`;',
'        });',
'        const reportContent = document.getElementById(\'reportContent\');',
'        if (reportContent) reportContent.innerHTML = reportHTML;',
'        const reportModal = document.getElementById(\'reportModal\');',
'        if (reportModal) reportModal.style.display = \'block\';',
'    } catch (error) {',
'        console.error(\'Error obteniendo reporte:\', error);',
'        alert(\'Error al cargar el reporte.\');',
'    }',
'}'];

// replace lines start..end
lines.splice(start, end-start+1, ...newFunc);
fs.writeFileSync(path, lines.join('\r\n'));
console.log('replacement done');
