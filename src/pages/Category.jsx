import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useParams } from "react-router";

export default function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);
  const params = useParams();
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListing(lastVisible);
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
      } catch (error) {
        toast.error("Could not find the listings!");
      }
    }
    fetchListings();
  }, [params.categoryName]);

  async function fetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => {
        return [...prevState, ...listings];
      });
      console.log(listings);
      setLoading(false);
    } catch (error) {
      toast.error("Could not find the listings!");
    }
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-center mt-6 mb-6 font-bold text-3xl">
        {params.categoryName === "rent" ? "Places for Rent" : "Places for Sale"}
      </h1>
      {!loading && listings && listings.length > 0 && (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                );
              })}
            </ul>
          </main>
          {lastFetchListing && (
            <div className="flex items-center justify-between">
              <button
                onClick={fetchMoreListings}
                className="mx-auto font-semibold text-xl py-1.5 rounded shadow-lg hover:shadow-2xl transition duration-200 ease-in-out hover:border-slate-600 bg-white border-gray-300 mb-6 mt-6 px-3"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
//the category page is almost similar to the offers page the only change is that we dynamically extract from the url using useParams whether we want to fetch items for sale or rent
