import {getAllContacts, deleteContact} from "./shared/contact-service.js"

let contacts = [];
let isSortedByName = false; // Stato iniziale dell'ordinamento

function displayContacts(contactsToList){

    const contactsContainer = document.getElementById('contacts-container');
    contactsContainer.innerHTML = "";

    if(contactsToList.length === 0) {
        contactsContainer.innerHTML = "<p style='text-align:center; color:#999; margin-top:20px;'>Nessun contatto trovato.</p>";
        return;
    }

    for (const contact of contactsToList) {
        
        // Contenitore Card
        const card = document.createElement('div');
        card.classList.add('contact-card'); 

        // 1. Info (Sinistra)
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info-group');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('info-name');
        const fullName = contact.FirstName + (contact.Surname ? " " + contact.Surname : "");
        nameSpan.innerText = fullName;
        
        const phoneSpan = document.createElement('span');
        phoneSpan.classList.add('info-phone');
        // Mostro anche l'ID per debug/chiarezza se stiamo ordinando per ID, o l'email
        const details = contact.PhoneNumber; 
        phoneSpan.innerText = details;

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(phoneSpan);
        card.appendChild(infoDiv);

        // 2. Azioni (Destra)
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions-group');
        
        // Tasto Modifica (Freccia/Matita)
        const editLink = document.createElement('a');
        editLink.classList.add('icon-btn', 'edit');
        editLink.href = './detail/detail.html?contactId=' + contact.id;
        // Icona SVG modifica
        editLink.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
        actionsDiv.appendChild(editLink);

        // Tasto Cancella
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('icon-btn', 'delete');
        // Icona SVG cestino
        deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

        deleteBtn.addEventListener('click', () => {
            if(confirm("Vuoi davvero eliminare " + contact.FirstName + "?")) {
                deleteContact(contact.id)
                .then(_ => {
                    contacts = contacts.filter(c => c.id !== contact.id);
                    // Riapplichiamo il filtro corrente se c'è
                    applyFilterAndSort(); 
                })
            }
        })
        actionsDiv.appendChild(deleteBtn);

        card.appendChild(actionsDiv);
        contactsContainer.appendChild(card);
    }
}

// Funzione unica che gestisce Ordinamento + Filtro insieme
function applyFilterAndSort() {
    // 1. Filtro
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    let filtered = contacts.filter(contact => {
        const nameFound = contact.FirstName.toLowerCase().includes(searchTerm);
        const surnameFound = contact.Surname && contact.Surname.toLowerCase().includes(searchTerm);
        const phoneFound = contact.PhoneNumber && contact.PhoneNumber.includes(searchTerm);
        return nameFound || surnameFound || phoneFound;
    });

    // 2. Ordinamento
    if (isSortedByName) {
        // Ordina A-Z
        filtered.sort((c1, c2) => c1.FirstName.toLowerCase().localeCompare(c2.FirstName.toLowerCase()));
    } else {
        // Ordina per ID (che di solito corrisponde all'ordine di creazione)
        // Se gli ID sono numerici stringa, usiamo parseInt, altrimenti localeCompare
        filtered.sort((c1, c2) => parseInt(c2.id) - parseInt(c1.id)); // Dal più recente al più vecchio
    }

    displayContacts(filtered);
}

// Logica del pulsante Toggle
function toggleSortOrder() {
    const btn = document.getElementById("sort-toggle-btn");
    
    // Invertiamo lo stato
    isSortedByName = !isSortedByName;

    if (isSortedByName) {
        // Ora è ordinato per nome, quindi il tasto deve proporre di tornare all'ID
        btn.innerText = "Ordina per ID"; // O "Ordina Recenti"
        btn.style.backgroundColor = "#eef4ff"; // Feedback visivo (opzionale)
        btn.style.color = "#007AFF";
    } else {
        // Ora è per ID, il tasto propone A-Z
        btn.innerText = "Ordina A-Z";
        btn.style.backgroundColor = "white";
        btn.style.color = "#555";
    }

    applyFilterAndSort();
}


// Event Listeners
document.getElementById("sort-toggle-btn").addEventListener('click', toggleSortOrder);
document.getElementById("search-input").addEventListener('input', applyFilterAndSort);

// Init
getAllContacts().then(results => {
    // Ordiniamo inizialmente per ID (i più recenti in alto magari)
    contacts = results;
    // Di default isSortedByName è false, quindi ordina per ID
    applyFilterAndSort();
});