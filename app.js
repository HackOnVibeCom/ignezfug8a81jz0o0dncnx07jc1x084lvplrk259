const people = [
  ['Анна Коваль','Продуктовый дизайнер','Дизайн','UX, Figma, исследования','Стартапы, фотография','Проектирую сервисы, которые легко освоить с первого экрана.','Atlas — дизайн сервиса городских маршрутов','story-3'],
  ['Максим Волков','Full-stack разработчик','Разработка','React, API, MVP, архитектура','Стартапы, автоматизация','Собираю MVP и помогаю командам быстрее выходить на рынок.','Relay — личный кабинет для малого бизнеса','story-2'],
  ['Лера Соколова','Бренд-стратег','Маркетинг','Брендинг, контент, стратегия','Фотография, образование','Помогаю найти язык бренда и запустить первые кампании.','Forma — позиционирование студии','story-1'],
  ['Артём Беляев','Юрист для бизнеса','Право','Договоры, лицензии, право','Технологии, предпринимательство','Готовлю договоры и проверяю риски при запуске продуктов.','Договорная база для маркетплейса',''],
  ['Мария Орлова','Бухгалтер','Финансы','Бухгалтерия, бюджет, налоги','Малый бизнес, автоматизация','Помогаю навести порядок в учёте и составить бюджет проекта.','Финансовый учёт для дизайн-студии',''],
  ['Илья Романов','Менеджер по продажам','Продажи','B2B, продажи, CRM, переговоры','Предпринимательство, технологии','Строю воронку продаж и веду переговоры с первыми клиентами.','Первые 20 клиентов B2B-сервиса',''],
  ['Нина Петрова','SMM-специалист','Маркетинг','SMM, соцсети, контент, Reels','Гастрономия, локальный бизнес','Веду соцсети локальных брендов и заведений.','Контент и запуск соцсетей для кафе','']
].map(([name,role,field,skills,interests,bio,work,img],id)=>({id,name,role,field,skills,interests,bio,work,img}));
const firstAdditionalId=people.length;
people.push(...additionalSpecialties.map(([name,role,field,skills,interests,bio,work,caseDetail],index)=>
  ({id:firstAdditionalId+index,name,role,field,skills,interests,bio,work,caseDetail})));
