import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile, Cart, Love } from "../../../assets/icons";
import { logoutAsync, selectLoggedInUser } from "../../auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../cart/CartSlice";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { axiosi } from "../../../config/axios";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItemsCount = cartItems?.length || 0;
  const wishlistItemsCount = wishlistItems?.length || 0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosi.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching Categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest(".dropdown-container")) {
      setShopDropdown(false);
      setProfileDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  const handleRedirect = (path) => {
    if (!loggedInUser) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate("/login");
  };

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const toggleSubCategory = (subcategory) => {
    setExpandedSubCategory((prev) => (prev === subcategory ? null : subcategory));
  };

  return (
    <div className="fixed top-0 w-full h-16 bg-white text-black shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 h-full">
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <div className="relative dropdown-container">
            <button
              className="flex items-center text-sm font-medium hover:text-gray-600"
              onClick={() => setShopDropdown(!shopDropdown)}
            >
              SHOP
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                  shopDropdown ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {shopDropdown && (
              <div className="absolute left-0 bg-white shadow-lg z-10 w-[96vw] mt-4 flex flex-wrap justify-between py-8 px-8">
                {categories.map((category) => (
                  <div key={category._id} className="w-1/4 flex flex-col items-start">
                    <h1 className="font-semibold text-lg text-black mb-2">
                      {category.name}
                    </h1>
                    <ul className="text-sm text-gray-700">
                      {category.subCategory.map((sub) => (
                        <li
                          key={sub._id}
                          className="hover:text-black mb-1"
                          onClick={() =>
                            navigate(`/categories/${category.name}/${sub.name}`)
                          }
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/about-us" className="text-sm font-medium hover:text-gray-600">
            ABOUT
          </Link>
          <Link to="/contact-us" className="text-sm font-medium hover:text-gray-600">
            CONTACT
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-gray-600">
            MORE
          </Link>
        </div>

        <div className="flex justify-center">
          <Link to="/">
            <h2 className="text-2xl font-bold text-black">BAROZA</h2>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {loggedInUser ? (
            <>
              {!loggedInUser.isAdmin && (
                <>
                  <div className="hidden sm:block">
                    <IconWithBadge
                      Icon={Love}
                      count={wishlistItemsCount}
                      onClick={() => handleRedirect("/wishlist")}
                    />
                  </div>

                  <IconWithBadge
                    Icon={Cart}
                    count={cartItemsCount}
                    onClick={() => handleRedirect("/cart")}
                  />
                </>
              )}

              <ProfileIcon
                name={loggedInUser.name}
                isAdmin={loggedInUser.isAdmin}
                handleLogout={handleLogout}
                handleRedirect={handleRedirect}
                setProfileDropdown={setProfileDropdown}
                profileDropdown={profileDropdown}
              />
            </>
          ) : (
            <>
              <Profile
                onClick={() => navigate("/login")}
                className="w-5 h-5 cursor-pointer hover:text-gray-600"
              />
              <Love
                onClick={() => navigate("/login")}
                className="w-6 h-6 cursor-pointer hover:text-gray-600"
              />
              <Cart
                onClick={() => navigate("/login")}
                className="w-6 h-6 cursor-pointer hover:text-gray-600"
              />
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-16 right-0 w-64 h-screen bg-white shadow-lg z-50">
              <div className="py-4 px-6">
                <h1 className="font-semibold">Hey {loggedInUser?.name}</h1>
                <Link to="/" className="block text-black mt-4 font-semibold">
                  Home
                </Link>
                <h3
                  className="font-semibold cursor-pointer mt-4"
                  onClick={() => toggleCategory("shop")}
                >
                  Shop
                </h3>
                {expandedCategory === "shop" && (
                  <ul className="ml-4 cursor-pointer">
                    <li
                      className="mb-2 cursor-pointer font-semibold"
                      onClick={() => toggleSubCategory("women")}
                    >
                      Women
                    </li>
                    {expandedSubCategory === "women" && (
                      <ul className="ml-4 text-sm">
                        <li>Top</li>
                        <li>Mid Dress</li>
                        <li>Long Dress</li>
                        <li>Sets</li>
                        <li>Pants</li>
                        <li>Shorts</li>
                        <li>Sleepwear</li>
                        <li>Blazers</li>
                      </ul>
                    )}
                    <li
                      className="mb-2 cursor-pointer font-semibold"
                      onClick={() => toggleSubCategory("men")}
                    >
                      Men
                    </li>
                    {expandedSubCategory === "men" && (
                      <ul className="ml-4 text-sm">
                        <li>Shirts</li>
                        <li>Pants</li>
                        <li>Casual Pants</li>
                        <li>Suits</li>
                        <li>Shorts</li>
                        <li>Sleepwear</li>
                        <li>Blazers</li>
                        <li>Sets</li>
                      </ul>
                    )}
                    <li
                      className="mb-2 cursor-pointer font-semibold"
                      onClick={() => toggleSubCategory("kids")}
                    >
                      Kids
                    </li>
                    {expandedSubCategory === "kids" && (
                      <ul className="ml-4 text-sm">
                        <li>Shirts</li>
                        <li>Pants</li>
                        <li>Shorts</li>
                        <li>Sleepwear</li>
                        <li>Sets</li>
                      </ul>
                    )}
                    <li
                      className="mb-2 cursor-pointer font-semibold"
                      onClick={() => toggleSubCategory("gifts")}
                    >
                      Gifts
                    </li>
                    {expandedSubCategory === "gifts" && (
                      <ul className="ml-4 text-sm">
                        <li>Gifts</li>
                      </ul>
                    )}
                  </ul>
                )}
                <Link
                  to="/about-us"
                  className="block text-black mt-4 font-semibold"
                >
                  About
                </Link>
                <Link to="/contact-us" className="block text-black font-semibold">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileIcon = ({
  name,
  isAdmin,
  handleLogout,
  setProfileDropdown,
  profileDropdown,
}) => (
  <div className="relative flex items-center gap-2 dropdown-container">
    <Profile
      className="w-5 h-5 cursor-pointer hover:text-gray-600"
      onClick={() => setProfileDropdown(!profileDropdown)}
    />
    <span className="font-semibold text-sm hidden sm:block">{name}</span>
    {profileDropdown && (
      <div className="absolute top-10 right-0 mt-2 bg-white border border-gray-200 rounded shadow-md text-center">
        {isAdmin ? (
          <>
            <Link
              to="/admin-dashboard"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/add-product"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Add Products
            </Link>
            <Link
              to="/admin/orders"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Manage Orders
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="block px-8 py-2 text-sm text-left hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              My Orders
            </Link>
          </>
        )}
        <button
          className="block w-full text-center px-4 py-2 text-sm hover:bg-gray-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

const IconWithBadge = ({ Icon, count, onClick }) => (
  <div className="relative cursor-pointer hover:text-gray-600">
    <Icon onClick={onClick} className="w-6 h-6 cursor-pointer" />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {count}
      </span>
    )}
  </div>
);