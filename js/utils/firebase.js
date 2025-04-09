/**
 * Base URL of the Firebase Realtime Database.
 * Used as the root endpoint for all database requests.
 *
 * @constant {string}
 */
const BASE_URL = 'https://join-418-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Fetches data from the specified URL
 *
 * @param {string} url - The URL from which to fetch the data
 * @param {object} options - Options for the fetch request (method, headers, body)
 * @return {Promise<object|undefined>} - A promise that resolves to a JSON object on success or `undefined` on failure
 */
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    return undefined;
  }
}

/**
 * Sends a new task to the Firebase Realtime Database.
 * The task is posted under the `/board/newTasks` node.
 *
 * @param {Object} newTask - The task object to be saved in the database.
 * @returns {Promise<Object>} - A promise that resolves with the response from the database.
 */
async function postNewTaskToDB(newTask) {
  const url = BASE_URL + '/board/newTasks.json';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  };
  return await fetchData(url, options);
}

/**
 * Writes the `firebaseId` into its corresponding task entry in the database.
 * This stores the Firebase-generated key inside the task object itself for easier future reference.
 *
 * @param {string} firebaseId - The unique Firebase key for the task.
 * @returns {Promise<void>} - A promise that resolves once the ID has been written.
 */
async function setFirebaseIdInDB(firebaseId) {
  const url = BASE_URL + `/board/newTasks/${firebaseId}/firebaseId.json`;
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(firebaseId),
  };
  await fetchData(url, options);
}

/**
 * Deletes a task from the Firebase Realtime Database.
 * Automatically determines whether the task is a default or newly created one.
 *
 * @param {string} firebaseId - The Firebase key of the task to delete.
 * @param {boolean} isDefault - Whether the task is from the default set or not.
 * @returns {Promise<boolean>} - Returns true if the task was deleted successfully, false otherwise.
 */
async function deleteTaskInDB(firebaseId, isDefault) {
  const taskType = isDefault ? 'default' : 'newTasks';
  const url = `${BASE_URL}/board/${taskType}/${firebaseId}.json`;
  const options = {
    method: 'DELETE',
  };
  const response = await fetchData(url, options);
  if (!response) return false;
  return true;
}

/**
 * Sends a task in JSON format to Firebase via POST request.
 * Returns the ID (`name`) generated by Firebase.
 *
 * @param {Object} task - The task to be sent.
 * @returns {Promise<string|undefined>} - The Firebase ID or ‘undefined’ for errors.
 */
async function postTaskToFirebase(task) {
  const url = BASE_URL + '/board/default.json';
  const response = await fetchData(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return response?.name;
}

/**
 * Updates the `status` field of a specific task in the Firebase Realtime Database.
 *
 * @param {string} path - The base path to the task (e.g., 'board/newTasks' or 'board/default').
 * @param {Object} task - The task object containing the `firebaseId` and updated `status`.
 * @param {string} task.firebaseId - The unique Firebase key of the task.
 * @param {string} task.status - The new status to assign (e.g., "toDo", "inProgress", "done").
 * @returns {Promise<void>} - A promise that resolves when the status has been updated.
 */
async function updateTaskStatusDB(path, task) {
  const urlStatus = BASE_URL + `${path}/${task.firebaseId}/status.json`;
  const optionsStatus = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task.status),
  };
  await fetchData(urlStatus, optionsStatus);
}

/**
 * Updates the `subtasks` of a specific task in the Firebase Realtime Database.
 *
 * @param {string} path - The base path to the task (e.g., 'board/newTasks' or 'board/default').
 * @param {Object} task - The task object containing the `firebaseId` and updated `subtasks`.
 * @param {string} task.firebaseId - The unique Firebase key of the task.
 * @param {Array<Object>} task.subtasks - The updated list of subtasks.
 * @returns {Promise<void>} - A promise that resolves when the subtasks have been updated.
 */
