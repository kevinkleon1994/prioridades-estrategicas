const AREAS = {
  "Identidade": { color:"#ff0046", symbol:"circle" },
  "Liderança": { color:"#00bddd", symbol:"triangle" },
  "Novas Gerações": { color:"#ffb800", symbol:"half" },
  "Discipulado": { color:"#00c97b", symbol:"square" }
};

const AREA_DESCRIPTIONS = {
  "Identidade":"Fortalecer a identidade profética da Igreja e o compromisso com as crenças fundamentais e o estilo de vida adventista.",
  "Liderança":"Formar e desenvolver líderes, fortalecendo competências espirituais, administrativas e pastorais.",
  "Novas Gerações":"Integrar crianças, adolescentes e jovens à comunhão, fidelidade, liderança e missão da igreja.",
  "Discipulado":"Desenvolver comunhão, relacionamento, missão e multiplicação por meio de uma jornada contínua de discipulado."
};

const CHURCHES = ["Central", "Cachoeira da Serra", "Jardim Vitória", "Jardim Planalto", "PDS Brasília", "Vila Isol", "Terra Nossa", "Pedra Alta"];
const REQUIREMENT_CATALOG = [
  {
    "code": "ID-01",
    "area": "Identidade",
    "title": "Patriarcas e Profetas",
    "description": "Estudar semanalmente o livro Patriarcas e Profetas (Os Escolhidos), incluindo o minuto profético.",
    "question": "Como a igreja fará para alcançar o número correspondente a 60% dos membros estudando semanalmente o livro?",
    "defaultGoal": 60
  },
  {
    "code": "ID-02",
    "area": "Identidade",
    "title": "Nisto Cremos",
    "description": "Realizar, nos cultos evangelísticos aos domingos, o estudo do livro Nisto Cremos.",
    "question": "Como a igreja realizará os cultos evangelísticos aos domingos com o estudo do livro Nisto Cremos?",
    "defaultGoal": 100
  },
  {
    "code": "ID-03",
    "area": "Identidade",
    "title": "Classe pós-batismal",
    "description": "Manter classe pós-batismal permanente como unidade da Escola Sabatina.",
    "question": "Como a igreja garantirá que todos os novos batizados estejam matriculados e participem regularmente?",
    "defaultGoal": 100
  },
  {
    "code": "ID-04",
    "area": "Identidade",
    "title": "Capacitação dos professores",
    "description": "Capacitar professores das classes pós-batismais Vivendo em Cristo.",
    "question": "Como a igreja capacitará e treinará os professores das classes pós-batismais?",
    "defaultGoal": 100
  },
  {
    "code": "LI-01",
    "area": "Liderança",
    "title": "Desenvolvimento do ancionato",
    "description": "Envolver pelo menos 50% do ancionato em programas mensais, trimestrais e anuais.",
    "question": "Como a igreja alcançará pelo menos 50% do ancionato nos programas mensais, trimestrais e anuais?",
    "defaultGoal": 50
  },
  {
    "code": "LI-02",
    "area": "Liderança",
    "title": "Integração da MOPa",
    "description": "Alcançar pelo menos 50% da liderança participando do Integração da MOPa.",
    "question": "Como a igreja inserirá pelo menos 50% da liderança no Integração da MOPa?",
    "defaultGoal": 50
  },
  {
    "code": "LI-03",
    "area": "Liderança",
    "title": "Formação de líderes",
    "description": "Formar e desenvolver líderes dos diferentes departamentos da igreja.",
    "question": "Quais ações serão realizadas para formar e desenvolver os líderes dos departamentos?",
    "defaultGoal": 90
  },
  {
    "code": "LI-04",
    "area": "Liderança",
    "title": "Competências pastorais",
    "description": "Acompanhar pastores e fortalecer suas competências pastorais.",
    "question": "Como será realizado o acompanhamento e fortalecimento das competências pastorais?",
    "defaultGoal": 80
  },
  {
    "code": "NG-01",
    "area": "Novas Gerações",
    "title": "Plataforma de diálogo",
    "description": "Criar diálogo entre líderes, pastores e jovens para ampliar o engajamento missionário.",
    "question": "Como a igreja estabelecerá diálogo entre líderes, pastores e jovens?",
    "defaultGoal": 100
  },
  {
    "code": "NG-02",
    "area": "Novas Gerações",
    "title": "Fidelidade cristã",
    "description": "Ampliar a prática da fidelidade cristã através do 7me e aplicativos adequados.",
    "question": "O que será feito para ampliar a fidelidade cristã entre as novas gerações?",
    "defaultGoal": 45
  },
  {
    "code": "NG-03",
    "area": "Novas Gerações",
    "title": "Jovens no ancionato",
    "description": "Integrar jovens à liderança com acompanhamento de anciãos experientes.",
    "question": "Como os jovens serão integrados à liderança e acompanhados por anciãos experientes?",
    "defaultGoal": 20
  },
  {
    "code": "NG-04",
    "area": "Novas Gerações",
    "title": "Palavra e missão",
    "description": "Integrar crianças, juvenis, adolescentes e jovens no estudo e ensino da Palavra.",
    "question": "Quais passos serão usados para envolver as novas gerações no estudo, vivência e ensino da Palavra?",
    "defaultGoal": 60
  },
  {
    "code": "NG-05",
    "area": "Novas Gerações",
    "title": "Vida familiar cristã",
    "description": "Fortalecer culto familiar, fidelidade e envolvimento missionário.",
    "question": "Quais ações fortalecerão a vida cristã, o culto familiar e o envolvimento missionário?",
    "defaultGoal": 100
  },
  {
    "code": "DI-01",
    "area": "Discipulado",
    "title": "Escola Sabatina Viva",
    "description": "Reorganizar a Escola Sabatina e alcançar membros no estudo diário da lição.",
    "question": "Como a igreja alcançará a meta de membros estudando diariamente a Lição da Escola Sabatina?",
    "defaultGoal": 40
  },
  {
    "code": "DI-02",
    "area": "Discipulado",
    "title": "EDMC e ELMC",
    "description": "Consolidar os programas de discipulado em distritos e congregações.",
    "question": "Como a igreja local será organizada para receber a EDMC e atender novos conversos e interessados?",
    "defaultGoal": 30
  },
  {
    "code": "DI-03",
    "area": "Discipulado",
    "title": "Estratégias missionárias",
    "description": "Envolver a maioria dos membros na missão e no ensino da Bíblia.",
    "question": "Como a igreja trabalhará as diferentes estratégias missionárias para envolver a maioria dos membros?",
    "defaultGoal": 100
  },
  {
    "code": "DI-04",
    "area": "Discipulado",
    "title": "Escola de Missão",
    "description": "Preparar jovens para o Serviço Voluntário Adventista.",
    "question": "Quem representará o distrito na Escola de Missão e como serão providenciadas as passagens?",
    "defaultGoal": 100
  },
  {
    "code": "DI-05",
    "area": "Discipulado",
    "title": "Desenvolvimento dos dons",
    "description": "Capacitar membros para reconhecer e desenvolver seus dons.",
    "question": "Como os membros serão capacitados para reconhecer e desenvolver seus dons?",
    "defaultGoal": 100
  },
  {
    "code": "DI-06",
    "area": "Discipulado",
    "title": "Estudos bíblicos",
    "description": "Ampliar o número de membros que ministram estudos bíblicos.",
    "question": "Como a igreja ampliará o número de membros ministrando estudos bíblicos?",
    "defaultGoal": 50
  }
];

