import { User, Obiettivo, ObiettiviUtente } from './Models.mjs';

const SERVER_URL = 'http://localhost:3001'; //definisco la url del server così tutte le api possono utilizzarla 

const handleResponse = async (response) => {
  //per tutte le risposte la gestione è la stessa, quindi si crea una funzione che verrà ripetuta in ogni api.
  const content = await response.json();
  if (response.ok) {
    return content;
  } else {
    throw new Error(`Error ${response.status}: ${content.message || content}`);
  }
};

//SESSION

// /api/sessions (Login)
const logIn = async (credentials) => {
  /*login fa una fetch al server, mandiamo un oggetto json, le credenziali sono incluse , trasformo in stringa l'oggetto json
  se ho una risposta positiva prendiamo il json e lo inseriamo nell'oggetto utente, altrimenti ricaviamo il testo della risposta per leggere l'errore.  */
  const response = await fetch(`${SERVER_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',//lo aggiungo in tutte le api che chiedono di inviare i cookie 
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};
// /api/sessions/current (sessione corrente)
const getSessioneCorrente = async () => {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/sessions/current (logout)
//effettua la delete della sessione 
const logout = async () => {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.ok) return null;
};

///api/sessions/current ( da user_dao)
//lo si chiama per verificare se l'utente è ancora loggato. si fa una get all'api session current. 
const getUserInfo = async () => {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

//ALTRO

// /api/generaNumeroSegreto
const generaNumeroSegreto = async (dati) => {
  const response = await fetch(`${SERVER_URL}/api/generaNumeroSegreto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dati),
  });
  return handleResponse(response);
};

// /api/inviaTentativo
const inviaTentativo = async (dati) => {
  const response = await fetch(`${SERVER_URL}/api/inviaTentativo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(dati),
  });
  return handleResponse(response);
};

//UTENTE

// /api/utente/:id
const infoUtente = async (id) => {
  const response = await fetch(`${SERVER_URL}/api/utente/${id}`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/PartiteGiocate/:name
const partiteGiocate = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/PartiteGiocate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/PartiteVinte/:name
const partiteVinte = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/PartiteVinte`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/resetConsecutive/:name
const resetConsecutive = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/resetConsecutive`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/PartiteVinteLivello/:name
const partiteVinteLivello = async (name, livello) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/PartiteVinteLivello`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify( livello ),
  });
  return handleResponse(response);
};


//OBIETTIVO

// /api/obiettivi
const listObiettivi = async () => {
  const response = await fetch(`${SERVER_URL}/api/obiettivi`, {
    credentials: 'include',
  });
  return handleResponse(response); //costruisco un array in ui 
};

//OBIETTIVI UTENTE 

// /api/utenti/:name/obiettiviUtente
const listObiettiviUtente = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente`, {
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/obiettiviNuovi
const listObiettiviNuovi = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/obiettiviNuovi`,{
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/checkAddObiettivoGiocata
const checkAddObiettivoGiocata = async (name, livello) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/checkAddObiettivoGiocata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify (livello ),

  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/checkAddObiettivoVinta
const checkAddObiettivoVinta = async (name, livello) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/checkAddObiettivoVinta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify (livello )

  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/checkAddObiettivoConsecutive
const checkAddObiettivoConsecutive = async (name, livello) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/checkAddObiettivoConsecutive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify (livello )
  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/checkAddObiettivoLivello
const checkAddObiettivoLivello = async (name, livello) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/checkAddObiettivoLivello`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify (livello ), // Invia il livello come oggetto JSON
  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/resetNuovo
const resetNuovo = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/resetNuovo`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return handleResponse(response);
};

// /api/utenti/:name/obiettiviUtente/obiettiviProssimi 
const listObiettiviProssimi = async (name) => {
  const response = await fetch(`${SERVER_URL}/api/utenti/${name}/obiettiviUtente/obiettiviProssimi`, {
    credentials: 'include',
  });
  return handleResponse(response);
};


const API = {
  logIn,getSessioneCorrente,logout,getUserInfo,
  generaNumeroSegreto,inviaTentativo,
  infoUtente,partiteGiocate,partiteVinte,resetConsecutive, partiteVinteLivello,
  listObiettivi,listObiettiviUtente,listObiettiviNuovi,checkAddObiettivoGiocata,
  checkAddObiettivoVinta,checkAddObiettivoConsecutive,checkAddObiettivoLivello,
  resetNuovo,listObiettiviProssimi
};


export default API;
