function Contact(first, last, email) {
	this.first_name = first;
	this.last_name = last;
	this.email = email;
}

Contact.prototype.updateFirstName = function(firstName) {
	this.first_name = firstName;
}
Contact.prototype.updateLastName = function(lastName) {
	this.last_Name = lastName;
}
Contact.prototype.updateEmail = function(updatedEmail) {
	this.email = updatedEmail;
}


function hydrateContacts() {
	contacts = [];

	if(localStorage.contacts) {

		contacts = JSON.parse(localStorage.contacts).map(function(element){
			return new Contact(element.first_name, element.last_name, element.email);
		});
	}
}

function addNewContact(event) {
	event.preventDefault();

	var FormInfo = new FormData(document.querySelector("#new-contact"));
	
	var contact = {};

	FormInfo.forEach(function(value, key){
		contact[key] = value;
	});

	if(contact.email=="") {
		alert("This is an address book: you need to add an email address");
		return;
	}

	contact = new Contact(contact.first_name, contact.last_name,  contact.email);

	document.querySelector("#new-contact").reset();
	contacts.push(contact);

	updateStore();
	document.querySelector(".contacts-list").appendChild(createContactElement(contact));
}



function checkEmail() {
	var emailToCheck = this.value;
	contacts.forEach(function(contact){ 
		if(emailToCheck==contact.email) {
			alert("Another contact is already using that email.");
			document.querySelector("form#new-contact [name='email']").value = "";
		}
	});
}

function updateStore() {
	localStorage.setItem("contacts", JSON.stringify(contacts));
}


function findContactByEmail(email) {
	var contact = contacts.find(function(contact) {
		if(contact.email == email) return contact;
	});
	return contact;
}


function startContactEdit() {

	var listing = this.parentElement;

	var contact = findContactByEmail(listing.getAttribute("data-email"));

	listing.innerHTML = document.querySelector("#new-contact").innerHTML;

	var firstName = listing.querySelector(".first-name");
	firstName.focus();
	firstName.setAttribute("value", contact.first_name);
	firstName.setSelectionRange(0, contact.first_name.length);
	listing.querySelector(".last-name").setAttribute("value", contact.last_name);
	listing.querySelector(".email").setAttribute("value", contact.email);

	listing.querySelector(".submit-contact").innerHTML = "Update";

	listing.querySelector(".submit-contact").addEventListener("click", updateContact);
}



function updateContact() {
	var contact = this.parentElement;


	var contactObject;

	contacts = contacts.map(function(contactRecord) {
		if(contactRecord.email == contact.getAttribute("data-email")) {
			contactRecord.updateFirstName(contact.querySelector(".first-name").value);
			contactRecord.updateLastName(contact.querySelector(".last-name").value);
			contactRecord.updateEmail(contact.querySelector(".email").value);
			contactObject = contactRecord;
		}
		return contactRecord;
	});


	contact.parentNode.insertBefore(createContactElement(contactObject), contact);
	contact.parentNode.removeChild(contact);

	updateStore();
}


function deleteContact() {

	var contact_to_be_deleted = this.parentElement.getAttribute('data-email');

	if (confirm('Are you sure you want to remove this contact?')) {
		contacts = contacts.filter(function(contact) {
			if(contact.email == contact_to_be_deleted) {
				return false;
			}
			return true;
		});

		updateStore();
		listContacts();
	}
}

function listContacts() {

	document.querySelector(".contacts-list").innerHTML = "";

	contacts.sort(function(a, b){
	    if(a.last_name < b.last_name) return -1;
	    if(a.last_name > b.last_name) return 1;
	    return 0;
	})

	contacts.forEach(function(contact) {
		document.querySelector(".contacts-list").appendChild(createContactElement(contact));
	});	
}


function createContactElement(contact) {

	var contact_element = document.createElement("LI");      
	contact_element.className += " contact";         

	var last_name_element = document.createElement("span");		
		last_name_element.appendChild(document.createTextNode(contact.last_name));
		last_name_element.className = "last-name";

	var first_name_element = document.createElement("span");		
		first_name_element.appendChild(document.createTextNode(contact.first_name));
		first_name_element.className = "first-name";

	var email_element = document.createElement("span");		
		email_element.appendChild(document.createTextNode(contact.email));
		email_element.className = "email";

	var delete_element = document.createElement("button");
		delete_element.setAttribute("class", "delete");

	var edit_contact_element = document.createElement("button");
		edit_contact_element.appendChild(document.createTextNode("Edit"));
		edit_contact_element.setAttribute("class", "edit");
		edit_contact_element.addEventListener("click", startContactEdit);


	contact_element.appendChild(first_name_element);
	contact_element.appendChild(last_name_element);
	contact_element.appendChild(email_element);
	contact_element.appendChild(edit_contact_element);
	contact_element.appendChild(delete_element);

	contact_element.setAttribute('data-email', contact.email);

	delete_element.addEventListener("click", deleteContact);

	return contact_element;
}


function attatchListeners() {
	document.querySelector("form#new-contact").addEventListener("submit", addNewContact);
	document.querySelector("form#new-contact [name='email']").addEventListener("keyup", checkEmail);	
}


function initialize() {
	hydrateContacts();
	attatchListeners();
	listContacts();
}


initialize();