let records = [];
let currentArea = "Identidade";
let selectedChurch = "Todas";
let selectedYear = "2026";
let selectedRequirementId = null;
let selectedStatus = "Todos";
let isConnected = false;

const $ = id => document.getElementById(id);
const clamp = n => Math.max(0,Math.min(100,Number(n)||0));
const percentage = r => Number(r.meta) > 0 ? clamp((Number(r.alcancado)/Number(r.meta))*100) : 0;

function getEndpoint(){
  return localStorage.getItem("appsScriptUrl") || window.APP_CONFIG?.APPS_SCRIPT_URL || "";
}

function setEndpoint(url){
  localStorage.setItem("appsScriptUrl", url.trim());
}

function scaleStage(){
  const stage=$("stage");
  const scale=Math.min(window.innerWidth/1920,window.innerHeight/1080);
  stage.style.transform=`scale(${scale})`;
}
window.addEventListener("resize",scaleStage);

function normalizeRecord(row, index=0){
  return {
    id: row.id || `${row.igreja}|${row.ano}|${row.codigo_requisito || row.codigo}`,
    igreja: row.igreja || row.church || "Central",
    distrito: row.distrito || "Castelo de Sonhos",
    ano: String(row.ano || row.year || "2026"),
    codigo: row.codigo_requisito || row.codigo || "",
    area: row.area || "Identidade",
    titulo: row.titulo || row.title || "",
    descricao: row.descricao || row.description || "",
    pergunta: row.pergunta || row.question || "",
    meta: Number(row.meta ?? row.goal ?? 0),
    alcancado: Number(row.alcancado ?? row.reached ?? 0),
    plano_acao: row.plano_acao || row.action || "",
    responsavel: row.responsavel || row.responsible || "",
    data_inicial: normalizeDate(row.data_inicial || row.date || ""),
    voto: row.voto || row.vote || "",
    material: row.material || "",
    ultima_atualizacao: row.ultima_atualizacao || ""
  };
}

