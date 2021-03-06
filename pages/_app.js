import '../styles/globals.css'
import { useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from '../firebase'
import firebase from 'firebase';
// import Login from './login'
import Login from './login1'
import Loading from '../components/Loading'

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    if(user){
      db.collection('users').doc(user.uid).set({
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : user.email.charAt(0).toUpperCase(),
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true })
    }
  }, [user])
  if (loading) return <Loading />
  if (!user) return <Login/>
  return <Component {...pageProps} />
}

export default MyApp
