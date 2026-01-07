// URL aggiornato alla tua API dei contatti
const baseUrl = "https://69411cdb686bc3ca8165aaf1.mockapi.io/api/v1/ContactInfo";

export function getAllContacts() {
    const apiUrl = baseUrl;

    return fetch(apiUrl)
    .then(response => response.json())
    .then(result => result)
    .catch(error => console.error('Aiuuutoooo!', error));
}

export function getContact(id) {
    const apiUrl = baseUrl + "/" + id;

    return fetch(apiUrl)
    .then(response => response.json())
    .then(result => result)
    .catch(error => console.error('Aiuuutoooo!', error));
}
 
export function deleteContact(id) {
    const apiUrl = baseUrl + "/" + id;

    return fetch(apiUrl, {method: 'DELETE'})
    .then(response => response.json())
    .then(result => result)
    .catch(error => console.error('Aiuuutoooo!', error))
}

// Questa funzione sostituisce la vecchia 'changeDoneStatus'. 
// Serve per aggiornare tutti i dati (Nome, Cognome, ecc.)
export function updateContact(id, contactData) {
    const apiUrl = baseUrl + "/" + id;

    return fetch(apiUrl, {
        method: 'PUT', // MockAPI accetta PUT per aggiornare l'oggetto
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(contactData)
    }).then(response => response.json())
    .then(result => result)
    .catch(error => console.error('Aiuuutoooo!', error))
}

export function postContact(contact) {
    const apiUrl = baseUrl;

    return fetch(apiUrl, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(contact)
    }).then(res => res.json())
    .then(result => result)
    .catch(error => console.error('Error:', error));
}