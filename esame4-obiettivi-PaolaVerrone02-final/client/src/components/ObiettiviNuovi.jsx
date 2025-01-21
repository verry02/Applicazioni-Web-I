import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import API from '../API.mjs';  

/* Questo componente non è stato diviso in più componenti come "ObiettiviUtente" in quanto perché ritardavano a ricaricare a causa del setWait 
 impostato in partita.jsx */

function ObiettiviNuovi({  user }) {
  const [obiettivi, setObiettivi] = useState([]); //Array per memorizzare tutti gli obiettivi disponibili.
  const [obiettiviNuovi, setObiettiviNuovi] = useState([]); //Array per memorizzare i nuovi obiettivi sbloccati dall'utente.
  const [error, setError] = useState(''); //Stringa per memorizzare eventuali messaggi di errore.

  useEffect(() => {
    // Fetch degli obiettivi
    const fetchObiettivi = async () => {
      try {
        const obiettivi = await API.listObiettivi();
        setObiettivi(obiettivi);
        console.log(user.name);
      } catch (err) {
        console.error('Error fetching objectives:', err);
        setError('Errore nel recupero degli obiettivi. Riprova più tardi.');
      }
    };

    // Fetch degli obiettivi utente
    const fetchObiettiviNuovi = async () => {
      try {
        const obiettiviNuovi = await API.listObiettiviNuovi(user.name);
        setObiettiviNuovi(obiettiviNuovi);
        
      } catch (err) {
        console.error('Error fetching user objectives:', err);
        setError('Errore nel recupero degli obiettivi. Riprova più tardi.');
      }
    };

  
    if ( user) {
      fetchObiettivi();
      fetchObiettiviNuovi();
    }
  }, [ user]);

  return (
    <div className="mt-3">
      <h3 style={{ textDecoration: 'underline', color: 'darkred',  }}>Nuovi Obiettivi</h3>
      <p style={{ fontStyle: 'italic' }}>
  Ecco il resoconto degli obiettivi sbloccati durante la partita che hai appena concluso. Continua a giocare per ottenerne altri!
</p>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
          <th></th>
            <th>Nome Obiettivo</th>
            <th>Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {obiettiviNuovi.length === 0 ? (
            <tr>
                <td colSpan="3" className="text-center">Non hai raggiunto altri obiettivi!</td>
            </tr>
            ) : (
              obiettiviNuovi.map((obiettivo) => (
              <tr key={obiettivo.id}>
                <td><img width="50" height="50" src ={obiettivo.icona} alt="darts"/> </td>
                <td>{obiettivo.obiettivo}</td>
                <td>{obiettivo.descrizione}</td>
              </tr>
              ))
            )}
        </tbody>
      </Table>
      )}
    </div>
    );
  };
export default ObiettiviNuovi;

