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

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
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
        <div className="w-full h-[200px] lg:h-[400px]">
          <p className="font-bold text-2xl mb-2 text-blue-900">
            {listing.name}-${" "}
            {listing.offer ? listing.discountedPrice : listing.regularPrice}
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
                ${listing.regularPrice - listing.discountedPrice} Discount
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
        </div>
        <div className="bg-blue-300 w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden"></div>
      </div>
    </main>
  );
}
