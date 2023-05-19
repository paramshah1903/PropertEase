import React, { useState } from "react";

export default function CreateListing() {
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
  } = formData;
  function onChange() {
    console.log("clicked");
  }
  return (
    <main className="max-w-md px-2 mx-auto ">
      <h1 className="text-3xl text-center font-bold mt-6">Create a Listing</h1>
      <form>
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
            value="sale"
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
            required
            className="rounded bg-white px-4 py-2 border-slate-800 w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full uppercase text-white bg-blue-600 px-4 py-3 hover:bg-blue-800 hover:shadow-lg transition duration 200 ease-in-out shadow-md"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