async function updateTaskSubtasksDB(path, task) {
  const urlSubtasks = BASE_URL + `${path}/${task.firebaseId}/subtasks.json`;
  const optionsSubtasks = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task.subtasks),
  };
  await fetchData(urlSubtasks, optionsSubtasks);
}

/**
 * Sends a contact object to the Firebase Realtime Database under `/contacts`.
 * Returns the contact object with the generated Firebase ID on success.
 *
 * @param {Object} contact - The contact object to store.
 * @returns {Promise<Object|null>} - The saved contact including its Firebase ID, or `null` on failure.
 */
async function postToFirebase(contact) {
  try {
    let response = await fetch(BASE_URL + '/contacts.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (response.ok) {
      let data = await response.json();
      return { id: data.name, ...contact };
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

/**
 * Updates a single task in Firebase with the modified task data.
 *
 * @param {string} path - Firebase path to the task.
 * @param {string} key - Firebase ID of the task.
 * @param {Object} task - Task object with updated data.
 * @returns {Promise<void>}
 */
async function updateTaskInFirebase(path, key, task) {
  let url = `${BASE_URL}${path}/${key}.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

/**
 * Fetches task data from a specific Firebase path.
 *
 * @param {string} path - Firebase path to fetch tasks from.
 * @returns {Promise<Object|undefined>} - The task data or undefined if fetch fails.
 */
async function fetchTasksFromPath(path) {
  let url = BASE_URL + path + '.json';
  return await fetchData(url, { method: 'GET' });
}

/**
 * Updates an existing contact in the Firebase Realtime Database.
 *
 * @param {string} contactId - The Firebase ID of the contact to update.
 * @param {Object} updatedContact - The updated contact data to store.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function sendUpdateToFirebase(contactId, updatedContact) {
  const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedContact),
  });
}

/**
 * Loads all tasks stored under `/board/newTasks` from the Firebase Realtime Database.
 * Adds the `firebaseId` to each task object based on the key from the response.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of task objects.
 */
async function loadTaskFromDB() {
  let data = await fetchData(BASE_URL + '/board/newTasks.json');
  if (!data) return [];
  return Object.entries(data).map(([firebaseId, task]) => {
    task.firebaseId = firebaseId;
    return task;
  });
}

/**
 * Loads all default tasks stored under `/board/default` from the Firebase Realtime Database.
 * Adds the `firebaseId` to each task object based on the key from the response.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of default task objects.
 */
async function loadDefaultTaskFromDB() {
  let data = await fetchData(BASE_URL + '/board/default.json');
  if (!data) return [];
  return Object.entries(data).map(([firebaseId, task]) => {
    task.firebaseId = firebaseId;
    return task;
  });
}

/**
 * Saves a new task to the Firebase Realtime Database and sets its `firebaseId`.
 * The task is first posted to `/board/newTasks`, and then the Firebase-generated ID
 * is written into the task's own data structure for future reference.
 *
 * @param {Object} task - The task object to be saved.
 * @returns {Promise<void>} - A promise that resolves once the task is fully saved and updated.
 */
async function saveTaskToDB(task) {
  const response = await postNewTaskToDB(task);
  task.firebaseId = response.name;
  await setFirebaseIdInDB(response.name);
}

/**
 * Compares the predefined default tasks with the tasks already stored in the Firebase Realtime Database.
 * Uploads any missing default tasks that are not yet present in the database.
 *
 * @returns {Promise<void>} - A promise that resolves once all missing default tasks are uploaded.
 */
async function uploadMissingDefaultTasks() {
  const defaultTasks = await loadDefaultTaskFromDB();
  const defaultTaskIds = defaultTasks.map((t) => t.id);
  const missingTasks = DEFAULT_TASKS.filter((task) => !defaultTaskIds.includes(task.id));
  for (let task of missingTasks) {
    await prepareAndUploadTask(task);
  }
}
