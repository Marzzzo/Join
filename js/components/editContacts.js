/**
 * Opens the contact edit overlay for the given contact ID.
 * Renders the edit form with contact details and shows the overlay with animation.
 *
 * @param {string} contactId - The ID of the contact to be edited.
 */
function addEditContact(contactId) {
  let contact = contactsArray.find((c) => c.id === contactId);
  if (!contact) return;
  let editContact = document.getElementById('addContactOverlay');
  editContact.innerHTML = generateContactsEditFloaterHTML(contact);
  document.body.style.overflow = 'hidden';
  editContact.classList.remove('slideOut');
  editContact.classList.add('slideIn');
  editContact.classList.remove('d-none');
  setTimeout(() => {
    editContact.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 200);
}

/**
 * Closes the contact edit overlay.
 * Hides the overlay with animation and resets the page scroll behavior.
 */
function closeEditFloater() {
  let closeEditFloater = document.getElementById('addContactOverlay');
  closeEditFloater.classList.remove('slideIn');
  closeEditFloater.classList.add('slideOut');
  closeEditFloater.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  setTimeout(() => {
    closeEditFloater.classList.add('d-none');
    closeEditFloater.innerHTML = '';
    document.body.style.overflow = 'auto';
  }, 100);
}

/**
 * Closes the responsive contact floater if it exists.
 * Removes the floater from the DOM and shows the responsive command image.
 */
function closeRespEditFloater() {
  let floater = document.getElementById("respFloater");
  if (!floater) return;
  floater.classList.remove("slideIn");
  floater.classList.add("slideOut");
  setTimeout(() => {
    floater.remove();
    let img = document.getElementById("resp-cmd-img");
    if (img) img.classList.remove("d-none");
  }, 300);
}

/**
 * Handles updating a contact after editing.
 * Validates input, updates Firebase and UI.
 *
 * @param {string} contactId - The ID of the contact to update.
 */
async function updateEditContact(contactId) {
  if (!allContactFieldsValid()) return;
  const { name, email, phone } = getContactinput();
  renderEmptyFieldMessages(name, email, phone);
  try {
    await saveUpdatedContact(contactId);
    await reloadAndRenderContacts(contactId);
    closeEditFloater();
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Sends updated contact data to Firebase and updates the local contact array.
 *
 * @param {string} contactId - The ID of the contact to update.
 */
async function saveUpdatedContact(contactId) {
  let updatedContact = getContactinput();
  await sendUpdateToFirebase(contactId, updatedContact);
  updateContactInArray(contactId, updatedContact);
}

/**
 * Reloads contacts from Firebase and updates the UI if the detail view is open.
 *
 * @param {string} contactId - The ID of the contact to refresh in the view.
 */
async function reloadAndRenderContacts(contactId) {
  await loadContactsFromFirebase();
  getGroupedContacts();
  let glanceWindow = document.getElementById('cnt-glance-contact');
  if (glanceWindow && glanceWindow.style.display !== 'none') {
    showContactInfo(contactId);
  }
}

/**
 * Updates a contact inside the `contactsArray` by matching its ID.
 *
 * @param {string} contactId - The ID of the contact to update.
 * @param {Object} updatedContact - The updated contact data.
 */
function updateContactInArray(contactId, updatedContact) {
  contactsArray = contactsArray.map((contact) =>
    contact.id === contactId ? { id: contactId, ...updatedContact } : contact
  );
}