function normalizeDate(value){
  if(!value) return "";
  const s=String(value);
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if(/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s.split("/").reverse().join("-");
  const d=new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0,10);
}

function createDemoRecords(){
  const demo=[];
  CHURCHES.forEach((church,ci)=>{
    ["2026","2027","2028","2029","2030"].forEach((year,yi)=>{
      REQUIREMENT_CATALOG.forEach((req,ri)=>{
        const factor=0.42 + ((ci*7+ri*3+yi*5)%45)/100;
        demo.push(normalizeRecord({
          id:`${church}|${year}|${req.code}`,
          igreja:church,
          distrito:"Castelo de Sonhos",
          ano:year,
          codigo_requisito:req.code,
          area:req.area,
          titulo:req.title,
          descricao:req.description,
          pergunta:req.question,
          meta:req.defaultGoal,
          alcancado:Math.round(req.defaultGoal*Math.min(.98,factor)),
          plano_acao:"",
          responsavel:"",
          data_inicial:"",
          voto:"",
          material:""
        }));
      });
    });
  });
  return demo;
}

function setupFilters(){
  const existing=selectedChurch;
  $("churchFilter").innerHTML=["Todas",...CHURCHES].map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  selectedChurch=CHURCHES.includes(existing)||existing==="Todas"?existing:"Todas";
  $("churchFilter").value=selectedChurch;
  $("yearFilter").value=selectedYear;
}

function areaRecords(){
  return records.filter(r =>
    r.area===currentArea &&
    r.ano===selectedYear &&
    (selectedChurch==="Todas" || r.igreja===selectedChurch)
  );
}

function aggregateByRequirement(data){
  const map=new Map();
  data.forEach(r=>{
    const key=r.codigo || r.titulo;
    if(!map.has(key)){
      map.set(key,{...r, id:key, meta:0, alcancado:0, rowIds:[]});
    }
    const item=map.get(key);
    item.meta+=Number(r.meta)||0;
    item.alcancado+=Number(r.alcancado)||0;
    item.rowIds.push(r.id);
    if(selectedChurch!=="Todas") Object.assign(item,r);
  });
  return [...map.values()];
}

function status(p){
  if(p>=100)return "Concluído";
  if(p>=60)return "Em andamento";
  return "Atenção";
}

function render(){
  const cfg=AREAS[currentArea];
  document.documentElement.style.setProperty("--current-area",cfg.color);
  document.documentElement.style.setProperty("--detail-accent",cfg.color);
  document.querySelectorAll(".area-pill").forEach(b=>b.classList.toggle("active",b.dataset.area===currentArea));

  const data=aggregateByRequirement(areaRecords());
  $("summaryTitle").textContent=currentArea;
  $("summaryMeta").textContent=`${selectedChurch==="Todas"?"Distrito Castelo de Sonhos":selectedChurch} · ${selectedYear}`;

  const totalGoal=data.reduce((s,r)=>s+Number(r.meta||0),0);
  const totalReached=data.reduce((s,r)=>s+Number(r.alcancado||0),0);
  const overall=totalGoal?clamp(totalReached/totalGoal*100):0;
  $("overallGauge").style.setProperty("--value",overall.toFixed(1));
  $("overallPercent").textContent=Math.round(overall)+"%";
  $("goalTotal").textContent=Math.round(totalGoal);
  $("reachedTotal").textContent=Math.round(totalReached);
  $("requirementTotal").textContent=data.length;

  $("cardsGrid").innerHTML=data.map((r,i)=>{
    const p=percentage(r);
    return `<article class="metric-card" data-id="${escapeHtml(r.id)}" style="--accent:${cfg.color}">
      <div class="card-top">
        <span class="card-symbol ${cfg.symbol}"></span>
        <span class="card-index">${String(i+1).padStart(2,"0")}</span>
      </div>
      <strong class="card-title">${escapeHtml(r.titulo)}</strong>
      <span class="card-meta">${escapeHtml(r.descricao)}</span>
      <div class="card-bottom">
        <b class="card-percent">${Math.round(p)}%</b>
        <span class="card-status">${status(p)}</span>
      </div>
      <div class="card-progress"><span style="width:${p}%"></span></div>
    </article>`;
  }).join("") || `<div style="grid-column:1/-1;display:grid;place-items:center;color:#6c818b">Nenhum dado encontrado para este filtro.</div>`;

  document.querySelectorAll(".metric-card").forEach(card=>{
    card.addEventListener("click",()=>{
      selectedRequirementId=card.dataset.id;
      openDetailWorkspace();
    });
  });

  renderDetailTabs();
  if($("detailView").classList.contains("active")) renderDetailWorkspace();
  $("lastUpdate").textContent=`Última atualização: ${new Date().toLocaleString("pt-BR")} · ${isConnected?"Google Sheets":"modo demonstração"}`;
}

