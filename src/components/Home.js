import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Chat from './Chat'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { logInWithFacebook } from "./../store/action";
import { logOut } from "./../store/action";


function Home() {

  const { current_user, isLoggedIn } = useSelector(state => ({
    current_user: state.current_user,
    isLoggedIn: state.isLoggedIn,
  }), shallowEqual);

  const dispatch = useDispatch();

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">:: HOME ::   My Chat App</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {isLoggedIn ?
                <>Signed in as  : <a href="#">{current_user.name}</a><Button variant="outline-light" size="sm" onClick={() => dispatch(logOut())} style={{ marginLeft: '20px' }}>LogOut</Button></> : 
                <h5>User Login Required!</h5>
              }
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      {isLoggedIn ?
        <Chat /> :
        <>
          <Button variant="primary" onClick={() => dispatch(logInWithFacebook())}>Login With Facebook</Button>
          <p style={{marginTop: '35%'}}>This is a Chat-App. It has been built via ReactJS--Firebase--Facebook Login.</p>
        </>
        
      }
    </div>
  );
}

export default Home;