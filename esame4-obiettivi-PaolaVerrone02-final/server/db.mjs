import sqlite from 'sqlite3'; //importo per gestire il database 

/* Apertura del database 
   Creo una nuova istanza del database e apro la connessione al file "database.sqlite"
    Se il file non esiste, SQLite ne creerà uno nuovo con il nome indicato. La callback gestisce
    anche eventuali errori (se presente, il programma terminerà e l'errore verrà visualizzato. 
    Si aggiunge export per rendere la costante db disponibilie per l'importazione in altri file.*/
    export const db = new sqlite.Database('database.sqlite', (err) => {
    if (err) throw err;
  });
  