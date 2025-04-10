/**
 * Generates a unique task ID using the current timestamp and a random number.
 * Format: "task-{timestamp}-{randomNumber}"
 *
 * @returns {string} - A unique task ID string.
 */
function generateUniqueId() {
  return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/**
 * Checks whether a specific checkbox (by type) is currently checked.
 *
 * @param {string} type - The type of checkbox to check ("signup" or "remember").
 * @returns {boolean} - `true` if the checkbox is checked, otherwise `false`.
 */
function isCheckboxChecked(type) {
  if (type === 'signup') {
    return document.getElementById('checkboxSignup').checked;
  }
  if (type === 'remember') {
    return document.getElementById('rememberMe').checked;
  }
}

/**
 * Toggles the arrow rotation based on dropdown visibility.
 *
 * Adds or removes CSS classes to visually indicate whether the dropdown is open or closed.
 *
 * @param {HTMLElement} arrow - The arrow element to rotate.
 * @param {boolean} isHidden - Whether the dropdown is currently hidden.
 */
function toggleArrowRotation(arrow, isHidden) {
  if (arrow) {
    arrow.classList.toggle('rotate-arrow', isHidden);
    arrow.classList.toggle('rotate-arrow-0', !isHidden);
  }
}

/**
 * Updates the placeholder and value of an input field based on visibility state.
 *
 * If the dropdown is visible (`isHidden` is false), the placeholder is cleared.
 * If the dropdown is hidden (`isHidden` is true), a default placeholder is shown and the value is cleared.
 *
 * @param {HTMLInputElement} inputField - The input field to update.
 * @param {boolean} isHidden - Whether the related dropdown is currently hidden.
 */
function updatePlaceholder(inputField, isHidden) {
  if (inputField) {
    inputField.placeholder = !isHidden ? '' : 'Select contacts to assign';
    inputField.value = isHidden ? '' : inputField.value;
  }
}

/**
 * Prevents the form with ID `addTaskForm` from being submitted
 * when the Enter key is pressed inside any non-submit input field.
 *
 * Useful for avoiding accidental submissions during task creation.
 */
function preventFormSubmitOnEnter() {
  let form = document.getElementById('addTaskForm');
  if (!form) {
    return;
  }
  let inputs = form.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && inputs[i].type !== 'submit') {
        a
        event.preventDefault();
      }
    });
  }
}

/**
 * Toggles the `input-focus` class on the grandparent container of the given input element.
 * 
 * This is typically used for input fields wrapped inside an additional outer container,
 * like in password inputs with a `.input-border` wrapper.
 *
 * @param {HTMLElement} inputElement - The input element triggering the focus or blur event.
 * @param {boolean} isFocused - `true` if the input is focused, `false` if blurred.
 */
function toggleRequiredInput(inputElement, isFocused) {
  let border = inputElement.parentElement.parentElement;
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}

/**
 * Toggles the `input-focus` class on the direct parent container of the given input element.
 * 
 * This is used for simpler input structures where no additional wrapper exists,
 * like contact inputs directly inside `.input-div`.
 *
 * @param {HTMLElement} inputElement - The input element triggering the focus or blur event.
 * @param {boolean} isFocused - `true` if the input is focused, `false` if blurred.
 */
function toggleRequiredInputContact(inputElement, isFocused) {
  let border = inputElement.parentElement;
  if (border) {
    border.classList.toggle('input-focus', isFocused);
  }
}


/**
 * Disables the signup button and returns the button element.
 *
 * Targets the button with ID `buttonSignup`, sets `disabled` to `true`,
 * and returns the DOM element for further use if needed.
 *
 * @returns {HTMLButtonElement|null} - The disabled button element, or `null` if not found.
 */
function deactivateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = true;
  return button;
}

/**
 * Enables the signup button and returns the button element.
 *
 * Targets the button with ID `buttonSignup`, sets `disabled` to `false`,
 * and returns the DOM element for further use if needed.
 *
 * @returns {HTMLButtonElement|null} - The enabled button element, or `null` if not found.
 */
function activateButton() {
  const button = document.getElementById('buttonSignup');
  button.disabled = false;
  return button;
}

/**
 * Toggles the signup button's enabled state based on form validation.
 *
 * If all form fields are valid (`allSignupFieldsValid()` returns true), the button is enabled.
 * Otherwise, the button is disabled.
 */
function toggleSubmitButton() {
  if (allSignupFieldsValid()) {
    activateButton();
  } else {
    deactivateButton();
  }
}

/**
 * Resets all fields in the registration form to their initial values.
 *
 * Targets the form with ID `formRegister` and calls `.reset()` on it.
 *
 * @returns {boolean} - `true` if the reset was successful, otherwise `false`.
 */
function resetFormRegister() {
  const form = document.getElementById('formRegister');
  return form.reset();
}

/**
 * Toggles the visibility of the submenu by adding or removing the `d-none` class.
 *
 * Targets the element with ID `submenu`. If it's hidden, it will be shown; if it's visible, it will be hidden.
 */
function showSubMenu() {
  const submenu = document.getElementById('submenu');
  submenu.classList.toggle('d-none');
}

