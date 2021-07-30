import Head from 'next/head'
import styled from 'styled-components'
import Sidebar from '../../components/Sidebar'
import {db, auth} from '../../firebase'
import ChatScreen from '../../components/ChatScreen'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useAuthState } from "react-firebase-hooks/auth"

// #########################################################################
import Chat1 from '../../components/Chat1'
import { useCollection } from 'react-firebase-hooks/firestore';
import {useState, useRef} from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import firebase from 'firebase'
import Message from '../../components/Message'
import TimeAgo from 'timeago-react';
import { useRouter} from 'next/router'
import { Avatar, IconButton, Button } from '@material-ui/core'

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4$$$$$$$$$$$$$$$$
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import * as EmailValidator from 'email-validator'

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
// import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// ################################################################################


const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

const Chat = (props) => {
    const {chat, messages} = props
    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [value] = useCollection(userChatRef);
    // console.log(props)

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    const [input, setInput] = useState("")
    const endOfMessageRef = useRef(null)
    const router = useRouter()

    const [messagesSnapshot] = useCollection(db.collection('chats')
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc"))

    const [recipientSnapshot] = useCollection(db.collection('users')
    .where("email", "==", getRecipientEmail(chat.users, user)))
    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map(message => (
                
                <Message key={message.id} 
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }} />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const ScrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }
    const sendMessage = (e) => {
        e.preventDefault();
        db.collection("users").doc(user.id).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true});

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
            
        })

        setInput("");
        ScrollToBottom();
    }
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// *****************************************************************************************
// ****************************************************************************************
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Container2>
            {/* <div className={classes.toolbar} /> */}
            <Divider />
            <Header1>
                {user?.photoURL !== null ? (<UserAvatar src={user.photoURL} />)
                : (<UserAvatar>{user.email.charAt(0).toUpperCase()}</UserAvatar>)}
                {/* <UserAvatar src={user.photoURL} /> */}
                <IconsContainer>
                    <IconButton>
                        <ChatIcon onClick={createChat} />
                    </IconButton>
                    {/* <IconButton>
                        <MoreVertIcon />
                    </IconButton> */}
                    <IconButton onClick={logout}>
                        <ExitToAppIcon  />
                    </IconButton>
                </IconsContainer>
            </Header1>
            <Search>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <SearchInput placeholder="Search in chat" />
            </Search>
            {value?.docs.map((item) => (
                    <Chat1 key={item.id} id={item.id} users={item.data().users} />
                )
                        
            )}
        
    </Container2>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
// *****************************************************************************************
// ****************************************************************************************

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
                <meta name="description" content="Each Chat will be generated here" />
                <link rel="icon" href="/whatsapp.png" />
            </Head>
            <CssBaseline />
            {/* <Sidebar/> */}
            <ChatContainer>
                {/* <ChatScreen chat={chat} messages={messages} /> */}
                <Container1>
                    <Header className={classes.appBar}>
                        {/* <Avatar /> */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        {recipient?.photoURL.length == null ? (<Avatar src={recipient?.photoURL} />) : (<Avatar>{recipientEmail?.charAt(0).toUpperCase()}</Avatar>) }
                        
                        <HeaderInformation>
                            
                            <h3>{recipientEmail}</h3>
                            {recipientSnapshot ? (<p> Last Seen: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Unavailable"}</p>) : ( <p>Loading Last active</p>)}
                        </HeaderInformation>
                        <HeaderIcon>
                            <IconButton>
                                <AttachFileIcon />
                            </IconButton>
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </HeaderIcon>
                    </Header>
                    <nav className={classes.drawer} aria-label="mailbox folders">
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                            paper: classes.drawerPaper,
                            }}
                            
                        >
                            {drawer}
                        </Drawer>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                            paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                        </Hidden>
                    </nav>   
                    <MessageContainer className={classes.appBar}>
                        {showMessages()}
                        <EndOfMessage ref={endOfMessageRef} />
                    </MessageContainer>

                    <InputContainer className={classes.appBar}>
                        <IconButton><InsertEmoticonIcon/></IconButton>
                        <Input value={input} onChange={e => setInput(e.target.value)} />
                        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send</button>
                    </InputContainer>
                </Container1>
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);
    const messaesRef = await ref.collection("messages")
    .orderBy("timestamp", "asc")
    .get()

    const messages = messaesRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages, 
        timestamp: messages.timestamp.toDate().getTime()
    }));

    const chatRef = await ref.get();
    const chat = {
        id: chatRef.id,
        ...chatRef.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        }
    }
}

const Container1 = styled.div``;

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;


const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 10;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    justify-content: space-between;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    >h3 {
        margin-bottom: 3px;
        /* margin-top: 5px; */
    }

    > p {
        font-size: 0.7rem;
        color: gray;
    }
`;

const HeaderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    margin-left: 15px;
    padding: 20px;
    margin-right: 15px;
    background-color: whitesmoke;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 10;
`;

/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */

const UserAvatar = styled(Avatar)`
    /* margin: 15px */
    cursor: pointer;
    :hover {
        opacity: 0.8;

    }
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

const Container2 = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
     height: 100vh;
    /* min-width: 300px;
    max-width: 350px; */
    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;
const Header1 = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 60px;
    border-bottom: 1px solid whitesmoke;
`;
const IconsContainer = styled.div``;