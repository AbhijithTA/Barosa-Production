import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./NewArrivalCategoryCard";

const categories = [
  {
    title: "Mens",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/free-photo/vertical-shot-successful-male-standing-with-hand-pocket_181624-44739.jpg?uid=P153408150&semt=ais_hybrid", // Replace with actual image URL
    
  },
  {
    title: "Women",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/premium-photo/beautiful-woman-with-clean-skin-poses-street-city_333900-4297.jpg?uid=P153408150&semt=ais_hybrid", // Replace with actual image URL
  },
  {
    title: "Kids",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/free-photo/child-pajama_146671-13730.jpg?uid=P153408150&semt=ais_hybrid", // Replace with actual image URL
  },
  {
    title: "Gifts",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/free-photo/front-view-smiling-cute-kid-riding-green-skateboard-white-t-shirt-orange-shorts-blue-space_179666-1170.jpg?uid=P153408150&semt=ais_hybrid", // Replace with actual image URL
  },
  
];


const NewArrivalCategory = () => {

  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-12">
        <h1 className="text-2xl font-semibold text-center mb-10">New Arrivals</h1>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            buttonText={category.buttonText}
            image={category.image}
            onClick={() => navigate(`/categories/${category.title}`)}
           />
        ))}
      </div>
    </div>
  );
};

export default NewArrivalCategory;
