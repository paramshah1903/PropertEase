import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  //fetch the offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //get Reference
        const listingRef = collection(db, "listings");
        //create the query
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  //fetch Rent listing:
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  //fetch sale listing:
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold text-2xl px-3">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out">
                Show More Offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
              {offerListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                );
              })}
            </ul>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold text-2xl px-3">Places for Rent</h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out">
                Show More Places for Rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                );
              })}
            </ul>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="font-semibold text-2xl px-3">Places For Sale</h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-500 hover:text-blue-800 transition duration-150 ease-in-out">
                Show More Places For Sent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
              {saleListings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
