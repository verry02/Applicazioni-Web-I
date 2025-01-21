/* Import necessari */
  import { db } from './db.mjs'; //importo il database dichiarato in db.mjs
  import crypto from 'crypto'; //Per le funzionalità crittografiche sulla gestione di algoritmi crittografici

/* Cerco un utente in base alle credenziali fornite. 
    La funzione è di tipo asincrono e cerca un utente nel database in base alla coppia email e
    password forniti. Utilizza una Promessa per gestire il flusso asincrono(resolve in 
    caso di successo, reject in caso di errore, con relative informazioni).
 */
  export const getUser = (email, password) => {
    /* efettuo una query SQL al database e cerco l'email inviata al server. La funzione callback 
       riceve un errore (err) o il risultato della query (row). */
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        //se si verifica un errore nella query, la promessa viene rigettata con err,
        if (err) { 
          reject(err); 
        }
        //se non viene trovato nessun utente con l'email fornita, la Promessa viene risolta con false.
        else if (row === undefined) { 
          resolve(false); 
        }
        else {
          /* Se viene trovato un utente, viene creato un oggetto user con le informazioni 
              di base dell'utente (id, email e name).*/
          const user = {id: row.id, username: row.email, name: row.name};
          /* Viene generato l'hash crittografico della password fornita utilizzando la stessa 
             salt memorizzata nel database.  
          */
          crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
            if (err) reject(err);
            //La funzione crypto.timingSafeEqual viene utilizzata per confrontare l'hash generato con 
            // quello salvato nel database in  modo sicuro.
            if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
              resolve(false); //Se non coincidono,la Promessa viene risolta con false
            else
              resolve(user); //altrimenti viene risolta con l'oggetto user
          });
        }
      });
    });
  };

/* Cerco un utente in base all'id fornito 
   La funzione è di tipo asincrono e cerca un utente nel database in base all'id fornto.
    Utilizza una Promessa per gestire il flusso asincrono resolve in caso di successo, 
    reject in caso di errore, con relative informazioni)
*/
  export const getUserById = (id) => {
    /* Viene eseguita una query SQL per cercare l'utente con l'ID fornito nel database.
      La funzione callback riceve un eventuale errore (err) o il risultato della query (row). */
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) { 
          reject(err); //Se c'è un errore nella query, la Promessa viene rigettata con l'errore.
        }
        /*Se non viene trovato nessun utente con l'ID fornito, la Promessa viene risolta 
        con un oggetto contenente un messaggio di errore. */
        else if (row === undefined) { 
          resolve({error: 'User not found!'}); 
        }
        else {
          /*Se viene trovato un utente, viene creato un oggetto user con le informazioni di base dell'utente*/
          const user = {id: row.id, username: row.email, name: row.name};
          resolve(user); //la Promessa viene risolta co l'oggetto user, che contiene le informazioni trovate
        }
      });
    });
  };