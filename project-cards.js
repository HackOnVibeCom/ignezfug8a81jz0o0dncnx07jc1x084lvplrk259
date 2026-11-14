const defaultCovers = ['assets/story-2.webp','assets/story-3.webp','assets/gallery.webp','assets/story-1.webp'];

function coverUrl(value) {
  if(typeof value!=='string') return '';
  if(defaultCovers.includes(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol==='https:' ? url.href : '';
  } catch { return ''; }
}

function coverStrip(project) {
  const covers = Array.isArray(project.covers) ? project.covers.map(coverUrl).filter(Boolean).slice(0,4) : [];
  const images = covers.length ? covers : defaultCovers;
  return Array.from({length:4},(_,index)=>'<img src="'+esc(images[index%images.length])+'" alt="" loading="lazy">').join('');
}

function projectCards(projects, visitor=false) {
  if(!projects.length) return '<p class="muted">Проектов пока нет.</p>';
  return '<div class="project-grid">'+projects.map((project,index)=>`
    <article class="project-tile">
      <button class="project-cover" data-project-index="${index}" ${visitor?'data-visitor-project':''} aria-label="Открыть проект ${esc(project.name)}">
        <span class="cover-strip">${coverStrip(project)}</span><span class="cover-glass"><span aria-hidden="true">+</span></span>
      </button>
      <h3>${esc(project.name)}</h3>
      <p>${esc(project.description || project.brief || '')}</p>
    </article>`).join('')+'</div>';
}

function renderProjects() {
  content.innerHTML='<div class="section-head project-heading"><h1>Проекты</h1>'+
    (data.projects.length?button('+ Новый проект','data-create',true):'')+'</div>'+
    (data.projects.length?projectCards(data.projects):`
      <section class="project-empty">
        <div class="cover-stack" aria-hidden="true">${defaultCovers.slice(0,3).map(src=>'<img src="'+src+'" alt="">').join('')}</div>
        <h2>Всё начинается с проекта</h2>
        <p>Добавьте название, описание и обложки.</p>
        ${button('Создать первый проект','data-create',true)}
      </section>`);
}

function showProjectForm(editIndex) {
  const project = editIndex===undefined ? null : data.projects[editIndex];
  const fromTeam = page==='team' && !project;
  const images = project?.covers || [];
  open(project?'Редактировать проект':'Новый проект',`
    <form id="create" data-origin="${fromTeam?'team':'projects'}" ${project?'data-edit="'+editIndex+'"':''}>
      <div class="cover-stack form-stack" aria-hidden="true">${defaultCovers.slice(0,3).map(src=>'<img src="'+src+'" alt="">').join('')}</div>
      <label>Название проекта<input name="name" maxlength="80" value="${esc(project?.name)}" required></label>
      <label>Короткое описание<textarea name="description" maxlength="240" required>${esc(project?.description || (project?.brief || (fromTeam?brief:'' )).slice(0,240))}</textarea></label>
      <label>Ссылки на изображения<textarea name="covers" maxlength="2000" placeholder="До четырёх HTTPS-ссылок, каждая с новой строки">${esc(images.join('\n'))}</textarea></label>
      <p class="muted cover-hint">Если оставить ссылки пустыми, появятся демонстрационные обложки.</p>
      <div role="status" class="project-status"></div>
      <div><button class="btn primary">${project?'Сохранить':fromTeam?'Создать и открыть чат':'Создать проект'}</button></div>
    </form>`);
}

function projectSnapshot(profile) {
  return {
    name:profile.name,
    projects:data.projects.map(({name,description,brief,covers})=>({name,description:description || (brief||'').slice(0,240),covers:covers||[]}))
  };
}

function readProjectSnapshot() {
  const hash = location.hash;
  if(!hash.startsWith('#portfolio='))return null;
  try {
    const snapshot=JSON.parse(decodeURIComponent(hash.slice('#portfolio='.length)));
    if(typeof snapshot.name!=='string'||!Array.isArray(snapshot.projects))return null;
    return {name:snapshot.name,projects:snapshot.projects.filter(project=>project&&typeof project.name==='string'&&typeof project.description==='string')};
  } catch { return null; }
}

document.addEventListener('click',async event=>{
  const control=event.target.closest('button');
  if(!control)return;
  if(control.hasAttribute('data-copy-portfolio')){
    const status=content.querySelector('#portfolio-link-status');
    const url=new URL(location.href);
    url.hash='portfolio='+encodeURIComponent(JSON.stringify(projectSnapshot(data.profile)));
    const field=content.querySelector('#portfolio-link');
    field.value=url.href;
    field.hidden=false;
    try {
      await navigator.clipboard.writeText(url.href);
      status.textContent='Ссылка скопирована. Она содержит текущие карточки проектов.';
    } catch {
      field.focus();
      field.select();
      status.textContent='Скопируйте ссылку из поля.';
    }
  }
  if(control.dataset.projectIndex!==undefined){
    const index=Number(control.dataset.projectIndex);
    const visitor=control.hasAttribute('data-visitor-project');
    const project=(visitor?readProjectSnapshot()?.projects:data.projects)?.[index];
    if(!project)return;
    open(project.name,'<div class="project-detail-images">'+coverStrip(project)+'</div><p>'+esc(project.description||project.brief||'')+'</p>'+
      (visitor?'':'<div class="actions">'+button('Редактировать','data-edit-project="'+index+'"')+button('Командный чат','data-thread="p:'+project.id+'"')+'</div>'));
  }
  if(control.dataset.editProject!==undefined)showProjectForm(Number(control.dataset.editProject));
});
