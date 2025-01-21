import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

/* Il componente Regole è un componente che mostra le regole del gioco e una tabella degli obiettivi in un accordion. se l'utente è loggato, l'utente ha la
possibilità di comprimere ed espandere il componente a proprio piacimento, altrimenti rimane esteso per tutta la pagina e non è possibile fare nessuna azione sul
componente */
function Regole(props) {
  const [activeKey, setActiveKey] = useState(props.loggedIn ? "0" : "1");

  useEffect(() => {
    setActiveKey(props.loggedIn ? "0" : "1");
  }, [props.loggedIn]);

  const handleAccordionSelect = (key) => {
    if (props.loggedIn) {
      setActiveKey(key);
    }
  };

  return (
    <>
      <Accordion activeKey={activeKey} onSelect={handleAccordionSelect}>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Non sai da dove iniziare? Diamo un'occhiata alle regole del gioco!</Accordion.Header>
          <Accordion.Body>
            Prima di iniziare ti verrà chiesto di selezionare un livello di difficoltà compreso tra 1 e 4. Successivamente
            verrà generato un numero segreto, compreso tra 1 e 10 elevato alla potenza del numero di difficoltà che hai scelto: 
            <ul>
              <li> Livello 1: 1 - 10</li>
              <li> Livello 2: 1 - 100</li>
              <li> Livello 3: 1 - 1.000</li>
              <li> Livello 4: 1 - 10.000</li>
            </ul>
             Anche il numero di tentativi che hai a disposizione dipende dal livello di difficoltà che scegli:
             <ul>
              <li> Livello 1: 4*1 = 4 tentativi</li>
              <li> Livello 2: 4*2 = 8 tentativi</li>
              <li> Livello 3: 4*3 = 12 tentativi</li>
              <li> Livello 4: 4*4 = 16 tentativi</li>
            </ul>
            Sembra difficile? Non preoccuparti! al termine di ogni tentativo riceverai un suggerimento, il quale ti 
            dirà se il numero appena inserito è troppo alto o troppo basso rispetto al numero segreto. 
            Se non riesci ad indovinare il numero, purtroppo perderai la partita, ma se indovini, non solo vincerai il gioco, 
            ma avrai la possibilità di ottenere degli obiettivi! Alcuni obiettivi si ottengono una sola volta, altri dipendono
            dal livello che scegli e altri ancora sono ripetibili. Ecco una tabella riassuntiva con tutti gli obiettivi
            e cosa devi fare per raggiungerli: 
            
             <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Condizione </th>
                  <th>Nome</th>
                  <th>Descrizione</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                  <td>Prima partita giocata</td>
                  <td>Esordio epico!</td>
                  <td>Congratulazioni! Hai completato la tua prima partita.</td>
                </tr>
                <tr>
                  <td>Prima partita vinta</td>
                  <td>Primo Trionfo!</td>
                  <td>Fantastico! Hai vinto la tua prima partita.</td>
                </tr>
                <tr>
                  <td>1 vittoria a livello k</td>
                  <td>Trionfo iniziale!</td>
                  <td>Bene! Hai vinto la tua prima partita di livello k.</td>
                </tr>
                <tr>
                  <td>2 vittorie a livello k</td>
                  <td>Doppio Dominio!</td>
                  <td>Ottimo! Hai vinto due partite di livello k.</td>
                </tr>
                <tr>
                  <td>3 vittorie a livello k </td>
                  <td>Tripletta leggendaria!</td>
                  <td>Fantastico! Hai vinto tre partite di livello k.</td>
                </tr>
                <tr>
                  <td>4 vittorie a livello k</td>
                  <td>Quadrifoglio della gloria!</td>
                  <td>Sei un grande! Hai vinto quattro partite di livello k.</td>
                </tr>
                <tr>
                  <td>2 vittorie consecutive</td>
                  <td>Eroe della doppia!</td>
                  <td>Bell'inizio! Hai vinto due partite consecutive, riesci a vincere anche la terza?</td>
                </tr>
                <tr>
                  <td>3 vittorie consecutive</td>
                  <td>Maestro della tripletta!</td>
                  <td>Continua così! Hai vinto tre partite consecutive, proviamo a vincere anche la quarta?</td>
                </tr>
                <tr>
                  <td>4 vittorie consecutive </td>
                  <td>Campione del quattro!</td>
                  <td>Impressionante! Hai vinto quattro partite consecutive. Sai che se arrivi a cinque ottieni tutti gli obiettivi?</td>
                </tr>
                <tr>
                  <td>5 vittorie consecutive</td>
                  <td>Leggenda dell'imbattibilità!</td>
                  <td>Sei imbattibile! Hai vinto cinque partite consecutive. Continua a giocare per ottenere altri obiettivi</td>
                </tr>
              </tbody>
            </Table>
            Allora, sei pronto a diventare il campione dei numeri? Assicurati di aver effettuato il login e inizia a vincere!
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

Regole.propTypes = {
  loggedIn: PropTypes.bool.isRequired
};

export default Regole;
