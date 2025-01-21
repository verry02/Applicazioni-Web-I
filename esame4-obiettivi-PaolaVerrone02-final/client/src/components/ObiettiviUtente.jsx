import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import API from '../API.mjs'; 

/* il componente ObiettiviUtente gestisce la logica per recuperare e visualizzare gli obiettivi raggiunti e da raggiungere per l'utente loggato.
Utilizza useEffect per effettuare chiamate API e aggiornare lo stato. Mostra tabelle con gli obiettivi raggiunti (ObiettiviRaggiunti) e da 
raggiungere (ObiettiviProssimi). RigaObiettivo è un componente di supporto che visualizza i dettagli di ciascun obiettivo in una riga della tabella.*/

/*Si definisce lo stato per gli obiettivi raggiunti dall'utente (obiettiviUtente), gli obiettivi prossimi (obiettiviProssimi) e eventuali errori (error). */
function ObiettiviUtente({ loggedIn, user }) {
  const [obiettiviUtente, setObiettiviUtente] = useState([]);
  const [obiettiviProssimi, setObiettiviProssimi] = useState([]);
  const [error, setError] = useState('');

  /* useEffect per eseguire due funzioni asincrone (fetchObiettiviUtente e fetchObiettiviProssimi) quando l'utente è loggato e il valore di user è disponibile.
  fetchObiettiviUtente: Chiama l'API per ottenere gli obiettivi raggiunti dall'utente e aggiorna lo stato obiettiviUtente.
  fetchObiettiviProssimi: Chiama l'API per ottenere gli obiettivi prossimi e aggiorna lo stato obiettiviProssimi.
  Se si verifica un errore durante il recupero degli obiettivi, aggiorna lo stato error. */
  useEffect(() => {
    const fetchObiettiviUtente = async () => {
      try {
        const obiettiviUtente = await API.listObiettiviUtente(user);
        setObiettiviUtente(obiettiviUtente);
      } catch (err) {
        console.error('Error fetching user objectives:', err);
        setError('Errore nel recupero degli obiettivi. Riprova più tardi.');
      }
    };
    
    const fetchObiettiviProssimi = async () => {
      try {
        const obiettiviProssimi = await API.listObiettiviProssimi(user);
        setObiettiviProssimi(obiettiviProssimi);
      } catch (err) {
        console.error('Error fetching next objectives:', err);
        setError('Errore nel recupero degli obiettivi. Riprova più tardi.');
      }
    };

    if (loggedIn && user) {
      fetchObiettiviUtente();
      fetchObiettiviProssimi();
    }
  }, [loggedIn, user]);
  
  /*Se c'è un errore (error), mostra il messaggio di errore.
  Altrimenti, renderizza i componenti ObiettiviRaggiunti e ObiettiviProssimi, passando loro i rispettivi stati (obiettiviUtente e obiettiviProssimi). */
  return (
    <div className="mt-3">
      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <ObiettiviRaggiunti obiettiviUtente={obiettiviUtente} />
          <ObiettiviProssimi obiettiviProssimi={obiettiviProssimi} />
        </>
      )}
    </div>
  );
}

/* Componente per visualizzare gli obiettivi raggiunti. Renderizza una tabella che elenca gli obiettivi raggiunti dall'utente*/
function ObiettiviRaggiunti({ obiettiviUtente }) {
  return (
    <div>
      <h3 style={{ textDecoration: 'underline', color: 'darkred' }}>Obiettivi Raggiunti</h3>
      <p style={{ fontStyle: 'italic' }}>
        In questa tabella trovi elencati tutti gli obiettivi che hai raggiunto, continua a giocare per ottenerne altri!
      </p>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th></th>
            <th>Nome Obiettivo</th>
            <th>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {obiettiviUtente.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">Non hai ancora raggiunto alcun obiettivo!</td>
            </tr>
          ) : (
            obiettiviUtente.map((obiettivo) => (
              <RigaObiettivo key={Math.random()} obiettivo={obiettivo} />
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

/* Componente per visualizzare gli obiettivi raggiunti. Renderizza una tabella che elenca gli obiettivi che l'utente ancora non ha raggiunto*/
function ObiettiviProssimi({ obiettiviProssimi }) {
  return (
    <div>
      <h3 style={{ textDecoration: 'underline', color: 'darkred' }}>Obiettivi Da Raggiungere</h3>
      <p style={{ fontStyle: 'italic' }}>
        In questa tabella trovi elencati tutti gli obiettivi che ancora non hai raggiunto, continua a giocare per ottenerne altri!
      </p>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th></th>
            <th>Nome Obiettivo</th>
            <th>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {obiettiviProssimi.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">Non hai obiettivi da raggiungere al momento!</td>
            </tr>
          ) : (
            obiettiviProssimi.map((obiettivo) => (
              <RigaObiettivo key={Math.random()} obiettivo={obiettivo} iconaDaRaggiungere />
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

/*Componente comune per visualizzare una riga della tabella Renderizza una riga della tabella per un obiettivo.
Mostra un'icona (diversa se l'obiettivo deve essere raggiunto) e le informazioni dell'obiettivo (nome e descrizione).*/
function RigaObiettivo({ obiettivo, iconaDaRaggiungere }) {
  return (
    <tr>
      <td>
        <img 
          src={iconaDaRaggiungere ? "/obiettivoDaRaggiungere.png" : obiettivo.icona} 
          alt={iconaDaRaggiungere ? "Obiettivo da Raggiungere" : "Obiettivo"} 
          style={{ width: '30px', height: '30px' }} 
        />
      </td>
      <td>{obiettivo.obiettivo}</td>
      <td>{obiettivo.descrizione}</td>
    </tr>
  );
}

export default ObiettiviUtente;