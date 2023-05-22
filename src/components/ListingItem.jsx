import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="flex relative flex-col m-[10px] bg-white justify-between items-center shadow-md hover:shadow-xl rounded-lg overflow-hidden transition duration-150 ease-in-out">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt="house"
          loading="lazy"
          className="h-[170px] w-full hover:scale-105 object-cover transition duration-150 ease-in-out "
        ></img>
        {/* the fromNow is added to calculate the time the listing was created from the 
        current time. */}
        <Moment
          className="absolute top-2 left-2 bg-blue-500 text-white px-2.5 py-1 uppercase test-semibold rounded text-xs shadow-lg"
          fromNow
        >
          {listing.timestamp.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold truncate text-gray-600 text-sm mb-[2px]">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold mt-0  truncate text-xl">{listing.name}</p>
          <p className="text-[#457b9d]">
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === "rent" ? "/month" : ""}
          </p>
          <div className="flex justify-start space-x-1">
            <div className="font-semibold text-s">
              {listing.bedrooms > 1 ? `${listing.bedrooms}Beds` : "1Bed"}
            </div>
            <div className="font-semibold text-s">
              {listing.bathrooms > 1 ? `${listing.bathrooms}Baths` : "1Bath"}
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute right-2 bottom-2 h-[14px] cursor-pointer text-red-500 "
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute right-7 bottom-2 h-4 cursor-pointer text-black "
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}
//listing is an object which it gets as a prop along with an id

//we have already added in the firestore database the timestamp which contains the details
//about when we added the listing
//to show the time we created the listing in a particular format we install react-moment

//SPECIAL TAILWIND CLASSES USED TO STYLE THE listing item:
//the truncate class has been used in address and name
//In Tailwind CSS, you can use the truncate utility class to truncate text and limit it to a single line. This class is useful when you want to restrict text overflow within a container. Here's an example of how to use it:

//the contents class has been applied in the <Link>:-it was used to style properly after we included the grid
//In Tailwind CSS, the contents utility class is used to remove the default styling and layout behavior of certain HTML elements, allowing their contents to flow without any constraints or modifications.

//GRID used in Profile.jsx...explanation:
// In Tailwind CSS, the classes sm:grid, sm:grid-cols-2, lg:grid-cols-3, xl:grid-cols-4, and 2xl:grid-cols-5 are used to create a responsive grid layout with varying column widths at different breakpoints.
// Let's break down what each of these classes does:
// sm:grid: This class sets the element to use a grid layout starting from the small breakpoint (sm) and up.
// sm:grid-cols-2: This class specifies that the grid should have two columns starting from the small breakpoint (sm) and up.
// lg:grid-cols-3: This class specifies that the grid should have three columns starting from the large breakpoint (lg) and up.
// xl:grid-cols-4: This class specifies that the grid should have four columns starting from the extra-large breakpoint (xl) and up.
// 2xl:grid-cols-5: This class specifies that the grid should have five columns starting from the 2x-extra-large breakpoint (2xl) and up.
