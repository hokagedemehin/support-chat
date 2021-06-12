import styled from 'styled-components';
import Head from "next/head";
import { Button } from '@material-ui/core';
// import {auth} from '../firebase'
import firebase from 'firebase';
// import * as firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// var firebaseui = require('firebaseui');
const Login = () => {

    // const firebaseConfig = {
    //     apiKey: "AIzaSyAWJuQbGK5dYLyLhrs9PGQFh47Rd55cM3A",
    //     authDomain: "ibk-support-chat1.firebaseapp.com",
    //     projectId: "ibk-support-chat1",
    //     storageBucket: "ibk-support-chat1.appspot.com",
    //     messagingSenderId: "46740928301",
    //     appId: "1:46740928301:web:721d4d76d68e3f3ceac5a4"
    //   };

    // firebase.initializeApp(firebaseConfig)

    const uiConfig = {
        signinOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInFLow: 'popup',
        signinSuccessUrl: '/',
    }
    // var ui = new firebaseui.auth.AuthUI(auth);

    return (
        <Container>
            <Head>
                <title>Login Page</title>
            </Head>
            <LoginContainer>
                {/* <Logo /> */}
                <Button>Sign in</Button>
                {/* ui.start('#firebaseui-auth-container', uiConfig); */}
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div``;
const LoginContainer = styled.div``;
const Logo = styled.image``;