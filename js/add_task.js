function standardButtons(btnId) {
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

function openDropdownMenu() {
  const inputArrow = document.getElementById('inputField');
  const dropDownMenu = document.getElementById('dropDownMenu');
  inputArrow.classList.add('d-none');
  dropDownMenu.innerHTML = assignedToTemplate();
  dropDownMenu.classList.remove('d-none');
}

function closeDropdownMenu() {
  const inputArrow = document.getElementById('inputField');
  const dropDownMenu = document.getElementById('dropDownMenu');
  inputArrow.classList.remove('d-none');
  dropDownMenu.classList.add('d-none');
  inputArrow.style.display = '';
  dropDownMenu.style.display = '';
}