function renderDetailTabs(){
  $("detailTabs").innerHTML=Object.entries(AREAS).map(([area,cfg])=>{
    const count=aggregateByRequirement(records.filter(r=>r.area===area && r.ano===selectedYear && (selectedChurch==="Todas"||r.igreja===selectedChurch))).length;
    return `<button class="detail-tab ${area===currentArea?"active":""}" data-area="${area}" style="--accent:${cfg.color}">
      <span class="detail-tab-copy"><i class="detail-tab-symbol ${cfg.symbol}"></i><strong>${area}</strong></span>
      <span>${count} critérios</span>
    </button>`;
  }).join("");
  document.querySelectorAll(".detail-tab").forEach(btn=>btn.addEventListener("click",()=>{
    currentArea=btn.dataset.area;
    selectedRequirementId=null;
    selectedStatus="Todos";
    $("statusFilter").value="Todos";
    render();
    openDetailWorkspace();
  }));
}

function openDetailWorkspace(){
  $("overviewView").classList.remove("active");
  $("detailView").classList.add("active");
  renderDetailWorkspace();
}

function showOverview(){
  $("detailView").classList.remove("active");
  $("overviewView").classList.add("active");
  render();
}

function renderDetailWorkspace(){
  const cfg=AREAS[currentArea];
  document.documentElement.style.setProperty("--detail-accent",cfg.color);
  const data=aggregateByRequirement(areaRecords());
  const totalGoal=data.reduce((s,r)=>s+Number(r.meta||0),0);
  const totalReached=data.reduce((s,r)=>s+Number(r.alcancado||0),0);
  const areaPercent=totalGoal?clamp(totalReached/totalGoal*100):0;

  $("detailSummaryIcon").className=`detail-summary-icon ${cfg.symbol}`;
  $("detailAreaTitle").textContent=currentArea;
  $("detailAreaDescription").textContent=AREA_DESCRIPTIONS[currentArea];
  $("detailAreaPercent").textContent=Math.round(areaPercent)+"%";
  $("detailAreaProgress").style.width=areaPercent+"%";
  $("detailAreaGoal").textContent=Math.round(totalGoal);
  $("detailAreaReached").textContent=Math.round(totalReached);
  $("detailAreaCount").textContent=data.length;

  const visible=data.filter(r=>selectedStatus==="Todos" || status(percentage(r))===selectedStatus);
  $("criteriaList").innerHTML=visible.map((r,i)=>{
    const p=percentage(r);
    return `<button class="criteria-item ${String(selectedRequirementId)===String(r.id)?"active":""}" data-id="${escapeHtml(r.id)}">
      <span class="criteria-number">${String(i+1).padStart(2,"0")}</span>
      <span class="criteria-copy"><strong>${escapeHtml(r.titulo)}</strong><span>${status(p)} · Meta ${Math.round(r.meta)}</span></span>
      <span class="criteria-score">${Math.round(p)}%</span>
    </button>`;
  }).join("") || `<p style="color:#6e818a;font-size:12px">Nenhum critério nesta situação.</p>`;

  document.querySelectorAll(".criteria-item").forEach(item=>item.addEventListener("click",()=>{
    selectedRequirementId=item.dataset.id;
    renderDetailWorkspace();
  }));

  if(!selectedRequirementId || !data.some(r=>String(r.id)===String(selectedRequirementId))){
    selectedRequirementId=data[0]?.id || null;
  }
  renderPlanningDetail();
}

