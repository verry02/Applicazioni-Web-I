import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from './API.mjs';

// Componenti personalizzati
import NavHeader from "./components/NavHeader.jsx";
import Regole from "./components/Regole.jsx";
import NotFound from "./components/NotFound.jsx";
import { LoginForm } from "./components/AuthComponents.jsx";
import ObiettiviUtente from "./components/ObiettiviUtente.jsx";
import Partita from "./components/Partita.jsx";  
import Footer from "./components/Footer.jsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    if (loggedIn) {
      checkAuth();
    }
  }, [loggedIn]);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Benvenuto, ${user.name}!`, type: 'success' });
      setUser(user);
      navigate(`/${user.name}`);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setMessage({ msg: `Logout eseguito correttamente`, type: 'success' });
    navigate('/Homepage');
  };

  const startNewGame = () => {
    navigate(`/${user.name}/NuovaPartita`);
  };

  const backgroundStyle = {
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/numeri.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat', 
    margin: 0,
  };

  return (
      <Routes>
        <Route path="/Homepage" element={
          <>
            <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
            <Container fluid className='mt-5' style={backgroundStyle}>
              {message && <Row>
                <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
              </Row>}
              <Regole loggedIn={loggedIn} />
            </Container>
            <Footer />
          </>
        } />
        <Route path="/:name" element={
          <>
            <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
            <Container fluid className='mt-5' style={backgroundStyle}>
              {message && <Row>
                <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
              </Row>}
              <Regole loggedIn={loggedIn} />
              {loggedIn && user && (
                <Container fluid className='mt-3' style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '5px' }}>
                  <Col className="text-end">
                    <Button variant="success" onClick={startNewGame}>Nuova partita</Button>
                  </Col>
                  <Col xs="auto">
                    <ObiettiviUtente loggedIn={loggedIn} user={user.name} />
                  </Col>
                </Container>
              )}
            </Container>
            <Footer />
          </>
        } />

        <Route path="/:name/NuovaPartita" element={
          <>
            <Container fluid style={backgroundStyle}>
              <Partita key={location.key} user={user} /> {/* Aggiungi `key={location.key}` */}
            </Container>
            <Footer />
          </>
        } />

        <Route path="/Homepage/login" element={
          loggedIn ? <Navigate replace to={`/${user?.name}`} /> : 
          <>
            <Container fluid className='mt-5' style={backgroundStyle}>
              <LoginForm login={handleLogin} />
            </Container>
            <Footer />
          </>
        } />

        <Route path="*" element={
          <>
            <Container fluid style={backgroundStyle}>
              <NotFound />
            </Container>
            <Footer />
          </>
        } />
      </Routes>
  );
}

export default App;
