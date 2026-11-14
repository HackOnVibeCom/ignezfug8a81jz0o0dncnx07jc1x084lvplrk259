const profileFields = [
  ['name', 'Имя', 'Ваше имя'], ['role', 'Профессия или роль', 'Чем вы занимаетесь'],
  ['location', 'Город и страна', 'Например, Баку, Азербайджан'],
  ['bio', 'О себе', 'Какие проекты вам интересны', true],
  ['skills', 'Навыки', 'Например, Figma, переговоры'],
  ['knowledge', 'Знания', 'Например, финансы, продуктовая аналитика'],
  ['interests', 'Интересы', 'Например, фотография, стартапы']
];

const portfolioSections = {
  works: ['Работы', 'Добавить работу', [['title','Название'],['description','Описание'],['url','Ссылка']]],
  cases: ['Кейсы', 'Добавить кейс', [['title','Название'],['task','Задача'],['contribution','Ваш вклад'],['result','Результат'],['url','Ссылка']]],
  education: ['Образование', 'Добавить образование', [['title','Учебное заведение'],['program','Программа или специальность'],['period','Период']]],
  experience: ['Опыт работы', 'Добавить компанию', [['title','Компания'],['position','Должность'],['period','Период'],['description','Обязанности и достижения']]]
};

function portfolioRow(section, entry = {}) {
  return '<fieldset class="entry"><legend>'+portfolioSections[section][0]+'</legend>'+
    portfolioSections[section][2].map(([key,label])=>{
      const name=section+'.'+key;
      const value=esc(entry[key]);
      return '<label>'+label+(key==='description'||key==='task'||key==='contribution'||key==='result'
        ? '<textarea name="'+name+'" maxlength="2000">'+value+'</textarea>'
        : '<input name="'+name+'" maxlength="500" value="'+value+'">')+'</label>';
    }).join('')+button('Удалить запись','type="button" data-remove-entry')+'</fieldset>';
}

function renderProfile() {
  const profile=data.profile;
  content.innerHTML='<h1>Ваш профиль</h1><p class="muted">Расскажите о себе, покажите работы и опыт. Профиль можно заполнить в любой профессиональной роли.</p>'+
    '<section class="panel stack profile-projects"><div class="actions"><h2>Проекты</h2>'+button('+ Добавить проект','data-create')+button('Скопировать ссылку на проекты','data-copy-portfolio')+'</div>'+projectCards(data.projects)+'<input id="portfolio-link" aria-label="Ссылка на проекты" readonly hidden><small id="portfolio-link-status" role="status"></small></section>'+
    '<form id="profile"><section class="panel stack"><h2>Основное</h2><div class="profile-fields">'+profileFields.map(([key,label,hint,multiline])=>{
      const value=esc(profile[key]);
      return '<label>'+label+(multiline
        ? '<textarea name="'+key+'" maxlength="2000" placeholder="'+hint+'">'+value+'</textarea>'
        : '<input name="'+key+'" maxlength="250" placeholder="'+hint+'" value="'+value+'" '+(key==='name'?'required':'')+'>')+'</label>';
    }).join('')+'</div></section>'+
    Object.entries(portfolioSections).map(([key,[title,action]])=>
      '<section class="panel stack"><h2>'+title+'</h2><div class="stack" data-entries="'+key+'">'+(profile[key]||[]).map(entry=>portfolioRow(key,entry)).join('')+'</div><div>'+button(action,'type="button" data-add-entry="'+key+'"')+'</div></section>'
    ).join('')+
    '<div class="actions"><button class="btn primary">Сохранить профиль</button>'+button('Предпросмотр','type="button" data-preview-profile')+'</div><div role="status" id="profile-status"></div></form>';
}

function readProfile(form) {
  const values=new FormData(form);
  const profile=Object.fromEntries(profileFields.map(([key])=>[key,String(values.get(key)||'').trim()]));
  for (const [section,[,,fields]] of Object.entries(portfolioSections)) {
    profile[section]=[...form.querySelectorAll('[data-entries="'+section+'"] .entry')].map(row=>
      Object.fromEntries(fields.map(([key])=>[key,row.querySelector('[name="'+section+'.'+key+'"]').value.trim()]))
    ).filter(entry=>Object.values(entry).some(Boolean));
  }
  return profile;
}

function portfolioLink(value) {
  try {
    const url=new URL(value);
    if (url.protocol==='https:'||url.protocol==='http:') return '<a href="'+esc(url.href)+'" target="_blank" rel="noopener noreferrer">'+esc(value)+'</a>';
  } catch {}
  return esc(value);
}

function previewPortfolio(profile) {
  const basic=profileFields.slice(1).filter(([key])=>profile[key]).map(([key,label])=>'<div><strong>'+label+'</strong><p>'+esc(profile[key])+'</p></div>').join('');
  const details=Object.entries(portfolioSections).map(([section,[title,,fields]])=>{
    const entries=profile[section];
    if(!entries.length)return '';
    return '<section><h3>'+title+'</h3>'+entries.map(entry=>'<article class="report">'+(entry.title?'<strong>'+esc(entry.title)+'</strong>':'')+fields.slice(1).filter(([key])=>entry[key]).map(([key,label])=>'<p><strong>'+label+'</strong><br>'+(key==='url'?portfolioLink(entry[key]):esc(entry[key]))+'</p>').join('')+'</article>').join('')+'</section>';
  }).join('');
  open(profile.name||'Ваш профиль','<div class="stack portfolio-preview">'+(basic+details||'<p class="muted">Заполните профиль, чтобы показать своё портфолио.</p>')+'</div>');
}

document.addEventListener('click', event=>{
  const control=event.target.closest('button');
  if(!control)return;
  const {addEntry,removeEntry,previewProfile}=control.dataset;
  if(addEntry){
    const container=control.closest('section').querySelector('[data-entries]');
    container.insertAdjacentHTML('beforeend',portfolioRow(addEntry));
    container.lastElementChild.querySelector('input').focus();
  }
  if(removeEntry!==undefined){
    const entry=control.closest('.entry');
    const next=entry.nextElementSibling?.querySelector('input')||entry.closest('section').querySelector('[data-add-entry]');
    entry.remove();
    next.focus();
  }
  if(previewProfile!==undefined)previewPortfolio(readProfile(document.querySelector('#profile')));
});