function selectedRecord(){
  const aggregated=aggregateByRequirement(areaRecords()).find(r=>String(r.id)===String(selectedRequirementId));
  if(!aggregated) return null;
  if(selectedChurch==="Todas") return aggregated;
  return records.find(r=>r.id===aggregated.id) || aggregated;
}

function renderPlanningDetail(){
  const r=selectedRecord();
  if(!r){
    $("planningTitle").textContent="Nenhum critério disponível";
    return;
  }
  const p=percentage(r);
  $("planningTitle").textContent=r.titulo;
  $("planningStatus").textContent=status(p);
  $("planningDescription").textContent=r.descricao;
  $("planningQuestion").textContent=r.pergunta || "Como a igreja realizará este requisito?";
  $("planningPercent").textContent=Math.round(p)+"%";
  $("planningProgress").style.width=p+"%";
  $("planningGoal").value=Math.round(r.meta);
  $("planningReached").value=Math.round(r.alcancado);
  $("planningResponsible").value=r.responsavel || "";
  $("planningDate").value=r.data_inicial || "";
  $("planningVote").value=r.voto || "";
  $("planningMaterial").value=r.material || "";
  $("planningAction").value=r.plano_acao || "";

  const disabled=selectedChurch==="Todas";
  document.querySelectorAll("#planningGoal,#planningReached,#planningResponsible,#planningDate,#planningVote,#planningMaterial,#planningAction,#savePlanning")
    .forEach(el=>el.disabled=disabled);
  $("savePlanning").textContent=disabled?"Selecione uma igreja para editar":"Salvar na planilha";
}

async function savePlanning(){
  if(selectedChurch==="Todas") return;
  const r=selectedRecord();
  if(!r) return;
  const payload={
    action:"save",
    id:r.id,
    igreja:selectedChurch,
    distrito:"Castelo de Sonhos",
    ano:selectedYear,
    codigo_requisito:r.codigo,
    area:r.area,
    titulo:r.titulo,
    descricao:r.descricao,
    pergunta:r.pergunta,
    meta:Number($("planningGoal").value)||0,
    alcancado:Number($("planningReached").value)||0,
    plano_acao:$("planningAction").value,
    responsavel:$("planningResponsible").value,
    data_inicial:$("planningDate").value,
    voto:$("planningVote").value,
    material:$("planningMaterial").value
  };

  const button=$("savePlanning");
  button.disabled=true;
  button.textContent="Salvando...";

  try{
    if(getEndpoint()){
      await postToSheet(payload);
      await new Promise(resolve=>setTimeout(resolve,1200));
      await loadData(false);
    }else{
      const idx=records.findIndex(x=>x.id===r.id);
      records[idx]=normalizeRecord({...records[idx],...payload});
      localStorage.setItem("dashboardLocalData",JSON.stringify(records));
    }
    button.textContent="Salvo ✓";
    setTimeout(()=>{button.disabled=false;button.textContent="Salvar na planilha";},1000);
    render();
    openDetailWorkspace();
  }catch(error){
    console.error(error);
    button.disabled=false;
    button.textContent="Erro ao salvar";
    alert("Não foi possível salvar. Verifique a URL do Web App e a implantação do Apps Script.");
  }
}

async function postToSheet(payload){
  const endpoint=getEndpoint();
  const body=new URLSearchParams();
  Object.entries(payload).forEach(([k,v])=>body.append(k,String(v??"")));

  // Apps Script não fornece cabeçalhos CORS configuráveis.
  // O modo no-cors permite gravar sem bloquear o navegador.
  await fetch(endpoint,{
    method:"POST",
    mode:"no-cors",
    headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},
    body
  });

  return {ok:true};
}

function loadJsonp(endpoint){
  return new Promise((resolve,reject)=>{
    const callbackName="enfasesCallback_"+Date.now()+"_"+Math.random().toString(36).slice(2);
    const script=document.createElement("script");
    const timeout=setTimeout(()=>{
      cleanup();
      reject(new Error("Tempo limite excedido ao consultar o Google Sheets."));
    },20000);

    function cleanup(){
      clearTimeout(timeout);
      script.remove();
      try{delete window[callbackName];}catch(_e){window[callbackName]=undefined;}
    }

    window[callbackName]=(payload)=>{
      cleanup();
      resolve(payload);
    };

    const url=new URL(endpoint);
    url.searchParams.set("action","list");
    url.searchParams.set("callback",callbackName);
    url.searchParams.set("_",Date.now());
    script.src=url.toString();
    script.onerror=()=>{
      cleanup();
      reject(new Error("Falha ao carregar os dados do Apps Script."));
    };
    document.head.appendChild(script);
  });
}

