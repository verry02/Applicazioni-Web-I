import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API.mjs';
import ObiettiviNuovi from "./ObiettiviNuovi.jsx";

function Partita({ user }) {
  const [livello, setLivello] = useState('');
  const [numero, setNumero] = useState('');
  const [messaggio, setMessaggio] = useState('');
  const [tentativi, setTentativi] = useState(0);
  const [numeroSegreto, setNumeroSegreto] = useState(null);
  const [maxTentativi, setMaxTentativi] = useState(0);
  const [livelloSelezionato, setLivelloSelezionato] = useState(false);
  const [showObiettivi, setShowObiettivi] = useState(false);
  const [mode, setMode] = useState('play'); 
  const navigate = useNavigate();

  //se l'utente non è loggato reindirizza alla pagina di login
  useEffect(() => {
    if (!user) {
      navigate('/Homepage/login');
    }
  }, [user, navigate]);

  //ogni volta che il livello cambia, si generano un nuovo numero segreto e un nuovo numero di tentativi disponibile 
  useEffect(() => {
    if (livello) {
      API.generaNumeroSegreto({ livello })
        .then((res) => {
          setNumeroSegreto(res.numeroSegreto);
          setMaxTentativi(res.maxTentativi);
          console.log('Numero segreto:', res.numeroSegreto);
          console.log('Tentativi rimanenti:', res.maxTentativi);
        })
        .catch((err) => {
          console.error('Errore nella generazione del numero segreto:', err);
        });
    }
  }, [livello]);

  /*queste due funzioni servono a gestire l'interazione dell'utente con il form durante il gioco, qundi quando inserisce un numero ed invia un tentativo
  quando l'utente inserisce un numero, questo viene aggiorna lo stato locale numero con il valore inserito nel campo del form.La seconda funzione serve per 
  impedire alla pagina di ricaricarsi quando l'utente preve il tasto "invia" sul form */
  const handleNumeroChange = (event) => {
    setNumero(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    

    //verifico se la partita è in modalità play
    if (mode === 'play') {
      try {
        //invio il tentativo al server e ricevo dal server come "risposta" il feedback in base al tentativo 
        const risposta = await API.inviaTentativo({ numero });
        setMessaggio(risposta.messaggio);
        let alertMessage = risposta.messaggio;

        //se ho indovinato il numero chiamo le prime api 
        if (risposta.messaggio === 'Hai indovinato il numero!') {
          await API.partiteVinte(user.name);
          await API.partiteVinteLivello(user.name, { livello });

         //se ho terminato i tentativi e perso la partita chiamo l'api per resettare la partita 
        } else if (tentativi + 1 >= maxTentativi) {
          alertMessage = `Hai raggiunto il limite massimo di tentativi. Il numero segreto era ${numeroSegreto}.`;
          await API.resetConsecutive(user.name);

        //altrimenti la partita è ancora in corso, quindi ricevo dal server il numero di tentativi rimanenti
        } else {
          setTentativi(tentativi + 1);
          alertMessage += ` Tentativi rimanenti: ${maxTentativi - (tentativi + 1)}.`;
        }

        setMessaggio(alertMessage);//visualizzo quindi il messaggio

        //api che chiamo a prescindere dal risultato
        if (risposta.messaggio === 'Hai indovinato il numero!' || tentativi + 1 >= maxTentativi) {
          await API.partiteGiocate(user.name);
          await API.checkAddObiettivoGiocata(user.name, { livello });
          await API.checkAddObiettivoVinta(user.name, { livello });
          await API.checkAddObiettivoConsecutive(user.name, { livello });
          await API.checkAddObiettivoLivello(user.name, { livello });
          
          //aspetto un secondo prima di visualizzare la tabella con i nuovi obiettivi, per far aggiornare il database
          setTimeout(() => setShowObiettivi(true), 1000);
          setMode('replay');
        }
      } catch (err) {
        console.error('Errore nell\'invio del tentativo:', err);
        setMessaggio('Errore nell\'invio del tentativo. Riprova.');
      }

      //se sono in modalità replay (quindi quando il tasto diventa "Rigioca"), resetto i campi per preparare il form alla nuova partita
    } else if (mode === 'replay') {
      await API.resetNuovo(user.name);
      setTentativi(0);
      setMessaggio('');
      setNumero('');
      setNumeroSegreto(null);
      setMaxTentativi(0);
      setShowObiettivi(false);
      setMode('play'); // Torna alla modalità 'play'

      try {
        const res = await API.generaNumeroSegreto({ livello });
        setNumeroSegreto(res.numeroSegreto);
        setMaxTentativi(res.maxTentativi);
        console.log('Numero segreto:', res.numeroSegreto);
        console.log('Tentativi rimanenti:', res.maxTentativi);
        await API.checkAddObiettivoLivello(user.name, { livello });

      } catch (err) {
        console.error('Errore nella generazione del numero segreto:', err);
      }

    }
  };

  const handleResetAndNavigate = async () => {
    await API.resetNuovo(user.name);
    navigate(-1);
  };

  //se il livello è stato già selezionato, non posso modificarlo
  const handleLivelloChange = (e) => {
    if (!livelloSelezionato) {
      setLivello(e.target.value);
      setLivelloSelezionato(true);
    }
  };

  //sfondo
  const backgroundStyle = {
    backgroundImage: 'url(/numeri.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    margin: 0,
  };

  return (
    <div style={backgroundStyle}>
      <Container className="mt-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '5px' }}>
        <Row>
          <Col>
            <h3 style={{ textDecoration: 'underline', color: 'darkred' }}>Nuova Partita</h3>
            <p style={{ fontStyle: 'italic' }}>
              Prima di iniziare, scegli il livello di difficoltà. Buona fortuna, campione dei numeri!
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formLivello" className="p-4 bg-light rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Form.Label>Livello</Form.Label>
                <Form.Control 
                  as="select" 
                  value={livello} 
                  onChange={handleLivelloChange} 
                  required
                  disabled={livelloSelezionato}
                >
                  <option value="">Seleziona un livello</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formNumero" className="p-4 bg-light rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Form.Label>Numero</Form.Label>
                <Form.Control 
                  type="number" 
                  value={numero} 
                  onChange={handleNumeroChange} 
                  placeholder="Inserisci un numero" 
                  required 
                />
              </Form.Group>
              <Button variant="success" type="submit" className="mt-3">
                {mode === 'play' ? 'Invia' : 'Rigioca'} {/* Cambia il testo del bottone in base alla modalità */}
              </Button>
              <Button variant="secondary" onClick={handleResetAndNavigate} className="mt-3 ms-2">
                Indietro
              </Button>
            </Form>

            {messaggio && (
              <Container className="mt-3">
                <p style={{ fontStyle: 'italic' }}>{messaggio}</p>
                <Col xs="auto">
                  {showObiettivi && <ObiettiviNuovi user={user} />}
                </Col>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Partita;
