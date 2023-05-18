import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  //this is a state variable to check if user is loggedIn or not
  const [checkingStatus, setCheckingStatus] = useState(true);
  //this is a state variable which checks whether the auth is complete or not and is used for handling the loading spinner

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
      //   By placing setCheckingStatus(false) outside the if statement, it guarantees that setCheckingStatus(false) will always be executed after evaluating the if condition. If the condition is true and setLoggedIn(true) is called, it will be followed by setCheckingStatus(false). If the condition is false and setLoggedIn(true) is not called, setCheckingStatus(false) will still be executed.
    });
  }, []);

  //   The useEffect hook is utilized to perform an asynchronous operation for checking the authentication status when the component is mounted.
  // Inside the effect function, getAuth() is called to obtain the authentication instance.
  // onAuthStateChanged is a function likely provided by a library or framework (e.g., Firebase) that listens for changes in the authentication state.
  // When the authentication state changes (i.e., when a user signs in or signs out), the callback function receives the user object. If the user object exists (indicating that a user is signed in), setLoggedIn(true) is called to update the loggedIn state variable accordingly.
  // Finally, setCheckingStatus(false) is invoked to indicate that the authentication status check is complete.
  // By using useEffect with an empty dependency array ([]), the effect will run only once, after the initial render.

  return { loggedIn, checkingStatus };
}

// Inside the useEffect hook, the code sets up an event listener using the onAuthStateChanged function provided by Firebase Authentication.
//This function listens for changes in the authentication state, specifically when a user signs in or signs out.
// The getAuth() function is used to retrieve the authentication instance from Firebase. This instance is required to interact with the authentication functionalities provided by Firebase Authentication.
// When the onAuthStateChanged event is triggered, it passes the user object as an argument to the callback function. If the user object exists (i.e., the user is signed in), the code calls setLoggedIn(true) to update the state variable loggedIn to true. This state variable is likely used to control access to certain routes or components based on the user's authentication status.
// After updating the loggedIn state, the code calls setCheckingStatus(false) to update another state variable, likely used to indicate that the authentication status check is complete. This is useful for displaying loading spinners or conditional rendering based on whether the authentication status has been determined.
// The empty dependency array ([]) as the second parameter to useEffect indicates that the effect should only run once, immediately after the component is mounted. This ensures that the authentication state check is performed when the component is initially rendered.
