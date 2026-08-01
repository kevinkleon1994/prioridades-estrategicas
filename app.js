const CHURCHES=["Central","Cachoeira da Serra","Jardim Vitória","Jardim Planalto","PDS Brasília","Vila Isol","Terra Nossa","Pedra Alta"];
const AREAS={"Identidade":"#ff0046","Liderança":"#00bddd","Novas Gerações":"#ffb800","Discipulado":"#00c97b"};
const AREA_ICONS={"Identidade":"assets/icone_identidade.png","Liderança":"assets/icone_lideranca.png","Novas Gerações":"assets/icone_novasgeracoes.png","Discipulado":"assets/icone_discipulado.png"};
const USERS=[
 {id:"USR-KEVIN",email:"kevin.fernandes@adventistas.org",code:"2515",name:"Kevin Fernandes",role:"Pastor Distrital",church:"Todas",district:"Castelo de Sonhos",active:true,area:"Castelo de Sonhos"},
 {id:"USR-ADMIN",email:"admin",code:"1844",name:"Administrador Master",role:"Administrador da Missão",church:"Todas",district:"Todos",active:true,area:"Todas"},
 {id:"USR-SECRETARIA-CENTRAL",email:"secretaria@central.org",code:"1234",name:"Secretaria IASD Central",role:"Ancião/Secretária Local",church:"Central",district:"Castelo de Sonhos",active:true,area:"IASD Central"}
];
let user=null,records=[],tasks=[],evidences=[],systemUsers=[],churchStats=[],dailyVerse=null,evidenceEditMode=false,selectedChurch="Todas",selectedYear="2026",selectedMonth="Todos",deferredPrompt=null,currentPriority="Identidade",selectedCriterionCode=null,criteriaStatus="Todos";
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
      role:authenticated.funcao||authenticated.perfil||authenticated.role||"Usuário",
      church:authenticated.igreja||authenticated.church||(String(authenticated.funcao||authenticated.perfil||authenticated.role||"").includes("Local")?(authenticated.area_atuacao||authenticated.area||"Central"):"Todas"),
      district:authenticated.area_atuacao||authenticated.distrito||authenticated.district||"Castelo de Sonhos"
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
async function loadData(){
  $("refreshIcon").classList.add("spin");
  try{
    const res=await jsonp(endpoint());
    const rows=Array.isArray(res)?res:res.data;
    if(!Array.isArray(rows))throw Error();
    records=rows.map(normalize);
    localStorage.setItem("v5cache",JSON.stringify(records));
    const today=new Date().toISOString().slice(0,10);
    const extras=await Promise.allSettled([
      jsonp(endpoint(),"listChurchStats",{}),
      jsonp(endpoint(),"dailyVerse",{data:today}),
      jsonp(endpoint(),"listEvidences",{igreja:selectedChurch})
    ]);
    if(extras[0].status==="fulfilled") churchStats=Array.isArray(extras[0].value)?extras[0].value:(extras[0].value.data||[]);
    else churchStats=JSON.parse(localStorage.getItem("v83churchStats")||"[]");
    if(extras[1].status==="fulfilled") dailyVerse=extras[1].value.data||extras[1].value;
    else dailyVerse=JSON.parse(localStorage.getItem("v83dailyVerse")||"null");
    if(extras[2].status==="fulfilled") evidences=Array.isArray(extras[2].value)?extras[2].value:(extras[2].value.data||[]);
    else evidences=JSON.parse(localStorage.getItem("v83evidences")||"[]");
    localStorage.setItem("v83churchStats",JSON.stringify(churchStats));
    localStorage.setItem("v83dailyVerse",JSON.stringify(dailyVerse));
    localStorage.setItem("v83evidences",JSON.stringify(evidences));
    $("syncBadge").innerHTML="<i></i>Google Sheets conectado";
  }catch(e){
    records=JSON.parse(localStorage.getItem("v5cache")||"[]");
    churchStats=JSON.parse(localStorage.getItem("v83churchStats")||"[]");
    dailyVerse=JSON.parse(localStorage.getItem("v83dailyVerse")||"null");
    evidences=JSON.parse(localStorage.getItem("v83evidences")||"[]");
    $("syncBadge").innerHTML="<i style='background:#ffb800'></i>Modo offline";
  }finally{$("refreshIcon").classList.remove("spin");renderAll()}
}
function filtered(){return records.filter(r=>r.ano===selectedYear&&(selectedChurch==="Todas"||r.igreja===selectedChurch))}
function aggregate(data,key){const m=new Map();data.forEach(r=>{const k=r[key];if(!m.has(k))m.set(k,{key:k,meta:0,alc:0,count:0});const x=m.get(k);x.meta+=r.meta;x.alc+=r.alcancado;x.count++});return [...m.values()].map(x=>({...x,percent:pct(x.alc,x.meta)}))}
function renderAll(){$("contextText").textContent=`${selectedChurch==="Todas"?"Distrito completo":selectedChurch} · ${selectedYear}`;$("lastUpdate").textContent="Última atualização: "+new Date().toLocaleString("pt-BR");renderMemberStats();renderDailyVerse();renderDashboard();renderPriorities();renderPlanner();renderTimeline();renderEvidence();renderAdmin()}
function selectedChurchStats(){
  const empty={frequentes:0,naoFrequentes:0,transferir:0,resgatar:0};
  const map=s=>({frequentes:Number(s.membros_frequentes||s.frequentes||s.membros_ativos||0),naoFrequentes:Number(s.membros_nao_frequentes||s.nao_frequentes||Math.max(0,Number(s.total_membros||0)-Number(s.membros_ativos||0))),transferir:Number(s.membros_a_transferir||s.a_transferir||0),resgatar:Number(s.membros_a_resgatar||s.a_resgatar||0)});
  if(selectedChurch==="Todas")return churchStats.reduce((a,s)=>{const x=map(s);return{frequentes:a.frequentes+x.frequentes,naoFrequentes:a.naoFrequentes+x.naoFrequentes,transferir:a.transferir+x.transferir,resgatar:a.resgatar+x.resgatar}},empty);
  return map(churchStats.find(x=>String(x.igreja)===String(selectedChurch))||{});
}
function renderMemberStats(){const s=selectedChurchStats();$("frequentMembers").textContent=s.frequentes;$("infrequentMembers").textContent=s.naoFrequentes;$("transferMembers").textContent=s.transferir;$("rescueMembers").textContent=s.resgatar;document.querySelectorAll("[data-member-edit]").forEach(b=>b.disabled=selectedChurch==="Todas"||!canEditChurch(selectedChurch))}
function openMembersModal(){if(selectedChurch==="Todas")return toast("Selecione uma igreja para editar os membros.");if(!canEditChurch(selectedChurch))return;const s=selectedChurchStats();$("membersChurchName").textContent=selectedChurch;$("membersFrequentInput").value=s.frequentes;$("membersInfrequentInput").value=s.naoFrequentes;$("membersTransferInput").value=s.transferir;$("membersRescueInput").value=s.resgatar;updateMembersTotal();$("membersModal").classList.add("open")}
function updateMembersTotal(){$("membersTotalPreview").textContent=["membersFrequentInput","membersInfrequentInput","membersTransferInput","membersRescueInput"].reduce((s,id)=>s+(Number($(id).value)||0),0)}
async function saveMemberStats(){if(selectedChurch==="Todas"||!canEditChurch(selectedChurch))return;const row={igreja:selectedChurch,membros_frequentes:Number($("membersFrequentInput").value)||0,membros_nao_frequentes:Number($("membersInfrequentInput").value)||0,membros_a_transferir:Number($("membersTransferInput").value)||0,membros_a_resgatar:Number($("membersRescueInput").value)||0};const body=new URLSearchParams({action:"saveChurchStats",...Object.fromEntries(Object.entries(row).map(([k,v])=>[k,String(v)])),usuario:user.email});$("saveMembersButton").disabled=true;try{await fetch(endpoint(),{method:"POST",mode:"no-cors",body});const idx=churchStats.findIndex(x=>x.igreja===selectedChurch);if(idx>=0)churchStats[idx]={...churchStats[idx],...row};else churchStats.push(row);localStorage.setItem("v83churchStats",JSON.stringify(churchStats));renderMemberStats();$("membersModal").classList.remove("open");toast("Quantidade de membros salva.")}finally{$("saveMembersButton").disabled=false}}
function renderDailyVerse(){const text=dailyVerse?.texto_biblico||dailyVerse?.texto||"Tudo quanto fizerdes, fazei-o de todo o coração. — Colossenses 3:23";$("dailyBibleVerse").textContent=text}
function renderDashboard(){const data=filtered(),total=data.reduce((a,r)=>({m:a.m+r.meta,a:a.a+r.alcancado}),{m:0,a:0}),p=pct(total.a,total.m);$("overallRadial").style.setProperty("--value",p);$("overallPercent").textContent=Math.round(p)+"%";$("overallGoal").textContent=Math.round(total.m);$("overallReached").textContent=Math.round(total.a);const areas=aggregate(data,"area");$("priorityCards").innerHTML=Object.entries(AREAS).map(([area,color])=>{const x=areas.find(v=>v.key===area)||{percent:0,alc:0,meta:0};return `<button type="button" class="priority-card" data-area="${area}" style="--accent:${color}"><div style="display:flex;align-items:center;justify-content:space-between"><img class="priority-card-icon-v8" src="${AREA_ICONS[area]}" alt=""><strong>${Math.round(x.percent)}%</strong></div><h3>${area}</h3><p>${Math.round(x.alc)} de ${Math.round(x.meta)} realizados</p><div class="progress"><i style="width:${x.percent}%"></i></div></button>`}).join("");document.querySelectorAll(".priority-card").forEach(b=>b.onclick=()=>openPriorityV6(b.dataset.area));const ranking=aggregate(data,"igreja").sort((a,b)=>b.percent-a.percent);$("rankingList").innerHTML=ranking.map((x,i)=>`<div class="ranking-item"><b>${i+1}</b><div><strong>${x.key}</strong><span>${Math.round(x.alc)} de ${Math.round(x.meta)}</span></div><strong>${Math.round(x.percent)}%</strong></div>`).join("");$("trafficGrid").innerHTML=areas.map(x=>{const c=x.percent>=80?"#00c97b":x.percent>=60?"#ffb800":"#ff0046";return `<div class="traffic-card"><strong><i class="traffic-status-dot" style="background:${c}"></i>${x.key}</strong><span>${Math.round(x.percent)}% alcançado</span><img class="traffic-priority-icon" src="${AREA_ICONS[x.key]}" alt="Ícone de ${x.key}"></div>`}).join("");const alerts=data.filter(r=>pct(r.alcancado,r.meta)<60).sort((a,b)=>pct(a.alcancado,a.meta)-pct(b.alcancado,b.meta)).slice(0,8);$("alertsList").innerHTML=alerts.map(r=>`<div class="alert-item"><img class="alert-priority-icon" src="${AREA_ICONS[r.area]||AREA_ICONS["Identidade"]}" alt="Ícone de ${r.area}"><div><strong>${r.titulo}</strong><span>${r.igreja} · ${r.area}</span></div><strong>${Math.round(pct(r.alcancado,r.meta))}%</strong></div>`).join("");drawEvolution()}
function drawEvolution(){const c=$("evolutionChart"),ctx=c.getContext("2d"),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle="#dbe6ea";ctx.lineWidth=1;for(let i=1;i<5;i++){let y=i*h/5;ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(w-20,y);ctx.stroke()}const vals=[28,35,42,49,58,62,68,71,74,79,83,87].map((v,i)=>clamp(v+(selectedChurch==="Todas"?0:(selectedChurch.length+i)%7)));ctx.strokeStyle="#00bddd";ctx.lineWidth=4;ctx.beginPath();vals.forEach((v,i)=>{const x=45+i*(w-70)/11,y=h-30-v*(h-55)/100;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.fillStyle="#102333";ctx.font="12px Inter";["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].forEach((m,i)=>ctx.fillText(m,35+i*(w-70)/11,h-8))}

function openPriorityV6(area){currentPriority=area;selectedCriterionCode=null;showView("priorities");renderPriorities();document.querySelectorAll("[data-priority]").forEach(b=>b.classList.toggle("active",b.dataset.priority===area))}
function renderPriorities(){
  const cfgColor=AREAS[currentPriority];
  document.documentElement.style.setProperty("--current",cfgColor);
  $("priorityAreaTitle").textContent=currentPriority;
  const shapeMap={"Identidade":"circle","Liderança":"triangle","Novas Gerações":"half","Discipulado":"square"};
  const areaDescriptions={"Identidade":"Fortalecer a identidade profética da Igreja, as crenças fundamentais e o estilo de vida adventista.","Liderança":"Formar e desenvolver líderes, fortalecendo competências espirituais, administrativas e pastorais.","Novas Gerações":"Integrar crianças, adolescentes e jovens à comunhão, fidelidade, liderança e missão.","Discipulado":"Desenvolver comunhão, relacionamento, missão e multiplicação por meio de uma jornada contínua de discipulado."};
  $("priorityAreaDescription").textContent=areaDescriptions[currentPriority]||"";
  $("priorityShapeV7").src=AREA_ICONS[currentPriority];
  $("priorityShapeV7").alt=`Ícone de ${currentPriority}`;$("priorityWatermarkV8").src=AREA_ICONS[currentPriority];
  $("priorityTabs").innerHTML=Object.entries(AREAS).map(([area,color])=>{const count=new Set(records.filter(r=>r.area===area&&r.ano===selectedYear&&(selectedChurch==="Todas"||r.igreja===selectedChurch)).map(r=>r.codigo)).size;return `<button class="priority-tab-v7 ${area===currentPriority?"active":""}" data-area="${area}" style="--tab:${color}"><span class="priority-tab-copy-v7"><img class="priority-tab-icon-v8" src="${AREA_ICONS[area]}" alt="">${area}</span><small>${count} critérios</small></button>`}).join("");
  document.querySelectorAll(".priority-tab-v7").forEach(b=>b.onclick=()=>{currentPriority=b.dataset.area;selectedCriterionCode=null;renderPriorities()});
  const rows=aggregateCriteriaV51();
  const totalGoal=rows.reduce((s,r)=>s+Number(r.meta||0),0),totalReached=rows.reduce((s,r)=>s+Number(r.alcancado||0),0),totalPercent=totalGoal?clamp(totalReached/totalGoal*100):0;
  $("priorityPercentV7").textContent=Math.round(totalPercent)+"%";$("priorityProgressV7").style.width=totalPercent+"%";$("priorityGoalV7").textContent=Math.round(totalGoal);$("priorityReachedV7").textContent=Math.round(totalReached);$("priorityCountV7").textContent=rows.length;
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

function normalizeTaskArea(task){
  if(task.area&&AREAS[task.area])return task.area;
  const record=records.find(r=>r.titulo===task.title);
  return record?.area||"Identidade";
}
function renderPlanner(){
  if(!tasks.length)tasks=JSON.parse(localStorage.getItem("v81tasks")||localStorage.getItem("v5tasks")||"[]");
  if(!tasks.length){filtered().slice(0,9).forEach((r,i)=>tasks.push({id:Date.now()+i,title:r.titulo,owner:r.responsavel||"Não definido",due:"2026-12-31",status:["Não iniciado","Em andamento","Concluído"][i%3],area:r.area}))}
  tasks=tasks.map(t=>({...t,area:normalizeTaskArea(t)}));
  const statuses=["Não iniciado","Em andamento","Concluído"];
  $("kanbanBoard").innerHTML=statuses.map(s=>`<section class="kanban-column"><h3>${s}</h3>${tasks.filter(t=>t.status===s).map(t=>`<article class="task-card" style="--task-color:${AREAS[t.area]}"><button type="button" class="task-edit-button" data-edit-task="${t.id}" title="Editar item">✎</button><span class="task-card-area"><img src="${AREA_ICONS[t.area]}" alt="">${t.area}</span><strong>${t.title}</strong><span>${t.owner}</span><span>Prazo: ${t.due||"—"}</span></article>`).join("")}</section>`).join("");
  document.querySelectorAll("[data-edit-task]").forEach(b=>b.onclick=()=>openTaskModal(b.dataset.editTask));
}
function renderTimeline(){
  const items=[...tasks].sort((a,b)=>(a.due||"").localeCompare(b.due||""));
  $("timelineList").innerHTML=items.map(t=>`<article class="timeline-item" style="--timeline-color:${AREAS[t.area]||AREAS.Identidade}"><strong>${t.title}</strong><span class="timeline-area"><img src="${AREA_ICONS[t.area]||AREA_ICONS.Identidade}" alt="">${t.area||"Identidade"}</span><span>${t.owner} · ${t.status} · ${t.due||"Sem prazo"}</span></article>`).join("");
}
function openTaskModal(id=null){
  const task=id?tasks.find(t=>String(t.id)===String(id)):null;
  $("taskModalTitle").textContent=task?"Editar item do planejamento":"Nova tarefa";
  $("taskId").value=task?.id||"";$("taskTitle").value=task?.title||"";$("taskArea").value=task?.area||currentPriority||"Identidade";$("taskOwner").value=task?.owner||"";$("taskDue").value=task?.due||"";$("taskStatus").value=task?.status||"Não iniciado";
  $("deleteTask").classList.toggle("hidden",!task);$("taskModal").classList.add("open");
}
function saveTaskItem(){
  const id=$("taskId").value,title=$("taskTitle").value.trim();if(!title)return toast("Informe o título da tarefa.");
  const data={id:id||Date.now(),title,area:$("taskArea").value,owner:$("taskOwner").value||"Não definido",due:$("taskDue").value,status:$("taskStatus").value};
  const idx=tasks.findIndex(t=>String(t.id)===String(id));if(idx>=0)tasks[idx]=data;else tasks.push(data);
  localStorage.setItem("v81tasks",JSON.stringify(tasks));$("taskModal").classList.remove("open");renderPlanner();renderTimeline();toast(idx>=0?"Item atualizado.":"Tarefa criada.");
}
function deleteTaskItem(){const id=$("taskId").value;if(!id)return;if(!confirm("Excluir este item do planejamento?"))return;tasks=tasks.filter(t=>String(t.id)!==String(id));localStorage.setItem("v81tasks",JSON.stringify(tasks));$("taskModal").classList.remove("open");renderPlanner();renderTimeline();toast("Item excluído.")}
function renderEvidence(){
  const opts=filtered().map(r=>`<option value="${r.id}">${r.igreja} · ${r.titulo}</option>`).join("");
  $("evidenceCriterion").innerHTML=opts;$("editEvidenceCriterion").innerHTML=opts;
  const visible=evidences.filter(e=>selectedChurch==="Todas"||!e.igreja||e.igreja===selectedChurch);
  $("evidenceGallery").classList.toggle("editing",evidenceEditMode);
  $("toggleEvidenceEdit").textContent=evidenceEditMode?"✓ Concluir edição":"✎ Editar evidências";
  $("evidenceGallery").innerHTML=visible.map(e=>{
    const src=e.url||e.preview||"";const isImage=(e.mime_type||e.mimeType||"").startsWith("image/")||/\.(png|jpe?g|webp|gif)$/i.test(e.arquivo||e.fileName||src);
    return `<article class="evidence-card masonry-item" data-evidence-id="${e.id}">${isImage&&src?`<img src="${src}" alt="${escapeAdmin(e.descricao||"Evidência")}" loading="lazy">`:`<div class="document-placeholder">📄</div>`}<div class="evidence-caption"><strong>${escapeAdmin(e.descricao||"Evidência")}</strong><span>${escapeAdmin(e.arquivo||e.fileName||"")}</span></div>${evidenceEditMode?`<button type="button" class="evidence-edit-button" data-edit-evidence="${e.id}">✎ Editar</button>`:""}</article>`
  }).join("");
  document.querySelectorAll("[data-edit-evidence]").forEach(b=>b.onclick=()=>openEvidenceEdit(b.dataset.editEvidence));
}
async function uploadEvidence(){
  const file=$("evidenceFile").files[0];if(!file)return toast("Selecione um arquivo.");
  const reader=new FileReader();reader.onload=async()=>{
    const base64=String(reader.result).split(",")[1]||"";const criterion=records.find(r=>r.id===$("evidenceCriterion").value);
    const payload={action:"uploadEvidence",registro_id:$("evidenceCriterion").value,igreja:criterion?.igreja||selectedChurch,descricao:$("evidenceDescription").value||"Evidência",fileName:file.name,mimeType:file.type,base64,usuario:user.email};
    $("uploadEvidence").disabled=true;try{await fetch(endpoint(),{method:"POST",mode:"no-cors",body:new URLSearchParams(payload)});await new Promise(r=>setTimeout(r,1200));try{const res=await jsonp(endpoint(),"listEvidences",{igreja:selectedChurch});evidences=Array.isArray(res)?res:(res.data||[])}catch(_e){evidences.push({id:"LOCAL-"+Date.now(),...payload,preview:reader.result,arquivo:file.name,mime_type:file.type})}localStorage.setItem("v83evidences",JSON.stringify(evidences));renderEvidence();toast("Evidência enviada.")}finally{$("uploadEvidence").disabled=false}
  };reader.readAsDataURL(file)
}
function openEvidenceEdit(id){const e=evidences.find(x=>String(x.id)===String(id));if(!e)return;$("editingEvidenceId").value=e.id;$("editEvidenceDescription").value=e.descricao||"";$("editEvidenceCriterion").value=e.registro_id||e.criterion||"";$("evidenceEditModal").classList.add("open")}
async function saveEvidenceEdit(){const id=$("editingEvidenceId").value,e=evidences.find(x=>String(x.id)===String(id));if(!e)return;const payload={action:"saveEvidence",id,descricao:$("editEvidenceDescription").value,registro_id:$("editEvidenceCriterion").value,usuario:user.email};await fetch(endpoint(),{method:"POST",mode:"no-cors",body:new URLSearchParams(payload)});e.descricao=payload.descricao;e.registro_id=payload.registro_id;localStorage.setItem("v83evidences",JSON.stringify(evidences));$("evidenceEditModal").classList.remove("open");renderEvidence();toast("Evidência atualizada.")}
async function deleteEvidence(){const id=$("editingEvidenceId").value;if(!confirm("Excluir esta evidência?"))return;await fetch(endpoint(),{method:"POST",mode:"no-cors",body:new URLSearchParams({action:"deleteEvidence",id,usuario:user.email})});evidences=evidences.filter(x=>String(x.id)!==String(id));localStorage.setItem("v83evidences",JSON.stringify(evidences));$("evidenceEditModal").classList.remove("open");renderEvidence();toast("Evidência excluída.")}
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
document.addEventListener("DOMContentLoaded",()=>{const saved=localStorage.getItem("sessionUser");if(saved){user=JSON.parse(saved);startApp()}$("loginButton").onclick=login;["loginEmail","loginCode"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();login()}}));$("logoutButton").onclick=logout;document.querySelectorAll(".nav-button[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));$("prioritiesToggle").onclick=()=>$("prioritySubmenu").classList.toggle("open");document.querySelectorAll("[data-priority]").forEach(b=>b.onclick=()=>openPriorityV6(b.dataset.priority));$("churchFilter").onchange=e=>{selectedChurch=e.target.value;renderAll()};$("yearFilter").onchange=e=>{selectedYear=e.target.value;renderAll()};$("monthFilter").onchange=e=>{selectedMonth=e.target.value;renderAll()};$("refreshButton").onclick=loadData;$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");$("presentationButton").onclick=()=>document.documentElement.requestFullscreen?.();$("newTaskButton").onclick=()=>openTaskModal();$("saveTask").onclick=saveTaskItem;$("deleteTask").onclick=deleteTaskItem;$("criteriaStatusFilter").onchange=e=>{criteriaStatus=e.target.value;renderPriorities()};document.querySelectorAll("[data-member-edit]").forEach(b=>b.onclick=openMembersModal);["membersFrequentInput","membersInfrequentInput","membersTransferInput","membersRescueInput"].forEach(id=>$(id).oninput=updateMembersTotal);$("saveMembersButton").onclick=saveMemberStats;
  ["goalInputV51","reachedInputV51"].forEach(id=>$(id).oninput=updateLiveV51);
  $("saveCriterionV51").onclick=saveCriterionV51;
  $("newUserButton").onclick=()=>openUserModalV52();
  $("saveUserButton").onclick=saveUserV52;
  $("userSearch").oninput=renderUsersTableV52;
  $("toggleEvidenceEdit").onclick=()=>{evidenceEditMode=!evidenceEditMode;renderEvidence()};$("saveEvidenceButton").onclick=saveEvidenceEdit;$("deleteEvidenceButton").onclick=deleteEvidence;$("uploadEvidence").onclick=uploadEvidence;$("pdfButton").onclick=()=>window.print();$("excelButton").onclick=exportCSV;$("whatsappButton").onclick=shareWhatsApp;$("emailButton").onclick=()=>$("emailModal").classList.add("open");$("sendEmail").onclick=sendEmail;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove("open"));window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installButton").classList.remove("hidden")});$("installButton").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}};if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js")})