const sections = {people:['◎','Люди'], community:['▦','Комьюнити'], team:['✦','Подбор'], projects:['▤','Проекты'], chat:['◌','Чаты'], profile:['♙','Профиль']};
const topics = [
  {id:'design',name:'Дизайн и продукт',text:'Обсуждение исследований, интерфейсов и продуктовых кейсов.',seed:'Как вы проверяете идею продукта до первого релиза?'},
  {id:'startup',name:'Стартапы и бизнес',text:'Поиск сооснователей, обмен опытом и запуск проектов.',seed:'Поделитесь, на каком этапе ваш проект и кого вы ищете.'},
  {id:'operations',name:'Право и финансы',text:'Договоры, учёт и операционные вопросы команд.',seed:'Какие документы вы готовите перед запуском нового сервиса?'}
];
const defaultProfile = {name:'Ваш профиль',role:'',skills:'',interests:'',bio:'',work:''};
let data;
try { data = JSON.parse(localStorage.getItem('orbix-community-v1')); } catch {}
data ||= {profile:defaultProfile,projects:[],messages:{}};
data.profile = {...defaultProfile,...data.profile};
if (!data.profile.works && data.profile.work) data.profile.works = [{title:'Мои работы',description:data.profile.work}];
const save = () => localStorage.setItem('orbix-community-v1',JSON.stringify(data));
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parts = value => value.split(/[,\n]/).map(x=>x.trim()).filter(Boolean);
const tags = value => '<div class="tags">'+parts(value).map(x=>'<span class="tag">'+esc(x)+'</span>').join('')+'</div>';
const photo = name => 'assets/'+name+'.webp';
const avatar = p => '<span class="avatar">'+(p.img?'<img src="'+photo(p.img)+'" alt="">':esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join('')))+'</span>';
const button = (label, attributes, primary=false) => '<button class="btn'+(primary?' primary':'')+'" '+attributes+'>'+label+'</button>';
const content = document.querySelector('#content');
const dialog = document.querySelector('#dialog');
let submittedBrief='';
let page, filter='Все', query='', brief='', selected=[], recommended=[], analyzed=false, thread=null;
function open(title,html) {
  dialog.innerHTML='<div class="modal-top"><h2>'+esc(title)+'</h2>'+button('×','data-close aria-label="Закрыть"')+'</div>'+html;
  localize(dialog);
  if(!dialog.open) dialog.showModal();
}
function go(next) {
  if(dialog.open) dialog.close();
  if(location.hash!=='#'+next) location.hash=next;
  else render();
}
function card(p,score) {
  return '<article class="card"><div class="person">'+avatar(p)+'<div><h3>'+esc(p.name)+'</h3><small>'+esc(p.role)+'</small></div>'+(score===undefined?'':'<span class="score">'+score+'% совпадение</span>')+'</div><p>'+esc(p.bio)+'</p>'+tags(p.skills)+'<div class="actions">'+button('Портфолио','data-person="'+p.id+'"')+button('В команду','data-add="'+p.id+'"')+'</div></article>';
}
function renderPeople() {
  content.innerHTML=`<section class="hero"><div class="hero-copy"><h1>Найдите своих<br>людей для проекта</h1><p>Покажите свои работы, найдите людей по интересам и навыкам или соберите команду для проекта.</p>${button('✦ Подобрать команду','data-page="team"')}</div><div class="orbits" aria-hidden="true">${[['story-1','19%','13%','-14deg'],['story-2','8%','38%','13deg'],['story-3','21%','66%','-8deg']].map(([img,x,y,a])=>'<span style="--right:'+x+';--top:'+y+';--angle:'+a+'"><img src="'+photo(img)+'" alt=""></span>').join('')}</div></section>
  <div class="section-head"><h2>Люди сообщества</h2><input class="search" id="search" type="search" placeholder="Имя, профессия, навык или интерес" aria-label="Поиск специалистов" value="${esc(query)}"></div><div class="filters">${['Все',...new Set(people.map(p=>p.field))].map(x=>'<button class="chip'+(x===filter?' active':'')+'" data-filter="'+x+'" aria-pressed="'+(x===filter)+'">'+x+'</button>').join('')}</div><div class="grid" id="results" aria-live="polite"></div>`;
  updatePeople();
  document.querySelector('#search').addEventListener('input',e=>{query=e.target.value;updatePeople();});
}
function updatePeople() {
  const q=query.toLowerCase().trim();
  document.querySelector('#results').innerHTML=people.filter(p=>(filter==='Все'||p.field===filter)&&[p.name,p.role,p.field,p.skills,p.interests,p.work].join(' ').toLowerCase().includes(q)).map(p=>card(p)).join('')||'<p class="empty">Никого не нашли.</p>';
}
const signals = [
  /дизайн|интерфейс|ux|figma|прототип|исследован/iu,
  /разработ|сервис|приложен|код|mvp|api|react|сайт/iu,
  /маркетинг|бренд|продвиж|контент|стратег|кампан/iu,
  /юрист|договор|право|лиценз|риски|юрид/iu,
  /бухгалтер|финанс|уч[её]т|бюджет|налог/iu,
  /продаж|crm|b2b|клиент|переговор|воронк/iu,
  /smm|смм|соцсет|социальн.*сет/iu
];
signals.push(...additionalSpecialties.map(entry=>entry[8]));
const projectPlaybooks = [
  [/фаст[ -]?фуд|бургерн|кафе|кофейн|ресторан|шаурм|пиццер|общепит|точк[ау] питания/iu, [
    [firstAdditionalId+10,'Маркетолог','Поможет выбрать аудиторию, изучить соседние заведения и придумать предложение к открытию, чтобы привлечь первых гостей.'],
    [6,'SMM-специалист','Подготовит контент с меню и закулисьем, расскажет об открытии в соцсетях и будет отвечать на вопросы гостей.'],
    [3,'Юрист','Проверит договор аренды и подскажет, какие документы и требования к открытию нужно уточнить для вашего города.'],
    [4,'Бухгалтер','Поможет составить бюджет запуска, посчитать себестоимость блюд и настроить учёт расходов.']
  ]],
  [/интернет[ -]?магазин|маркетплейс|онлайн[ -]?магазин/iu, [
    [1,'Разработчик','Поможет запустить каталог, корзину и оформление заказов.'],
    [firstAdditionalId+10,'Маркетолог','Поможет сформулировать предложение и выбрать каналы для первых заказов.'],
    [3,'Юрист','Проверит условия продажи, возвратов и договоры с поставщиками.']
  ]],
  [/велосипед|веломагазин|велопрокат/iu, [
    [5,'Менеджер по продажам','Поможет выстроить консультации по выбору велосипеда, тестовые поездки и продажу аксессуаров.'],
    [firstAdditionalId+10,'Маркетолог','Изучит спрос в районе и предложит способы привлечь покупателей к открытию.'],
    [4,'Бухгалтер','Поможет посчитать бюджет закупки, маржу и расходы магазина.'],
    [3,'Юрист','Проверит договоры с поставщиками, аренду и условия возврата.']
  ]],
  [/магазин|розниц|торгов[а-яё]* точк/iu, [
    [5,'Менеджер по продажам','Поможет организовать консультации, обработку заказов и работу с покупателями.'],
    [firstAdditionalId+10,'Маркетолог','Поможет изучить спрос и выбрать каналы продвижения.'],
    [4,'Бухгалтер','Поможет оценить затраты на закупки и настроить учёт.']
  ]],
  [/стартап|мобильн[а-яё]* приложен|приложени|mvp|b2b[ -]?сервис/iu, [
    [0,'Продуктовый дизайнер','Проверит идею с будущими пользователями и соберёт прототип.'],
    [1,'Разработчик','Поможет выбрать функции для первой версии и собрать MVP.'],
    [5,'Специалист по продажам','Найдёт первых собеседников и поможет проверить, готовы ли клиенты платить.']
  ]]
];

