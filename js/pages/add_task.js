let subtaskNotes = [];

function initAddTask() { }

function buttonsColorSwitch(btnId) {
  let buttons = document.getElementsByClassName('input-section')[0].getElementsByTagName('button');
  let activeButton = document.getElementById(btnId);
  if (activeButton.classList.contains('isSelected')) {
    activeButton.classList.remove('isSelected');
  } else {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('isSelected');
    }
    activeButton.classList.add('isSelected');
  }
}


function openDropdownMenuAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  const inputField = document.getElementById('addTaskAssigned');
  const isOpen = dropDownMenu.classList.contains('drop-down-show');
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = assignedToTemplate();
  }
  if (isOpen) {
    dropDownMenu.classList.remove('drop-down-show');
    dropDownMenu.classList.add('drop-down-hide');
    setTimeout(() => {
      dropDownMenu.classList.add('d-none');
    }, 300);
    if (inputField) {
      inputField.placeholder = 'Select contacts to assign';
    }
  } else {
    dropDownMenu.classList.remove('d-none', 'drop-down-hide');
    dropDownMenu.classList.add('drop-down-show');
    if (inputField) {
      inputField.placeholder = '';
    }
  }
}



function closeDropdownMenuAssigned() {
  const dropDownMenu = document.getElementById('dropDownMenuAssigned');
  dropDownMenu.classList.remove('d-none');
}


function openDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  if (!dropDownMenu.innerHTML.trim()) {
    dropDownMenu.innerHTML = categoryTemplate();
  }
  isCategorySelected();
  dropDownMenu.classList.toggle('d-none');
  dropDownMenu.classList.toggle('drop-down-show');
}


function closeDropdownMenuCategory() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  dropDownMenu.classList.add('d-none');
}


function isCategorySelected() {
  const dropDownMenu = document.getElementById('dropDownMenuCategory');
  const selectedCategory = document.getElementById('selectedCategory');
  let originalCategoryText = 'Select task category';
  const isCategorySelected = false;
  if (dropDownMenu.classList.contains('d-none') && !isCategorySelected) {
    selectedCategory.innerText = originalCategoryText;
  }
}


function toggleIcons() {
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  if (inputField.value.trim() !== '') {
    plusIcon.classList.add('d-none');
    otherIcons.classList.remove('d-none');
  } else {
    plusIcon.classList.remove('d-none');
    otherIcons.classList.add('d-none');
  }
}

function clearInput() {
  const inputField = document.getElementById('addTaskSubtasks');
  const plusIcon = document.getElementById('plusIcon');
  const otherIcons = document.getElementById('otherIcons');
  inputField.value = '';
  otherIcons.classList.add('d-none');
  plusIcon.classList.remove('d-none');
}

function selectCategory(category) {
  let selectedCategory = document.getElementById('selectedCategory');
  if (selectedCategory) {
    selectedCategory.innerText = category;
    return category;
  }
  closeDropdownMenuCategory();
}

function renderSubtask() {
  let subtaskRef = document.getElementById('addedSubtaks');
  subtaskRef.innerHTML = '';
  for (let i = 0; i < subtaskNotes.length; i++) {
    subtaskRef.innerHTML += subtaskTemplate(i);
  }
  clearInput();
}

function addSubtaksFromInput() {
  let subtaskInputRef = document.getElementById('addTaskSubtasks');
  let subtaskNote = subtaskInputRef.value;
  subtaskNotes.push(subtaskNote);
  renderSubtask();
}

function deleteSubtask(i) {
  subtaskNotes.splice(i, 1);
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
