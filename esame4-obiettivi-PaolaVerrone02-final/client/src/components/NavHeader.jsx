import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';
/* Il componente NavHeader è una funzione che accetta un oggetto props come parametro. Le props vengono utilizzate per passare dati e 
funzioni al componente figlio. La barra di navigazione è fissata alla parte superiore della finestra. Si effettua un controllo sull'autenticazione
Se l'utente è loggato, mostra il componente LogoutButton passando la funzione props.handleLogout come prop logout. Se l'utente non è loggato mostra un 
collegamento alla pagina di login */


function NavHeader(props) {
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="fixed-top">
      <Container fluid>
        <span className='navbar-brand text-white'>Il Campione dei numeri</span>
        {props.loggedIn ? 
          <LogoutButton logout={props.handleLogout} /> :
          <Link to='/Homepage/login' className='btn btn-outline-light'>Login</Link>
        }
      </Container>
    </Navbar>
  );
}

export default NavHeader;