function suggestedRoles(task) {
  if(!task.trim())return [];
  const contextual = projectPlaybooks.find(([pattern])=>pattern.test(task))?.[1] || [];
  const used = new Set(contextual.map(([id])=>id));
  const direct = people.filter(p=>!used.has(p.id)&&signals[p.id].test(task))
    .map(p=>[p.id,p.role,'Может взять на себя '+contributions[p.id]+'.']);
  if(contextual.length || direct.length)return [...contextual,...direct].slice(0,5);
  return [
    [firstAdditionalId+8,'Менеджер проектов','Поможет уточнить цель, разложить идею на первые задачи и понять, какие специалисты нужны дальше.'],
    [firstAdditionalId+10,'Маркетолог','Если проект рассчитан на клиентов, поможет проверить спрос и определить аудиторию.'],
    [4,'Бухгалтер','Если у проекта есть закупки или платные услуги, поможет оценить бюджет и расходы.']
  ];
}

function roleSuggestions(task) {
  const roles=suggestedRoles(task);
  if(!roles.length)return '';
  return '<section class="stack"><h2>Предварительная команда</h2><p class="muted">Предложенные роли можно убрать или заменить в составе команды.</p>'+roles.map(([id,title,benefit])=>
    '<article class="card"><h3>'+title+'</h3><p>'+benefit+'</p>'+button('Посмотреть специалиста','data-person="'+id+'"')+'</article>'
  ).join('')+'</section>';
}

