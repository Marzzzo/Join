let selectedPriorityValue = '';
let selectedContacts = [];
let selectedCategoryValue = '';
let addSubtask = [];
let addNewTask = [];

function initAddTask() {
  preventFormSubmitOnEnter();
}

function getAddTaskValue() {
  let title = document.getElementById('addTaskTitle').value.trim();
  let description = document.getElementById('addTaskDescription').value.trim();
  let date = document.getElementById('addTaskDate').value.trim();
  let newTask = {
    id: generateUniqueId(),
    title,
    description,
    date,
    priority: selectedPriorityValue,
    contacts: Array.from(selectedContacts),
    category: selectedCategoryValue,
    subtasks: Array.from(addSubtask),
  };
  addNewTask.push(newTask);
  return newTask;
}

function areTaskFieldsFilled() {
  let { title, date, category } = getTaskFieldValues();
  if (!title || !date || !category) {
    showFieldErrors();
    return false;
  }
  clearFieldErrors();
  return true;
}

function getTaskFieldValues() {
  let title = document.getElementById('addTaskTitle').value.trim();
  let date = document.getElementById('addTaskDate').value.trim();
  let category = selectedCategoryValue.trim();
  return { title, date, category };
}

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

async function createNewTaskToStorage(status) {
  if (!areTaskFieldsFilled()) return;
  let newTask = getAddTaskValue();
  newTask.status = status || addTaskStatusTarget;
  const response = await postNewTaskToDB(newTask);
  newTask.firebaseId = response.name;
  await patchFirebaseId(response.name);
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  clearAddTask();
  messageTaskAdded();
  setTimeout(() => {
    loadPageContentPath('board');
    setActiveNavBoard();
  }, 1300);
}

async function postNewTaskToDB(newTask) {
  const url = BASE_URL + '/board/newTasks.json';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  };
  return await fetchData(url, options);
}

async function patchFirebaseId(firebaseId) {
  const patchUrl = BASE_URL + `/board/newTasks/${firebaseId}.json`;
  const patchOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firebaseId }),
  };
  await fetchData(patchUrl, patchOptions);
}

async function deleteTask(taskId) {
  let success = await deleteTaskInDB(taskId);
  if (!success) {
    deleteTaskInLocalStorage(taskId);
    loadPageContentPath('board');
  }
}

async function deleteTaskInDB(taskId) {
  const url = BASE_URL + `/board/newTasks/${taskId}.json`;
  const options = {
    method: 'DELETE',
  };
  const response = await fetchData(url, options);
  if (!response) return;
}

function deleteTaskInLocalStorage(taskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter((task) => task.firebaseId !== taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function selectedPriority(prio, element) {
  buttonsColorSwitch(element);
  selectedPriorityValue = prio;
}

function buttonsColorSwitch(activeButton) {
  let buttons = activeButton.parentElement.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('isSelected');
  }
  activeButton.classList.add('isSelected');
}

function resetSelectedPriority() {
  let buttons = document.getElementsByClassName('button-prio');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('isSelected');
  }
  let defaultButton = document.getElementById('btn2');
  if (defaultButton) {
    defaultButton.classList.add('isSelected');
  }
  selectedPriorityValue = '';
}

function openDropdownAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const arrow = document.getElementById('arrowAssigned');
  toggleDropdown(dropDownMenu);
  initialsShowOnAssinged(dropDownMenu);
  updateUIElements(inputField, arrow, dropDownMenu);
  assignedBorderColor(dropDownMenu);
}

function toggleDropdown(dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  getContacts(dropDownMenu);
  isHidden ? showDropdown(dropDownMenu) : hideDropdown(dropDownMenu);
}

function updateUIElements(inputField, arrow, dropDownMenu) {
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  toggleArrowRotation(arrow, isHidden);
  updatePlaceholder(inputField, isHidden);
}

function assignedBorderColor(dropDownMenu) {
  const borderColor = document.getElementById('assignedInputBorderColor');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    borderColor.style.border = '1px solid rgba(209, 209, 209, 1)';
  } else {
    borderColor.style.border = '1px solid rgba(41, 171, 226, 1)';
  }
}

function renderDropdownUser(dropDownMenu, contacts) {
  contacts = contacts || formattedContactsArray;
  dropDownMenu.innerHTML = '';
  addedContacts(dropDownMenu, contacts);
  applySelectionStyles(contacts);
}

function addedContacts(dropDownMenu, contacts) {
  contacts.forEach((contact, i) => {
    let { name, color, initials } = contact;
    let isChecked = selectedContacts.some((c) => c.id === contact.id);
    dropDownMenu.innerHTML += assignedToTemplate(name, color, initials, i, isChecked);
  });
}

function applySelectionStyles(contacts) {
  contacts.forEach((_, i) => updateSelectedStyle(document.getElementById(`innerDropmenu-${i}`), document.getElementById(`checkbox-${i}`)?.checked));
}

function searchContacts(searchTerm) {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  if (searchTerm.length < 2) {
    renderDropdownUser(dropDownMenu, formattedContactsArray);
    return;
  }
  let searchContacts = formattedContactsArray.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm.toLowerCase()));
  renderDropdownUser(dropDownMenu, searchContacts);
}

function getContacts(dropDownMenu) {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderDropdownUser(dropDownMenu);
}

function updatePlaceholder(inputField, isHidden) {
  if (inputField) {
    inputField.placeholder = !isHidden ? '' : 'Select contacts to assign';
    inputField.value = isHidden ? '' : inputField.value;
  }
}

