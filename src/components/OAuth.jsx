import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router";

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick(e) {
    try {
      // This line of code gets the Firebase Authentication instance. The Firebase Authentication instance is used to sign in users and manage their authentication state.
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      // This line of code creates a new Google Authentication provider. The Google Authentication provider is used to sign in users with Google.
      const result = await signInWithPopup(auth, provider);
      // This line of code signs in the user with Google using a pop-up window. The signInWithPopup() method takes two arguments: the Firebase Authentication instance and the authentication provider. The signInWithPopup() method returns a promise that resolves with the result of the sign-in operation. The result of the sign-in operation contains information about the signed-in user, such as their email address and ID token.
      const user = result.user;
      // This line of code gets the user object for the signed-in user. The user object contains information about the signed-in user, such as their email address, ID token, and display name.
      // console.log(user);

      //check if user already exists

      //This line of code creates a document reference to the user's document in the users collection. The document reference is used to get and set data on the user's document.
      //The doc() method takes three arguments: the database instance, the collection name, and the document ID. The database instance is used to access the database. The collection name is the name of the collection that contains the document. The document ID is the unique identifier for the document.
      //The document reference is a JavaScript object that contains properties for the document, such as the document ID, the document name, and the document data.

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // This line of code gets the user's document from the users collection. The getDoc() method takes a document reference as its argument and returns a promise that resolves with the document snapshot. The document snapshot contains the data for the document.
      // The document snapshot is a JavaScript object that contains properties for the document, such as the document ID, the document name, and the document data.

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
      // The setDoc() method takes a document reference and an object as its arguments. The object contains the data that will be set on the document. The setDoc() method returns a promise that resolves when the data is set on the document.
    } catch (error) {
      toast.error("Could not authenticate with Google");
    }
  }
  return (
    <div>
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm shadow-md hover:shadow-lg transition duration-150 ease-in-out hover:bg-red-900 "
      >
        <FcGoogle className="mr-1 text-2xl bg-white rounded-full" />
        Continue with Google
      </button>
    </div>
  );
}
