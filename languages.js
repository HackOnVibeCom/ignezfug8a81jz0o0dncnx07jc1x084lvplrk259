const languages = {ru:'Русский',en:'English',es:'Español',fr:'Français',ar:'العربية',zh:'简体中文'};
const rows = [
['Язык','Language','Idioma','Langue','اللغة','语言'],
['Люди','People','Personas','Personnes','الأشخاص','成员'],
['Комьюнити','Community','Comunidad','Communauté','المجتمع','社区'],
['Сообщество','Community','Comunidad','Communauté','المجتمع','社区'],
['Подбор','Matching','Selección','Sélection','المطابقة','人才匹配'],
['Проекты','Projects','Proyectos','Projets','المشاريع','项目'],
['Чаты','Chats','Chats','Discussions','المحادثات','聊天'],
['Профиль','Profile','Perfil','Profil','الملف الشخصي','个人资料'],
['Ваш профиль','Your profile','Tu perfil','Votre profil','ملفك الشخصي','你的资料'],
['Редактировать портфолио','Edit portfolio','Editar portafolio','Modifier le portfolio','تعديل معرض الأعمال','编辑作品集'],
['Подобрать команду','Find a team','Encontrar un equipo','Trouver une équipe','اعثر على فريق','寻找团队'],
['Найдите своих','Find the right','Encuentra a las','Trouvez les bonnes','اعثر على الأشخاص','寻找合适的'],
['людей для проекта','people for your project','personas para tu proyecto','personnes pour votre projet','لمشروعك','项目伙伴'],
['Покажите свои работы, найдите людей по интересам и навыкам или соберите команду для проекта.','Show your work, meet people by interests and skills, or build a project team.','Muestra tu trabajo, conoce personas por sus intereses y habilidades o forma un equipo.','Montrez vos réalisations, rencontrez des personnes ou formez une équipe.','اعرض أعمالك وتعرّف على أصحاب الاهتمامات والمهارات المشتركة أو كوّن فريقاً.','展示作品，按兴趣和技能寻找伙伴，或组建项目团队。'],
['Люди сообщества','Community members','Miembros de la comunidad','Membres de la communauté','أعضاء المجتمع','社区成员'],
['Имя, профессия, навык или интерес','Name, profession, skill or interest','Nombre, profesión, habilidad o interés','Nom, métier, compétence ou intérêt','الاسم أو المهنة أو المهارة أو الاهتمام','姓名、职业、技能或兴趣'],
['Поиск специалистов','Search specialists','Buscar especialistas','Rechercher des spécialistes','البحث عن متخصصين','搜索专业人士'],
['Все','All','Todos','Tous','الكل','全部'],
['Дизайн','Design','Diseño','Design','التصميم','设计'],
['Разработка','Development','Desarrollo','Développement','التطوير','开发'],
['Маркетинг','Marketing','Marketing','Marketing','التسويق','市场营销'],
['Право','Legal','Legal','Juridique','القانون','法律'],
['Финансы','Finance','Finanzas','Finance','المالية','财务'],
['Продажи','Sales','Ventas','Ventes','المبيعات','销售'],
['Ремонт и монтаж','Repairs and installation','Reparación e instalación','Réparation et installation','الإصلاح والتركيب','维修与安装'],
['Музыка и звук','Music and audio','Música y sonido','Musique et son','الموسيقى والصوت','音乐与音频'],
['Фото, видео и анимация','Photo, video and animation','Foto, vídeo y animación','Photo, vidéo et animation','التصوير والفيديو والرسوم المتحركة','摄影、视频和动画'],
['Управление','Management','Gestión','Gestion','الإدارة','管理'],
['Гастрономия','Food and hospitality','Gastronomía','Gastronomie','الضيافة والطعام','餐饮'],
['Языки и локализация','Languages and localization','Idiomas y localización','Langues et localisation','اللغات والتوطين','语言与本地化'],
['Архитектура и инженерия','Architecture and engineering','Arquitectura e ingeniería','Architecture et ingénierie','العمارة والهندسة','建筑与工程'],
['Логистика и закупки','Logistics and procurement','Logística y compras','Logistique et achats','الخدمات اللوجستية والمشتريات','物流与采购'],
['Портфолио','Portfolio','Portafolio','Portfolio','معرض الأعمال','作品集'],
['В команду','Add to team','Añadir al equipo','Ajouter à l’équipe','أضف إلى الفريق','加入团队'],
['Никого не нашли.','No matches found.','No hay resultados.','Aucun résultat.','لا توجد نتائج.','没有找到匹配成员。'],
['Подбор команды','Team matching','Selección de equipo','Sélection d’équipe','اختيار الفريق','团队匹配'],
['Опишите проект и выберите до пяти участников для разбора.','Describe your project and choose up to five members.','Describe tu proyecto y elige hasta cinco integrantes.','Décrivez votre projet et choisissez jusqu’à cinq membres.','صف مشروعك واختر ما يصل إلى خمسة أعضاء.','描述你的项目，最多选择五位成员。'],
['Задача проекта','Project brief','Descripción del proyecto','Description du projet','وصف المشروع','项目需求'],
['Например, я открываю фастфуд','For example, I’m opening a fast-food restaurant','Por ejemplo, voy a abrir un local de comida rápida','Par exemple, j’ouvre un restaurant rapide','مثلاً، أريد افتتاح مطعم وجبات سريعة','例如，我想开一家快餐店'],
['Найти специалистов','Find specialists','Buscar especialistas','Trouver des spécialistes','اعثر على متخصصين','寻找专业人士'],
['Предварительная команда','Suggested team','Equipo sugerido','Équipe proposée','الفريق المقترح','建议团队'],
['Предложенные роли можно убрать или заменить в составе команды.','You can remove or replace suggested members.','Puedes quitar o sustituir a los integrantes sugeridos.','Vous pouvez retirer ou remplacer les membres proposés.','يمكنك إزالة الأعضاء المقترحين أو استبدالهم.','可以删除或替换建议成员。'],
['Посмотреть специалиста','View specialist','Ver especialista','Voir le profil','عرض المتخصص','查看专家'],
['Рекомендации','Recommendations','Recomendaciones','Recommandations','التوصيات','推荐'],
['Состав команды','Team members','Integrantes del equipo','Membres de l’équipe','أعضاء الفريق','团队成员'],
['Разобрать вклад','Review contributions','Revisar aportaciones','Examiner les contributions','راجع المساهمات','分析贡献'],
['Создать проект','Create project','Crear proyecto','Créer un projet','أنشئ مشروعاً','创建项目'],
['Создать первый проект','Create your first project','Crea tu primer proyecto','Créer votre premier projet','أنشئ مشروعك الأول','创建第一个项目'],
['Всё начинается с проекта','It starts with a project','Todo empieza con un proyecto','Tout commence par un projet','كل شيء يبدأ بمشروع','从一个项目开始'],
['Добавьте название, описание и обложки.','Add a name, description and cover images.','Añade un nombre, una descripción e imágenes.','Ajoutez un nom, une description et des images.','أضف اسماً ووصفاً وصوراً.','添加名称、描述和封面。'],
['Новый проект','New project','Nuevo proyecto','Nouveau projet','مشروع جديد','新项目'],
['Название проекта','Project name','Nombre del proyecto','Nom du projet','اسم المشروع','项目名称'],
['Короткое описание','Short description','Descripción breve','Description courte','وصف مختصر','简短描述'],
['Ссылки на изображения','Image links','Enlaces de imágenes','Liens des images','روابط الصور','图片链接'],
['Сохранить','Save','Guardar','Enregistrer','احفظ','保存'],
['Проектов пока нет.','No projects yet.','Aún no hay proyectos.','Aucun projet pour le moment.','لا توجد مشاريع بعد.','暂无项目。'],
['Основное','Basics','Información básica','Informations générales','المعلومات الأساسية','基本信息'],
['Имя','Name','Nombre','Nom','الاسم','姓名'],
['Профессия или роль','Profession or role','Profesión o función','Métier ou rôle','المهنة أو الدور','职业或角色'],
['Город и страна','City and country','Ciudad y país','Ville et pays','المدينة والبلد','城市和国家'],
['О себе','About you','Sobre ti','À propos','نبذة عنك','个人简介'],
['Навыки','Skills','Habilidades','Compétences','المهارات','技能'],
['Знания','Knowledge','Conocimientos','Connaissances','المعارف','知识'],
['Интересы','Interests','Intereses','Centres d’intérêt','الاهتمامات','兴趣'],
['Работы','Work','Trabajos','Réalisations','الأعمال','作品'],
['Кейсы','Case studies','Casos prácticos','Études de cas','دراسات الحالة','案例'],
['Образование','Education','Educación','Formation','التعليم','教育'],
['Опыт работы','Work experience','Experiencia laboral','Expérience professionnelle','الخبرة العملية','工作经历'],
['Добавить работу','Add work','Añadir trabajo','Ajouter une réalisation','أضف عملاً','添加作品'],
['Добавить кейс','Add case study','Añadir caso','Ajouter une étude de cas','أضف دراسة حالة','添加案例'],
['Добавить образование','Add education','Añadir educación','Ajouter une formation','أضف مؤهلاً تعليمياً','添加教育经历'],
['Добавить компанию','Add company','Añadir empresa','Ajouter une entreprise','أضف شركة','添加公司'],
['Добавить проект','Add project','Añadir proyecto','Ajouter un projet','أضف مشروعاً','添加项目'],
['Скопировать ссылку на проекты','Copy project link','Copiar enlace de proyectos','Copier le lien des projets','انسخ رابط المشاريع','复制项目链接'],
['Сохранить профиль','Save profile','Guardar perfil','Enregistrer le profil','احفظ الملف الشخصي','保存资料'],
['Профиль сохранён','Profile saved','Perfil guardado','Profil enregistré','تم حفظ الملف الشخصي','资料已保存'],
['Предпросмотр','Preview','Vista previa','Aperçu','معاينة','预览'],
['Закрыть','Close','Cerrar','Fermer','أغلق','关闭'],
['Диалоги','Conversations','Conversaciones','Conversations','المحادثات','对话'],
['Выберите диалог.','Choose a conversation.','Elige una conversación.','Choisissez une conversation.','اختر محادثة.','请选择对话。'],
['Сообщение','Message','Mensaje','Message','رسالة','消息'],
['Напишите сообщение','Write a message','Escribe un mensaje','Écrivez un message','اكتب رسالة','输入消息'],
['Отправить','Send','Enviar','Envoyer','أرسل','发送'],
['Написать','Message','Escribir','Écrire','راسل','发送消息'],
['Командный чат','Team chat','Chat del equipo','Discussion d’équipe','محادثة الفريق','团队聊天'],
['Видеозвонок','Video call','Videollamada','Appel vidéo','مكالمة فيديو','视频通话'],
['Открыть обсуждение','Open discussion','Abrir debate','Ouvrir la discussion','افتح النقاش','打开讨论'],
['Название','Title','Título','Titre','العنوان','标题'],
['Описание','Description','Descripción','Description','الوصف','描述'],
['Ссылка','Link','Enlace','Lien','الرابط','链接'],
['Удалить запись','Remove entry','Eliminar entrada','Supprimer l’entrée','احذف الإدخال','删除条目']
];