async function loadData(showFeedback=true){
  const endpoint=getEndpoint();
  $("refreshIcon").classList.add("spin");
  try{
    if(endpoint){
      const result=await loadJsonp(endpoint);
      const rows=Array.isArray(result)?result:result.data;
      if(!Array.isArray(rows)) throw new Error("Resposta inválida do Apps Script");
      records=rows.map(normalizeRecord);
      isConnected=true;
      localStorage.setItem("dashboardLocalData",JSON.stringify(records));
      if(showFeedback) showConnection("Conexão realizada. Dados carregados do Google Sheets.",true);
    }else{
      const cached=localStorage.getItem("dashboardLocalData");
      records=cached?JSON.parse(cached).map(normalizeRecord):createDemoRecords();
      isConnected=false;
    }
  }catch(error){
    console.error(error);
    const cached=localStorage.getItem("dashboardLocalData");
    records=cached?JSON.parse(cached).map(normalizeRecord):createDemoRecords();
    isConnected=false;
    if(showFeedback) showConnection("Falha na conexão. O painel está usando os dados locais.",false);
  }finally{
    $("refreshIcon").classList.remove("spin");
    setupFilters();
    render();
  }
}

function showConnection(message,ok){
  const el=$("connectionResult");
  el.textContent=message;
  el.className=`connection-result ${ok?"ok":"error"}`;
}

async function testAndSaveEndpoint(){
  const url=$("appsScriptUrl").value.trim();
  if(!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(url)){
    showConnection("Informe uma URL válida terminada em /exec.",false); return;
  }
  setEndpoint(url);
  await loadData(true);
}

function escapeHtml(value){
  return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);
}

document.addEventListener("DOMContentLoaded",async()=>{
  scaleStage();
  setupFilters();

  document.querySelectorAll(".area-pill").forEach(btn=>btn.addEventListener("click",()=>{
    currentArea=btn.dataset.area; selectedRequirementId=null; render();
  }));
  $("churchFilter").addEventListener("change",e=>{selectedChurch=e.target.value;selectedRequirementId=null;render();});
  $("yearFilter").addEventListener("change",e=>{selectedYear=e.target.value;selectedRequirementId=null;render();});
  $("refreshButton").addEventListener("click",()=>loadData(true));
  $("backToOverview").addEventListener("click",showOverview);
  $("statusFilter").addEventListener("change",e=>{selectedStatus=e.target.value;renderDetailWorkspace();});
  $("savePlanning").addEventListener("click",savePlanning);

  ["planningGoal","planningReached"].forEach(id=>$(id).addEventListener("input",()=>{
    const goal=Number($("planningGoal").value)||0;
    const reached=Number($("planningReached").value)||0;
    const p=goal?clamp(reached/goal*100):0;
    $("planningPercent").textContent=Math.round(p)+"%";
    $("planningProgress").style.width=p+"%";
    $("planningStatus").textContent=status(p);
  }));

  $("settingsButton").addEventListener("click",()=>{
    $("appsScriptUrl").value=getEndpoint();
    $("settingsModal").classList.add("open");
  });
  $("closeSettings").addEventListener("click",()=>$("settingsModal").classList.remove("open"));
  $("settingsModal").addEventListener("click",e=>{if(e.target===$("settingsModal"))$("settingsModal").classList.remove("open");});
  $("saveEndpoint").addEventListener("click",testAndSaveEndpoint);
  $("useLocalMode").addEventListener("click",()=>{
    localStorage.removeItem("appsScriptUrl");
    $("appsScriptUrl").value="";
    isConnected=false;
    records=createDemoRecords();
    localStorage.setItem("dashboardLocalData",JSON.stringify(records));
    showConnection("Modo demonstração ativado.",true);
    setupFilters();render();
  });

  $("closeModal").addEventListener("click",()=>$("detailModal").classList.remove("open"));
  $("detailModal").addEventListener("click",e=>{if(e.target===$("detailModal"))$("detailModal").classList.remove("open");});

  await loadData(false);
});