function toggleArrowRotation(arrow, isHidden) {
  if (arrow) {
    arrow.classList.toggle('rotate-arrow', isHidden);
    arrow.classList.toggle('rotate-arrow-0', !isHidden);
  }
}

function openDropdownCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const arrow = document.getElementById('arrowCategory');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  renderDropdownMenuCategory(dropDownMenu);
  if (isHidden) {
    showDropdown(dropDownMenu);
  } else {
    hideDropdown(dropDownMenu);
  }
  isCategorySelected();
  toggleArrowRotation(arrow, isHidden);
}

function renderDropdownMenuCategory(dropDownMenu) {
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
}

function isCategorySelected() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const selectedCategory = document.getElementById('selectedCategory');
  let originalCategoryText = 'Select task category';
  if (dropDownMenu.classList.contains('d-none') && selectCategory(originalCategoryText)) {
    selectedCategory.innerText = originalCategoryText;
  }
}

function selectCategory(category) {
  const selectedCategory = document.getElementById('selectedCategory');
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  if (selectedCategory) {
    if (selectedCategory.innerText === category) {
      selectedCategory.innerText = 'Select task category';
    } else {
      selectedCategory.innerText = category;
    }
    hideDropdown(dropDownMenu);
  }
  selectedCategoryValue = category;
}

function resetSelectCategory() {
  const selectedCategory = document.getElementById('selectedCategory');
  selectedCategory.innerText = 'Select task category';
  selectedCategoryValue = '';
}

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

function renderSubtask() {
  let subtaskRef = document.getElementById('addedSubtaks');
  subtaskRef.innerHTML = '';
  for (let i = 0; i < addSubtask.length; i++) {
    subtaskRef.innerHTML += subtaskTemplate(i, addSubtask);
  }
}

function addSubtaksFromInput(event) {
  let subtaskInputRef = document.getElementById('addTaskSubtasks');
  let subtaskNote = subtaskInputRef.value;
  if (subtaskNote.trim() !== '') {
    addSubtask.push(subtaskNote);
    renderSubtask();
    resetSubtaskInput(event);
  }
}

function editSubtask(i) {
  let subtaskRef = document.getElementById(`subtask-${i}`);
  if (subtaskRef) {
    subtaskRef.outerHTML = editSubtaskTemplate(i, addSubtask[i]);
  }
}

function saveEditedSubtask(i) {
  let inputRef = document.getElementById(`editSubtask-${i}`);
  addSubtask[i] = inputRef.value;
  renderSubtask();
}

function resetSubtaskInput(event) {
  event.stopPropagation();
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  let container = document.getElementById('inputContainer');
  inputField.value = '';
  inputField.placeholder = 'Add new subtask';
  plusIcon.classList.remove('d-none');
  container.classList.remove('active');
  if (otherIcons) {
    otherIcons.classList.add('d-none');
  }
}

function deleteSubtask(i) {
  addSubtask.splice(i, 1);
  renderSubtask();
}

function resetSubtask() {
  let subtaskRef = document.getElementById('addedSubtaks');
  subtaskRef.innerHTML = '';
  addSubtask.length = 0;
}

function formatDate(input) {
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';
  if (value.length > 4) {
    formattedValue = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
  } else if (value.length > 2) {
    formattedValue = value.substring(0, 2) + '/' + value.substring(2);
  } else {
    formattedValue = value;
  }
  input.value = formattedValue;
  return;
}

function toggleContactsSelection(event, index) {
  const checkbox = document.getElementById(`checkbox-${index}`);
  const container = document.getElementById(`innerDropmenu-${index}`);
  const isCheckbox = event.target === checkbox;
  const checked = isCheckbox ? checkbox.checked : !checkbox.checked;
  if (!checkbox || !container) return;
  if (!isCheckbox) {
    event.preventDefault();
    checkbox.checked = checked;
  }
  updateSelectedContacts(index, checked);
  updateSelectedStyle(container, checked);
}

function resetContactsSelection() {
  let initialContainer = document.getElementById('selectedInitials');
  initialContainer.innerHTML = '';
  selectedContacts.length = 0;
}

function updateSelectedContacts(index, isChecked) {
  let contact = formattedContactsArray[index];
  let contactIndex = selectedContacts.findIndex((c) => c.id === contact.id);
  if (isChecked && contactIndex === -1) {
    selectedContacts.push(contact);
  } else if (!isChecked && contactIndex !== -1) {
    selectedContacts.splice(contactIndex, 1);
  }
  renderSelectedInitials();
}

function updateSelectedStyle(element, isChecked) {
  element.classList.toggle('inner-dropmenu', !isChecked);
  element.classList.toggle('inner-dropmenu-checked', isChecked);
}

function renderSelectedInitials() {
  const initialsRef = document.getElementById('selectedInitials');
  initialsRef.innerHTML = '';
  for (let i = 0; i < selectedContacts.length; i++) {
    const initials = selectedContacts[i].initials;
    const initialsColor = selectedContacts[i].color;
    initialsRef.innerHTML += initialsTemplate(initials, initialsColor);
  }
}

function initialsShowOnAssinged(dropDownMenu) {
  const initialCircle = document.getElementById('selectedInitials');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  if (isHidden) {
    initialCircle.classList.remove('d-none');
  } else {
    initialCircle.classList.add('d-none');
  }
}

function clearAddTask() {
  document.getElementById('addTaskTitle').value = '';
  document.getElementById('addTaskDescription').value = '';
  document.getElementById('addTaskDate').value = '';
  resetSelectCategory();
  resetContactsSelection();
  resetSubtask();
  resetSelectedPriority();
}
