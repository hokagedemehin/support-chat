import styled from 'styled-components'
import {Avatar, IconButton, Button} from '@material-ui/core'
// import {MoreVertIcon, ChatIcon} from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import * as EmailValidator from 'email-validator'
import firebase from 'firebase';
import {auth, db} from '../firebase'
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat'

const Sidebar = () => {
    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [value] = useCollection(userChatRef);
    
    const createChat = () => {
        const input = prompt('Please enter email address for the user you want to chat with.');

        if(!input) return null;

        if(EmailValidator.validate(input) && input !== user.email && !chatExist(input)){
            db.collection('chats').add({
                users: [user.email, input],
                // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }
    }
    const chatExist = (recipientEmail) =>
        !!value?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)

    const logout = () => {
        // firebase.auth().signOut();
        auth.signOut();
      };
    //   console.log(user)
    return (
        <Container>
            <Header>
                {user?.photoURL !== null ? (<UserAvatar src={user.photoURL} />)
                : (<UserAvatar>{user.email.charAt(0).toUpperCase()}</UserAvatar>)}
                {/* <UserAvatar src={user.photoURL} /> */}
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                    <IconButton onClick={logout}>
                        <ExitToAppIcon  />
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <SearchInput placeholder="Search in chat" />
            </Search>
            <SidebarButton onClick={createChat}>Start a new Chat</SidebarButton>
            
            {/* list of chats */}
            {value?.docs.map((item) => (
                <Chat key={item.id} id={item.id} users={item.data().users} />
            )
                
            )}
        </Container>
    );
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px
    `;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    /* margin: 15px */
    cursor: pointer;
    :hover {
        opacity: 0.8;

    }
`;

const IconsContainer = styled.div``;