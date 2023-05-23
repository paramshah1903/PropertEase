import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export default function Contact(props) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", props.userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not find Landlord");
      }
    }
    getLandlord();
  }, [props.userRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  //the landlord!== null is a very important condition which we must check before rendering landlord.email because it takes time for db to fetch data so once its fetched it will show correct data
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p className="mt-4">
            Contact {landlord.name} for {props.listing.name}
          </p>
          <div>
            <textarea
              className="mt-4 w-full px-4 py-2 text-xl text-gray-700 bg-white rounded "
              name="message"
              id="message"
              rows={2}
              value={message}
              onChange={onChange}
            ></textarea>
          </div>
          <a
            href={`mailto:${encodeURIComponent(
              landlord.email
            )}?Subject=${encodeURIComponent(
              props.listing.name
            )}&body=${encodeURIComponent(message)}`}
          >
            <button
              type="button"
              className="px-7 py-3 bg-blue-600 text-center uppercase hover:bg-blue-800 hover:shadow-xl text-white w-full mt-4 transition duration-150 ease-in-out font-semibold"
            >
              Send Email
            </button>
          </a>
        </div>
      )}
    </>
  );
}
