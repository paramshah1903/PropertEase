import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  }, []);

  return { loggedIn, checkingStatus };
}

// Inside the useEffect hook, the code sets up an event listener using the onAuthStateChanged function provided by Firebase Authentication. This function listens for changes in the authentication state, specifically when a user signs in or signs out.
// The getAuth() function is used to retrieve the authentication instance from Firebase. This instance is required to interact with the authentication functionalities provided by Firebase Authentication.
// When the onAuthStateChanged event is triggered, it passes the user object as an argument to the callback function. If the user object exists (i.e., the user is signed in), the code calls setLoggedIn(true) to update the state variable loggedIn to true. This state variable is likely used to control access to certain routes or components based on the user's authentication status.
// After updating the loggedIn state, the code calls setCheckingStatus(false) to update another state variable, likely used to indicate that the authentication status check is complete. This is useful for displaying loading spinners or conditional rendering based on whether the authentication status has been determined.
// The empty dependency array ([]) as the second parameter to useEffect indicates that the effect should only run once, immediately after the component is mounted. This ensures that the authentication state check is performed when the component is initially rendered.
