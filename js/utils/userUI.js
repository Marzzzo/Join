/**
 * Displays a personalized welcome message for the logged-in user.
 *
 * Retrieves the user data from local storage, sets the user's name
 * in the element with ID `welcomeUser`, and displays a dynamic greeting
 * (e.g., "Good morning") in the element with ID `welcomeMessage`.
 *
 * Relies on a `showDaytimeGreeting()` function to determine the greeting text.
 */
function showUserWelcome() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameUser = document.getElementById('welcomeUser');
  let welcomeUser = document.getElementById('welcomeMessage');
  nameUser.innerText = `${userData.name}`;
  welcomeUser.innerText = showDaytimeGreeting();
}

/**
 * Returns a greeting message based on the current time of day.
 *
 * - Morning: 05:00–11:59 → "Good Morning"
 * - Afternoon: 12:00–17:59 → "Good afternoon"
 * - Evening/Night: 18:00–04:59 → "Good evening"
 *
 * @returns {string} - A time-based greeting.
 */
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

/**
 * Extracts the initials from the logged-in user's name and displays them.
 *
 * Retrieves user data from local storage (`loggedInUser`),
 * extracts the first character of the first and (if available) last name,
 * then inserts the initials into the element with ID `userInitial`.
 *
 * Example: "Jane Doe" → "JD", "Alice" → "A"
 */
function getUserInitials() {
  let userData = JSON.parse(localStorage.getItem('loggedInUser'));
  let nameParts = userData.name.split(' ');
  let firstInitial = nameParts[0][0].toUpperCase();
  let lastInitial = nameParts.length > 1 ? nameParts[1][0].toUpperCase() : '';
  let initial = firstInitial + lastInitial;
  document.getElementById('userInitial').innerText = initial;
}

/**
 * Displays the responsive edit floater for a specific contact.
 *
 * Generates and injects the floater HTML into the command container,
 * hides the command image (if present), and animates the floater into view.
 * Also sets up a one-time outside click listener to close the floater when clicking outside.
 *
 * @param {string} contactId - The ID of the contact for which options should be shown.
 */
function showMoreOptions(contactId) {
  let respCmdContainer = document.getElementById('resp-cmd');
  let editFloaterHTML = generateRespEditFloaterHTML(contactId);
  respCmdContainer.innerHTML += editFloaterHTML;
  let img = document.getElementById('resp-cmd-img');
  if (img) img.classList.add('d-none');
  let floater = document.getElementById('respFloater');
  if (floater) {
    floater.classList.add('preSlideIn');
    setTimeout(() => {
      floater.classList.remove('preSlideIn');
      floater.classList.add('slideIn');
    }, 20);
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 50);
  }
}

/**
 * Opens the "Assigned To" dropdown in the task form and updates related UI elements.
 *
 * This includes:
 * - Updating the placeholder and arrow icon via `updateUIElements`
 * - Toggling the dropdown visibility via `toggleDropdown`
 * - Showing or hiding initials using `initialsShowOnAssinged`
 * - Adjusting the border color with `assignedBorderColor`
 */
function openDropdownAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const arrow = document.getElementById('arrowAssigned');
  updateUIElements(inputField, arrow, dropDownMenu);
  toggleDropdown(dropDownMenu);
  initialsShowOnAssinged(dropDownMenu);
  assignedBorderColor(dropDownMenu);
}

/**
 * Toggles the visibility of a dropdown menu and loads its content.
 *
 * Checks if the dropdown is currently hidden by inspecting the `drop-down-hide` class.
 * If hidden, it shows the dropdown using `showDropdown`; otherwise, it hides it using `hideDropdown`.
 * Also calls `getContacts` to ensure the dropdown is populated before showing.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to toggle.
 */
function toggleDropdown(dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  getContacts(dropDownMenu);
  isHidden ? showDropdown(dropDownMenu) : hideDropdown(dropDownMenu);
}

/**
 * Updates UI elements related to a dropdown's visibility state.
 *
 * - Rotates the dropdown arrow using `toggleArrowRotation`
 * - Updates the input field's placeholder using `updatePlaceholder`
 *
 * The changes depend on whether the dropdown is currently hidden.
 *
 * @param {HTMLInputElement} inputField - The input field associated with the dropdown.
 * @param {HTMLElement} arrow - The arrow icon indicating dropdown state.
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 */
function updateUIElements(inputField, arrow, dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  toggleArrowRotation(arrow, isHidden);
  updatePlaceholder(inputField, isHidden);
}

/**
 * Renders the user dropdown menu with a list of contacts.
 *
 * If no contact list is provided, it falls back to the global `formattedContactsArray`.
 * Clears the existing dropdown content, appends all contact elements via `addedContacts`,
 * and applies selection styles via `applySelectionStyles`.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to render into.
 * @param {Array<Object>} [contacts=formattedContactsArray] - An optional array of contact objects to display.
 */
