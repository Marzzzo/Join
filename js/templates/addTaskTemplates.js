function addTaskTemplate() {
  return `
  <div class="floating-content">
    <div class="headline-add-task">
      <h1 class="h1-add-task">Add Task</h1>
      <div class="close-div" onclick="closeAddTaskFloating()">
        <img src="../assets/icons/close.svg" class="add-close-btn" alt="Close" />
      </div>
    </div>
    <form id="addTaskForm" class="add-task-form" onsubmit="createNewTask();return false;">
      <div class="input-section">
        <div class="section-left">
          <div class="add-task-single">
            <label class="title-and-star" for="addTaskTitle">
              <h2>Title</h2>
              <span class="span-star">*</span>
            </label>
            <div>
              <input id="addTaskTitle" class="input_at" type="text" name="title" placeholder="Enter a title" />
              <span id="titleMessage" class="error-message"></span>
            </div>
          </div>
          <div class="add-task-single">
            <label for="addTaskDescription">
              <h2>Description</h2>
            </label>
            <textarea id="addTaskDescription" class="textarea-add-task" name="description"
              placeholder="Enter a Description"></textarea>
          </div>
          <div class="add-task-single">
            <label class="title-and-star" for="addTaskDate">
              <h2>Due date</h2>
              <span class="span-star">*</span>
            </label>
            <div>
              <div id="inputDate" class="input-date-outside">
                <input oninput="formatDate(this)" id="addTaskDate" class="input-date" name="date" type="text"
                  placeholder="dd/mm/yyyy" /><img src="../assets/icons/date_event.svg" />
              </div>
              <span id="dateMessage" class="error-message"></span>
            </div>
          </div>
        </div>
        <div class="devider-ver"></div>
        <div class="section-right">
          <div class="add-task-single">
            <label for="btn1">
              <h2>Prio</h2>
            </label>
            <div class="button-section selected">
              <button id="btn1" type="button" color="rgba(255, 61, 0, 1);" class="button-prio"
                onclick="selectedPriority('Urgent', this)">
                Urgent <img src="../assets/icons/urgent-red.svg" />
              </button>
              <button id="btn2" type="button" color="rgba(255, 168, 0, 1)" class="button-prio isSelected"
                onclick="selectedPriority('Medium', this)">
                Medium <img src="../assets/icons/medium-orange.svg" />
              </button>
              <button id="btn3" type="button" color="rgba(122, 226, 41, 1)" class="button-prio"
                onclick="selectedPriority('Low', this)">
                Low <img src="../assets/icons/low-green.svg" />
              </button>
            </div>
          </div>
          <div class="add-task-single">
            <div class="title-and-star" for="">
              <h2>Assigned to</h2>
            </div>
            <div class="assigned-input-outside">
              <div class="input-container-assigned" id="assignedInputBorderColor" onclick="openDropdownAssigned()">
                <input id="addTaskAssigned" type="text" name="contacts" placeholder="Select contacts to assign" />
                <div class="container-arrow-img-dropdown">
                  <img id="arrowAssigned" class="arrow-drop-down" src="../assets/icons/drop_up_arrwow.svg" />
                </div>
              </div>
              <div id="dropDownMenuAssigned" class="main-drop-down drop-down-hide"></div>
            </div>
            <div id="selectedInitials" class="initial-container d-none"></div>
          </div>
          <div class="add-task-single">
            <div class="title-and-star">
              <h2>Category</h2>
              <span class="span-star">*</span>
            </div>
            <div id="addTaskCategory" class="input-container-category">
              <div class="category-container" onclick="openDropdownCategory()">
                <div id="categoryDropDown" class="drop-down-placeholder">
                  <div class="textfield">
                    <h2 id="selectedCategory">Select task category</h2>
                  </div>
                  <div class="container-arrow-img-dropdown">
                    <img id="arrowCategory" class="arrow-drop-down" src="../assets/icons/drop_up_arrwow.svg" />
                  </div>
                </div>
                <div id="dropDownMenuCategory" class="drop-down-field-category drop-down-hide"></div>
              </div>
              <span id="categoryMessage" class="error-message"></span>
            </div>
          </div>
          <div class="add-task-single">
            <label for="addTaskSubtasks">
              <h2>Subtasks</h2>
            </label>
            <div id="inputContainer" class="input-container-subtask" onclick="openSubtaskInput()">
              <input type="text" name="category" id="addTaskSubtasks" placeholder="Add new subtask" />
              <div class="container-arrow-img-dropdown" id="plusIcon">
                <img src="../assets/icons/add_plus.svg" />
              </div>
              <div class="input-other-icons d-none" id="otherIcons">
                <div class="container-icons" onclick="closeSubtaskInput(event)">
                  <img src="../assets/icons/close.svg" alt="close" />
                </div>
                <div class="hyphen"></div>
                <div class="container-icons" onclick="addSubtaksFromInput(event)">
                  <img src="../assets/icons/check-blue.svg" alt="check" />
                </div>
              </div>
            </div>
            <div class="subtask-content" id="addedSubtask"></div>
          </div>
        </div>
      </div>
      <div class="required-section-floating">
        <div class="required-field">
          <span class="span-star">*</span>
          <p>This field is required</p>
        </div>
        <div class="bt-section">
          <button class="bt-clear" type="reset" onclick="clearAddTask()">
            Clear
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.2496 11.9998L17.4926 17.2428M7.00659 17.2428L12.2496 11.9998L7.00659 17.2428ZM17.4926 6.75684L12.2486 11.9998L17.4926
                      6.75684ZM12.2486 11.9998L7.00659 6.75684L12.2486 11.9998Z" stroke="#2A3647" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="bt-add-float-task" type="submit">Create Task <img src="../assets/icons/check.svg"
              alt="Check" /></button>
        </div>
      </div>
    </form>
  </div>
  `;
}

