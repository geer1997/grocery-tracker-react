import { signInWithPopup } from "firebase/auth";
import { useFirebase } from "react-redux-firebase";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "..";

const SignIn = () => {
  // const firebase = useFirebase();
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("result", result)
        navigate("../items", { replace: true });
      });
  };
  return (
    <div>
      <h1>Sign In</h1>
      <button
        onClick={(event) => {
          event.preventDefault();
          signInWithGoogle();
        }}
      >
        Sign In with Google
      </button>
    </div>
  );
};
export default SignIn;