import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile, Cart, Love } from "../../../assets/icons";
import { logoutAsync, selectLoggedInUser } from "../../auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../cart/CartSlice";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { axiosi } from "../../../config/axios";
import { SearchBar } from "../../search/SearchBar";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
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
    if (!e.target.closest(".dropdown-container") && !e.target.closest(".search-container")) {
      setShopDropdown(false);
      setProfileDropdown(false);
      // Don't close search on outside click, let the SearchBar component handle focus
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchExpanded(false);
  }, [navigate]);

  const handleRedirect = (path) => {
    if (!loggedInUser) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logoutAsync())
      .unwrap()
      .then(() => {
        // Force redirect to home page after logout
        window.location.href = "/"; // This does a full page reload
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Fallback to normal navigation if needed
        navigate("/");
      });
  };

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const toggleSubCategory = (subcategory) => {
    setExpandedSubCategory((prev) =>
      prev === subcategory ? null : subcategory
    );
  };

  return (
    <div className="fixed top-0 w-full h-16 bg-white text-black shadow-md z-50">
      <div className="container mx-auto px-4 md:px-8 h-full relative">
        {/* Three-column layout */}
        <div className="grid grid-cols-3 h-full">
          {/* Left Column - Desktop Links */}
          <div className="flex items-center">
            {!loggedInUser?.isAdmin && (
              <div className="hidden md:flex gap-8 items-center">
                <div className="relative dropdown-container">
                  <button
                    className="flex items-center text-sm font-medium hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShopDropdown(!shopDropdown);
                    }}
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
                    <div className="fixed left-0 right-0 mx-auto bg-white shadow-lg z-10 container mt-4 flex flex-wrap justify-between py-8 px-8 overflow-y-auto max-h-[80vh]">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          className="w-1/4 flex flex-col items-start"
                        >
                          <h1 className="font-semibold text-lg text-black mb-2">
                            {category.name}
                          </h1>
                          <ul className="text-sm text-gray-700 cursor-pointer">
                            {category.subCategory.map((sub) => (
                              <li
                                key={sub._id}
                                className="hover:text-black mb-1"
                                onClick={() => {
                                  navigate(
                                    `/categories/${category.name}/${sub.name}`
                                  );
                                  setShopDropdown(false);
                                }}
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

                <Link
                  to="/about-us"
                  className="text-sm font-medium hover:text-gray-600"
                >
                  ABOUT
                </Link>
                <Link
                  to="/contact-us"
                  className="text-sm font-medium hover:text-gray-600"
                >
                  CONTACT
                </Link>
                <Link to="/" className="text-sm font-medium hover:text-gray-600">
                  MORE
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
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
            </div>
          </div>
          
          {/* Center Column - Logo */}
          <div className={`flex items-center justify-center transition-all duration-300 ${searchExpanded ? 'transform -translate-x-10' : ''}`}>
            <Link to={loggedInUser?.isAdmin ? "/admin/dashboard" : "/"}>
              <h2 className="text-2xl font-bold text-black">
                {loggedInUser?.isAdmin ? "Admin" : "BAROSA"}
              </h2>
            </Link>
          </div>
          
          {/* Right Column - Search and User Icons */}
          <div className="flex items-center justify-end gap-4 sm:gap-6">
            {/* Expandable Search Bar */}
            <div className="relative search-container hidden sm:block">
              {searchExpanded ? (
                <div className={`absolute right-0 w-64 md:w-80 transition-all duration-300 z-10 -top-5`}>
                   

                  <SearchBar className="w-full" />
                  
                  <button 
                    type="button" 
                    className="absolute right-12 top-1/4 mx-5 text-gray-500"
                    onClick={() => { setSearchExpanded(false);
                      
                     navigate('/admin/dashboard') 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* User Icons */}
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
                />{loggedInUser && (
                  
               <>
                <Love
                  onClick={() => navigate("/login")}
                  className="w-6 h-6 cursor-pointer hover:text-gray-600"
                />
                <Cart
                  onClick={() => navigate("/login")}
                  className="w-6 h-6 cursor-pointer hover:text-gray-600"
                /> 
                </>)}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-16 left-0 w-full h-[calc(80vh-4rem)] bg-white shadow-lg z-50 overflow-y-auto">
            <div className="py-4 px-6">
              {/* Search Bar in Mobile Menu */}
              <div className="mb-4">
               
                  
                <SearchBar className="w-full" />
              
              </div>
            
              {loggedInUser && (
                <h1 className="font-semibold">Hey {loggedInUser.name}</h1>
              )}
              <Link
                to="/"
                className="block text-black mt-4 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {!loggedInUser?.isAdmin && (
                <>
                  <div
                    className="font-semibold cursor-pointer mt-4 flex justify-between items-center"
                    onClick={() => toggleCategory("shop")}
                  >
                    <span>Shop</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        expandedCategory === "shop"
                          ? "rotate-180"
                          : "rotate-0"
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
                  </div>

                  {expandedCategory === "shop" && (
                    <div className="ml-4 mt-2">
                      {categories.map((category) => (
                        <div key={category._id} className="mb-3">
                          <div
                            className="mb-2 cursor-pointer font-semibold flex justify-between items-center"
                            onClick={() => toggleSubCategory(category.name)}
                          >
                            <span>{category.name}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-4 h-4 transform transition-transform duration-200 ${
                                expandedSubCategory === category.name
                                  ? "rotate-180"
                                  : "rotate-0"
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
                          </div>

                          {expandedSubCategory === category.name && (
                            <ul className="ml-4 text-sm space-y-2">
                              {category.subCategory.map((sub) => (
                                <li
                                  key={sub._id}
                                  className="hover:text-black"
                                  onClick={() => {
                                    navigate(
                                      `/categories/${category.name}/${sub.name}`
                                    );
                                    setMobileMenuOpen(false);
                                  }}
                                >
                                  {sub.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <Link
                to="/about-us"
                className="block text-black mt-4 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact-us"
                className="block text-black mt-4 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile menu user options */}
              {loggedInUser && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {loggedInUser.isAdmin ? (
                    <>
                      <Link
                        to="/admin-dashboard"
                        className="block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/add-product"
                        className="block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add Products
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block py-2 sm:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Wishlist ({wishlistItemsCount})
                      </Link>
                      <Link
                        to="/cart"
                        className="block py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Cart ({cartItemsCount})
                      </Link>
                    </>
                  )}
                  <button
                    className="block w-full text-left py-2 text-red-500"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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
      onClick={(e) => {
        e.stopPropagation();
        setProfileDropdown(!profileDropdown);
      }}
    />
    <span className="font-semibold text-sm hidden sm:block">{name}</span>
    {profileDropdown && (
      <div className="absolute top-10 right-0 mt-2 bg-white border border-gray-200 rounded shadow-md text-center">
        {isAdmin ? (
          <>
            <Link
              to="/admin-dashboard"
              className="block px-4 py-2 text-sm hover:bg-gray-100 whitespace-nowrap"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/add-product"
              className="block px-4 py-2 text-sm hover:bg-gray-100 whitespace-nowrap"
            >
              Add Products
            </Link>
            <Link
              to="/admin/orders"
              className="block px-4 py-2 text-sm hover:bg-gray-100 whitespace-nowrap"
            >
              Manage Orders
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="block px-8 py-2 text-sm text-left hover:bg-gray-100 whitespace-nowrap"
            >
              Profile
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm hover:bg-gray-100 whitespace-nowrap"
            >
              My Orders
            </Link>
          </>
        )}
        <button
          className="block w-full text-center px-4 py-2 text-sm hover:bg-gray-100 whitespace-nowrap"
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
        {count > 99 ? "99+" : count}
      </span>
    )}
  </div>
);
