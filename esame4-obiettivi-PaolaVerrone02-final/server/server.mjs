/* Import necessari */
import express from 'express'; //framework per creare server ed API
import morgan from 'morgan'; //middleware per le richieste http
import cors from 'cors'; //middleware per gestire le politiche di Cross-Origin Resource
import { check, validationResult } from 'express-validator'; //middleware per validare i dati delle richieste 
import session from 'express-session';//middleware di express per gestire la sessione 
import passport from 'passport'; //middleware per l'autenticazione 
import LocalStrategy from 'passport-local'; //Sistema email e password per l'autenticazione 
import { getUser } from './user-dao.mjs'; //modulo per l'accesso ai dati degli utenti
import { infoUtente,aggiungiPartitaGiocata,aggiungiPartitaVinta,resetConsecutive, partiteVinteLivello,
  listObiettivi, getObiettiviUtente, getObiettiviNuovi,checkAddObiettivoGiocata, checkAddObiettivoVinta, 
  checkAddObiettivoConsecutive, checkAddObiettivoLivello,resetNuovo,getObiettiviProssimi } from './dao.mjs';

//Fase 1 - inizializzazione del server 
  /*Inizializzo un'app express sulla porta 3001. La porta è rappresentata dalla costante "port" */
  const app = express();
  const port = 3001; 

  // Middleware
  /*I middleware vengono eseguiti nell'ordine in cui si presentano. Quelli configurati all'inizio del codice vengono sempre invocati
   Tutte le funzioni che vengono inserite prima della callback vengono eseguite 
  dal server ogni volta che si chiama l'API. isLogged viene invocata solo quando arrivo nella route in cui è prevista  */
  app.use(express.json()); //middleware aggiunto ad app.use. Comunica al server di prendere la richiesta e di trasformarla in un certo json 
  app.use(morgan('dev')); //come parametro vuole uno che dice qual è il livello di log. dev mostra tutte le informazioni necessarie per lo sviluppo 

  // Set up and enable CORS (middleware per accettare le richieste da http://localhost:5137)
  const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200, //default code di success per le richieste di tipo option. nel nostro caso in teoria non serve perche è per alcuni tipi di browser legacy in cui per default è 204 e alcuni browser non lo riconoscono
    credentials: true //serve al server per capire che può accettare i cookie che provengno dal localhost 5173 anche se non è 3001.
  };
  app.use(cors(corsOptions));

// Fase 2 - Configurazione di Passport 
  /*Passport viene configurato con LocalStrategy, quindi l'autenticazione viene fatta tramite username (che può essere anche email) e password */
  passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password); //cerco l'utente con le credenziali inserite 
    if (!user)
      return cb(null, false, 'Incorrect username or password');//Per motivi di sicurezza non si specifica quale delle due credenziali è corretta
    return cb(null, user);
  }));

  //se il login ha successo, devo gestire la sessione 

  /* Determina quali dati dell'oggetto utente devono essere memorizzati nella sessione. Ogni volta che un utente viene autenticato, 
  l'intero oggetto utente viene memorizzato nella sessione.*/
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  /*Questa funzione è usata per prendere i dati che sono stati serializzati nella sessione (durante la fase di autenticazione) e trasformarli 
  nuovamente in un oggetto utente. Specifica che quando i dati dell'utente vengono letti dalla sessione, l'intero oggetto utente viene 
  ricostruito e passato alla funzione di callback.*/ 
  passport.deserializeUser(function (user, cb) {
    return cb(null, user);
  });

  /* Middleware che semplifica l'autenticazione della route: controlla se un utente è autenticato prima di accedere ad una 
  determinata route.Se è tutto leggittio prosegue, altrimenti restituisce errore */
  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ error: 'Not Authorized' });
  };

  /*Inizializzo la sessione. Si inizializza con delle opzioni specifiche: 
    secret -> usata per firmare e criptare i dati della sessione. È importante mantenerla segreta per la sicurezza dell'applicazione.
    resave: false -> Questa opzione impedisce alla sessione di essere salvata di nuovo sul server se non è stata modificata durante la richiesta.
    saveUninitialized: false ->  Questa opzione evita di salvare una nuova sessione non inizializzata. Viene usata per ridurre la memorizzazione di sessioni vuote. */
    app.use(session({
      secret: "shh... è un segreto!", //modificato per non renderlo uguale 
      resave: false,
      saveUninitialized: false,
    }));

    //si utilizza passport per autenticare la sessione. significa che gestirà l'autenticazione dell'utente per ogni richiesta, utilizzando i dati salvati nella sessione 
    app.use(passport.authenticate('session'))

