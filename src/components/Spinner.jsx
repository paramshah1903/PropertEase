import React from "react";
import spinner from "../assets/svg/spinner.svg";
export default function Spinner() {
  return (
    <div className="bg-black bg-opacity-50 flex fixed top-0 left-0 right-0 bottom-0 items-center justify-center z-50">
      <div>
        <img src={spinner} alt="Loading...."></img>
      </div>
    </div>
  );
}

//to make any loader...go to loader.io and in that download the svg file and then use it in your project
// The combination of fixed left-0 right-0 top-0 bottom-0 positions the spinner element to cover the entire viewport, while the flex container along with items-center and justify-center classes centers the spinner within that container.

// To summarize:
// fixed left-0 right-0 top-0 bottom-0 positions the spinner element to cover the entire viewport by setting the element's position to fixed and all four edges to 0. This ensures that the spinner spans the full height and width of the viewport.
// flex on the parent container establishes a flexbox context, allowing for flexible and centered alignment of child elements.
// items-center centers the child elements vertically within the parent container.
// justify-center centers the child elements horizontally within the parent container.
// By combining these CSS classes, the spinner element is positioned to cover the entire viewport, while the flex container ensures that the spinner is centered both vertically and horizontally within that container. This results in the spinner appearing as a centered overlay above the entire page.