const translations = new Map(rows.map(row=>[row[0],row]));
let locale = 'ru';
try {
  const saved = localStorage.getItem('commn-language');
  if(Object.hasOwn(languages,saved))locale=saved;
} catch {}

function translated(value) {
  const index=Object.keys(languages).indexOf(locale);
  if(!index)return value;
  const key=value.trim();
  const row=translations.get(key);
  if(row)return value.replace(key,row[index]);
  const prefix=key.match(/^[✦+▤]\s*/u)?.[0];
  if(prefix&&translations.has(key.slice(prefix.length)))return value.replace(key,prefix+translations.get(key.slice(prefix.length))[index]);
  if(key.includes(' / '))return key.split(' / ').map(translated).join(' / ');
  return value;
}

function localize(root) {
  if(locale==='ru')return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
    return node.parentElement.closest('script, style, textarea, [data-content], .bubble, .project-tile p, .project-tile h3')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;
  }});
  while(walker.nextNode()){
    const node=walker.currentNode;
    const value=translated(node.nodeValue);
    if(value!==node.nodeValue)node.nodeValue=value;
  }
  for(const element of root.querySelectorAll('[aria-label], [placeholder]')){
    for(const name of ['aria-label','placeholder']){
      if(element.hasAttribute(name))element.setAttribute(name,translated(element.getAttribute(name)));
    }
  }
}

function setupLanguage() {
  const select=document.querySelector('#language');
  select.innerHTML=Object.entries(languages).map(([code,label])=>'<option value="'+code+'" lang="'+code+'">'+label+'</option>').join('');
  select.value=locale;
  document.documentElement.lang=locale;
  document.documentElement.dir=locale==='ar'?'rtl':'ltr';
  select.setAttribute('aria-label',translated('Язык'));
  select.addEventListener('change',()=>{
    try { localStorage.setItem('commn-language',select.value); } catch {}
    location.reload();
  });
}
