import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  //inside the profile page we are taking the values from the auth instance and initially
  //displaying the values as stored in the database so the value of inputs are name and email which are
  //set using the auth instance

  const { name, email } = formData;

  const [changeDetail, setChangeDetail] = useState(false);

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      //onSubmit we need to do two things first we need to change in the auth and then in the firestore
      if (auth.currentUser.displayName !== name) {
        //updating the display name in firebase authentication
        await updateProfile(auth.currentUser, { displayName: name });
        //basically in this we are updating the displayName property in the firebase auth with the current value of the "name"
      }

      //update the name in the firestore
      const docRef = doc(db, "users", auth.currentUser.uid);
      //This line creates a reference to a specific document in the Firestore database. It uses the doc() function provided by the Firestore SDK to create a reference to the document.
      //here db is the firestore database instance
      //"users" is the name of the collection
      //auth.currentUser.uid represents the UID (unique identifier) of the currently authenticated user. It is used as the document ID to target the specific user document.
      //By creating this docRef, you have a reference to the document in the "users" collection for the currently authenticated user.

      //await updateDoc(docRef, { name: name });: This line updates the specified document with new data. It uses the updateDoc() function provided by the Firestore SDK to perform the update.
      await updateDoc(docRef, {
        name: name,
      });
      //the name property inside the firestore is set to value of name from the input

      toast.success("Profile details updated!!");
    } catch (error) {
      toast.error("Could not update the profile details!");
    }
  }

  return (
    <>
      <section className="flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold text-center mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              //if the change detail is false then disabled will be true because we dont want to edit the value if change detail is set to false
              //the email cant be edited only the name can be edited its state is changed on clicking the edit button
              onChange={onChange}
              className={`w-full text-xl text-gray-700 mb-6 bg-white rounded transition ease-in-out ${
                changeDetail && "bg-red-300"
              }`}
              //dynamic styling using short circuiting
            ></input>

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full text-xl text-gray-700 mb-6 bg-white rounded transition ease-in-out"
            ></input>

            <div className="flex justify-between text-[18px] whitespace-nowrap mb-6">
              <p>
                Do you want to change your details?{" "}
                <span
                  onClick={() => {
                    //using short circuiting to call the onSubmit function when the changeDetail is true.
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-500 cursor-pointer hover:text-red-800 transition duration-150 ease-in-out"
                >
                  {changeDetail ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                className="text-blue-500 cursor-pointer hover:text-blue-800 transition duration-150 ease-in-out"
                onClick={onLogout}
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full rounded shadow-md hover:bg-blue-800 transition duration-150 ease-in-out hover:shadow-lg bg-blue-600 text-white px-4 py-3 font-medium uppercase text-lg "
          >
            <Link to="/create-listing">
              <div className="flex justify-center items-center">
                <FcHome className="mr-2 bg-white rounded-full text-2xl" />
                Sell or rent your house
              </div>
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}
