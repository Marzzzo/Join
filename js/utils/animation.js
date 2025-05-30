/**
 * Displays the animated contact overlay depending on screen width.
 */
function showAnimateContact() {
  let overlay = document.getElementById('addContactOverlay');
  overlay.classList.remove('slideOut', 'slideOutVertical');
  windowWidthOption = window.innerWidth >= 1200;
  if (windowWidthOption) {
    animateContactDesktop();
  } else {
    animateContactMobile();
  }
}

/**
 * Animates the contact overlay for desktop view.
 */
function animateContactDesktop() {
  let addContact = document.getElementById('addContactOverlay');
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = 'hidden';
  addContact.classList.remove('d-none');
  addContact.classList.add('slideIn');
  setTimeout(() => {
    addContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 100);
}

/**
 * Animates the contact overlay for mobile view.
 */
function animateContactMobile() {
  let addContact = document.getElementById('addContactOverlay');
  addContact.innerHTML = generateFloaterHTML();
  document.body.style.overflow = 'hidden';
  addContact.classList.remove('d-none');
  addContact.classList.add('slideInVertical');
  setTimeout(() => {
    addContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 100);
}

/**
 * Animates closing the contact overlay in desktop view.
 */
function animateCloseContactDesktop() {
  let closeFloater = document.getElementById('addContactOverlay');
  closeFloater.classList.remove('slideIn');
  closeFloater.classList.add('slideOut');
  closeFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeFloater.classList.add('d-none');
    closeFloater.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
}

/**
 * Animates closing the contact overlay in mobile view.
 */
function animateCloseContactMobile() {
  let closeFloater = document.getElementById('addContactOverlay');
  closeFloater.classList.remove('slideInVertical');
  closeFloater.classList.add('slideOutVertical');
  closeFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeFloater.classList.add('d-none');
    closeFloater.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
}

/**
 * Closes the contact overlay with animation depending on screen width.
 */
function animateCloseContact() {
  if (window.innerWidth >= 1200) {
    animateCloseContactDesktop();
  } else {
    animateCloseContactMobile();
  }
}

/**
 * Displays a temporary "Task Added" message.
 */
function messageTaskAdded() {
  let msg = document.getElementById('overlayTaskAdded');
  if (!msg) return;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 1300);
}

function switchJoinLogoOnMobile() {
  const joinLogoMobile = document.querySelector('.start-join-logo img');
  if (joinLogoMobile && window.innerWidth <= 600) {
    joinLogoMobile.src = './assets/img/join.svg';
    setTimeout(() => {
      joinLogoMobile.src = './assets/img/join_login.svg';
    }, 800);
  }
}

/**
 * Displays field validation errors for task input fields.
 */
function showFieldErrors() {
  const messages = document.getElementsByClassName('error-message');
  const requirements = [document.getElementById('addTaskTitle'), document.getElementById('inputDate'), document.getElementById('categoryDropDown')];
  for (const message of messages) {
    message.innerText = 'This field is required';
    message.style.display = 'block';
  }
  for (const required of requirements) {
    required.style.borderColor = '#FF001F';
  }
}

/**
 * Clears field validation errors and resets styles.
 */
function clearFieldErrors() {
  const messages = document.getElementsByClassName('error-message');
  const requirements = [document.getElementById('addTaskTitle'), document.getElementById('inputDate'), document.getElementById('categoryDropDown')];
  for (const message of messages) {
    message.innerText = '';
    message.style.display = 'none';
  }
  for (const required of requirements) {
    required.style.borderColor = '';
  }
}

/**
 * Opens the category dropdown and toggles its visibility.
 */
function openDropdownCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const arrow = document.getElementById('arrowCategory');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  toggleArrowRotation(arrow, isHidden);
  renderDropdownMenuCategory(dropDownMenu);
  if (isHidden) {
    dropDownMenu.style.scrollbarWidth = 'none';
    showDropdown(dropDownMenu);
    closeOnClickOutsideCategory('dropDownMenuCategory', 'categoryDropDown');
  } else {
    hideDropdown(dropDownMenu);
  }
}

function closeOnClickOutsideCategory(dropdownId, triggerId) {
  window.onclick = function (event) {
    const dropDownMenu = document.getElementById(dropdownId);
    const inputField = document.getElementById(triggerId);
    const arrow = document.getElementById('arrowCategory');
    if (!dropDownMenu || !inputField) return;
    const isVisible = !dropDownMenu.classList.contains('drop-down-hide');
    if (!isVisible) return;
    const clickedOutside = !dropDownMenu.contains(event.target) && !inputField.contains(event.target);
    if (clickedOutside) {
      updateUIElements(inputField, arrow, dropDownMenu);
      hideDropdown(dropDownMenu);
      closeOnClickOutsideAssigned('dropDownMenuAssigned', 'addTaskAssigned');
    }
  };
}

/**
 * Selects a category and updates the dropdown display.
 * @param {string} category - The selected category.
 * @param {Event} [event] - The event triggering the selection (optional).
 */