function matches(p, task = brief) {
  const terms=new Set((task.toLowerCase().match(/[а-яёa-z0-9]{3,}/giu)||[]));
  const found=parts(p.skills).filter(skill=>skill.toLowerCase().split(/\s+/).some(word=>terms.has(word)));
  const suggested=suggestedRoles(task).find(([id])=>id===p.id);
  const role=signals[p.id].test(task) || Boolean(suggested);
  return {score:Math.min(96,(role?76:15)+found.length*5), reason:found.length?found.join(', '):suggested?suggested[1]:role?p.field:''};
}
const contributions = ['исследования, прототип и дизайн интерфейса','архитектуру, разработку и технический запуск','позиционирование, контент и продвижение','договоры, права и проверку юридических рисков','бюджет, учёт и налоговые вопросы','переговоры, воронку и первые продажи','контент, публикации и общение с аудиторией в соцсетях'];
contributions.push(...additionalSpecialties.map(entry=>entry[9]));
function renderTeam() {
  const ranked = recommended.map(p=>card(p,matches(p,submittedBrief).score)).join('');
  content.innerHTML=`<h1>Подбор команды</h1><p class="muted">Опишите проект и выберите до пяти участников для разбора.</p>
  <div class="split"><div class="stack"><section class="panel"><form id="match"><label>Задача проекта<textarea name="brief" maxlength="2000" required placeholder="Например, я открываю фастфуд">${esc(brief)}</textarea></label><div><button class="btn primary">✦ Найти специалистов</button></div></form></section>
  ${roleSuggestions(submittedBrief)}
  ${ranked?'<section class="stack"><h2>Рекомендации</h2><div class="notice">Демо-оценка по навыкам и предложенным ролям.</div>'+ranked+'</section>':''}</div>
  <section class="panel stack"><h2>Состав команды</h2><small>Выбрано ${selected.length} из 5</small><div class="team-roster">${[...people].sort((a,b)=>Number(selected.includes(b.id))-Number(selected.includes(a.id))).map(p=>'<label class="check"><input type="checkbox" data-select="'+p.id+'" '+(selected.includes(p.id)?'checked':selected.length===5?'disabled':'')+'>'+esc(p.name)+' · '+esc(p.field)+'</label>').join('')}</div>
  <div class="actions">${button('Разобрать вклад','data-analyze '+(!selected.length?'disabled':''),true)}${button('Создать проект','data-create '+(!selected.length?'disabled':''))}</div>
  ${analyzed?teamReport():''}</section></div>`;
}
function teamReport() {
  return '<div class="notice">Демонстрационный разбор по описанию задачи и ролям участников.</div>'+selected.map(id=>{
    const p=people[id], {reason}=matches(p);
    return '<div class="report"><h3>'+esc(p.name)+'</h3><p>Может взять на себя '+contributions[id]+'.</p><p class="muted">'+(brief.trim()?reason?'Роль пригодится для текущей задачи. Совпадение: '+esc(reason)+'.':'В описании проекта пока нет задач для этой роли. Уточните объём работ перед приглашением.':'Опишите проект, чтобы оценить необходимость этой роли.')+'</p></div>';
  }).join('');
}
function renderCommunity() {
  content.innerHTML='<h1>Комьюнити</h1><p class="muted">Обсуждения по интересам и профессиям.</p><div class="grid">'+topics.map(t=>'<article class="card"><h3>'+t.name+'</h3><p>'+t.text+'</p>'+button('Открыть обсуждение','data-thread="c:'+t.id+'"')+'</article>').join('')+'</div>';
}
function threadTitle(key) {
  const [type,id]=key.split(':');
  return type==='d'?people[Number(id)]?.name:type==='p'?data.projects.find(p=>p.id===id)?.name:topics.find(t=>t.id===id)?.name;
}
function renderChat() {
  const keys=[...new Set([...Object.keys(data.messages),...data.projects.map(p=>'p:'+p.id),...(thread?[thread]:[])])].filter(threadTitle);
  const topic=thread?.startsWith('c:')?topics.find(t=>'c:'+t.id===thread):null;
  content.innerHTML='<h1>Чаты</h1><div class="split"><section class="panel"><h3>Диалоги</h3>'+(keys.map(key=>'<button class="btn thread '+(key===thread?'primary':'')+'" data-thread="'+key+'">'+esc(threadTitle(key))+'</button>').join('')||'<p class="muted">Откройте портфолио, чтобы написать специалисту.</p>')+'</section><section class="panel">'+(thread&&threadTitle(thread)?'<div class="modal-top"><h2>'+esc(threadTitle(thread))+'</h2>'+(thread.startsWith('p:')?button('Видеозвонок','data-call'):'')+'</div><div class="messages" role="log" aria-live="polite">'+(topic?'<p class="notice">'+topic.seed+'</p>':'')+(data.messages[thread]||[]).map(m=>'<div class="bubble">'+esc(m)+'</div>').join('')+'</div><form id="message"><label>Сообщение<input name="message" maxlength="1000" required placeholder="Напишите сообщение"></label><div><button class="btn primary">Отправить</button></div></form>':'<p class="muted">Выберите диалог.</p>')+'</section></div>';
  const log=content.querySelector('.messages');if(log)log.scrollTop=log.scrollHeight;
}
function render() {
  const visitor=readProjectSnapshot();
  if(visitor){
    page='portfolio';
    document.querySelector('#crumb').textContent='Профиль / Проекты';
    content.innerHTML='<h1>'+esc(visitor.name)+'</h1><div class="section-head"><h2>Проекты</h2></div>'+projectCards(visitor.projects,true);
    return;
  }
  page=location.hash.slice(1);
  if(!Object.hasOwn(sections,page)) page='people';
  document.querySelector('#nav').innerHTML=Object.entries(sections).map(([key,[icon,label]])=>'<button data-page="'+key+'" '+(key===page?'aria-current="page"':'')+'><i aria-hidden="true">'+icon+'</i>'+label+'</button>').join('');
  document.querySelector('#crumb').textContent='Сообщество / '+sections[page][1];
  document.querySelector('#account-name').textContent=data.profile.name;
  ({people:renderPeople,team:renderTeam,community:renderCommunity,projects:renderProjects,chat:renderChat,profile:renderProfile})[page]();
}
document.addEventListener('click', e=>{
  const b=e.target.closest('button');if(!b)return;
  const d=b.dataset;
  if(d.page)go(d.page);
  if(d.filter){filter=d.filter;renderPeople();}
  if(d.close!==undefined)dialog.close();
  if(d.person!==undefined){
    const p=people[Number(d.person)];
    open(p.name,'<div class="person">'+avatar(p)+'<strong>'+p.role+'</strong></div><p>'+p.bio+'</p>'+tags(p.skills)+'<p><strong>Интересы</strong><br>'+p.interests+'</p><p><strong>Кейс</strong><br>'+esc(p.work)+'</p>'+(p.caseDetail?'<p>'+esc(p.caseDetail)+'</p>':'')+(p.img?'<img class="cover" src="'+photo(p.img)+'" alt="">':'')+'<div class="actions">'+button('Написать','data-thread="d:'+p.id+'"',true)+button('Разобрать сотрудничество','data-pair="'+p.id+'"')+button('В команду','data-add="'+p.id+'"')+'</div>');
  }
  if(d.pair!==undefined){
    const p=people[Number(d.pair)], own=data.profile;
    const shared=parts(own.interests).filter(i=>parts(p.interests).some(j=>i.toLowerCase()===j.toLowerCase()));
    open('Разбор сотрудничества','<p class="notice">Демонстрационный разбор профилей</p><p><strong>'+p.name+'</strong> может взять на себя '+contributions[p.id]+'.</p><p>'+(own.skills?'Вы можете внести навыки из своего профиля: '+esc(own.skills)+'.':'Укажите свои навыки в портфолио, чтобы увидеть ваш возможный вклад.')+'</p>'+(shared.length?'<p>Общие интересы: '+esc(shared.join(', '))+'.</p>':'')+'<p>Совместный сценарий: спланировать небольшой пилот, распределить задачи и проверить результат с первыми пользователями.</p>'+button('Написать','data-thread="d:'+p.id+'"',true));
  }
  if(d.add!==undefined){
    const id=Number(d.add);
    if(!selected.includes(id)&&selected.length>=5){open('Команда заполнена','<p>Можно выбрать до пяти участников.</p>');return;}
    if(!selected.includes(id))selected.push(id);
    analyzed=false;go('team');
  }
  if(d.analyze!==undefined){analyzed=true;renderTeam();}
  if(d.create!==undefined)showProjectForm();
  if(d.thread){thread=d.thread;go('chat');}
  if(d.call!==undefined){
    const id=thread.split(':')[1];
    const url='https://meet.jit.si/Orbix-'+encodeURIComponent(id);
    open('Командный созвон','<p>Откройте комнату проекта и отправьте ссылку участникам.</p><p><a class="btn primary" href="'+url+'" target="_blank" rel="noopener noreferrer">Открыть комнату Jitsi ↗</a></p><label>Ссылка для команды<input readonly value="'+url+'" onclick="this.select()"></label>');
  }
});
document.addEventListener('change', e=>{
  if(e.target.dataset.select===undefined)return;
  const id=Number(e.target.dataset.select);
  selected=e.target.checked?[...selected,id]:selected.filter(x=>x!==id);
  analyzed=false;renderTeam();
});
content.addEventListener('input',e=>{if(e.target.name==='brief')brief=e.target.value;});
document.addEventListener('submit', e=>{
  e.preventDefault();
  const form=e.target, values=Object.fromEntries(new FormData(form));
  if(form.id==='match'){
    brief=values.brief.trim();if(!brief)return;
    submittedBrief=brief;
    selected=suggestedRoles(brief).map(([id])=>id);
    analyzed=false;
    recommended=people.filter(p=>matches(p).reason).sort((a,b)=>matches(b).score-matches(a).score);
    renderTeam();
  }
  if(form.id==='profile'){
    const profile=readProfile(form);
    if(!profile.name){document.querySelector('#profile-status').textContent='Укажите имя';return;}
    data.profile=profile;save();
    document.querySelector('#account-name').textContent=profile.name;
    document.querySelector('#profile-status').textContent='Профиль сохранён';
  }
  if(form.id==='create'){
    const name=values.name.trim(), description=values.description.trim();
    const coverLinks=values.covers.split(/\r?\n/).map(link=>link.trim()).filter(Boolean);
    const covers=coverLinks.map(coverUrl).filter(Boolean);
    if(!name||!description||covers.length!==coverLinks.length||covers.length>4){
      form.querySelector('.project-status').textContent='Укажите название и описание. Добавьте до четырёх HTTPS-ссылок на изображения.';
      return;
    }
    const existing=data.projects[Number(form.dataset.edit)];
    if(existing) Object.assign(existing,{name,description,covers});
    else {
      const fromTeam=form.dataset.origin==='team';
      const id=crypto.randomUUID();
      data.projects.push({id,name,description,covers,brief:fromTeam?brief:description,members:fromTeam?[...selected]:[]});
      if(fromTeam)thread='p:'+id;
    }
    save();
    go(form.dataset.origin==='team'?'chat':'projects');
  }
  if(form.id==='message'&&values.message.trim()&&thread){
    (data.messages[thread]??=[]).push(values.message.trim());save();renderChat();
    document.querySelector('#message input').focus();
  }
});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
setupLanguage();
if(locale!=='ru'){
  const observer=new MutationObserver(()=>localize(document.body));
  observer.observe(document.body,{childList:true,subtree:true});
  localize(document.body);
}

render();