function assignedToTemplate(name, color, initials, i, isChecked) {
  return `
  <div id="innerDropmenu-${i}" class="inner-dropmenu" onclick="toggleContactsSelection(event, ${i})">
    <div class="contacts-line">
      <div style="background-color:${color}" class="circle-color">
        <span>${initials}</span>
      </div>
      <div class="contact">
        <span>${name}</span>
      </div>
    </div>
    <div class="checkbox">
      <input id="checkbox-${i}" ${isChecked ? 'checked' : ''} type="checkbox" name="checkbox" onclick=" toggleContactsSelection(event, ${i})" />
    </div>
  </div>`;
}

function categoryTemplate() {
  return `
  <div>
    <div onclick="selectCategory('Technical Task', event)" class="inner-task">
      <h2>Technical Task</h2>
    </div>
    <div onclick="selectCategory('User Story', event)" class="inner-task">
      <h2>User Story</h2>
    </div>
  </div>
  `;
}

function subtaskTemplate(i, subtask) {
  return `
    <div class="add-subtask" id="subtask-${i}">
      <ul>
        <li>${subtask.text}</li>
      </ul>
      <div class="input-other-icons">
        <div class="subtask-icons" onclick="editSubtask(${i})">
          <img src="../assets/icons/edit.svg" alt="edit-icon" />
        </div>
        <div class="hyphen-subtask"></div>
        <div class="subtask-icons" onclick="deleteSubtask(${i})">
          <img src="../assets/icons/delete.svg" alt="delete-icon" />
        </div>
      </div>
    </div>`;
}

function editSubtaskTemplate(i, subtask) {
  return `
    <div class="input-container-edit">
      <input type="text" name="category" id="editSubtask-${i}" value="${subtask.text}"/>
      <div class="input-other-icons">
        <div class="container-icons" onclick="deleteSubtask()">
          <img src="../assets/icons/delete.svg" alt="delete-icon" />
        </div>
        <div class="hyphen"></div>
        <div class="container-icons" onclick="saveEditedSubtask(${i})">
          <img src="../assets/icons/check-blue.svg" alt="check-icon" />
        </div>
      </div>
    </div>`;
}

function initialsTemplate(initials, initialsColor) {
  return `   
    <div class="circle-color-checked-assigned" style="background-color: ${initialsColor}">
      <span>${initials}</span>
    </div>`;
}
