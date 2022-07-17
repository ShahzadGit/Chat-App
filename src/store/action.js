import Startfirebase from './../config/firebase'
import { signInWithPopup, FacebookAuthProvider, signOut } from "firebase/auth";
import { set, ref, onValue, push, child, remove } from 'firebase/database'
export const SETUSERS = "SETUSERS"
export const SETFBUSERS = "SETFBUSERS"
export const LOGOUT = "LOGOUT"
export const GETCHATS = "GETCHATS"

export const INCREMENT_BY_VALUE = "INCREMENT_BY_VALUE"


export const setUsers = (users) => {
    return {
        type: SETUSERS,
        payload: users
    }
}

export const logInWithFacebook = () => {

    return (dispatch) => {
        const db = Startfirebase('DB')
        const auth = Startfirebase('Auth')
        const provider = new FacebookAuthProvider()

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user

                let createUser = {
                    name: user.displayName,
                    //email: user.email,
                    profile: user.photoURL,
                    uid: user.uid
                }
                //console.log("User-->", createUser)
                set(ref(db, 'Users/' + user.uid), createUser)
                    .then(() => {
                        dispatch({ type: SETUSERS, payload: createUser })
                    })
                    .catch((error) => {
                        console.log("Error in saving data-->", error)
                    })

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                // const credential = FacebookAuthProvider.credentialFromResult(result);
                // const accessToken = credential.accessToken;
            })
            .catch((error) => {
                console.log("Error in Login-->", error)
            })
        //   dispatch({ type: "SETDATA", data: data })
    }
}

export const getUsers = () => {

    return (dispatch) => {
        const db = Startfirebase("DB")
        let users = []
        const dbRef1 = ref(db, '/Users');

        //This pattern can be useful when you want to fetch all children of a list in a single operation, rather than listening for additional child added events.
        onValue(dbRef1, (snapshot) => {
            if (snapshot.exists) {
                snapshot.forEach((childSnapshot) => {
                    //const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    users.push(childData)
                });
                //Place dispatch here...
                dispatch({ type: SETFBUSERS, payload: users })
                console.log('users----->', users)

            }
            else
                alert("No User in DB")
        }, {
            onlyOnce: true
        });
        //Don't place dispatch here...As this part is running before the above code
        //console.log("Users in Get Users-->", users)
    }
}

export const logOut = () => {

    return (dispatch) => {

        const auth = Startfirebase('Auth')

        signOut(auth).then(() => {
            dispatch({ type: LOGOUT })
        }).catch((error) => {
            // An error happened.
        });
    }
}

export const getChats = (chatsUid) => {

    return (dispatch) => {
        const db = Startfirebase("DB")
        // let myChats = [] //Don't place it here as it will empty the variable on Every childadded/changed/removed Place it down inside loop
        console.log("Mergged UID in getChats->", chatsUid)
        const dbRef1 = ref(db, '/Chats' + '/' + chatsUid);

        //This pattern can be useful when you want to fetch all children of a list in a single operation, rather than listening for additional child added events.
        onValue(dbRef1, (snapshot) => {
            let myChats = []
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    //const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    myChats.push(childData)
                });
                //Place dispatch here...
                dispatch({ type: GETCHATS, payload: myChats })
                // console.log('Chats in IF----->', myChats)

            }
            else {
                dispatch({ type: GETCHATS, payload: myChats }) //This dispatch will probably send an empty array jsut to remove previous chats if any
                // console.log('Chats in Else-IF----->', myChats)
                alert("No Chats in DB for this user.")
            }

        }, {
            // onlyOnce: true
        });
        //Don't place dispatch here...As this part is running before the above code
        //console.log("Users in Get Users-->", users)
    }

}

export const setChats = (chat) => {
    return (dispatch) => {
        console.log("Chat in Action", chat)
        const db = Startfirebase("DB")
        const newChatKey = push(child(ref(db), 'Chats')).key

        let createChat = {
            message: chat.message,
            name: chat.name,
            uid: chat.uid,
            chatUid: newChatKey
        }

        set(ref(db, 'Chats/' + chat.chatUid + '/' + newChatKey), createChat)
            .then(() => {
                // This dispatch was not needed at all. Because once the child data was added by set(), it triggered the OnValue() listener in the getChats(), which in return fetched all new changes and dispatched them to store. OnValue() This method is triggered once when the listener is attached and again every time the data, including children, changes.  
                // dispatch({ type: "SETCHATS", payload: create_chat })
                console.log("Chat added successfully")
                //alert("User Loged in Successfully!")
                //console.log("History-->", history)
                //history.push('/chat')
                //history.go()

            })
            .catch((error) => {
                console.log('ERROR->', error)
            })
    }
}

export const removeChat = (merggedID, chatID) => {
    return (dispatch) => {
        // console.log('Mergged-->',merggedID)
        // console.log('ChatUid-->',chatID)
        // console.log('Chats/' + merggedID + '/' + chatID)
        
        const db = Startfirebase("DB")
        remove(ref(db, 'Chats/' + merggedID + '/' + chatID))
            .then(() => { 
            //    alert('Data was Deleted') 
            console.log("Chat Deleted...")
            })
            .catch((error) => { alert('Error', error) })
    }
}

// export const decrement = () => {
//     return {
//         type: DECREMENT
//     }
// }

export const incrementByValue = (number) => {
    return {
        type: INCREMENT_BY_VALUE,
        payload: number
    }
}
