import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { serverTimestamp, setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      //inside the createUserWithEmailAndPassword we need to pass the earlier created auth instance which we had created using the getAuth() method
      //along with that we pass the email and password
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // The line of code updateProfile(auth.currentUser, { displayName: name, }); is used to update the profile of the current user in Firebase. The updateProfile() function takes two arguments: the current user and an object that contains the profile information that you want to update.
      // The displayName property is used to update the user's display name. The updateProfile() function is an asynchronous function, so the await keyword is used to wait for the function to complete before continuing execution.
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // The line of code const user = userCredentials.user; is used to assign the user variable to the value of the user property of the userCredentials object. The userCredentials object is returned by the createUserWithEmailAndPassword() function, which is used to create a new user in Firebase.
      // The user object contains information about the user, such as their email address, password, and display name. The user object is a valuable resource for accessing information about the user in your Firebase app.
      const user = userCredentials.user;

      //we dont want to store the password in the database so we first create a copy of the formData and remove the password from it
      //while signing up the password is automatically hashed and stored inside the firebase auth
      const fromDataCopy = { ...formData };
      delete fromDataCopy.password;
      fromDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), fromDataCopy);
      // The line of code await setDoc(doc(db, "users", user.uid), fromDataCopy); is used to set the value of a document in Firestore. The doc() function creates a reference to a document in the users collection. The setDoc() function then sets the value of the document to the value of the fromDataCopy object.
      // The setDoc() function is an asynchronous function, so the await keyword is used to wait for the function to complete before continuing execution.
      // The db variable is a reference to the Firestore database. The user.uid variable is the unique identifier of the user. The fromDataCopy object is an object that contains the data that you want to set for the document
      console.log(user);

      //the toast.success to show a success notification while the toast.error to display an error
      //toast is global component and just like Header it is defined outside the <Routes> in the app.js file
      toast.success("Signed Up Successfully");
      //to directly navigate to the home page we used the useNaviagte from the "react-router-dom"
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong with the registration");
    }
  }

  return (
    <diV>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">SignUp</h1>
        <div className="flex justify-center flex-wrap items-center px-4 py-4 max-w-6xl mx-auto">
          <div className="md:w-[67%] lg:w-[50%] mb-12 lg:mb-6 ">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2V5c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt="keys"
              className="w-full rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                id="name"
                value={name}
                onChange={onChange}
                className="text-xl mb-6 w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                placeholder="Full Name"
              ></input>
              <input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                className="text-xl mb-6 w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                placeholder="Email Address"
              ></input>
              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="text-xl w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                  placeholder="Password"
                ></input>
                {showPassword ? (
                  <AiFillEyeInvisible
                    className="absolute top-3 right-3 text-xl cursor-pointer"
                    onClick={() => {
                      setShowPassword((prevState) => !prevState);
                    }}
                  />
                ) : (
                  <AiFillEye
                    className="absolute top-3 right-3 text-xl cursor-pointer"
                    onClick={() => {
                      setShowPassword((prevState) => !prevState);
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
                {/* //the whitespace-nowrap is used to In Tailwind CSS, the
                whitespace-nowrap class prevents text from wrapping within an
                element. Newlines and spaces will be collapsed. */}
                <p>
                  Have an account?
                  <Link
                    to="/sign-in"
                    className="text-red-600 hover:text-red-300 transition duration-200 ease-in-out"
                  >
                    SignIn
                  </Link>
                </p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-300 transition duration-200 ease-in-out"
                >
                  Forgot Password
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 px-5 py-3 uppercase rounded text-white text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out "
              >
                Sign Up
              </button>
              <div>
                <p className="text-center font-bold items-center my-4 flex before:border-t before:flex-1 before:border-black after:border-t after:flex-1 after:border-black">
                  OR
                </p>
                <OAuth />
              </div>
            </form>
          </div>
        </div>
      </section>
    </diV>
  );
}