function renderDropdownUser(dropDownMenu, contacts) {
  contacts = contacts || formattedContactsArray;
  dropDownMenu.innerHTML = '';
  addedContacts(dropDownMenu, contacts);
  applySelectionStyles(contacts);
}

/**
 * Renders the category dropdown menu if it hasn't been rendered already.
 *
 * Checks if the dropdown is empty (ignoring whitespace).
 * If empty, it fills the dropdown with content from `categoryTemplate()`.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element for categories.
 */
function renderDropdownMenuCategory(dropDownMenu) {
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
}

/**
 * Displays the contact information window and fills it with the specified contact.
 * @param {Object} contact - The contact object with the information.
 */
function showGlanceWindow(contact) {
  let glanceWindow = document.getElementById('cnt-glance-contact');
  glanceWindow.style.display = 'flex';
  glanceWindow.innerHTML = generateContactsInfoHTML(contact);
}

/**
 * Adjusts the layout depending on the window width.
 * @param {number} contactId - The ID of the contact for which the view is opened.
 */
function showResponsiveLayout(contactId) {
  let listDiv = document.getElementById('cnt-list-div');
  let mainDiv = document.getElementById('cnt-main-div');
  if (window.innerWidth < 1200) {
    listDiv.classList.add('hidden');
    listDiv.style.display = 'none';
    mainDiv.style.display = 'flex';
    updateRespCmd(contactId);
  } else {
    listDiv.classList.remove('hidden');
    listDiv.style.display = 'flex';
    mainDiv.style.display = 'flex';
  }
}

/**
 * Updates the responsive command icon (`resp-cmd-img`) and its behavior
 * based on the current window width.
 *
 * - On mobile screens (< 1200px), sets the icon to "more options" and calls `onclickShowMoreOptions`.
 * - On larger screens, sets the icon to "add contact" and calls `onclickShowAnimateContact`.
 *
 * @param {string} contactId - The ID of the contact the action should refer to.
 */
function updateRespCmd(contactId) {
  let respCmdImg = document.getElementById('resp-cmd-img');
  windowWidthMobiel = window.innerWidth < 1200;
  respCmdImg.onclick = null;
  if (windowWidthMobiel) {
    respCmdImg.src = '../assets/icons/more-resp-contact.svg';
    onclickShowMoreOptions(contactId);
  } else {
    respCmdImg.src = '../assets/icons/add-contact-mobile.svg';
    onclickShowAnimateContact(contactId);
  }
}

/**
 * Assigns a click handler to the responsive command container (`resp-cmd`)
 * that shows the "more options" floater for the specified contact.
 *
 * @param {string} contactId - The ID of the contact for which the options should be shown.
 */
function onclickShowMoreOptions(contactId) {
  let respCmd = document.getElementById('resp-cmd');
  respCmd.onclick = function () {
    showMoreOptions(contactId);
  };
}

/**
 * Assigns a click handler to the responsive command container (`resp-cmd`)
 * that triggers the animated contact overlay for the specified contact.
 *
 * @param {string} contactId - The ID of the contact to show in the animated overlay.
 */
function onclickShowAnimateContact(contactId) {
  let respCmd = document.getElementById('resp-cmd');
  respCmd.onclick = function () {
    showAnimateContact(contactId);
  };
}

/**
 * Switches the view back to the contact list and updates the responsive command icon.
 *
 * - Hides the main contact content (`cnt-main-div`)
 * - Shows the contact list container (`cnt-list-div`)
 * - Updates the responsive command icon to "add contact"
 * - Re-binds the click handler for opening the contact overlay
 *
 * Behavior is the same for both mobile and desktop view.
 */
function backToList() {
  let respCmdImg = document.getElementById('resp-cmd-img');

  document.getElementById('cnt-main-div').style.display = 'none';
  document.getElementById('cnt-list-div').classList.remove('hidden');
  document.getElementById('cnt-list-div').style.display = 'flex';

  respCmdImg.src = '../assets/icons/add-contact-mobile.svg';
  onclickShowAnimateContact();
}

/**
 * Removes the highlight class (`cnt-name-highlight`) from all contact elements.
 *
 * Iterates through the `contactsArray` and removes the highlight class
 * from each corresponding DOM element if it exists.
 */
function clearHighlightContact() {
  for (let contact of contactsArray) {
    let contactElement = document.getElementById(`contact-${contact.id}`);
    if (contactElement) contactElement.classList.remove('cnt-name-highlight');
  }
}

/**
 * Toggles the highlight class (`cnt-name-highlight`) for a specific contact element.
 *
 * If the contact is currently highlighted, the class will be removed.
 * If not, the class will be added.
 *
 * @param {string} contactId - The ID of the contact to highlight.
 */
function highlightContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  contactElement.classList.toggle('cnt-name-highlight');
}
