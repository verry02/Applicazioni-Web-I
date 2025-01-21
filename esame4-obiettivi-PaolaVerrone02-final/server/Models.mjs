/* Definizione dei modelli
    In questo file vengono definite le strutture dati che rappresentano gli elementi principali 
    dell'applicazione. In particolare, si definiscono tre modelli: User, Obiettivo e Obiettivi_utente.

    Non vengono definiti tutti i campi delle tabelle in quanto si scelgono solo quelli necessari per 
    il contesto dell'applicazione (ad esempio, i campi password e salt presenti nella tabella user 
    non vengono condivisi). 

    Il file Models.mjs presente nella cartella server è il medesimo del file Models.mjs presente nella 
    cartella client. Si tratta di una scelta fondamentale per garantire un flusso di dati fluido e senza 
    errori tra il client e il server. Nel dettaglio, si garantisce che i dati trasferiti tra il client 
    e il server siano strutturati nello stesso modo per garantire la corretta manipolazione dei dati,
    coerenza nei cambiamenti e corretto funzionamento delle API.
*/

//Si definisce l'utente 
    function User (id, username, partiteGiocate, partiteVinte, partiteConsecutive){
        this.id = id;
        this.username = username;
        this.partiteGiocate = partiteGiocate;
        this.partiteVinte = partiteVinte;
        this.partiteConsecutive = partiteConsecutive;
    }

// Si definisce l'obiettivo 
    function Obiettivo (id, nome, descrizione){
        this.id = id;
        this.nome = nome;
        this.descrizione = descrizione;
    }

// Si definisce l'obiettivo raggiunto dall'utente 
    function ObiettiviUtente (id, user, obiettivo, descrizione, icona){
        this.id = id;
        this.user = user;
        this.obiettivo = obiettivo;
        this.descrizione = descrizione;
        this.icona = icona;
    }

/* Esportazione 
    Infine, i rende possibile l'importazione di questi modelli in altri moduli, 
    permettendo così di utilizzarli per creare oggetti User, Obiettivo e ObiettiviUtente 
    in diverse parti dell'applicazione server-side.
*/
    export { User, Obiettivo, ObiettiviUtente };


