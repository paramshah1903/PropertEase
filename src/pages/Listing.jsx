import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaParking, FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const auth = getAuth();
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  //   the useEffect hook in React expects a synchronous function or a cleanup function to be returned. The reason for this is that useEffect is designed to handle side effects, such as data fetching, subscriptions, or DOM manipulation. These side effects are typically synchronous operations.

  //   When using the async keyword with a function, it means that the function will return a promise. Promises are asynchronous constructs that represent the result of an asynchronous operation. However, useEffect doesn't directly handle promises as return values.

  //     If you try to directly use an async function as the callback for useEffect, it will not work as expected. The returned promise from the async function is not interpreted as a cleanup function or synchronous operation by React, which can lead to unexpected behavior or errors.

  //   Inside the callback function, an asynchronous function fetchListing is defined. This function will be responsible for fetching the data and updating the component's state.

  //   The doc function is used from the Firebase Firestore library to create a reference to a specific document in the "listings" collection. The document ID is determined by params.listingId.

  //   The getDoc function is called with the docRef to fetch the document snapshot asynchronously.

  //   Using the await keyword, the code waits for the getDoc promise to resolve and then retrieves the docSnap representing the document snapshot.

  //   If the docSnap exists (i.e., the document was found in the database), the data is extracted using docSnap.data(). This data represents the listing information.

  //   The setListing function is called to update the component's state with the fetched listing data.

  //   The setLoading function is called with false to indicate that the loading process is complete.
  function formatPriceWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  //the useEffect only depends upon the params.listingId because whenever the listingId changes we need to re fetch the data from the database

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] cursor-pointer rounded-full h-12 w-12 flex justify-center items-center bg-white z-20"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href); //to copy the location in the users clipboard
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        //after 2s the setShareLinkCopied is set to false while is is true it dynamically renders a <p> with a link copied message.
      >
        <FaShare className="text-2xl text-slate-500  "></FaShare>
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[1%] font-semibold text-md rounded-md z-10 bg-white px-4 py-2">
          Link Copied
        </p>
      )}

      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 shadow-lg rounded-lg lg:space-x-5 bg-white">
        <div className="w-full ">
          <p className="font-bold text-2xl mb-2 text-blue-900">
            {listing.name}-&#8377;{" "}
            {listing.offer
              ? formatPriceWithCommas(listing.discountedPrice)
              : formatPriceWithCommas(listing.regularPrice)}
            {listing.type === "rent" ? "/month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1.5" />{" "}
            {listing.address}
          </p>
          <div className="flex items-center space-x-4">
            <p className="bg-red-800 text-white w-full text-center max-w-[200px] py-1.5  px-1 font-semibold text-xl rounded-lg shadow-lg ">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] rounded-lg py-1.5  px-1 bg-green-800 text-white text-center text-xl font-semibold shadow-lg">
                &#8377;
                {formatPriceWithCommas(
                  listing.regularPrice - listing.discountedPrice
                )}{" "}
                Discount
              </p>
            )}
          </div>
          <p>
            <span className="font-semibold">Description:</span>
            {listing.description}
          </p>
          <ul className="flex justify-between mt-3 font-medium">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="mr-2 text-xl" />
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : "1 bed"}
            </li>
            <li className="flex items-center whitespace-nowrap sm:space-x-10">
              <FaBath className="mr-2 text-xl" />
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 bath"}
            </li>
            <li className="flex items-center whitespace-nowrap sm:space-x-10">
              <FaParking className="mr-2 text-xl" />
              {listing.parking ? `Parking` : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap sm:space-x-10">
              <FaChair className="mr-2 text-xl" />
              {listing.furnished ? `Furnished` : "Not Furnished"}
            </li>
          </ul>
          {/* //, auth.currentUser?.uid is checking if the currentUser object exists
          and has a property called uid. If it does, the expression evaluates to
          true, indicating that the current user's uid is not equal to
          listing.userRef. This condition is used to determine whether to render
          the following code block. By using ?., the code ensures that if
          auth.currentUser is null or undefined, the expression
          auth.currentUser?.uid will also be null or undefined instead of
          throwing an error. It provides a safe way to access nested properties
          without causing runtime errors. */}
          {auth.currentUser?.uid !== listing.userRef && !contactLandlord && (
            <>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setContactLandlord(true);
                    console.log(contactLandlord);
                  }}
                  className="px-7 py-3 bg-blue-600 text-white font-semibold uppercase shadow:md hover:bg-blue-800 hover:shadow-xl rounded w-full text-center transition duration-150 ease-in-out"
                >
                  Contact Landlord
                </button>
              </div>
            </>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>

        <div className=" w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden sm:mt-6 md:mt-0">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                {listing.address} <br />
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