function selectCategory(category, event) {
  if (event) {
    event.stopPropagation();
  }
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const selectedCategory = document.getElementById('selectedCategory');
  const arrow = document.getElementById('arrowCategory');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  hideDropdown(dropDownMenu);
  toggleArrowRotation(arrow, isHidden);
  if (selectedCategory) {
    selectedCategory.innerText = category;
    const message = document.getElementById('categoryMessage');
    const categoryContainer = document.getElementById('categoryDropDown');
    hideError(categoryContainer, message);
  }
  selectedCategoryValue = category;
}

/**
 * Opens the input for adding subtasks and shows relevant icons.
 */
function openSubtaskInput() {
  let inputField = document.getElementById('addTaskSubtasks');
  let plusIcon = document.getElementById('plusIcon');
  let otherIcons = document.getElementById('otherIcons');
  let container = document.getElementById('inputContainer');
  container.classList.add('active');
  plusIcon.classList.add('d-none');
  otherIcons.classList.remove('d-none');
  inputField.placeholder = '';
}

/**
 * Closes the subtask input field and resets it.
 * @param {Event} event - The triggering event, used to stop propagation.
 */
function closeSubtaskInput(event) {
  event.stopPropagation();
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  plusIcon.classList.remove('d-none');
  otherIcons.classList.add('d-none');
  inputField.placeholder = 'Add new subtask';
  resetSubtaskInput(event);
}

/**
 * Opens the detailed board card view for the specified task.
 *
 * @param {string} id - The unique ID of the task to display.
 *
 * - Loads task data, subtasks, and assigned names from `taskDataMap`.
 * - Renders the task card template into the board card container.
 * - Disables page scrolling and triggers the slide-in animation.
 * - Applies a background overlay after a short delay.
 */
function openBoardCard(id) {
  let { task, subtaskHTML, namesHTML } = taskDataMap[id];
  addSubtask = [...(task.subtasks || '')];
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.innerHTML = boardCardTemplate(task, subtaskHTML, namesHTML);
  document.body.style.overflow = 'hidden';
  boardCard.classList.remove('slideOut');
  boardCard.classList.add('slideIn');
  setTimeout(() => {
    boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

/**
 * Closes the currently open task card view on the board.
 *
 * - Animates the closing of the large board card.
 * - Clears its content and restores page scroll behavior.
 * - Resets the selected priority value.
 */
function closeTaskCard() {
  let boardCard = document.getElementById('boardCardLarge');
  boardCard.classList.remove('slideIn');
  boardCard.classList.add('slideOut');
  boardCard.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    boardCard.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
  selectedPriorityValue = '';
}

/**
 * Displays a welcome overlay with animation on smaller screens.
 */
function welcomeOverlayOnStart() {
  const overlay = document.getElementById('welcomeOverlay');
  if (window.innerWidth < 1200) {
    overlay.style.display = 'flex';
    overlay.classList.add('fade-smart-out');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 3000);
  }
}

/**
 * Checks session storage to show welcome overlay once per session.
 */
function checkLoginWelcome() {
  if (sessionStorage.getItem('showWelcome') === 'true') {
    sessionStorage.removeItem('showWelcome');
    welcomeOverlayOnStart();
  }
}

/**
 * Handles responsive behavior of the welcome overlay on window resize.
 */
window.addEventListener('resize', () => {
  const welcomeDiv = document.getElementById('welcomeOverlay');
  if (window.innerWidth >= 1200) {
    if (welcomeDiv) welcomeDiv.style.display = 'flex';
  }
  if (window.innerWidth < 1200) {
    if (welcomeDiv) welcomeDiv.style.display = 'none';
  }
});

/**
 * Animates the success message container by fading it in and out.
 * @param {HTMLElement} successMessageContainer - The element containing the success message.
 */
function animateSuccessMessage(successMessageContainer) {
  if (window.innerWidth >= 1200) {
    cntDesktopSuccessMessage(successMessageContainer);
  } else {
    cntMobilSuccessMessage(successMessageContainer);
  }
}

function cntDesktopSuccessMessage(successMessageContainer) {
  let successFloater = document.getElementById('successMessage');
  successFloater.classList.remove('cnt-hide');
  successFloater.classList.add('cnt-show');
  setTimeout(() => {
    successFloater.classList.remove('cnt-show');
    successFloater.classList.add('cnt-hide');
    setTimeout(() => {
      successMessageContainer.parentNode.removeChild(successMessageContainer);
    }, 500);
  }, 3000);
}

function cntMobilSuccessMessage(successMessageContainer) {
  let successFloater = document.getElementById('successMessage');
  successFloater.classList.remove('cnt-hide');
  successFloater.classList.add('slide-in-Vertical');
  setTimeout(() => {
    successFloater.classList.remove('slide-in-Vertical');
    successFloater.classList.add('slide-out-vertical');
    setTimeout(() => {
      successMessageContainer.parentNode.removeChild(successMessageContainer);
    }, 500);
  }, 3000);
}

/**
 * Shows the success message inside the contact content area.
 */
function showSuccessMessage() {
  let successFloaterHTML = generateSuccessFloaterHTML();
  let successMessageContainer = document.createElement('div');
  successMessageContainer.id = 'successMessageContainer';
  document.getElementById('contactContent').appendChild(successMessageContainer);
  successMessageContainer.innerHTML = successFloaterHTML;
  animateSuccessMessage(successMessageContainer);
}
