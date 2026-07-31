const CHURCHES=["Central","Cachoeira da Serra","Jardim Vitória","Jardim Planalto","PDS Brasília","Vila Isol","Terra Nossa","Pedra Alta"];
const AREAS={"Identidade":"#ff0046","Liderança":"#00bddd","Novas Gerações":"#ffb800","Discipulado":"#00c97b"};
const USERS=[
 {id:"USR-KEVIN",email:"kevin.fernandes@adventistas.org",code:"2515",name:"Kevin Fernandes",role:"Pastor Distrital",church:"Todas",district:"Castelo de Sonhos",active:true,area:"Castelo de Sonhos"},
 {id:"USR-ADMIN",email:"admin",code:"1844",name:"Administrador Master",role:"Administrador da Missão",church:"Todas",district:"Todos",active:true,area:"Todas"}
];
let user=null,records=[],tasks=[],evidences=[],systemUsers=[],selectedChurch="Todas",selectedYear="2026",selectedMonth="Todos",deferredPrompt=null,currentPriority="Identidade",selectedCriterionCode=null,criteriaStatus="Todos";
const $=id=>document.getElementById(id),clamp=n=>Math.max(0,Math.min(100,Number(n)||0)),pct=(a,b)=>b?clamp(a/b*100):0;
function toast(m){const e=$("toast");e.textContent=m;e.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>e.classList.remove("show"),2800)}
function endpoint(){return window.APP_CONFIG.APPS_SCRIPT_URL}
function jsonp(url,action="list",extra={}){return new Promise((resolve,reject)=>{const cb="cb_"+Date.now()+"_"+Math.random().toString(36).slice(2),s=document.createElement("script");const timer=setTimeout(()=>{cleanup();reject(new Error("timeout"))},25000);function cleanup(){clearTimeout(timer);s.remove();try{delete window[cb]}catch(e){}}window[cb]=d=>{cleanup();resolve(d)};const u=new URL(url);u.searchParams.set("action",action);u.searchParams.set("callback",cb);u.searchParams.set("_",Date.now());Object.entries(extra).forEach(([k,v])=>u.searchParams.set(k,v));s.src=u;s.onerror=()=>{cleanup();reject(new Error("network"))};document.head.appendChild(s)})}
function normalize(r){return {...r,ano:String(r.ano),meta:Number(r.meta)||0,alcancado:Number(r.alcancado)||0,codigo:r.codigo_requisito||r.codigo}}
async function login(){
  const email=$("loginEmail").value.trim().toLowerCase();
  const code=$("loginCode").value;
  $("loginButton").disabled=true;
  $("loginButton").textContent="Entrando...";
  $("loginMessage").textContent="";
  try{
    let authenticated=null;
    try{
      const result=await jsonp(endpoint(),"login",{email,codigo:code});
      authenticated=result?.user||result?.data||null;
    }catch(_e){}
    if(!authenticated){
      authenticated=USERS.find(u=>u.email.toLowerCase()===email&&u.code===code&&u.active!==false)||null;
    }
    if(!authenticated) throw new Error("Credenciais inválidas.");
    user={
      email:authenticated.email||email,
      name:authenticated.nome||authenticated.name||email,
      role:authenticated.perfil||authenticated.role||"Usuário",
      church:authenticated.igreja||authenticated.church||"Todas",
      district:authenticated.distrito||authenticated.district||"Castelo de Sonhos"
    };
    localStorage.setItem("sessionUser",JSON.stringify(user));
    startApp();
  }catch(error){
    $("loginMessage").textContent="Usuário ou senha inválidos.";
  }finally{
    $("loginButton").disabled=false;
    $("loginButton").textContent="Entrar";
  }
}
function startApp(){$("loginScreen").classList.add("hidden");$("appRoot").classList.remove("hidden");$("profileName").textContent=user.name;$("profileRole").textContent=user.role;document.querySelectorAll(".admin-only").forEach(e=>e.classList.toggle("hidden",!isMaster()));selectedChurch=user.church==="Todas"?"Todas":user.church;setupFilters();loadData()}
function logout(){localStorage.removeItem("sessionUser");location.reload()}
function canEditChurch(church){
  if(!user) return false;
  if(user.role==="Administrador da Missão") return true;
  if(user.role==="Pastor Distrital") return user.district==="Castelo de Sonhos";
  return user.church===church;
}
function isMaster(){return user?.role==="Administrador da Missão"}
function setupFilters(){$("churchFilter").innerHTML=["Todas",...CHURCHES].map(c=>`<option>${c}</option>`).join("");$("churchFilter").value=selectedChurch;$("churchFilter").disabled=user&&user.church!=="Todas";$("yearFilter").value=selectedYear}
async function loadData(){ $("refreshIcon").classList.add("spin"); try{const res=await jsonp(endpoint());const rows=Array.isArray(res)?res:res.data;if(!Array.isArray(rows))throw Error();records=rows.map(normalize);localStorage.setItem("v5cache",JSON.stringify(records));$("syncBadge").innerHTML="<i></i>Google Sheets conectado"}catch(e){records=JSON.parse(localStorage.getItem("v5cache")||"[]");$("syncBadge").innerHTML="<i style='background:#ffb800'></i>Modo offline"}finally{$("refreshIcon").classList.remove("spin");renderAll()}}
function filtered(){return records.filter(r=>r.ano===selectedYear&&(selectedChurch==="Todas"||r.igreja===selectedChurch))}
function aggregate(data,key){const m=new Map();data.forEach(r=>{const k=r[key];if(!m.has(k))m.set(k,{key:k,meta:0,alc:0,count:0});const x=m.get(k);x.meta+=r.meta;x.alc+=r.alcancado;x.count++});return [...m.values()].map(x=>({...x,percent:pct(x.alc,x.meta)}))}
function renderAll(){$("contextText").textContent=`${selectedChurch==="Todas"?"Distrito completo":selectedChurch} · ${selectedYear}`;$("lastUpdate").textContent="Última atualização: "+new Date().toLocaleString("pt-BR");renderDashboard();renderPriorities();renderPlanner();renderTimeline();renderEvidence();renderAdmin()}
function renderDashboard(){const data=filtered(),total=data.reduce((a,r)=>({m:a.m+r.meta,a:a.a+r.alcancado}),{m:0,a:0}),p=pct(total.a,total.m);$("overallRadial").style.setProperty("--value",p);$("overallPercent").textContent=Math.round(p)+"%";$("overallGoal").textContent=Math.round(total.m);$("overallReached").textContent=Math.round(total.a);const areas=aggregate(data,"area");$("priorityCards").innerHTML=Object.entries(AREAS).map(([area,color])=>{const x=areas.find(v=>v.key===area)||{percent:0,alc:0,meta:0};return `<article class="priority-card" style="--accent:${color}"><strong>${Math.round(x.percent)}%</strong><h3>${area}</h3><p>${Math.round(x.alc)} de ${Math.round(x.meta)} realizados</p><div class="progress"><i style="width:${x.percent}%"></i></div></article>`}).join("");const ranking=aggregate(data,"igreja").sort((a,b)=>b.percent-a.percent);$("rankingList").innerHTML=ranking.map((x,i)=>`<div class="ranking-item"><b>${i+1}</b><div><strong>${x.key}</strong><span>${Math.round(x.alc)} de ${Math.round(x.meta)}</span></div><strong>${Math.round(x.percent)}%</strong></div>`).join("");$("trafficGrid").innerHTML=areas.map(x=>{const c=x.percent>=80?"#00c97b":x.percent>=60?"#ffb800":"#ff0046";return `<div class="traffic-card"><strong><i style="background:${c}"></i>${x.key}</strong><span>${Math.round(x.percent)}% alcançado</span></div>`}).join("");const alerts=data.filter(r=>pct(r.alcancado,r.meta)<60).sort((a,b)=>pct(a.alcancado,a.meta)-pct(b.alcancado,b.meta)).slice(0,8);$("alertsList").innerHTML=alerts.map(r=>`<div class="alert-item"><span>!</span><div><strong>${r.titulo}</strong><span>${r.igreja} · ${r.area}</span></div><strong>${Math.round(pct(r.alcancado,r.meta))}%</strong></div>`).join("");drawEvolution()}
function drawEvolution(){const c=$("evolutionChart"),ctx=c.getContext("2d"),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle="#dbe6ea";ctx.lineWidth=1;for(let i=1;i<5;i++){let y=i*h/5;ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(w-20,y);ctx.stroke()}const vals=[28,35,42,49,58,62,68,71,74,79,83,87].map((v,i)=>clamp(v+(selectedChurch==="Todas"?0:(selectedChurch.length+i)%7)));ctx.strokeStyle="#00bddd";ctx.lineWidth=4;ctx.beginPath();vals.forEach((v,i)=>{const x=45+i*(w-70)/11,y=h-30-v*(h-55)/100;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillStyle="#102333";ctx.font="12px Inter";["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].forEach((m,i)=>ctx.fillText(m,35+i*(w-70)/11,h-8))}

function renderPriorities(){
  const cfgColor=AREAS[currentPriority];
  document.documentElement.style.setProperty("--current",cfgColor);
  $("priorityAreaTitle").textContent=currentPriority;
  $("priorityTabs").innerHTML=Object.entries(AREAS).map(([area,color])=>`<button class="priority-tab ${area===currentPriority?"active":""}" data-area="${area}" style="--current:${color}">${area}</button>`).join("");
  document.querySelectorAll(".priority-tab").forEach(b=>b.onclick=()=>{currentPriority=b.dataset.area;selectedCriterionCode=null;renderPriorities()});
  const rows=aggregateCriteriaV51();
  const visible=rows.filter(r=>criteriaStatus==="Todos"||situationV51(percentV51(r))===criteriaStatus);
  $("criteriaListV51").innerHTML=visible.map((r,i)=>`<button class="criterion-v51 ${selectedCriterionCode===r.codigo?"active":""}" data-code="${r.codigo}"><b>${String(i+1).padStart(2,"0")}</b><span><strong>${r.titulo}</strong><small>${situationV51(percentV51(r))}</small></span><em>${Math.round(percentV51(r))}%</em></button>`).join("");
  document.querySelectorAll(".criterion-v51").forEach(b=>b.onclick=()=>{selectedCriterionCode=b.dataset.code;renderPriorities()});
  if(!selectedCriterionCode&&rows[0]) selectedCriterionCode=rows[0].codigo;
  renderCriterionFormV51();
}
function aggregateCriteriaV51(){
  const m=new Map();
  filtered().filter(r=>r.area===currentPriority).forEach(r=>{
    const k=r.codigo;
    if(!m.has(k))m.set(k,{...r,meta:0,alcancado:0});
    const x=m.get(k);
    x.meta+=Number(r.meta)||0;
    x.alcancado+=Number(r.alcancado)||0;
    if(selectedChurch!=="Todas")Object.assign(x,r);
  });
  return [...m.values()];
}
function percentV51(r){return Number(r.meta)>0?clamp(Number(r.alcancado)/Number(r.meta)*100):0}
function situationV51(p){return p>=100?"Concluído":p>=60?"Em andamento":"Atenção"}
function selectedCriterionRecordV51(){
  if(selectedChurch==="Todas")return aggregateCriteriaV51().find(r=>r.codigo===selectedCriterionCode);
  return filtered().find(r=>r.area===currentPriority&&r.codigo===selectedCriterionCode);
}
function renderCriterionFormV51(){
  const r=selectedCriterionRecordV51();
  if(!r)return;
  const p=percentV51(r);
  $("criterionTitleV51").textContent=r.titulo;
  $("criterionStatusV51").textContent=situationV51(p);
  $("criterionDescriptionV51").textContent=r.descricao||"";
  $("criterionQuestionV51").textContent=r.pergunta||"";
  $("actionPlanV51").value=r.plano_acao||"";
  $("goalInputV51").value=r.meta||0;
  $("reachedInputV51").value=r.alcancado||0;
  $("responsibleInputV51").value=r.responsavel||"";
  $("dateInputV51").value=normalizeDateV51(r.data_inicial);
  $("voteInputV51").value=r.voto||"";
  $("materialInputV51").value=r.material||"";
  updateLiveV51();
  const disabled=selectedChurch==="Todas"||!canEditChurch(selectedChurch);
  ["actionPlanV51","goalInputV51","reachedInputV51","responsibleInputV51","dateInputV51","voteInputV51","materialInputV51","saveCriterionV51"].forEach(id=>$(id).disabled=disabled);
  $("saveCriterionV51").textContent=disabled?"Selecione uma igreja para editar":"Salvar na planilha";
}
function normalizeDateV51(v){
  if(!v)return"";
  const s=String(v);
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
  if(/^\d{2}\/\d{2}\/\d{4}$/.test(s))return s.split("/").reverse().join("-");
  return"";
}
function updateLiveV51(){
  const g=Number($("goalInputV51").value)||0,a=Number($("reachedInputV51").value)||0,p=g?clamp(a/g*100):0;
  $("livePercentV51").textContent=Math.round(p)+"%";
  $("liveProgressV51").style.width=p+"%";
  $("criterionStatusV51").textContent=situationV51(p);
}
async function saveCriterionV51(){
  if(selectedChurch==="Todas"||!canEditChurch(selectedChurch))return;
  const r=selectedCriterionRecordV51();
  if(!r)return;
  const body=new URLSearchParams({
    action:"save",
    id:r.id,
    igreja:selectedChurch,
    distrito:"Castelo de Sonhos",
    ano:selectedYear,
    codigo_requisito:r.codigo,
    area:r.area,
    titulo:r.titulo,
    descricao:r.descricao||"",
    pergunta:r.pergunta||"",
    meta:$("goalInputV51").value,
    alcancado:$("reachedInputV51").value,
    plano_acao:$("actionPlanV51").value,
    responsavel:$("responsibleInputV51").value,
    data_inicial:$("dateInputV51").value,
    voto:$("voteInputV51").value,
    material:$("materialInputV51").value,
    usuario:user.email
  });
  $("saveCriterionV51").disabled=true;
  $("saveCriterionV51").textContent="Salvando...";
  try{
    await fetch(endpoint(),{method:"POST",mode:"no-cors",body});
    await new Promise(r=>setTimeout(r,1200));
    await loadData();
    toast("Critério salvo com sucesso.");
  }catch(e){toast("Não foi possível salvar.");}
  finally{$("saveCriterionV51").disabled=false;}
}

function renderPlanner(){if(!tasks.length)tasks=JSON.parse(localStorage.getItem("v5tasks")||"[]");if(!tasks.length){filtered().slice(0,9).forEach((r,i)=>tasks.push({id:Date.now()+i,title:r.titulo,owner:r.responsavel||"Não definido",due:"2026-12-31",status:["Não iniciado","Em andamento","Concluído"][i%3]}))}const statuses=["Não iniciado","Em andamento","Concluído"];$("kanbanBoard").innerHTML=statuses.map(s=>`<section class="kanban-column"><h3>${s}</h3>${tasks.filter(t=>t.status===s).map(t=>`<article class="task-card"><strong>${t.title}</strong><span>${t.owner}</span><span>Prazo: ${t.due||"—"}</span></article>`).join("")}</section>`).join("")}
function renderTimeline(){const items=[...tasks].sort((a,b)=>(a.due||"").localeCompare(b.due||""));$("timelineList").innerHTML=items.map(t=>`<article class="timeline-item"><strong>${t.title}</strong><span>${t.owner} · ${t.status} · ${t.due||"Sem prazo"}</span></article>`).join("")}
function renderEvidence(){const opts=filtered().map(r=>`<option value="${r.id}">${r.igreja} · ${r.titulo}</option>`).join("");$("evidenceCriterion").innerHTML=opts;evidences=JSON.parse(localStorage.getItem("v5evidences")||"[]");$("evidenceGallery").innerHTML=evidences.map(e=>`<article class="evidence-card">${e.preview?`<img src="${e.preview}" alt="">`:""}<div><strong>${e.description}</strong><span>${e.fileName}</span></div></article>`).join("")}
function uploadEvidence(){const file=$("evidenceFile").files[0];if(!file)return toast("Selecione um arquivo.");const reader=new FileReader();reader.onload=()=>{evidences.push({criterion:$("evidenceCriterion").value,description:$("evidenceDescription").value||"Evidência",fileName:file.name,preview:file.type.startsWith("image/")?reader.result:""});localStorage.setItem("v5evidences",JSON.stringify(evidences));renderEvidence();toast("Evidência adicionada localmente. Para envio ao Drive, atualize o Code.gs da V5.")};reader.readAsDataURL(file)}
function renderAdmin(){
  if(!isMaster()) return;
  loadUsersV52();
}

async function loadUsersV52(){
  try{
    const result=await jsonp(endpoint(),"listUsers",{});
    const rows=Array.isArray(result)?result:(result.data||result.users||[]);
    if(Array.isArray(rows)&&rows.length){
      systemUsers=rows.map(normalizeUserV52);
    }else{
      systemUsers=USERS.map(normalizeUserV52);
    }
  }catch(_e){
    systemUsers=JSON.parse(localStorage.getItem("v52users")||"null")||USERS.map(normalizeUserV52);
  }
  localStorage.setItem("v52users",JSON.stringify(systemUsers));
  renderUsersTableV52();
}
function normalizeUserV52(u){
  return {
    id:u.id||u.email||u.login||("USR-"+Date.now()),
    nome:u.nome||u.name||"",
    funcao:u.funcao||u.perfil||u.role||"",
    area:u.area_atuacao||u.area||u.distrito||u.igreja||"",
    login:u.login||u.email||"",
    senha:u.senha||u.code||"",
    ativo:String(u.ativo??u.active??true).toLowerCase()!=="false"
  };
}
function renderUsersTableV52(){
  const q=($("userSearch")?.value||"").trim().toLowerCase();
  const rows=systemUsers.filter(u=>`${u.nome} ${u.funcao} ${u.area} ${u.login}`.toLowerCase().includes(q));
  $("usersCount").textContent=`${rows.length} usuário${rows.length===1?"":"s"}`;
  $("usersTableBody").innerHTML=rows.map(u=>`
    <tr>
      <td><strong>${escapeAdmin(u.nome)}</strong></td>
      <td>${escapeAdmin(u.funcao)}</td>
      <td>${escapeAdmin(u.area)}</td>
      <td>${escapeAdmin(u.login)}</td>
      <td>••••••</td>
      <td><span class="access-pill ${u.ativo?"active":"inactive"}"><i></i>${u.ativo?"Ativo":"Inativo"}</span></td>
      <td>
        <div class="user-actions">
          <button class="user-action edit" data-edit-user="${escapeAdmin(u.id)}">Editar</button>
          <button class="user-action toggle" data-toggle-user="${escapeAdmin(u.id)}">${u.ativo?"Inativar":"Ativar"}</button>
          <button class="user-action delete" data-delete-user="${escapeAdmin(u.id)}">Excluir</button>
        </div>
      </td>
    </tr>`).join("");
  document.querySelectorAll("[data-edit-user]").forEach(b=>b.onclick=()=>openUserModalV52(b.dataset.editUser));
  document.querySelectorAll("[data-toggle-user]").forEach(b=>b.onclick=()=>toggleUserV52(b.dataset.toggleUser));
  document.querySelectorAll("[data-delete-user]").forEach(b=>b.onclick=()=>deleteUserV52(b.dataset.deleteUser));
}
function escapeAdmin(v){
  return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function openUserModalV52(id=null){
  const u=id?systemUsers.find(x=>String(x.id)===String(id)):null;
  $("userModalTitle").textContent=u?"Editar usuário":"Novo usuário";
  $("editingUserId").value=u?.id||"";
  $("userNameInput").value=u?.nome||"";
  $("userRoleInput").value=u?.funcao||"Pastor Distrital";
  $("userAreaInput").value=u?.area||"Castelo de Sonhos";
  $("userLoginInput").value=u?.login||"";
  $("userPasswordInput").value=u?.senha||"";
  $("userActiveInput").value=String(u?.ativo??true);
  $("userModal").classList.add("open");
}
async function saveUserV52(){
  if(!isMaster()) return;
  const payload={
    action:"saveUser",
    id:$("editingUserId").value||("USR-"+Date.now()),
    nome:$("userNameInput").value.trim(),
    funcao:$("userRoleInput").value,
    area_atuacao:$("userAreaInput").value.trim(),
    login:$("userLoginInput").value.trim(),
    senha:$("userPasswordInput").value,
    ativo:$("userActiveInput").value,
    usuario_admin:user.email
  };
  if(!payload.nome||!payload.login||!payload.senha){
    toast("Preencha nome, login e senha."); return;
  }
  $("saveUserButton").disabled=true;
  $("saveUserButton").textContent="Salvando...";
  try{
    const body=new URLSearchParams(payload);
    await fetch(endpoint(),{method:"POST",mode:"no-cors",body});
    const local=normalizeUserV52(payload);
    const idx=systemUsers.findIndex(x=>String(x.id)===String(local.id));
    if(idx>=0)systemUsers[idx]=local;else systemUsers.push(local);
    localStorage.setItem("v52users",JSON.stringify(systemUsers));
    $("userModal").classList.remove("open");
    renderUsersTableV52();
    toast("Usuário salvo.");
  }catch(_e){toast("Não foi possível salvar o usuário.");}
  finally{$("saveUserButton").disabled=false;$("saveUserButton").textContent="Salvar usuário";}
}
async function toggleUserV52(id){
  const u=systemUsers.find(x=>String(x.id)===String(id));
  if(!u)return;
  u.ativo=!u.ativo;
  await saveUserDirectV52(u);
}
async function deleteUserV52(id){
  const u=systemUsers.find(x=>String(x.id)===String(id));
  if(!u)return;
  if(u.login==="admin"){toast("O administrador master não pode ser excluído.");return;}
  if(!confirm(`Excluir o usuário ${u.nome}?`))return;
  const body=new URLSearchParams({action:"deleteUser",id:u.id,usuario_admin:user.email});
  await fetch(endpoint(),{method:"POST",mode:"no-cors",body});
  systemUsers=systemUsers.filter(x=>String(x.id)!==String(id));
  localStorage.setItem("v52users",JSON.stringify(systemUsers));
  renderUsersTableV52();
  toast("Usuário excluído.");
}
async function saveUserDirectV52(u){
  const body=new URLSearchParams({
    action:"saveUser",id:u.id,nome:u.nome,funcao:u.funcao,area_atuacao:u.area,
    login:u.login,senha:u.senha,ativo:String(u.ativo),usuario_admin:user.email
  });
  await fetch(endpoint(),{method:"POST",mode:"no-cors",body});
  localStorage.setItem("v52users",JSON.stringify(systemUsers));
  renderUsersTableV52();
  toast(u.ativo?"Acesso ativado.":"Acesso inativado.");
}

function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(name+"View").classList.add("active");document.querySelectorAll(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view===name));const titles={dashboard:"Dashboard Executivo",priorities:"Prioridades Estratégicas",planner:"Planner",timeline:"Linha do tempo",evidence:"Evidências",reports:"Relatórios",admin:"Administração"};$("viewTitle").textContent=titles[name]||name;if(name==="admin")loadUsersV52();$("sidebar").classList.remove("open")}
function exportCSV(){const rows=filtered(),headers=["igreja","ano","area","titulo","meta","alcancado","plano_acao","responsavel","data_inicial","voto","material"],csv=[headers,...rows.map(r=>headers.map(h=>r[h]??""))].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="prioridades-estrategicas.csv";a.click();URL.revokeObjectURL(a.href)}
function shareWhatsApp(){const data=filtered(),t=data.reduce((a,r)=>({m:a.m+r.meta,x:a.x+r.alcancado}),{m:0,x:0}),text=`*Prioridades Estratégicas*\n${selectedChurch==="Todas"?"Distrito Castelo de Sonhos":selectedChurch} — ${selectedYear}\nResultado geral: *${Math.round(pct(t.x,t.m))}%*`;window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank")}
async function sendEmail(){const email=$("reportEmail").value.trim();if(!email)return;const body=new URLSearchParams({action:"sendReport",email,igreja:selectedChurch,ano:selectedYear});await fetch(endpoint(),{method:"POST",mode:"no-cors",body});toast("Solicitação de envio realizada.");$("emailModal").classList.remove("open")}
document.addEventListener("DOMContentLoaded",()=>{const saved=localStorage.getItem("sessionUser");if(saved){user=JSON.parse(saved);startApp()}$("loginButton").onclick=login;$("logoutButton").onclick=logout;document.querySelectorAll(".nav-button").forEach(b=>b.onclick=()=>showView(b.dataset.view));$("churchFilter").onchange=e=>{selectedChurch=e.target.value;renderAll()};$("yearFilter").onchange=e=>{selectedYear=e.target.value;renderAll()};$("monthFilter").onchange=e=>{selectedMonth=e.target.value;renderAll()};$("refreshButton").onclick=loadData;$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");$("presentationButton").onclick=()=>document.documentElement.requestFullscreen?.();$("newTaskButton").onclick=()=>$("taskModal").classList.add("open");$("saveTask").onclick=()=>{tasks.push({id:Date.now(),title:$("taskTitle").value,owner:$("taskOwner").value,due:$("taskDue").value,status:$("taskStatus").value});localStorage.setItem("v5tasks",JSON.stringify(tasks));$("taskModal").classList.remove("open");renderPlanner();renderTimeline()};$("criteriaStatusFilter").onchange=e=>{criteriaStatus=e.target.value;renderPriorities()};
  ["goalInputV51","reachedInputV51"].forEach(id=>$(id).oninput=updateLiveV51);
  $("saveCriterionV51").onclick=saveCriterionV51;
  $("newUserButton").onclick=()=>openUserModalV52();
  $("saveUserButton").onclick=saveUserV52;
  $("userSearch").oninput=renderUsersTableV52;
  $("uploadEvidence").onclick=uploadEvidence;$("pdfButton").onclick=()=>window.print();$("excelButton").onclick=exportCSV;$("whatsappButton").onclick=shareWhatsApp;$("emailButton").onclick=()=>$("emailModal").classList.add("open");$("sendEmail").onclick=sendEmail;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove("open"));window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installButton").classList.remove("hidden")});$("installButton").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}};if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js")})