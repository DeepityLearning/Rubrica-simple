import {postContact} from "../shared/contact-service.js"

function saveContact(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const data = new FormData(form);

    // CORREZIONE: Mappatura esatta keys API
    const newContact = {
        FirstName: data.get('name'),
        Surname: data.get('surname'),
        PhoneNumber: data.get('phone'),
        Email: data.get('email')
    };

    postContact(newContact)
    .then(createdContact => {
        console.log('Contatto creato:', createdContact);
        form.reset();
        window.location.assign('../');
    })
}

document.getElementById("contact-form")
.addEventListener('submit', saveContact)