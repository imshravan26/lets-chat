import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import firebase from "firebase";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          name: user.displayName,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return (
    <motion.div
      key={router.route}
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          scale: 0.8,
          opacity: 0.1,
        },
        animate: {
          scale: 1,
          opacity: 1,
        },
      }}
    >
      <ToastContainer />
      <Component {...pageProps} />
    </motion.div>
  );
}

export default MyApp;