/**
 * Displays a dropdown menu by updating its CSS classes.
 *
 * Removes `d-none` and `drop-down-hide`, and adds `drop-down-show` to make the menu visible.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to show.
 */
function showDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('d-none', 'drop-down-hide');
  dropDownMenu.classList.add('drop-down-show');
}

/**
 * Hides a dropdown menu by updating its CSS classes.
 *
 * Removes `drop-down-show` and adds `drop-down-hide` to hide the menu with animation.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to hide.
 */
function hideDropdown(dropDownMenu) {
  dropDownMenu.classList.remove('drop-down-show');
  dropDownMenu.classList.add('drop-down-hide');
}

/**
 * Returns the filename of the icon corresponding to a given task priority.
 *
 * Priority values are case-insensitive. If the priority is not recognized,
 * the function defaults to `'medium-orange.svg'`.
 *
 * @param {string} priority - The priority level (e.g., "urgent", "medium", "low").
 * @returns {string} - The filename of the corresponding priority icon.
 */
function getPriorityIcon(priority) {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'urgent-red.svg';
    case 'medium':
      return 'medium-orange.svg';
    case 'low':
      return 'low-green.svg';
    default:
      return 'medium-orange.svg';
  }
}

/**
 * Returns the color code associated with a given task category.
 *
 * Category names are case-insensitive. If the category is not recognized,
 * the function returns `undefined`.
 *
 * @param {string} category - The task category (e.g., "technical task", "user story").
 * @returns {string|undefined} - The hex color code for the category, or `undefined` if not found.
 */
function getCategoryColor(category) {
  switch (category.toLowerCase()) {
    case 'technical task':
      return '#1FD7C1';
    case 'user story':
      return '#0038FF';
  }
}

/**
 * Handles clicks outside the responsive floater element (`respFloater`).
 *
 * If the click occurs outside the floater, the floater is closed and
 * the event listener is removed to prevent unnecessary checks.
 *
 * @param {MouseEvent} event - The click event.
 */
function handleOutsideClick(event) {
  const floater = document.getElementById('respFloater');
  if (floater && !floater.contains(event.target)) {
    closeRespEditFloater();
    document.removeEventListener('click', handleOutsideClick);
  }
}

/**
 * Prepares a formatted version of the contacts by mapping each contact
 * to a simplified object containing `id`, `name`, `initials`, and `color`.
 *
 * The result is stored in the global variable `formattedContactsArray`.
 * The initials are generated using the `getInitials` function.
 */
function prepareFormattedContacts() {
  formattedContactsArray = contactsArray.map((contact, index) => ({
    id: contact.id,
    name: contact.name,
    initials: getInitials(contact.name),
    color: contact.color,
  }));
}

/**
 * Delays the transition to the board view by 1.3 seconds.
 *
 * After the delay, the function loads the board page content and
 * activates the corresponding navigation item.
 */
function showBoardAfterDelay() {
  setTimeout(() => {
    loadPageContentPath('board');
    setActiveNavBoard();
  }, 1300);
}

/**
 * Updates the border color of the assigned contacts input field
 * based on the visibility of the dropdown menu.
 *
 * If the dropdown is hidden, a neutral gray border is applied.
 * If the dropdown is visible, a highlight blue border is applied.
 *
 * @param {HTMLElement} dropDownMenu - The dropdown menu element to check.
 */
function assignedBorderColor(dropDownMenu) {
  const borderColor = document.getElementById('assignedInputBorderColor');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    borderColor.style.border = '1px solid rgba(209, 209, 209, 1)';
  } else {
    borderColor.style.border = '1px solid rgba(41, 171, 226, 1)';
  }
}

/**
 * Sets the border color of the given input field's parent container to a red tone
 * to indicate a validation error.
 *
 * @param {HTMLElement} input - The input element whose border should be highlighted.
 */
function borderColorRed(input) {
  const border = input?.parentElement;
  if (border) {
    border.style.borderColor = "#FF8190";
  }
}

/**
 * Resets the border color of the given input field's parent container
 * to its default state, removing any error styling.
 *
 * @param {HTMLElement} input - The input element whose border should be reset.
 */
function resetBorderColor(input) {
  const border = input?.parentElement;
  if (border) {
    border.style.borderColor = "";
  }
}

/**
 * Sorts the global contacts array alphabetically by name
 * and returns the grouped result by first letter.
 *
 * @returns {Array<{group: string, contacts: Object[]}>} Alphabetically grouped contacts.
 */
function sortContacts() {
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  return groupContactsByLetter();
}

/**
 * Extracts initials from a full name (first and last name).
 *
 * @param {string} name - Full name string (e.g. "John Doe").
 * @returns {string} The initials in uppercase (e.g. "JD").
 */
function getInitials(name) {
  let nameParts = name.split(' ');
  return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
}

/**
 * Assigns a color from the predefined contactColors array to each contact,
 * cycling through the color list as needed.
 *
 * @param {Array<{group: string, contacts: Object[]}>} groupedContacts - Grouped contacts to colorize.
 */
function assignColorsToContacts(groupedContacts) {
  let colorizeIndex = 0;
  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    for (let j = 0; j < group.contacts.length; j++) {
      group.contacts[j].color = contactColors[colorizeIndex % contactColors.length];
      colorizeIndex++;
    }
  }
}