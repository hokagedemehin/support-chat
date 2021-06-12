import Head from 'next/head'
import styled from 'styled-components'
import Sidebar from '../../components/Sidebar'
import {db, auth} from '../../firebase'
import ChatScreen from '../../components/ChatScreen'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useAuthState } from "react-firebase-hooks/auth"

const Chat = (props) => {
    const {chat, messages} = props
    const [user] = useAuthState(auth)

    // console.log(props)
    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
                <meta name="description" content="Each Chat will be generated here" />
                <link rel="icon" href="/whatsapp.png" />
            </Head>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
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