// Fase 3 - API 

  // SESSION 

  // POST /api/sessions -> for login, create session
  app.post('/api/sessions', function(req, res, next) {
    /*Questa API serve per attivare la sessione, quindi per effettuare il login. Si crea una sessione e tramite passport.authenticate
    si esegue l'autenticazione con localStrategy (configurato in precedenza).  Si usa post e non get per proteggere le credenziali.
    next -> se si verifica un errore, viene passato alla funzione next */
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).send(info);
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(req.user);
      });
    })(req, res, next);
  });

  // GET /api/sessions/current
  app.get('/api/sessions/current', (req, res) => {
    /*Questa API verifica se l'utente è ancora autenticato, quindi fa una get alla sessione corrente. Non si inseriscono parametri in quanto si 
    gestiscono tramite i cookie. Una volta verificato se è autenticato, l'API restituisce le informazioni sull'utente, altrimenti restituisce un 
    messaggio di errore*/
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  // DELETE /api/sessions/current
    /*Questa API elimina la sessione corrente, attraverso il metodo logout. La risposta termina con res.end */
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });

  // SERVER 

  /*Si definiscono le variabili per salvare il numero segreto generato dal server e il numero di tentativi che l'utente 
  ha a disposizione per indovinare il numero segreto */
  let numeroSegreto = null;
  let maxTentativi = 0;
  // Genera numero segreto nell'intervallo corretto
  app.post('/api/generaNumeroSegreto', isLoggedIn, (req, res) => {
    /*questa API genera un numero segreto e determina il numero massimo di tentativi basandosi sul livello fornito dall'utente, 
    garantendo che solo gli utenti autenticati possano accedere a questa funzionalità */
    const { livello } = req.body;
    const max = Math.pow(10, livello);//(base, esponente)
    numeroSegreto = Math.floor(Math.random() * max) + 1; //numero compreso tra 1 e 10^k (escluso). +1 per escludere lo 0 e includere 10^k.
    maxTentativi = 4 * livello; //4*k numero di tentativi
    res.json({ numeroSegreto, maxTentativi });
  });

  // Gestisce i tentativi e verifica correttamente il numero tentato
  app.post('/api/inviaTentativo', isLoggedIn, (req, res) => {
    /*Questa API POST gestisce il tentativo dell'utente di indovinare un numero segreto. Viene estratto il valore "numero" dal corpo della 
    richiesta, il quale corrisponde al tentativo dell'utente. Dopo aver convertito il numero da stringa a intero, effettua il confronto con
    il numero segreto e in base all'esito il server comunica all'utente se ha indovinato o meno. */
    const { numero } = req.body;
    const tentativoNumero = parseInt(numero); // Assicura che entrambi i numeri siano dello stesso tipo
    if (tentativoNumero === numeroSegreto) {
      res.json({ messaggio: 'Hai indovinato il numero!' });
    } else if (tentativoNumero > numeroSegreto) {
      res.json({ messaggio: 'Il numero inserito è maggiore del numero segreto.' });
    } else {
      res.json({ messaggio: 'Il numero inserito è minore del numero segreto.' });
    }
  });


  //USER

  // infoUtente(id)
  app.get('/api/utente', isLoggedIn, async (req, res) => {
    /*Questa API recupera le informazioni di un utente specifico basandosi sull'id. Viene chiamata la funzione "infoUtente" e viene passato
    come parametro l'id ricavato dalla query string. La funzione restituisce le informazioni dell'utente */
    infoUtente(req.query.id)
      .then(utente => res.json(utente)) //promise 
      .catch(err => { //gestisco il caso di errore 
        console.error('Errore durante il recupero delle informazioni utente', err);
        res.status(500).end(); //.end per specificare che è completata la gestione dell'errore
      });
  });

  // aggiungiPartitaGiocata(name)
  app.put('/api/utenti/:name/PartiteGiocate', isLoggedIn, [], async (req, res) => {
    /*Questa API aggiorna il numero di partite giocate da un utente specifico basandosi sul parametro "name" dell'url.  */
    aggiungiPartitaGiocata(req.params.name)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
      .catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({
          message: 'Si è verificato un errore durante l\'aggiunta della partita giocata.',
          error: err.message
        });
      });
  });
  
  // aggiungiPartitaVinta(name)
  app.put('/api/utenti/:name/PartiteVinte', isLoggedIn,[  ], async (req, res) => {
    /*Questa API aggiorna il numero di partite vinte da un utente specifico basandosi sul parametro "name" dell'url.  */
    aggiungiPartitaVinta(req.params.name)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
      .catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({
          message: 'Si è verificato un errore durante l\'aggiunta della partita vinta.',
          error: err.message
        });
      });
  });

  // resetConsecutive(name)
  app.put('/api/utenti/:name/resetConsecutive', isLoggedIn,[], async (req, res) => {
    /*Questa API effettua il reset delle partite consecutive vinte da un utente specifico basandosi sul parametro "name" dell'url.  */
    resetConsecutive(req.params.name)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
      .catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({
          message: 'Si è verificato un errore durante il reset delle partite consecutive.',
          error: err.message
        });
      });
  });

  //partiteVinteLivello(name, livello)
  app.put('/api/utenti/:name/PartiteVinteLivello', isLoggedIn,[],async (req, res) => {
   /*Questa API aggiorna il numero di partite vinte ad un determinato livello da un utente specifico basandosi sul parametro "name" dell'url.  */
    const { livello } = req.body;
    partiteVinteLivello(req.params.name, livello)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
    .catch((err) => {
      console.error('API Error:', err);
      res.status(500).json({
        message: 'Si è verificato un errore durante l\'aggiornamento del numero di partite vinte per livello.',
        error: err.message
      });
    });
  });


  //OBIETTIVO

  // listObiettivi()
  app.get('/api/obiettivi', isLoggedIn, async (req, res) => {
    /*Questa API recupera l'elenco di tutti gli obiettivi disponibili.*/
    listObiettivi()
      .then(obiettivi => res.json(obiettivi))
      .catch(err => {
        console.error('Errore durante il recupero degli obiettivi', err);
        res.status(500).end();
      });
  });


  //OBIETTIVI_UTENTE

  // getObiettiviUtente(name)
  app.get('/api/utenti/:name/obiettiviUtente', isLoggedIn, async (req, res) => {
    /*Questa API recupera l'elenco di tutti gli obiettivi ottenuti dall'utente loggato.*/
    const name = req.params.name;
    try {
      const obiettiviUtente = await getObiettiviUtente(name);
      res.json(obiettiviUtente);
    } catch (err) {
      console.error('Errore durante il recupero degli obiettivi raggiunti dal giocatore', err);
      res.status(500).json({ error: 'Errore nel recupero degli obiettivi raggiunti dal giocatore' });
    }
  });

  // getObiettiviNuovi(name)
  app.get('/api/utenti/:name/obiettiviUtente/obiettiviNuovi', isLoggedIn, async (req, res) => {
    /*Questa API recupera l'elenco di tutti gli obiettivi nuovi ottenuti dall'utente durante l'ultima partita.*/
    const name = req.params.name;
    try {
      const obiettiviNuovi = await getObiettiviNuovi(name);
      res.json(obiettiviNuovi);
    } catch (err) {
      console.error('Errore durante il recupero degli obiettivi appena raggiunti dal giocatore', err);
      res.status(500).json({ error: 'Errore nel recupero degli obiettivi appena raggiunti dal giocatore' });
    }
  });

  // checkAddObiettivoGiocata(name, livello)//modificata 
  app.post('/api/utenti/:name/obiettiviUtente/checkAddObiettivoGiocata', isLoggedIn, async (req, res) => {
    /*Questa API controlla i requisiti ed eventualmente assegna l'obiettivo "Prima partita giocata".*/
    const { livello } = req.body;
    const name = req.params.name;
    checkAddObiettivoGiocata(name, livello)
      .then((msg ) => {
        res.status(200).json ({
          message: msg
        });
      })
      .catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({
          message: 'Si è verificato un errore durante il controllo e l\'aggiunta dell\'obiettivo "Prima partita giocata".',
          error: err.message
        });
      });
  });

  // checkAddObiettivoVinta(req.params.name, livello)
  app.post('/api/utenti/:name/obiettiviUtente/checkAddObiettivoVinta', isLoggedIn, async (req, res) => {
    /*Questa API controlla i requisiti ed eventualmente assegna l'obiettivo "Prima partita vinta".*/
    const { livello } = req.body;
    checkAddObiettivoVinta(req.params.name, livello)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
    .catch((err) => {
      console.error('API Error:', err);
      res.status(500).json({
          message: 'Si è verificato un errore durante il controllo e l\'aggiunta dell\'obiettivo "Prima partita vinta".',
          error: err.message
        });
      });
  });

  //checkAddObiettivoConsecutive(req.params.name, livello)
  app.post('/api/utenti/:name/obiettiviUtente/checkAddObiettivoConsecutive', isLoggedIn, async (req, res) => {
    /*Questa API controlla i requisiti ed eventualmente assegna l'obiettivo "Partite consecutive".*/
    const { livello } = req.body;
    checkAddObiettivoConsecutive(req.params.name, livello)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
      .catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({
          message: 'Si è verificato un errore durante il controllo e l\'aggiunta dell\'obiettivo "Partite consecutive".',
          error: err.message
        });
      });
  });

  //checkAddObiettivoLivello(name, livello)
  app.post('/api/utenti/:name/obiettiviUtente/checkAddObiettivoLivello', isLoggedIn, async (req, res) => {
    /*Questa API controlla i requisiti ed eventualmente assegna l'obiettivo "obiettivi per livello".*/
    const { livello } = req.body;
    const name = req.params.name;

    checkAddObiettivoLivello(name, livello)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
      .catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({
          message: 'Si è verificato un errore durante il controllo e l\'aggiunta dell\'obiettivo in base al livello.',
          error: err.message
        });
      });
  });

  //resetNuovo(name)
  app.put('/api/utenti/:name/obiettiviUtente/resetNuovo', isLoggedIn, async (req, res) => {
    /*Questa API resetta il campo "nuovo" nella tabella obiettivi_utente.*/
    resetNuovo(req.params.name)
    .then((msg ) => {
      res.status(200).json ({
        message: msg
      });
    })
    .catch((err) => {
      console.error('API Error:', err);
      res.status(500).json({
        message: 'Si è verificato un errore durante il reset del campo nuovo.',
        error: err.message
      });
    });
  });

  // getObiettiviProssimi(name)
  app.get('/api/utenti/:name/obiettiviUtente/obiettiviProssimi', isLoggedIn, async (req, res) => {
    /*Questa API recupera gli obiettivi non ancora raggiunti dall'utente.*/
    const name = req.params.name;
    try {
      const obiettiviProssimi = await getObiettiviProssimi(name);
      res.json(obiettiviProssimi);
    } catch (err) {
      console.error('Errore durante il recupero degli obiettivi raggiunti dal giocatore', err);
      res.status(500).json({ error: 'Errore nel recupero degli obiettivi prossimi' });
    }
  });

//Fase 4 - Far partire il server 

  // Start server -> lancio il server sulla porta + messaggio da inviare.
  app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });
