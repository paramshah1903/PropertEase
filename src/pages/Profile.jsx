import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

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

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  //The useEffect hook is used to define a function, fetchUserListings, that will be executed after the component is mounted or whenever the value of auth.currentUser.uid changes. The dependency array [auth.currentUser.uid] specifies that the effect should run whenever the auth.currentUser.uid value changes.

  //Inside the fetchUserListings function, a reference to the "listings" collection in Firestore is created using collection(db, "listings"). The db variable is assumed to be a reference to your Firestore database.

  //A query is constructed using the query function, which specifies the conditions for the query. In this case, the query filters documents where the "userRef" field is equal to the current user's UID (auth.currentUser.uid), and the results are ordered by the "timestamp" field in descending order.

  //The getDocs function is used to asynchronously retrieve the documents that match the query from Firestore. The await keyword is used to pause the execution of the code until the query results are returned.

  //The querySnap variable holds the snapshot of the query results. The forEach method is called on the snapshot to iterate over each document in the results.

  //For each document, an object is created with the document ID (doc.id) and the document data (doc.data). This object is then pushed to the listings array.

  //After iterating over all the documents, the listings array is set as the state using the setListings function. This will trigger a re-render of the component with the updated listings state.

  //Finally, the setLoading function is called with false to indicate that the loading state is complete.

  //The listings array is an array of objects, where each object represents a document retrieved from the Firestore query result. Each object has two properties:
  //id: This property holds the unique identifier (doc.id) of the Firestore document.
  //data: This property holds the actual data (doc.data) of the Firestore document.

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  //   The onDelete function takes a listingID parameter, representing the ID of the listing to be deleted.

  // The function displays a confirmation dialog using window.confirm(). If the user confirms the deletion by clicking "OK," the code inside the if statement executes.

  // Inside the if block, the deleteDoc function is called asynchronously. It appears to be deleting a document using Firebase Firestore, based on the doc and db objects. The await keyword ensures that the deletion operation completes before proceeding to the next step.

  // After the deletion, the listings array is filtered using the filter method. It creates a new array called updatedListings that excludes the listing with the matching listingID. The filter function checks if each listing.id is not equal to listingID.

  // The setListings function is called with updatedListings as an argument to update the state or variable that holds the listings data.

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete??")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter((listing) => {
        return listing.id !== listingID;
      });
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }
  //onEdit we simply navigate to a different route
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
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
              //if the change detail is false then disabled will be true because we don't want to edit the value if change detail is set to false
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
      <div className="max-w-6xl mx-auto mt-4">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-center font-semibold text-2xl">My Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                  // In this case, the anonymous arrow function serves as a callback or event handler that points to the onDelete function. It is not calling onDelete directly when the component is rendered, but rather when the associated event or action occurs.
                  // The arrow function is created on-the-fly and provides a way to pass the listing.id argument to the onDelete function without invoking it immediately. It allows for deferred execution of the onDelete function with the specified argument, triggered by the event or action associated with the component.
                  // So, you can say that the anonymous arrow function acts as a reference or pointer to the onDelete function, enabling the passing of arguments in a delayed manner.
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
