import styled from 'styled-components'
import {Avatar, IconButton, Button} from '@material-ui/core'
import getRecipientEmail from '../utils/getRecipientEmail'
import { useAuthState } from "react-firebase-hooks/auth"
import {auth, db} from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter} from 'next/router'

const Chat = (props) => {
    const router = useRouter()
    const {users, id} = props
    const [value] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)))
    const enterChat = () => (
        router.push(`/chat/${id}`)
    )
    const [user] = useAuthState(auth)
    const recipient = value?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user)
    // console.log(recipient);
    // console.log(recipientEmail)
    return (
        <Container onClick={enterChat}>
            {recipient?.photoURL.length > 1 ? (<UserAvatar src={recipient?.photoURL} />) : (<UserAvatar>{recipientEmail?.charAt(0).toUpperCase()}</UserAvatar>) }
            
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat


const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;