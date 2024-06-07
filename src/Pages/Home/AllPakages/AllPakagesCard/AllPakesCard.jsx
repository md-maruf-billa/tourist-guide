import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";
import useAuth from "../../../../Hook/useAuth";
import Swal from "sweetalert2";

const AllPakesCard = ({ tour }) => {
  const { photoUrls, tourType, title,
    guideName, guideImage,
    guideEmail, tourPlan, _id } = tour;
  const firstDayPackage = tourPlan[0]; // Extracting details for the first day
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const handleWishList = async () => {
    if (user && user.email) {
      // Send wishlist to database
      const tourData = {
        email: user.email,
        tourId: _id,
        photoUrls,
        tourType,
        guideName,
        guideImage,
        guideEmail,
        title,
        tourPlan
      };
      console.log(tourData)

      try {
        const response = await axiosSecure.post('/wishLists', tourData);
        if (response.status === 200) {
          Swal.fire({
            title: "Added to Wishlist",
            text: `${title} has been added to your wishlist!`,
            icon: "success",
            confirmButtonText: "Ok"
          });
          //refetch the cart

        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        Swal.fire({
          title: "Error",
          text: "Failed to add to wishlist. Please try again later.",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } else {
      Swal.fire({
        title: "You are not logged in",
        text: "Please log in to add to wishlist!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, login!"
      }).then((result) => {
        if (result.isConfirmed) {
          // Send the user to the login page
          navigate('/login', { state: { from: location } });
        }
      });
    }

  }
  return (
    <div className="relative max-w-sm overflow-hidden shadow-lg p-5 rounded-2xl m-4">
      <img className="w-full h-60 rounded-2xl object-cover" src={photoUrls[0]} alt={title} />
      <Link to="/dashboard/wishList">
        <FaHeart
          to="/dashboard/wishList"
          onClick={handleWishList} className="absolute top-2 mr-5 mt-5 right-2 text-red-500 z-10 cursor-pointer" /></Link>
      <div className="px-6 py-4">
        <p className="font-bold text-xl mb-2">{title}</p>
        <p className="text-gray-700 text-base">{tourType}</p>
      </div>
      <div >
        <h3 className="text-xl font-bold">Guide information:</h3>
        <div className="flex justify-between items-center ">

          <div>
            <img className="size-12 rounded-full" src={guideImage} alt="Guide" />
          </div>
          <div>
            <p>{
              guideName}</p>
            <p>{
              guideEmail}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold my-3">Day 1 Package:</h3>
          <p>{firstDayPackage.description}</p>
          <p>Price: ${firstDayPackage.price}</p>
        </div>
      </div>
      <div className="">
        <Link to={`/tourisDetail/${tour._id}`}>
          <button className="bg-btn hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Package
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AllPakesCard;
