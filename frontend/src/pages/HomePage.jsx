import React, { useEffect } from "react";
import { Navbar } from "../features/navigation/components/Navbar";
import { HeroBanner, NewArrivalProductComponent } from "../features/products/components/HeroBanner.jsx";
import {
  resetAddressStatus,
  selectAddressStatus,
} from "../features/address/AddressSlice";
import { useDispatch, useSelector } from "react-redux";
import { Footer } from "../features/footer/Footer";
import { ProductFeatured } from "../features/products/components/ProductFeatured.jsx";
import ShopByCategory from "../features/products/components/ProductCategoryBanner.jsx";
import NewArrivalCategory from "../features/products/components/NewArrivalCategory.jsx";
import { ProductBanner } from "../features/products/components/ProductBanner.jsx";

export const HomePage = () => {
  const dispatch = useDispatch();
  const addressStatus = useSelector(selectAddressStatus);

  useEffect(() => {
    if (addressStatus === "fulfilled") {
      dispatch(resetAddressStatus());
    }
  }, [addressStatus]);
  console.log(addressStatus);

  return (
    <>
      <Navbar />
      <div className="pt-[65px]">
        {/* <HeroBanner /> */}
        <ProductBanner/>
        <div className="pt-[50px]">
          <NewArrivalCategory />
        </div>
        <div className="pt-[50px]">
          <ProductFeatured />
        </div>
        {/* <ShopByCategory /> */}
        <Footer />
      </div>
    </>
  );
};
