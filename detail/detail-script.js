import {getContact, deleteContact, updateContact} from "../shared/contact-service.js"

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('contactId');

let selectedContact;

function fillForm(contact) {
    // CORREZIONE: Mappatura campi API -> Input HTML
    document.getElementById('name').value = contact.FirstName;
    document.getElementById('surname').value = contact.Surname;
    document.getElementById('phone').value = contact.PhoneNumber;
    document.getElementById('email').value = contact.Email || ''; // Gestione caso vuoto
}

if(id) {
    getContact(id).then(result => {
        selectedContact = result;
        fillForm(selectedContact);
    });
} else {
    alert("Nessun ID contatto fornito!");
    window.location.assign('../');
}

function deleteAndRedirect() {
    // CORREZIONE: Uso FirstName per il messaggio
    if (confirm("Vuoi veramente eliminare " + selectedContact.FirstName + "?")) {
        deleteContact(selectedContact.id).then(_ => {
            window.location.assign('../');
        });  
    }
}

document.getElementById("delete-btn")
.addEventListener("click", deleteAndRedirect);


function saveChanges(event) {
    event.preventDefault(); 

    const form = document.getElementById('edit-form');
    const data = new FormData(form);

    // CORREZIONE: Creazione oggetto con le chiavi corrette per l'API
    const updatedData = {
        FirstName: data.get('name'),
        Surname: data.get('surname'),
        PhoneNumber: data.get('phone'),
        Email: data.get('email')
    };

    updateContact(selectedContact.id, updatedData)
    .then(result => {
        console.log("Contatto aggiornato:", result);
        alert("Modifiche salvate!");
        window.location.assign('../');
    });
}

document.getElementById("edit-form")
.addEventListener("submit", saveChanges);