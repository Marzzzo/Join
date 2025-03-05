const BASE_URL = "https://join-418-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsArray = [];

const contactColors = ["#ff7a01", "#9327ff", "#6e52ff", "#fc71ff", "#ffbb2c", "#20d7c2", "#462f8a", "#ff4646"];

// Kontakte ab Firebase holen, rendern, sortieren, Farben zuordnen

async function loadContactsFromFirebase() {
  try {
    let contactsResponse = await getAllContacts();
    console.log("Kontake von Firebase:", contactsResponse);
    contactsArray = [];
    if (contactsResponse.contacts) {
      let contacts = contactsResponse.contacts;
      await getDetailInfo(contacts);
    }
    let groupedContacts = sortContacts();
    console.log("Gruppierte Kontakte:", groupedContacts);
    assignColorsToContacts(groupedContacts);
    renderContacts(groupedContacts);
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte", error);
  }
}

async function getAllContacts() {
  let response = await fetch(`${BASE_URL}.json`);
  return await response.json();
}

async function getDetailInfo(contacts) {
  let userIds = Object.keys(contacts);
  for (let i = 0; i < userIds.length; i++) {
    let contactId = userIds[i];
    let contact = contacts[contactId];

    contactsArray.push({
      id: contactId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  }
}

function sortContacts() {
  contactsArray.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  let groupedByLetter = [];
  let letterGroup = null;
  for (let i = 0; i < contactsArray.length; i++) {
    let contact = contactsArray[i];
    let firstLetter = contact.name[0].toUpperCase();
    if (letterGroup !== firstLetter) {
      letterGroup = firstLetter;
      groupedByLetter.push({
        group: letterGroup,
        contacts: [],
      });
    }
    groupedByLetter[groupedByLetter.length - 1].contacts.push(contact);
  }
  return groupedByLetter;
}

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

function getInitials(name) {
  let nameParts = name.split(" ");
  return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
}

function renderContacts(groupedContacts) {
  console.log("Rendering contacts:", groupedContacts);
  let contactList = document.getElementById("contacts-div");
  contactList.innerHTML = "";

  for (let i = 0; i < groupedContacts.length; i++) {
    let group = groupedContacts[i];
    contactList.innerHTML += generateGroupHTML(group.group);

    // Zweite Schleife für die Kontakte unter den Lettern
    for (let j = 0; j < group.contacts.length; j++) {
      let contact = group.contacts[j];
      let initials = getInitials(contact.name);
      contactList.innerHTML += generateContactsHTML(contact, initials);
    }
  }
}

// Neuen Kontakt erstellen, auf Firebase schreiben

async function createNewContact() {
  let newContact = addContactInput();
  let response = await postToFirebase(newContact);
  if (response) {
    console.log("contact successfully added:", newContact);
    await loadContactsFromFirebase();
    document.getElementById("contactForm").reset();
  } else {
    console.error("Error when adding contact");
  }
}

function validateForm() {
  let form = document.getElementById("contactForm");
  if (!form.checkValidity()) {
    return false;
  }
  createNewContact();
  return false;
}

async function postToFirebase(contact) {
  try {
    let response = await fetch(BASE_URL + "/contacts.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    if (response.ok) {
      let data = await response.json();
      return { id: data.name, ...contact };
    }
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

function addContactInput() {
  let name = document.getElementById("addContName").value;
  let email = document.getElementById("addContMail").value;
  let phone = document.getElementById("addContPhone").value;
  let newContact = { name, email, phone };
  return newContact;
}

function showContactInfo(contactId) {
    let contact = contactsArray.find(c => c.id === contactId);
    if (!contact) return;
    clearHighlightContact();
    highlightContact(contactId);

        let glanceWindow = document.getElementById("cnt-glance-contact");
        glanceWindow.style.display = "none";

        glanceWindow.innerHTML = generateContactsInfoHTML(contact);
        glanceWindow.style.display = "block";
    }


function clearHighlightContact() {
for (let contact of contactsArray) {
  let contactElement = document.getElementById(`contact-${contact.id}`);
  if (contactElement) contactElement.classList.remove("cnt-name-highlight");
}
}

function highlightContact(contactId) {
  let contactElement = document.getElementById(`contact-${contactId}`);
  contactElement.classList.toggle("cnt-name-highlight");
}

async function deleteContact(contactId) {
    console.log("deleteContact - contact ID to delete:", contactId);
    try {
        await fetch (`${BASE_URL}/contacts/${contactId}.json`,
        { method: "DELETE" });
        contactsArray = contactsArray.filter(contact => contact.id !== contactId);
        document.getElementById("cnt-glance-contact").style.display = "none";
        loadContactsFromFirebase();
    } catch (error) {
        console.error ("Fehler beim Löschen des Kontakts:", error);
    }
    }

function editContact(contactId) {
     let contact = contactsArray.find((c) => c.id === contactId);
     if (!contact) return; 

    let editFloater = document.getElementById("contactFloater");
      editFloater.innerHTML = generateContactsEditFloaterHTML(contact);
      editFloater.style.display = "block";

    document.getElementById("addContName").value = contact.name;
    document.getElementById("addContMail").value = contact.email;
    document.getElementById("addContPhone").value = contact.phone;
}

async function updateContact(contactId) {
  let updatedContact = {
    name: document.getElementById("addContName").value,
    email: document.getElementById("addContMail").value,
    phone: document.getElementById("addContPhone").value,
  };

  try {
    await fetch(`${BASE_URL}/contacts/${contactId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    });

    contactsArray = contactsArray.map((contact) =>
      contact.id === contactId ? { id: contactId, ...updatedContact } : contact
    );

    loadContactsFromFirebase();
    document.getElementById("contactFloater").style.display = "none";
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts:", error);
  }
}

function addEditContact(contact) {
  let editContact = document.getElementById("addContactOverlay");
  editContact.innerHTML = generateContactsEditFloaterHTML(contact);
  document.body.style.overflow = "hidden";
  editContact.classList.remove("slideOut");
  editContact.classList.add("slideIn");
  editContact.classList.remove("d-none");
  setTimeout(() => {
    editContact.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  }, 200);
}

function closeEditFloater() {
  let closeEditFloater = document.getElementById("addContactOverlay");
  closeEditFloater.classList.remove("slideIn");
  closeEditFloater.classList.add("slideOut");
  closeEditFloater.style.backgroundColor = "rgba(0, 0, 0, 0)";
  setTimeout(() => {
    closeEditFloater.classList.add("d-none");
    closeEditFloater.innerHTML = "";
    document.body.style.overflow = "";
  }, 100);
}

