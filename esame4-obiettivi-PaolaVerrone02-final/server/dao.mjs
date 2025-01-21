/* Import necessari */
  import { User, Obiettivo, ObiettiviUtente } from './Models.mjs'; //importo i modelli
  import { db } from './db.mjs'; //importo il database 

// USER
//Riepilogo utente  
export const infoUtente = (id) => {
/*Questa funzione viene utilizzata per ottenere informazioni sull'utente loggato. 
  Restituisce una Promessa che si risolve con i dati dell'utente se la query 
  al database ha successo, oppure si rigetta in caso di errore. */
  return new Promise((resolve, reject) => {
  /* Viene eseguita una query SQL per cercare l'utente con l'ID fornito nel database. 
  La funzione db.aget esegue la query e restituisce la riga trovata. */
    const sql = `SELECT id, name, partiteGiocate, partiteVinte, partiteConsecutive 
                  FROM user 
                  WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err); 
      } else if (row === undefined) { 
        /* Se non viene trovato alcun utente con l'ID fornito, la Promessa viene risolta 
        con un oggetto contenente un messaggio di errore.*/
        reject(err); 
      } else {
        /* Se viene trovato un utente, viene creato un oggetto user con le informazioni 
          essenziali dell'utente. .*/
          const user = {id: row.id, username: row.email, name: row.name};
          resolve(user); //la Promessa viene risolta co l'oggetto user, che contiene le informazioni trovate
        }
      });
    });
  };

// Incrementa di 1 il numero di user.partiteGiocate  
export const aggiungiPartitaGiocata = (name) => {
  /* Questa funzione serve per incrementare di 1 il numero di partite giocate dall'utente 
  loggato (utente specificato attraverso il parameto name). La Promessa gestisce l'operazione 
  asincrona con resolve (se l'operazione ha successo) o reject (se si verifica un errore). */
  return new Promise((resolve, reject) => {
    /* Viene eseguita una query SQL di tipo UPDATE per aumentare di 1 il numero di partite giocate 
    per l'utente con il nome fornito.*/
    const query = `UPDATE user 
                    SET partiteGiocate = partiteGiocate + 1 
                    WHERE name = ?`;
    // La funzione db.run esegue la query.
    db.run(query, [name], function (err) {
      if (err) {
        //la funzione restituisce un messaggio di errore se non riesce ad incrementare 
        reject(err); 
      } else {
        resolve( 'Partita giocata aggiunta con successo!'); 
      }
    });
  });
};

// Incrementa di 1 il numero di user.partiteVinte e user.partiteConsecutive
export const aggiungiPartitaVinta = (name) => {
    /* Questa funzione serve per incrementare di 1 il numero di partite consecutive e vinte dall'utente 
    loggato (utente specificato attraverso il parameto name). La Promessa gestisce l'operazione 
    asincrona con resolve (se l'operazione ha successo) o reject (se si verifica un errore). */
  return new Promise((resolve, reject) => {
    const query = `UPDATE user 
                    SET partiteVinte = partiteVinte + 1, partiteConsecutive = partiteConsecutive + 1 
                    WHERE name = ?`;
    db.run(query, [name], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve('Partita vinta aggiunta con successo!');
        }
      });
    });
};

// Imposta a 0 il campo di user.partiteConsecutive
export const resetConsecutive = (name) => {
    /* Questa funzione serve per resettare a 0 il numero di partite vinte consecutivamente
    dall'utente loggato(specificato attraverso il parameto name), rappresentato dal campo
    "reset consecutive" nella tabella "user". La Promessa gestisce l'operazione asincrona 
    con resolve (se l'operazione ha successo) o reject (se si verifica un errore). */
  return new Promise((resolve, reject) => {
    const query = `UPDATE user 
                    SET partiteConsecutive = 0 
                    WHERE name = ?`;
    db.run(query, [name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve( 'Partite conseutive resettate con successo!');
      }
    });
  });
};

//Imposta a 1 user.livello1, user.livello2, user.livello3 o user.livello4 in base alla vittoria 
export const partiteVinteLivello = (name, livello) => {
    /* Questa funzione serve per tenere il conteggio di quante partite vengono vinte per ogni 
    livello (specificato dal parametro livello) dall'utente loggato(specificato attraverso
    il parameto name), rappresentato dai campi "livello1", "livello2", "livello3", "livello4"
    nella tabella "user". La Promessa gestisce l'operazione asincrona con resolve (se 
    l'operazione ha successo) o reject (se si verifica un errore). */
  return new Promise((resolve, reject) => {
    const countsql = `SELECT * 
                      FROM user 
                      WHERE name = ?`;
    db.get(countsql, [name], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      /* Il valore del livello viene convertito da stringa a numero intero utilizzando parseInt. 
      Se la conversione non è valida (cioè, livelloInt non è un numero), la Promessa viene 
      rigettata con un messaggio di errore.*/
      const livelloInt = parseInt(livello, 10);

      if (isNaN(livelloInt)) {
        reject(new Error('Livello non valido. Deve essere un numero intero.'));
        return;
      }
      /* In base al valore del livello (livelloInt), viene selezionata la query di aggiornamento 
      appropriata per incrementare il numero di partite vinte al livello specificato. */
      let updateSql;
      switch (livelloInt) {
        case 1:
          updateSql = 'UPDATE user SET livello1 = livello1 + 1 WHERE name = ?';
          break;
        case 2:
          updateSql = 'UPDATE user SET livello2 = livello2 + 1 WHERE name = ?';
          break;
        case 3:
          updateSql = 'UPDATE user SET livello3 = livello3 + 1 WHERE name = ?';
          break;
        case 4:
          updateSql = 'UPDATE user SET livello4 = livello4 + 1 WHERE name = ?';
          break;
        default:
          reject(new Error('Livello non valido.'));
          return;
      }
      /* Viene eseguita la query di aggiornamento utilizzando db.run. Se c'è un errore 
      durante l'esecuzione della query, la Promessa viene rigettata con l'errore. 
      Se l'operazione ha successo, la Promessa viene risolta. */      
      db.run(updateSql, [name], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve('numero di partite vinte per livello aggiornato con successo.');
      });
    });
  });
};

//OBIETTIVO

// Restituisce la lista di tutti gli obiettivi presenti nella tabella obiettivo
export const listObiettivi = () => {
    /* Questa funzione serve per ricavare l'intera lista di tutti gli obiettivi disponibili
    nella tabella "obiettivo". La Promessa gestisce l'operazione asincrona con resolve (se 
    l'operazione ha successo) o reject (se si verifica un errore). */
    return new Promise((resolve, reject) => {
      /* Viene eseguita una query SQL per selezionare tutti i campi (*) dalla tabella obiettivo. 
      La funzione db.all esegue la query e restituisce tutte le righe trovate salvandole nell'array 
      di oggetti "obiettivi" , se si verifica un errore la Promise viene rigettata. */
      const sql = `SELECT * 
                   FROM obiettivo`;
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        const obiettivi = rows.map((o) => new Obiettivo(o.id, o.nome, o.descrizione));
        resolve(obiettivi);
      }
    });
  });
};

//OBIETTIVI UTENTE 

// Dato user.name, restituisce l'elenco di tutti gli obiettivi raggiunti dall'utente loggato
export const getObiettiviUtente = (name) => { 
    /* Questa funzione serve per ricavare la lista di tutti gli obiettivi raggiunti dall'utente 
    presenti nella tabella "obiettivi_utente". La Promessa gestisce l'operazione asincrona con resolve (se 
    l'operazione ha successo) o reject (se si verifica un errore). */
    return new Promise((resolve, reject) => { 
      /* Viene eseguita una query SQL per selezionare gli obiettivi raggiunti dall'utente. La query utilizza 
      un JOIN tra la tabella "obiettivi_utente" e la tabella "obiettivo" per ottenere tutte le informazioni 
      necessarie sugli obiettivi raggiunti. La funzione db.all esegue la query e restituisce tutte le righe
      trovate salvandole nell'array di oggetti "obiettiviUtente", se si verifica un errore la Promise viene 
      rigettata.*/
      const sql = `SELECT obiettivi_utente.ID AS id, obiettivi_utente.userId AS utente, 
                          obiettivo.nome AS obiettivo, obiettivi_utente.descrizione AS descrizione, 
                          obiettivi_utente.icona AS icona 
                   FROM obiettivi_utente 
                   JOIN obiettivo ON obiettivi_utente.obiettivo = obiettivo.ID 
                   WHERE obiettivi_utente.userId = ?`; 
    db.all(sql, [name], (err, rows) => { 
      if (err) { reject(err); 
      } else { 
        const obiettiviUtente = rows.map((o) => ({ id: o.id, user: o.utente, obiettivo: o.obiettivo, descrizione: o.descrizione, icona: o.icona })); 
        resolve(obiettiviUtente); 
      } 
    }); 
  }); 
};

//Dato user.name, restituisce l'elenco degli obiettivi appena raggiunti durante l'ultima partita
export const getObiettiviNuovi = (name) => { 
  /* Questa funzione serve per ricavare la lista di tutti gli obiettivi appena raggiunti dall'utente 
  solo durante l'utlima partita giocata, presenti nella tabella "obiettivi_utente". 
  La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
  (se si verifica un errore). */
  return new Promise((resolve, reject) => { 
    /* Viene eseguita una query SQL per selezionare gli obiettivi nuovi raggiunti dall'utente. La query 
    utilizza un JOIN tra la tabella "obiettivi_utente" e la tabella "obiettivo" per ottenere le informazioni 
    necessarie sugli obiettivi. La query filtra anche per userId (user.name) e il flag "nuovo" impostato a 1.
    La funzione db.all esegue la query e restituisce tutte le righe trovate, salvandole nell'array di 
    oggetti "obiettiviUtente", mentre se si verifica un errore la Promise viene rigettata */
    const sql = `SELECT obiettivi_utente.ID AS id, obiettivi_utente.userId AS utente, 
                        obiettivo.nome AS obiettivo, obiettivo.descrizione AS descrizione, 
                        obiettivi_utente.icona AS icona FROM obiettivi_utente 
                  JOIN obiettivo ON obiettivi_utente.obiettivo = obiettivo.ID 
                  WHERE obiettivi_utente.userId = ? AND obiettivi_utente.nuovo = 1`; 
  db.all(sql, [name], (err, rows) => { 
      if (err) { reject(err); 
      } else { 
        const obiettiviUtente = rows.map((o) => ({ id: o.id, user: o.utente, obiettivo: o.obiettivo, descrizione: o.descrizione, icona: o.icona })); 
        resolve(obiettiviUtente); 
      } 
    }); 
  }); 
};

//Controlla e assegna l'obiettivo "Prima partita giocata"
export const checkAddObiettivoGiocata = (name, livello) => {
    /* Questa funzione serve per controllare i requisiti richiesti assegnare l'obiettivo 
    "Prima Partita giocata" e, in caso positivo, aggiungerlo nella tabella "obiettivi_utente".
    La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
    (se si verifica un errore). */ 
    return new Promise((resolve, reject) => {
      /* Viene eseguita una query SQL per verificare se l'obiettivo "Prima partita giocata" 
      (identificato con obiettivo = 1) è già presente nella tabella obiettivi_utente per l'utente specificato.
      Se l'obiettivo è già presente (row.count > 0), la Promessa viene risolta senza eseguire ulteriori operazioni
      (è stato impostato in questo modo per non bloccare l'applicazione durante l'esecuzione del codice lato 
      client). Se l'obiettivo non è presente (row.count == 0), si procede al controllo dei requisiti. */
      const countsql = `SELECT COUNT(*) as count 
                        FROM obiettivi_utente 
                        WHERE userId = ? AND obiettivo = 1`;
    db.get(countsql, [name], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else if (row.count !=0 ) {
        // Se l'obiettivo è già presente in tabella
        resolve('Obiettivo \'Prima partita giocata\' già ottenuto!');
      } else if (row.count == 0) {
        // Obiettivo non è presente nella tabella, quindi devo controllare se ci sono i requisiti 
        /*Viene eseguita un'altra query SQL per verificare se l'utente ha giocato esattamente una 
        partita (partiteGiocate = 1). Se l'utente non ha giocato una partita (row.count < 1|| row.count > 1), 
        la Promessa viene risolta senza aggiungere l'obiettivo. Se l'utente ha giocato solo
        una partita, si procede all'aggiunta dell'obiettivo.*/
        const countsqlUser = `SELECT COUNT(*) as count 
                              FROM user 
                              WHERE name = ? AND partiteGiocate = 1`;
        db.get(countsqlUser, [name], (err, row) => {
          if (err) {
            reject(err);
            return;
          } else if (row.count < 1) {
            resolve('Requisiti insufficienti per l\'Obiettivo \'Prima partita giocata\'!');
          } else {
            /*Viene eseguita una query SQL per recuperare le informazioni sull'obiettivo 
            "Prima partita giocata" dalla tabella obiettivo.*/
            const checksql = `SELECT id AS obiettivo, nome , descrizione 
                              FROM obiettivo 
                              WHERE obiettivo.id = 1`;
            db.get(checksql, [], (err, obiettivoRow) => {
              if (err) {
                reject(err);
                return;
              }
              //DESTRUCTURING ASSIGNMENT (assegnazione per decomposizione)
              /* In questa riga di codice si estraggono da obiettivoRow solamente i campi di interesse, 
              quindi obiettivo (obiettivo.id AS obiettivo) e descrizione  (obiettivo.descrizione)*/
              const { obiettivo, descrizione } = obiettivoRow; 
              /*Il valore del livello viene convertito da stringa a numero intero utilizzando parseInt. 
              Se la conversione non è valida la promise viene rigettata. Non si effettua un controllo 
              se il livello è un numero compreso tra 1 e 4 in quanto viene effettuato nel form del 
              componente Partita.*/
              const livelloInt = parseInt(livello, 10);
              if (isNaN(livelloInt)) {
                reject(new Error('Livello non valido. Deve essere un numero intero.'));
                return;
              }
              /*Viene eseguita una query SQL per inserire l'obiettivo raggiunto nella tabella 
              "obiettivi_utente" con le informazioni necessarie. Se l'inserimento ha successo, 
              la Promessa viene risolta con un console.log visibile sul terminale.*/
              const insertSql = `INSERT INTO obiettivi_utente (userId, obiettivo, descrizione, nuovo, icona, livello ) 
                                  VALUES (?, ?, ?, 1, "https://img.icons8.com/doodle/48/ok.png", ? )`;
              db.run(insertSql, [name, obiettivo, descrizione, livelloInt], (insertErr) => {
                if (insertErr) {
                  reject(insertErr);
                  return;
                }
                resolve('Obiettivo \'Prima partita giocata\' controllato e aggiunto con successo.');
              });
            });
          }
        });
      }
    });
  });
};

//Controlla e assegna "Prima partita vinta"
export const checkAddObiettivoVinta = (name, livello) => {
    /* Questa funzione serve per controllare i requisiti richiesti assegnare l'obiettivo 
    "Prima Partita vinta" e, in caso positivo, aggiungerlo nella tabella "obiettivi_utente".
    La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
    (se si verifica un errore). */ 
  return new Promise((resolve, reject) => {
    /* Viene eseguita una query SQL per verificare se l'obiettivo "Prima partita vinta" 
    (identificato con obiettivo = 2) è già presente nella tabella obiettivi_utente per l'utente specificato.
    Se l'obiettivo è già presente (row.count > 0), la Promessa viene risolta senza eseguire ulteriori 
    operazioni (è stato impostato in questo modo per non bloccare l'applicazione durante l'esecuzione del
    codice lato client). Se l'obiettivo non è presente (row.count == 0), si procede al controllo dei 
    requisiti. */
    const countsql = `SELECT COUNT(*) as count 
                      FROM obiettivi_utente 
                      WHERE userId = ? AND obiettivo = 2`;
    db.get(countsql, [name], (err, row) => {
      if (err) {
        reject(err);
        return;
      } else if (row.count > 0) {
       resolve('Obiettivo \'Prima partita vinta\' già ottenuto!'); // Se l'obiettivo è già presente in tabella
      } else if (row.count == 0) {
        /*Viene eseguita un'altra query SQL per verificare se l'utente ha vinto esattamente una 
        partita (partiteVinte = 1). Se l'utente non ha vinto una partita (row.count < 1|| row.count > 1), 
        la Promessa viene risolta senza aggiungere l'obiettivo. Se l'utente ha vinto solo
        una partita, si procede all'aggiunta dell'obiettivo.*/
        const countsqlUser = `SELECT COUNT(*) as count 
                              FROM user 
                              WHERE name = ? AND partiteVinte = 1`;
        db.get(countsqlUser, [name], (err, row) => {
          if (err) {
            reject(err);
            return;
          } else if (row.count < 1) {
            resolve('Requisiti insufficienti per l\'Obiettivo \'Prima partita vinta\'!');//requisiti insufficienti
          } else {
            /*Viene eseguita una query SQL per recuperare le informazioni sull'obiettivo 
            "Prima partita vinta" dalla tabella obiettivo.*/
            const checksql = `SELECT id AS obiettivo, nome , descrizione 
                              FROM obiettivo 
                              WHERE id = 2`;
            db.get(checksql, [], (err, obiettivoRow) => {
              if (err) {
                reject(err);
                return;
              }
              //DESTRUCTURING ASSIGNMENT (assegnazione per decomposizione)
              /* In questa riga di codice si estraggono da obiettivoRow solamente i campi di interesse, 
              quindi obiettivo (obiettivo.id AS obiettivo) e descrizione (obiettivo.descrizione)*/
              const { obiettivo, descrizione } = obiettivoRow;

              /*Il valore del livello viene convertito da stringa a numero intero utilizzando parseInt. 
              Se la conversione non è valida la promise viene rigettata. Non si effettua un controllo 
              se il livello è un numero compreso tra 1 e 4 in quanto viene effettuato nel form del 
              componente Partita.*/ 
              const livelloInt = parseInt(livello, 10);
              if (isNaN(livelloInt)) {
                reject(new Error('Livello non valido. Deve essere un numero intero.'));
                return;
              }
              /*Viene eseguita una query SQL per inserire l'obiettivo raggiunto nella tabella 
              "obiettivi_utente" con le informazioni necessarie. Se l'inserimento ha successo, 
              la Promessa viene risolta con un console.log visibile sul terminale.*/
              const insertSql = `INSERT INTO obiettivi_utente (userId, obiettivo, descrizione, nuovo, icona, livello ) 
                                  VALUES (?, ?, ?, 1,"https://img.icons8.com/color/48/gold-medal--v1.png", ? )`;
              db.run(insertSql, [name, obiettivo, descrizione, livelloInt], (insertErr) => {
                if (insertErr) {
                  reject(insertErr);
                  return;
                }
                resolve('Obiettivo \'Prima partita vinta\' controllato e aggiunto con successo.');
              });
            });
          }
        });
      }
    });
  });
};

//Controlla e assegna "N partite vinte consecutive" 
export const checkAddObiettivoConsecutive = (name, livello) => {
    /* Questa funzione serve per controllare i requisiti richiesti assegnare l'obiettivo 
    "N partite consecutive" e, in caso positivo, aggiungerlo nella tabella "obiettivi_utente".
    La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
    (se si verifica un errore). */ 
    return new Promise((resolve, reject) => {
      /*Viene eseguita una query SQL per ottenere i dati dell'utente dalla tabella user. Se l'utente non 
      esiste o ha meno di 2 partite vinte consecutive (row.partiteConsecutive < 2), la Promessa viene 
      risolta senza aggiungere l'obiettivo.*/
      const countsql = `SELECT * 
                        FROM user 
                        WHERE name = ?`;
    db.get(countsql, [name], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (!row || row.partiteConsecutive < 2) {
        resolve('Requisiti insufficienti per l\'Obiettivo \'N partite vinte consecutive\'!');
      } else {
        /* DESTRUCTURING ASSIGNMENT - si salva in una costante partiteConsecutive il valore del medesimo
        campo e si dichiarano due variabili che saranno utilizzate successivamente per determinare l'id 
        dell'obiettivo e la sua relativa icona l'ID dell'obiettivo (obiettivoId) e l'URL dell'icona 
        (iconaUrl) associata all'obiettivo. Entrambe sono inizialmente non definite (undefined) o vuote (''). */
        const partiteConsecutive = row.partiteConsecutive;
        let obiettivoId;
        let iconaUrl = '';

        /*si determinano l'ID dell'obiettivo e l'icona da utilizzare in base al numero di partite 
        consecutive vinte dall'utente*/
        switch (partiteConsecutive) {
          case 2:
            obiettivoId = 7;
            iconaUrl = 'https://img.icons8.com/doodle/48/2.png';
            break;
          case 3:
            obiettivoId = 8;
            iconaUrl = 'https://img.icons8.com/doodle/48/3.png';
            break;
          case 4:
            obiettivoId = 9;
            iconaUrl = 'https://img.icons8.com/doodle/48/4.png';
            break;
          case 5:
            obiettivoId = 10;
            iconaUrl = 'https://img.icons8.com/doodle/48/5.png';
            break;
          default:
            resolve('Errore durante la ricerca dell\obiettivo \'N partite vinte consecutive\'!');
            return;
        }
        /*Viene eseguita una query SQL per recuperare le informazioni sull'obiettivo dalla tabella 
        "obiettivo" utilizzando l'ID dell'obiettivo (obiettivoId)ricavato precedentemente in base al 
        numero di partite vinte consecutivamente. La funzione db.get esegue la query e restituisce 
        un eventuale errore (err) o il risultato della query (obiettivoRow).*/
        const getObiettivoSql = `SELECT id AS obiettivo, nome, descrizione
                                 FROM obiettivo 
                                 WHERE id = ?`;
        db.get(getObiettivoSql, [obiettivoId], (err, obiettivoRow) => {
          if (err) {
            reject(err);
            return;
          }
          if (!obiettivoRow) {
            reject(err); 
            return;
          }
          /*Il valore del livello viene convertito da stringa a numero intero utilizzando parseInt. Se la 
          conversione non è valida la promise viene rigettata. Non si effettua un controllo se il livello è 
          un numero compreso tra 1 e 4 in quanto viene effettuato nel form del componente Partita.*/ 
          const livelloInt = parseInt(livello, 10);
          if (isNaN(livelloInt)) {
            reject(new Error('Livello non valido. Deve essere un numero intero.'));
            return;
          }
          /*Utilizzando l'assegnazione per decomposizione (destructuring assignment), 
          vengono estratte le proprietà obiettivo e descrizione dall'oggetto obiettivoRow e 
          assegnate a variabili locali. */
          const { obiettivo, descrizione } = obiettivoRow;
          /*Viene eseguita una query SQL per inserire l'obiettivo raggiunto nella tabella "obiettivi_utente". 
          Se l'inserimento ha successo, viene stampato un messaggio di successo e la Promessa viene risolta. */
          const insertSql = `INSERT INTO obiettivi_utente (userId, obiettivo, descrizione, nuovo, icona, livello) 
                              VALUES (?, ?, ?, 1, ?, ?)`;
          db.run(insertSql, [name, obiettivo, descrizione, iconaUrl, livelloInt], (insertErr) => {
            if (insertErr) {
              reject(insertErr);
              return;
            }
            resolve('Obiettivo \'N partite vinte consecutive aggiunto con successo\'!');
          });
        });
      }
    });
  });
};

//Controlla e assegna "obiettivi per livello"
export const checkAddObiettivoLivello = (name, livello) => {
    /* Questa funzione serve per controllare i requisiti richiesti assegnare l'obiettivo 
    "obiettivi per livello" e, in caso positivo, aggiungerlo nella tabella "obiettivi_utente".
    La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
    (se si verifica un errore). */ 
    return new Promise((resolve, reject) => {
      /*Viene eseguita una query SQL per ottenere i dati dell'utente dalla tabella "user". Se c'è un errore, 
      la Promessa viene rigettata.*/
      const countsql = `SELECT * 
                        FROM user 
                        WHERE name = ?`;
    db.get(countsql, [name], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      /*Il valore del livello viene convertito da stringa a numero intero utilizzando parseInt. Se la 
      conversione non è valida la promise viene rigettata. Non si effettua un controllo se il livello è 
      un numero compreso tra 1 e 4 in quanto viene effettuato nel form del componente Partita.*/ 
      const livelloInt = parseInt(livello, 10);
      if (isNaN(livelloInt)) {
        reject(new Error('Livello non valido. Deve essere un numero intero.'));
        return;
      }
      /* Si dichiarano le variabili che verranno utilizzare per determinare il livello e l'obiettivo raggiunto
      (con relativa icona) */
      let livelloField;
      let obiettivoId;
      let iconaUrl = '';

      //si determina il livello cui è stata giocata la partita 
      switch (livelloInt) {
        case 1:
          livelloField = 'livello1';
          break;
        case 2:
          livelloField = 'livello2';
          break;
        case 3:
          livelloField = 'livello3';
          break;
        case 4:
          livelloField = 'livello4';
          break;
      }
      /*Viene eseguita una query SQL per ottenere il valore del livello specifico dell'utente. 
      Se il valore del livello è fuori dal range valido (1-4) o non esiste, 
      la Promessa viene risolta senza aggiungere l'obiettivo.*/
      const checkUserLevelSql = `SELECT ${livelloField} as livello 
                                  FROM user 
                                  WHERE name = ?`;
      db.get(checkUserLevelSql, [name], (err, userRow) => {
        if (err) {
          reject(err);
          return;
        }
        /*viene usato per assicurarsi che il codice non causi un errore se userRow è null o undefined. 
        Se userRow non esiste, livelloValue sarà semplicemente undefined */
        const livelloValue = userRow?.livello;
        if (!livelloValue || livelloValue < 1 || livelloValue > 4) {
          resolve('Requisiti insufficienti per l\'Obiettivo \'Obiettivi per livello\'!'); 
          return;
        }
        /*Viene determinato l'ID dell'obiettivo (obiettivoId) e l'URL dell'icona (iconaUrl) in base al 
        livello (livelloInt) e al numero di partite vinte per quel livello (livelloValue). */
        switch (livelloInt) {
          case 1:
            switch (livelloValue) {
              case 1:
                obiettivoId = 3;
                iconaUrl = 'https://img.icons8.com/clouds/100/1.png';
                break;
              case 2:
                obiettivoId = 4;
                iconaUrl = 'https://img.icons8.com/clouds/100/2--v2.png';
                break;
              case 3:
                obiettivoId = 5;
                iconaUrl = 'https://img.icons8.com/clouds/100/3.png';
                break;
              case 4:
                obiettivoId = 6;
                iconaUrl = 'https://img.icons8.com/clouds/100/4.png';
                break;
            }
            break;
          case 2:
            switch (livelloValue) {
              case 1:
                obiettivoId = 3;
                iconaUrl = 'https://img.icons8.com/dusk/64/1-circle.png';
                break;
              case 2:
                obiettivoId = 4;
                iconaUrl = 'https://img.icons8.com/dusk/64/2-circle.png';
                break;
              case 3:
                obiettivoId = 5;
                iconaUrl = 'https://img.icons8.com/dusk/64/3-circle--v1.png';
                break;
              case 4:
                obiettivoId = 6;
                iconaUrl = 'https://img.icons8.com/dusk/64/4-circle.png';
                break;
            }
            break;
          case 3:
            switch (livelloValue) {
              case 1:
                obiettivoId = 3;
                iconaUrl = 'https://img.icons8.com/bubbles/100/1.png';
                break;
              case 2:
                obiettivoId = 4;
                iconaUrl = 'https://img.icons8.com/bubbles/100/2.png';
                break;
              case 3:
                obiettivoId = 5;
                iconaUrl = 'https://img.icons8.com/bubbles/100/3.png';
                break;
              case 4:
                obiettivoId = 6;
                iconaUrl = 'https://img.icons8.com/bubbles/100/4.png';
                break;
            }
            break;
          case 4:
            switch (livelloValue) {
              case 1:
                obiettivoId = 3;
                iconaUrl = 'https://img.icons8.com/plasticine/100/1.png';
                break;
              case 2:
                obiettivoId = 4;
                iconaUrl = 'https://img.icons8.com/plasticine/100/2.png';
                break;
              case 3:
                obiettivoId = 5;
                iconaUrl = 'https://img.icons8.com/plasticine/100/3.png';
                break;
              case 4:
                obiettivoId = 6;
                iconaUrl = 'https://img.icons8.com/plasticine/100/4.png';
                break;
            }
            break;
        }

        if (!obiettivoId || !iconaUrl) {
          resolve('Errore nella ricerca dell\'Obiettivo \'Obiettivi per livello\'!'); 
          return;
        }
        /*Viene eseguita una query SQL per verificare se l'utente ha già raggiunto l'obiettivo specifico 
        per il livello. Se l'obiettivo è già raggiunto, la Promessa viene risolta. */
        const checkObiettivoSql = `SELECT COUNT(*) as count 
                                   FROM obiettivi_utente 
                                   WHERE userId = ? AND obiettivo = ?`;
        db.get(checkObiettivoSql, [name, obiettivoId], (err, obiettivoCheckRow) => {
          if (err) {
            reject(err);
            return;
          }

          if (obiettivoCheckRow.count > 0) {
            resolve('L\'obiettivo \'Obiettivi per livello\' è stato già ottenuto (per questo livello)!'); 
          } else {
            /*Viene eseguita una query SQL per ottenere la descrizione dell'obiettivo. Se non viene 
            trovata nessuna descrizione, la Promessa viene risolta. La descrizione viene modificata 
            per includere il livello specifico.*/
            const getObiettivoDescrizioneSql = `SELECT descrizione 
                                                FROM obiettivo 
                                                WHERE id = ?`;
            db.get(getObiettivoDescrizioneSql, [obiettivoId], (err, obiettivoRow) => {
              if (err) {
                reject(err);
                return;
              }

              if (!obiettivoRow) {
                resolve('L\'obiettivo \'Obiettivi per livello\' non è stato trovato nella tabella obiettivo!'); 
                return;
              }

              const descrizione = obiettivoRow.descrizione;
              // Modifica la descrizione aggiungendo "obiettivo raggiunto per il livello k"
              const descrizioneModificata = `${descrizione} Obiettivo raggiunto per il livello ${livelloInt}`;
              /*Viene eseguita una query SQL per inserire l'obiettivo raggiunto nella tabella "obiettivi_utente"
              con tutte le informazioni necessarie. Se l'inserimento ha successo, la Promessa viene risolta 
              con un messaggio di successo. */
              const insertObiettivoSql = `INSERT INTO obiettivi_utente (userId, obiettivo, descrizione, nuovo, icona, livello) 
                                          VALUES (?, ?, ?, 1, ?, ?)`;
              db.run(insertObiettivoSql, [name, obiettivoId, descrizioneModificata, iconaUrl, livelloInt], (insertErr) => {
                if (insertErr) {
                  reject(insertErr);
                  return;
                }
                resolve('L\'obiettivo \'Obiettivi per livello\' per questo livello è stato aggiunto con successo!');
              });
            });
          }
        });
      });
    });
  });
};

//Reset del campo obiettivi_utente.nuovo
export const resetNuovo = (name) => {
    /* Questa funzione è utilizzata per aggiornare il flag "nuovo" degli obiettivi di un utente 
    specifico nel database, impostandolo a 0. Questo è utile per indicare che gli obiettivi non 
    sono più considerati "nuovi". La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
    (se si verifica un errore). */ 
    return new Promise((resolve, reject) => {
      /*Viene definita una query SQL di tipo UPDATE per impostare il campo nuovo a 0 per tutti gli obiettivi 
      dell'utente identificato da userId. */
      const query = `UPDATE obiettivi_utente 
                     SET nuovo = 0 
                    WHERE userId = ?`;
    db.run(query, [name], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve('Campo \'nuovo\' resettato con successo!');
        }
      });
    });
};

// Obiettivi mancanti, prima quelli generali, poi quelli per livello (quindi ripetibili)
const getObiettiviGeneraliMancanti = (name) => {
    /* Questa funzione non viene esportata in quanto verrà chiamata solo in getObiettiviProssimi,
    presente in questo file. Essa serve per recuperare gli obiettivi generali che un utente 
    specifico non ha ancora raggiunto. Questi obiettivi hanno gli ID 1, 2, 7, 8, 9 e 10.
    La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
    (se si verifica un errore). */ 
    return new Promise((resolve, reject) => {
      /*Viene definita una query SQL che utilizza una LEFT JOIN per ottenere gli obiettivi dalla tabella 
      "obiettivo" che non sono presenti nella tabella obiettivi_utente per l'utente specificato (userID). 
      La query filtra anche per gli ID degli obiettivi specificati (1, 2, 7, 8, 9, 10). */
      const sqlGenerali = `SELECT obiettivo.id AS id, obiettivo.nome AS obiettivo, obiettivo.descrizione AS descrizione
                           FROM obiettivo
                           LEFT JOIN obiettivi_utente 
                           ON obiettivo.id = obiettivi_utente.obiettivo AND obiettivi_utente.userID = ?
                           WHERE obiettivi_utente.obiettivo IS NULL 
                           AND obiettivo.id IN (1, 2, 7, 8, 9, 10);`;
    db.all(sqlGenerali, [name], (err, rowsGenerali) => {
      if (err) {
        reject(err);
        return;
      }
      /*Se la query ha successo, viene creato un array di oggetti obiettiviGeneraliMancanti 
      mappando le righe (rowsGenerali) restituite dalla query. La Promessa viene quindi risolta con 
      questo array di obiettivi mancanti. */
      const obiettiviGeneraliMancanti = rowsGenerali.map((o) => ({
        id: o.id,
        obiettivo: o.obiettivo,
        descrizione: o.descrizione
      }));
      
      resolve(obiettiviGeneraliMancanti);
    });
  });
};

// Funzione per recuperare gli obiettivi speciali (ID: 3, 4, 5, 6) mancanti per livello
const getObiettiviMancantiPerLivello = (name) => {
  /* Questa funzione non viene esportata in quanto verrà chiamata solo in getObiettiviProssimi,
  presente in questo file. Essa serve per recuperare gli obiettivi per livello che un utente 
  specifico non ha ancora raggiunto. Questi obiettivi hanno gli ID 3,4,5 e 6.
  La Promessa gestisce l'operazione asincrona con resolve (se l'operazione ha successo) o reject 
  (se si verifica un errore). */ 
return new Promise((resolve, reject) => {
  /* Viene definita una query SQL che utilizza una LEFT JOIN per ottenere gli obiettivi dalla 
  tabella "obiettivo" che non sono presenti nella tabella obiettivi_utente per l'utente specificato 
  (userID). La query filtra anche per gli ID degli obiettivi specificati (3, 4, 5, 6). */
  const sqlSpeciali = `SELECT obiettivo.id AS id, obiettivo.nome AS obiettivo, 
                              obiettivo.descrizione AS descrizione, obiettivi_utente.livello
                        FROM obiettivo
                        LEFT JOIN obiettivi_utente
                        ON obiettivo.id = obiettivi_utente.obiettivo AND obiettivi_utente.userID = ?
                        WHERE obiettivo.id IN (3, 4, 5, 6);`;
  
  db.all(sqlSpeciali, [name], (err, rowsSpeciali) => {
    if (err) {
      reject('Obiettivi non trovati!');
      return;
    }
    /*Viene creata una mappa obiettiviPerLivello per tenere traccia degli obiettivi raggiunti per livello. 
    Le chiavi della mappa corrispondono al livello di gioco. Con un ciclo forEach si popola la mappa controllando
    ogni elemento di rowsSpeciali. In base al livello row.livello si aggiunge l'id dell'obiettivo in obiettiviPerLivello
    con chiave pari allo stesso valore di row.livello */
    const obiettiviPerLivello = {
      1: [],
      2: [],
      3: [],
      4: []
    };

    rowsSpeciali.forEach((row) => {
      if (row.livello >= 1 && row.livello <= 4) {
        obiettiviPerLivello[row.livello].push(row.id);
      }
    });

    /*Vengono create tre liste: una per contenere i livelli, una per contenere gli id degli obiettivi da analizzare
    e una lista obiettiviMancantiLivello che conterrà gli obiettivi mancanti per ciascun livello e che sarà il risltato di questa funzione */
    const livelli = [1, 2, 3, 4];
    const obiettiviSpeciali = [3, 4, 5, 6];
    const obiettiviMancantiLivello = [];
    
    /* per ogni livello, itero obiettiviSpeciali , identificandoli singolarmente con obiettivoId. Se il singolo obiettivo non è presente 
    in obiettiviPerLivello al livello indicato, lo si cerca in rowsSpeciali (risultato iniziale della query, in quanto in obiettiviPerLivello
    non sono presenti tutte e informazioni necessarie)con il metodo find e lo si aggiunge all'array obiettiviMancantiLivello.
    La descrizione viene completata aggiungendo la specifica su quale livello è riferito l'obiettivo e si risolve la promise con questo array di obiettivi mancanti. */
    livelli.forEach((livello) => {
      obiettiviSpeciali.forEach((obiettivoId) => {
        // Se l'obiettivo non è presente per questo livello, aggiungilo
        if (!obiettiviPerLivello[livello].includes(obiettivoId)) {
          const obiettivo = rowsSpeciali.find((o) => o.id === obiettivoId);
          if (obiettivo) {
            obiettiviMancantiLivello.push({
              id: obiettivo.id,
              obiettivo: obiettivo.obiettivo,
              descrizione: `${obiettivo.descrizione}. Obiettivo mancante per il livello ${livello}` // Descrizione con livello
            });
          }
        }
      });
    });

    resolve(obiettiviMancantiLivello);
  });
});
};

  export const getObiettiviProssimi = (name) => {
    /* Questa funzione serve per recuperare tutti gli obiettivi mancanti per un utente specifico, 
    combinando sia gli obiettivi generali che quelli speciali mancanti per livello. La Promessa gestisce 
    l'operazione asincrona con resolve (se l'operazione ha successo) o reject (se si verifica un errore). */ 
  return new Promise((resolve, reject) => {
    /*La funzione chiama getObiettiviGeneraliMancanti con il nome dell'utente per ottenere gli obiettivi 
    generali mancanti. Questa chiamata restituisce una Promessa che, quando risolta, fornisce un array 
    di obiettivi generali mancanti (obiettiviGeneraliMancanti). */
    getObiettiviGeneraliMancanti(name)
      .then((obiettiviGeneraliMancanti) => {
        /*Dopo aver ottenuto gli obiettivi generali mancanti, la funzione chiama getObiettiviMancantiPerLivello 
        con il nome dell'utente per ottenere gli obiettivi speciali mancanti per livello. Questa chiamata 
        restituisce una Promessa che, quando risolta, fornisce un array di obiettivi speciali mancanti per 
        livello (obiettiviMancantiLivello). */
        return getObiettiviMancantiPerLivello(name).then((obiettiviMancantiLivello) => {
          /*Gli obiettivi generali mancanti e quelli speciali mancanti per livello vengono combinati in un 
          unico array obiettiviProssimi attraverso l'uso di un operatore di spread. La Promessa viene quindi risolta con questo array combinato. */
          const obiettiviProssimi = [
            ...obiettiviGeneraliMancanti,
            ...obiettiviMancantiLivello
          ];

          resolve(obiettiviProssimi);
        });
      })
      .catch((err) => {
        reject('Obiettivi prossimi non trovati!');
      });
  });
};