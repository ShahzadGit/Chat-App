import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import Image from 'react-bootstrap/Image'
import Table from 'react-bootstrap/Table'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getUsers } from "./../store/action";
import { getChats } from "./../store/action";
import { setChats } from "./../store/action";
import { removeChat } from "./../store/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'


function Chat() {

  const { users, current_user, isLoggedIn, chats } = useSelector(state => ({
    current_user: state.current_user,
    isLoggedIn: state.isLoggedIn,
    users: state.users,
    chats: state.chats

  }), shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers())
    //console.log('Users-->', users);

  }, []);

  const [chatUser, setChatUser] = useState({})
  const [message, setMessage] = useState("")

  function startChat(user) {
    const chatsUid = merge_uid(current_user.uid, user.uid)
    setChatUser(user)
    // setChatUser(preState => {
    //   return Object.assign({}, preState, user);
    // })
    dispatch(getChats(chatsUid))
  }
  function merge_uid(uid1, uid2) {
    if (uid1 < uid2) {
      return uid1 + uid2
    } else
      return uid2 + uid1
  }
  function send() {
    const chatsUid = merge_uid(current_user.uid, chatUser.uid)
    // console.log("chatsUid-->", chatsUid)
    let data = {
      message: message,
      name: current_user.name,
      uid: current_user.uid,
      chatUid: chatsUid
    }
    // console.log("data-->", data)
    dispatch(setChats(data)) //This will not only Set Chats in State but also in Firebase DB, whiich in return invoke onValue listener and cause a re-render
    setMessage("")

  }

  function deleteChat(chatID) {
    const mergeddUid = merge_uid(current_user.uid, chatUser.uid)
    // console.log('Mergged-->',mergeddUid)
    // console.log('ChatUid-->',mergeddUid)

    dispatch(removeChat(mergeddUid, chatID))
  }

  return (
    <div style={{ display: 'flex', textAlign: 'left', justifyContent: 'center' }}>

      <Accordion defaultActiveKey={['0']} alwaysOpen style={{ width: '70%' }}  >
        <Accordion.Item eventKey="0">
          <Accordion.Header>List of Users</Accordion.Header>
          <Accordion.Body>
            <div style={{ display: 'flex', textAlign: 'left', justifyContent: 'center' }}>
              <Card style={{ width: '100%' }} >
                <ListGroup >
                  <Table striped size="sm" hover>
                    <tbody>
                      {users.map((user, i) => {
                        return (
                          current_user.uid !== user.uid &&
                          <tr key={i}>
                            <td><Image src={user.profile} roundedCircle width="40rem" style={{ float: 'left' }} /></td>
                            <td><h6>{user.name}</h6></td>
                            <td><Button variant="primary" id="button-addon2" onClick={() => startChat(user)}>Chat</Button></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </ListGroup>
              </Card>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Chats...</Accordion.Header>
          <Accordion.Body>
            {Object.keys(chatUser).length ?
              <div style={{ display: 'flex', textAlign: 'left', justifyContent: 'center' }}>
                <Card style={{ width: '100%' }}>
                  <Card.Img variant="top" src={chatUser.profile} style={{ width: '7rem', display: 'block', marginLeft: 'auto', marginRight: 'auto', borderRadius: '50%', border: '2px solid lightgray' }} />
                  <Card.Body>
                    {/* <Card.Title>{chatUser.name}</Card.Title> */}
                    <Table striped size="sm" hover>
                      <tbody>
                        {chats.length > 0 ?
                          chats.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.uid === current_user.uid ? <h6 style={{ color: "royalblue" }}>You-> {v.message}</h6> : <h6 style={{ color: "gray" }}>{chatUser.name}-> {v.message}</h6>}</td>
                                <td>{v.uid === current_user.uid && <Button variant="outline-primary" size="sm" onClick={() => { deleteChat(v.chatUid) }}><FontAwesomeIcon icon={faTrashCan} size="lg" /></Button>}</td>
                              </tr>
                              // <div key={i}>
                              //   {v.uid === current_user.uid ? <h6 style={{ color: "royalblue", display: "inline-block", float: "left" }}>You-> {v.message}</h6> : <h6 style={{ color: "gray" }}>{chatUser.name}-> {v.message}</h6>}
                              //   {/* <Card.Text  style={{ color: v.uid === current_user.uid ? "blue" : "green" }}>{v.message}</Card.Text> */}
                              //   {v.uid === current_user.uid && <Button variant="outline-primary" size="sm" style={{ marginLeft: "30%" }} onClick={() => { deleteChat(v.chatUid) }}><FontAwesomeIcon icon={faTrashCan} size="lg" /></Button>}
                              // </div>
                            )
                          })
                          :
                          <Card.Text>No Chats in DB</Card.Text>
                        }
                      </tbody>
                    </Table>

                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Write your message"
                        aria-label="Write your message"
                        aria-describedby="basic-addon2"
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                      />
                      <Button variant="primary" id="button-addon2" onClick={() => send()}>Send</Button>
                    </InputGroup>
                  </Card.Body>
                </Card>
              </div>
              :
              <h5>Select a User to Chat with...!</h5>
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Chat;
