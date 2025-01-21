import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-light py-2 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Attenzione!</h5>
            <p>Prima di giocare assicurati di aver letto e compreso il regolamento, per qualsiasi
                 informazione o segnalazione per contribuire a migliorare la nostra applicazione puoi
                  contattarci al nostro indirizzo email o attraverso una delle nostre pagine social.</p>
          </Col>
          <Col md={3}>
          <h5>Contatti</h5>
            <ul className="list-unstyled">
              <li><a href="mailto:servizioclienti@gmail.com" className="text-light">servizioclienti@gmail.com</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Seguici</h5>
            <ul className="list-unstyled">
              <li><a href="https://www.facebook.com/login/" target="_blank" rel="noopener noreferrer" className="text-light">Facebook</a></li>
              <li><a href="https://twitter.com/login/" target="_blank" rel="noopener noreferrer" className="text-light">Twitter</a></li>
              <li><a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer" className="text-light">Instagram</a></li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p>&copy; 2025 Il campione dei numeri. Tutti i diritti riservati.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;