import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";

export default function CreateListing() {
  const navigate = useNavigate();
  const [geoLocationEnabled, setgeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  //loading is a state variable to control the spinner component
  const [listing, setListing] = useState(null);
  const auth = getAuth();
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: "1",
    bathrooms: "1",
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  //Only a small part has changed for the EditListing page from the CreateListing page
  //the changes include that whenever we go to EditListing page we already get the
  //user inputted values we get it using the fetchListings function
  //other change is that instead of saveDoc we use updateDoc
  const params = useParams();
  //useParams to extract parameters from the URL
  //apart from it here we ensure that only if the userRef(which has the id) is same as the id in the route only then the listing can be edited
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You cant edit this page");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  //   An inner asynchronous function fetchListings is defined to handle the actual fetching of the listing data.

  // Inside fetchListings, a Firestore document reference (docRef) is created using the Firestore doc function. It specifies the document path as "listings" and the params.listingId value.

  // The getDoc function is called with the docRef to retrieve the document snapshot (docSnap) asynchronously.

  // The code checks if the document exists using docSnap.exists(). If it does exist, the code proceeds to update the component's state.

  // The setListing function is called with docSnap.data() to update the state with the retrieved listing data.

  // The setFormData function is called with { ...docSnap.data() } to update the form data state with the retrieved listing data.

  // The setLoading function is called with false to indicate that the data fetching is complete.

  useEffect(() => {
    setLoading(true);
    async function fetchListings() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }
    fetchListings();
  }, [navigate, params.listingId]);

  function onChange(e) {
    //HANDLING BOOLEAN INPUT
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //HANDLING FILE INPUT
    if (e.target.files) {
      setFormData((prevState) => {
        return {
          ...prevState,
          images: e.target.files,
        };
      });
    }
    //HANDLING NON FILE INPUT
    if (!e.target.files) {
      setFormData((prevState) => {
        return {
          ...prevState,
          [e.target.id]: boolean ?? e.target.value,

          // The ?? operator is a logical operator that is used to evaluate two expressions. The first expression is evaluated, and if it is truthy, the result of the ?? operator is the value of the first expression. If the first expression is falsy, the result of the ?? operator is the value of the second expression.
          // In the code you provided, the ?? operator is used to set the value of the property of the formData object. If the boolean variable is not null, the value of the property is set to the value of the boolean variable. Otherwise, the value of the property is set to the value of the input element.
        };
      });
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    //the setLoading manages the spinner component whether it should be displayed or not
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than the regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }
    let geolocation = {};
    //we haven't used the geolocation api so geoLocation enabled is false for us and we manually set
    //the value of latitude and longitude property of geolocation object based on the values we inserted in
    //latitude and longitude through the form
    if (!geoLocationEnabled) {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    //to store the images we require the firebase storage
    //basically in the whole project we are using three components of the firebase:
    //Firebase Authentication:
    //Firebase Authentication is a service that allows you to handle user authentication and manage user accounts in your application. It provides different authentication methods, such as email/password authentication, social authentication (using platforms like Google, Facebook, Twitter, etc.), and more. Firebase Authentication helps you authenticate and identify users of your application, enabling you to control access to certain features or data based on the user's authentication state or role.
    // Firebase Storage:
    // Firebase Storage is a service that provides secure cloud storage for user-generated content, such as images, videos, or any other files. It allows you to upload, download, and manage files in a scalable and reliable manner. Firebase Storage is typically used to store files like profile pictures, media assets, or any other files that need to be shared or accessed by users of your application. You can control access to files stored in Firebase Storage by setting appropriate security rules.
    // Firestore:
    // Firestore is a flexible and scalable NoSQL document database provided by Firebase. It allows you to store, query, and manage structured data for your application. Firestore organizes data into collections and documents, providing powerful querying capabilities and real-time synchronization.

    //here we are accessing the firebase storage
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}--${image.name}--${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // console.log("File available at", downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    }

    //In the code snippet you provided, the await keyword is used to wait for the resolution of multiple promises returned by the storeImage function. The Promise.all method is used to handle an array of promises and returns a new promise that is fulfilled with an array of resolved values when all the promises in the input array have been resolved.

    // The images array is spread into a new array using the spread operator [...images]. This is done to ensure that images is converted into a regular array so that it can be used with array methods.

    // The map method is used to iterate over each image in the array and call the storeImage function for each image. This returns an array of promises representing the asynchronous upload tasks for each image.

    // The array of promises is passed as an argument to Promise.all. This creates a new promise that waits for all the promises in the array to be resolved.

    // The await keyword is used to pause the execution of the code until the promise returned by Promise.all is resolved. This ensures that the code doesn't proceed to the next line until all the image upload promises are fulfilled.

    let imgUrls;
    try {
      imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      );
      // Process the uploaded image URLs
      console.log(imgUrls);
    } catch (error) {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    }

    //now a formDataCopy is created which will be stored in a new collection named listings
    //the copy will contain the formData the geolocation,the imgUrls and a timestamp
    //we even need to add the userRef which tells who created the listing
    //this will be particularly useful when we require to show all the listing of a certain user
    const formDataCopy = {
      ...formData,
      geolocation,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    //the images will be removed and they get stored in the storage
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    //code for storing into the listing collection
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing edited successfully");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto ">
      <h1 className="text-3xl text-center font-bold mt-6">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
        <div className="flex">
          {/* //we need to explicitly mention the type of button as type="button"
          because as it is within a form so by default it is of type submit and
          as it is a submit type it will lead to refreshing of page which we
          don't want to happen. */}
          <button
            id="type"
            value="sale"
            type="button"
            onClick={onChange}
            className={`font-medium mr-3 text-sm shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            Sell
          </button>
          <button
            id="type"
            value="rent"
            type="button"
            onClick={onChange}
            className={`font-medium text-sm ml-3 shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            rent
          </button>
        </div>
        <p className="mt-6 font-semibold text-lg">Name:</p>
        <input
          type="text"
          id="name"
          value={name}
          maxLength="32"
          minLength="10"
          required
          placeholder="Name"
          onChange={onChange}
          className="mt-2 w-full px-4 py-2 text-xl bg-white rounded focus:border-slate-600 mb-6"
        ></input>
        <div className="flex space-x-6">
          {/* //In Tailwind CSS, the class space-x-6 is used to create horizontal
          spacing between child elements within a parent container. The space-x
          utility class is part of Tailwind's "space" spacing system. When you
          apply the space-x-6 class to a parent container, it adds horizontal
          spacing between its direct child elements. The 6 in space-x-6
          represents the spacing value. In this case, it indicates a horizontal
          spacing of 1.5rem (or 24 pixels) between the child elements. */}
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
              className="text-lg rounded  focus:border-slate-600 text-center"
            ></input>
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
              className="text-lg rounded  focus:border-slate-600 text-center"
            ></input>
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            id="furnished"
            value={true}
            type="button"
            onClick={onChange}
            className={`font-medium mr-3 text-sm shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            id="furnished"
            value={false}
            type="button"
            onClick={onChange}
            className={`font-medium text-sm ml-3 shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex">
          <button
            id="parking"
            value={true}
            type="button"
            onClick={onChange}
            className={`font-medium mr-3 text-sm shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            id="parking"
            value={false}
            type="button"
            onClick={onChange}
            className={`font-medium text-sm ml-3 shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="mt-6 font-semibold text-lg">Address:</p>
        <textarea
          type="text"
          id="address"
          value={address}
          required
          placeholder="Address"
          onChange={onChange}
          className="mt-2 w-full px-4 py-2 text-xl bg-white rounded focus:border-slate-600 mb-6"
        ></textarea>
        {!geoLocationEnabled && (
          <div className="flex space-x-6">
            <div>
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-lg bg-white border-gray-300 rounded text-center"
              ></input>
            </div>
            <div>
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-lg bg-white border-gray-300 rounded text-center"
              ></input>
            </div>
          </div>
        )}
        <p className=" font-semibold text-lg">Description:</p>
        <textarea
          type="text"
          id="description"
          value={description}
          required
          placeholder="Description"
          onChange={onChange}
          className="mt-2 w-full px-4 py-2 text-xl bg-white rounded focus:border-slate-600 mb-6"
        ></textarea>
        <p className="text-lg  font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            id="offer"
            value={true}
            type="button"
            onClick={onChange}
            className={`font-medium mr-3 text-sm shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            id="offer"
            value={false}
            type="button"
            onClick={onChange}
            className={`font-medium text-sm ml-3 shadow-md uppercase px-7 py-3 hover:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <div>
          <div>
            <p className="font-semibold text-lg">Regular Price</p>
            <div className="flex space-x-6 items-center">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-gray-700 border-gray-300 rounded text-center focus:text-gray-900"
              ></input>
              {type === "rent" && (
                <div>
                  <p className="w-full text-md">$/month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div>
            <div>
              <p className="font-semibold text-lg">Discounted Price</p>
              <div className="flex space-x-6 items-center">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-gray-700 border-gray-300 rounded text-center focus:text-gray-900"
                ></input>
                {type === "rent" && (
                  <div>
                    <p className="w-full text-md">$/month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mt-6">
          <p className="text-xl font-semibold">Images</p>
          <p className="text-gray-700">The first image will be cover(max 6)</p>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            id="images"
            onChange={onChange}
            multiple
            // required
            className="rounded bg-white px-4 py-2 border-slate-800 w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full uppercase text-white bg-blue-600 px-4 py-3 hover:bg-blue-800 hover:shadow-lg transition duration 200 ease-in-out shadow-md"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
}

// const imgUrls = await Promise.all(
//   [...images]
//     .map((image) => storeImage(image))
//     .catch((error) => {
//       setLoading(false);
//       toast.error("Images not uploaded");
//       return;
//     })
// );
