const pageTitles = {
  add_task: 'Add Task',
  summary: 'Summary User',
  board: 'Board',
  contacts: 'Contacts',
  privacy_policy: 'Privacy Policy',
  legal_notice: 'Legal notice',
  help: 'Help',
};

async function loadPageContentPath(page) {
  let contentPages = document.getElementById('content');
  const content = await fetchContent(`${page}.html`);
  contentPages.innerHTML = content;
  changePageTitles(page);
  hideSubMenu();
}

async function fetchContent(page) {
  try {
    const response = await fetch(`../pages/${page}`);
    return await response.text();
  } catch (error) {
    console.error('Fehler beim Abrufen');
  }
}

function changePageTitles(page) {
  let changeTitles = pageTitles[page];
  document.title = changeTitles;
}

function openAddFloatingTask() {
  let addTask = document.getElementById('floatingAddTask');
  addTask.innerHTML = addTaskTemplate();
  document.body.style.overflow = 'hidden';
  addTask.classList.remove('slideOut');
  addTask.classList.add('slideIn');
  addTask.classList.remove('d-none');
  setTimeout(() => {
    addTask.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

function closeAddFloatingTask() {
  let floatingTask = document.getElementById('floatingAddTask');
  floatingTask.classList.remove('slideIn');
  floatingTask.classList.add('slideOut');
  floatingTask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    floatingTask.classList.add('d-none');
    floatingTask.innerHTML = '';
    document.body.style.overflow = '';
  }, 100);
}


function toggleSubMenu() {
  const submenu = document.getElementById('submenu');
  submenu.classList.toggle('d-none');
}


function hideSubMenu(){
  let submenu = document.getElementById('submenu');
  if (submenu) {
    submenu.classList.add('d-none');
  }
}


function addNewContact() {
  let addContactOverlay = document.getElementById('addContactOverlay');
  addContactOverlay.classList.remove = 'd-none';
  addContactOverlay.classList.add = 'overlay';

  addContactOverlay.innerHTML = generateFloaterHTML();

  document.getElementById('addCloseBtn').onclick = closeNewContact;
}

function closeNewContact(event) {
  let addContactOverlay = document.getElementById('addContactOverlay');

  addContactOverlay.classList.remove = 'overlay';
  addContactOverlay.classList.add = 'd-none';

  addContactOverlay.innerHTML = '';
}
