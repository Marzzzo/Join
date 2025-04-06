const BASE_URL = 'https://join-418-default-rtdb.europe-west1.firebasedatabase.app/';

let contactOpen = false;

let currentPage = '';

const pageTitles = {
  add_task: 'Add Task',
  summary: 'Summary User',
  board: 'Board',
  contacts: 'Contacts',
  privacy_policy: 'Privacy Policy',
  legal_notice: 'Legal notice',
  help: 'Help',
};

async function initPages(page) {
  currentPage = page;
  toggleNavPrivacyByPage(page);
  if (page === 'summary') {
    initSummary();
  } else if (page === 'add_task') {
    initAddTask();
  } else if (page === 'board') {
    initBoard();
  } else if (page === 'contacts') {
    initContacts();
  }
}

function toggleNavPrivacyByPage(page) {
  const nav = document.getElementById('navPrivacy');
  if (!nav) return;
  const isDashboardPage = ['summary', 'add_task', 'board', 'contacts'].includes(page);
  const isSmallScreen = window.innerWidth < 1200;
  if (isDashboardPage && isSmallScreen) {
    nav.classList.add('d-none');
  } else {
    nav.classList.remove('d-none');
  }
}
window.onresize = () => toggleNavPrivacyByPage(currentPage);

async function loadPageContentPath(page) {
  let contentPages = document.getElementById('content');
  let content = await fetchContent(`${page}.html`);
  contentPages.innerHTML = content;
  initPages(page);
  toggleNavPrivacyByPage(page);
  changePageTitles(page);
  if (page === 'summary') {
    showUserWelcome();
  }
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

function showUserWelcome() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameUser = document.getElementById('welcomeUser');
  let welcomeUser = document.getElementById('welcomeMessage');
  nameUser.innerText = `${userData.name}`;
  welcomeUser.innerText = showDaytimeGreeting();
}

function showDaytimeGreeting() {
  let hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

function setActiveNav(clickedNav) {
  let navLinks = document.getElementsByClassName('nav');
  let policyLinks = document.getElementsByClassName('policy-content');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove('active');
    navLinks[i].style.pointerEvents = 'auto';
  }
  for (let i = 0; i < policyLinks.length; i++) {
    policyLinks[i].classList.remove('active');
    policyLinks[i].style.pointerEvents = 'auto';
  }
  clickedNav.classList.add('active');
  clickedNav.style.pointerEvents = 'none';
}

function overlayClick(event) {
  let overlayContent = document.getElementById('contactFloater');
  if (!overlayContent.contains(event.target)) {
    animateCloseContact();
  }
}

function getUserInitials() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameParts = userData.name.split(' ');
  let firstInitial = nameParts[0][0].toUpperCase();
  let lastInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : '';
  let initial = firstInitial + lastInitial;
  document.getElementById('userInitial').innerText = initial;
}

function openHelpPage() {
  sessionStorage.setItem('previousPage', currentPage);
  loadPageContentPath('help');
}

function arrowBackToPreviousPage() {
  const previousPage = sessionStorage.getItem('previousPage');
  if (previousPage) {
    loadPageContentPath(previousPage);
    sessionStorage.removeItem('previousPage');
  }
}
