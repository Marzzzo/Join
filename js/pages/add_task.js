let selectedPriorityValue = '';
let selectedContacts = [];
let selectedCategoryValue = '';
let addSubtask = [];

function initAddTask() {
}

/* ---------- work in progress !-----------*/

// function taskGetValues() {
//   let title = document.getElementById('addTaskTitle').value.trim();
//   let description = document.getElementById('addTaskDescription').value.trim();
//   let date = document.getElementById('addTaskDate').value.trim();
//   let priority = selectedPriority();
//   let assignedTo = selectedContacts;
//   let category = selectCategory();
//   let subtasks = addSubtask;
//   return {
//     title: title,
//     description: description,
//     date: date,
//     priority: priority,
//     assignedTo: assignedTo,
//     category: category,
//     subtasks: subtasks,
//   }
// }

// function addNewTask() {
//   let taskData = taskGetValues();
//   if (!taskData.title || !taskData.date || !taskData.category) {
//     requiredMessageAddTask();
//   }
//   let newTask = {
//     title: taskData.title,
//     description: taskData.description,
//     date: taskData.date,
//     priority: taskData.priority,
//     assignedTo: taskData.assignedTo,
//     category: taskData.category,
//     subtasks: taskData.subtasks,
//   }
//   console.log("Neue Aufgabe:", newTask);
// }

// function requiredMessageAddTask() {
//   const title = document.getElementById('titleMessage');
//   const date = document.getElementById('dateMessage');
//   const category = document.getElementById('categoryMessage');
//   if (!addNewTask()) {
//     message.innerText = "This field is required";
//     message.style.display = "block";
//   } else {
//     message.innerText = "";
//     message.style.display = "none";
//   }
// }

function selectedPriority(prio, element) {
  buttonsColorSwitch(element)
  selectedPriorityValue = prio;
}

/* ----------------------------------- */


function buttonsColorSwitch(activeButton) {
  let buttons = activeButton.parentElement.getElementsByTagName('button')
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('isSelected');
  }
  activeButton.classList.add('isSelected');
}


function openDropdownAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const arrow = document.getElementById('arrowAssigned');
  const isHidden = dropDownMenu.classList.contains('drop-down-hide');
  getContacts(dropDownMenu);
  if (isHidden) {
    showDropdown(dropDownMenu);
  } else {
    hideDropdown(dropDownMenu);
  }
  toggleArrowRotation(arrow, isHidden);
  updatePlaceholder(inputField, isHidden);
}


function renderDropdownUser(dropDownMenu) {
  dropDownMenu.innerHTML = '';
  if (!dropDownMenu.innerHTML.trim()) {
    for (let i = 0; i < formattedContactsArray.length; i++) {
      let { name, color, initials } = formattedContactsArray[i];
      dropDownMenu.innerHTML += assignedToTemplate(name, color, initials, i);
    }
  }
}

function getContacts(dropDownMenu) {
  let groupedContacts = sortContacts();
  assignColorsToContacts(groupedContacts);
  prepareFormattedContacts();
  renderDropdownUser(dropDownMenu);
}


function updatePlaceholder(inputField, isHidden) {
  if (inputField) {
    inputField.placeholder = isHidden ? '' : 'Select contacts to assign';
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
  if (dropDownMenu.classList.contains('d-none') && selectCategory()) {
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
    subtaskRef.innerHTML += subtaskTemplate(i);
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

function assignedCheckedContacts() {
  let checkedContact = document.getElementById('innerDropmenu');
  for (let index = 0; index < checkedContact.length; index++) {
    const element = checkedContact[i];
    element.classList.add('inner-dropmenu-checked');
  }
}

/* -------------------function push to selectedContacts------------------- */

function toggleContactsSelection(event, index) {
  event.preventDefault();
  let checkbox = document.getElementById(`checkbox-${index}`);
  checkbox.checked = !checkbox.checked;
  let contact = formattedContactsArray[index];
  let contactIndex = selectedContacts.findIndex(c => c.id === contact.id)
  if (checkbox.checked) {
    if (contactIndex === -1) selectedContacts.push(contact);
  } else {
    if (contactIndex !== -1) selectedContacts.splice(contactIndex, 1);
  }
  console.log(selectedContacts);
}






