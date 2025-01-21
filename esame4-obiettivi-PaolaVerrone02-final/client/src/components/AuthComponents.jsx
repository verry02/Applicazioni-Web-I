import { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function LoginForm({ login }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Stato per tracciare il login

  const handleSubmit = (event) => {

    event.preventDefault();
    const credentials = { username, password };
    login(credentials);
    setIsLoggedIn(true);  // Imposta lo stato di login a true dopo l'accesso
  };

  const handleLogout = () => {
    setIsLoggedIn(false);  // Reimposta lo stato di login a false
  };

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
      <Container className="d-flex justify-content-center align-items-center min-vh-100" >
        <Row className="w-50" >
          <Col>
            {!isLoggedIn ? (
              <Form onSubmit={handleSubmit} className="p-4 bg-light rounded" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Form.Group controlId='username' className='mb-3'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type='email' 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} 
                    required 
                    placeholder="Inserisci la tua email"
                  />
                </Form.Group>

                <Form.Group controlId='password' className='mb-3'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type='password' 
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)} 
                    required 
                    minLength={6}
                    placeholder="Inserisci la tua password"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button type='submit' variant='success' className="w-45">Login</Button>
                  <Link className='btn btn-secondary mx-2 w-45' to={'/Homepage'}>Cancel</Link>
                </div>
              </Form>
            ) : (
              <div className="text-center">
                <h5 className="mb-4" style={{ fontSize: '18px' }}>Benvenuto {username}!</h5>
                <Button 
                  variant='outline-light' 
                  onClick={handleLogout} 
                  className="w-45"
                  style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
                >
                  Logout
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function LogoutButton({ logout }) {
  return (
    <Button 
      variant='outline-light'  
      onClick={logout}
      style={{ color: 'black', backgroundColor: 'white', border: '1px solid black' }}
    >
      Logout
    </Button>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

LogoutButton.propTypes = {
  logout: PropTypes.func.isRequired,
};

export { LoginForm, LogoutButton };
