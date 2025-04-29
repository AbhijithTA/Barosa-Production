import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./NewArrivalCategoryCard";



const categories = [
  {
    title: "Mens",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/free-photo/smart-man-with-hands-pockets_1153-1934.jpg?ga=GA1.1.793373529.1738067234&semt=ais_hybrid_sidr"
    
  },
  {
    title: "Women",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/premium-photo/fashion-model-outdoor-portrait-young-beautiful-woman-wearing-straw-hat-holding-backpack_106029-853.jpg?ga=GA1.1.793373529.1738067234&semt=ais_hybrid_sidr", 
  },
  {
    title: "Kids",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/premium-photo/cute-little-girl-dress-sunglasses-little-boy-summer-stylish-overalls-sunglasses-isolated-full-length-pink-background_179135-424.jpg?ga=GA1.1.793373529.1738067234&semt=ais_hybrid_sidr", 
  },
  {
    title: "Gifts",
    buttonText: "VIEW PRODUCTS",
    image: "https://img.freepik.com/free-photo/merry-christmas-new-year-holidays-concept-excited-young-woman-bring-gifts-holding-xmas-presents-smiling-camera-wearing-black-dress-white-background_1258-41106.jpg?ga=GA1.1.793373529.1738067234&semt=ais_hybrid_sidr", 
  },
  
];


const NewArrivalCategory = () => {

  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-12">
        <h1 className="text-3xl font-semibold text-center mb-10 w-full">New Arrivals</h1>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            buttonText={category.buttonText}
            image={category.image}
            onClick={() => navigate(`/new-arrivals/${category.title}`)}
           />
        ))}
      </div>
    </div>
  );
};

export default NewArrivalCategory;
