import {getAllContacts, deleteContact} from "./shared/contact-service.js"

let contacts = [];

function displayContacts(contactsToList){

    const contactsContainer = document.getElementById('contacts-container');
    contactsContainer.innerHTML = "";

    for (const contact of contactsToList) {
        
        const card = document.createElement('div');
        card.classList.add('todo-card'); 

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('color-and-title');

        const textDiv = document.createElement('div');
        textDiv.style.display = "flex";
        textDiv.style.flexDirection = "column";

        const nameSpan = document.createElement('strong');
        // CORREZIONE: Uso FirstName e Surname
        const fullName = contact.FirstName + (contact.Surname ? " " + contact.Surname : "");
        nameSpan.appendChild(document.createTextNode(fullName));
        
        const phoneSpan = document.createElement('span');
        phoneSpan.style.fontSize = "0.9em";
        phoneSpan.style.color = "#555";
        // CORREZIONE: Uso PhoneNumber e mostro anche l'Email se c'è
        const details = contact.PhoneNumber + (contact.Email ? ` - ${contact.Email}` : "");
        phoneSpan.appendChild(document.createTextNode(details));

        textDiv.appendChild(nameSpan);
        textDiv.appendChild(phoneSpan);

        infoDiv.appendChild(textDiv);
        card.appendChild(infoDiv);

        const actionsDiv = document.createElement('div');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.appendChild(document.createTextNode("✕"));
        deleteBtn.classList.add("action");
        deleteBtn.style.marginRight = "4px";
        deleteBtn.style.color = "red";
        deleteBtn.style.borderColor = "red";

        deleteBtn.addEventListener('click', () => {
            // CORREZIONE: Uso FirstName per il messaggio di conferma
            if(confirm("Vuoi davvero eliminare " + contact.FirstName + "?")) {
                deleteContact(contact.id)
                .then(_ => {
                    contacts = contacts.filter(c => c.id !== contact.id);
                    displayContacts(contacts);
                })
            }
        })

        actionsDiv.appendChild(deleteBtn);

        const detailLink = document.createElement('a');
        detailLink.appendChild(document.createTextNode("🠊"));
        detailLink.classList.add("action");
        detailLink.href = './detail/detail.html?contactId=' + contact.id;

        actionsDiv.appendChild(detailLink);

        card.appendChild(actionsDiv);

        contactsContainer.appendChild(card);
    }
}

function orderByName() {
    contacts.sort((c1, c2) => {
        // CORREZIONE: Ordinamento su FirstName
        const name1 = c1.FirstName.toLowerCase();
        const name2 = c2.FirstName.toLowerCase();
        return name1.localeCompare(name2);
    });
    displayContacts(contacts);
}

function filterContacts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    const filtered = contacts.filter(contact => {
        // CORREZIONE: Filtro sui campi corretti dell'API
        const nameFound = contact.FirstName.toLowerCase().includes(searchTerm);
        const surnameFound = contact.Surname && contact.Surname.toLowerCase().includes(searchTerm);
        const phoneFound = contact.PhoneNumber && contact.PhoneNumber.includes(searchTerm);
        
        return nameFound || surnameFound || phoneFound;
    });

    displayContacts(filtered);
}

document.getElementById("sort-az-btn").addEventListener('click', orderByName);
document.getElementById("search-input").addEventListener('input', filterContacts);

getAllContacts().then(results => {
    contacts = results;
    displayContacts(contacts);
});
