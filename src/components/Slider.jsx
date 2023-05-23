import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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
import { useNavigate } from "react-router";

export default function Slider() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  //all the times we define an async function in useEffect and then call it is because the callback function which we have inside the useEffect cant be an async function hence we first define an async function and then call it
  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit("5"));
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      console.log(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => {
            return (
              <SwiperSlide
                key={id}
                onClick={() => navigate(`category/${data.type}/${id}`)}
              >
                <div
                  style={{
                    background: `url(${data.imgUrls[0]}) center,no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="w-full h-[400px] overflow-hidden relative"
                ></div>
                <p className="text-white bg-[#457b9d] absolute left-3 top-4 py-2 px-3 rounded-br-3xl text-lg font-semibold ">
                  {data.name}
                </p>
                <p className="text-white bg-[#e63946] absolute left-3 bottom-4 py-2 px-3 rounded-tl-3xl text-lg font-semibold ">
                  ${data.offer ? data.discountedPrice : data.regularPrice} {` `}
                  {data.type === "rent" ? "per month" : ""}
                </p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    )
  );
}
