import React from 'react';
import aboutus from "../assets/images/AboutUs.jpg"

const AboutUs = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover the story behind Barosa Trendz Fashion and our commitment to style and elegance.
          </p>
        </div>

        {/* Main Content Section */}
        <div className="mt-10 space-y-8">
          {/* Introduction Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600">
                Barosa brand was recently established in the UAE, however, our tailors are well experienced and hold more than 15 years in the fashion market.
              </p>
              <p className="mt-4 text-gray-600">
                Take advantage of our Mobile Tailoring Service and stay fashion-forward. Our tailors will come to your doorstep. No need to wait in queues or stress out looking for parking spaces. We will keep your wardrobe UpToDate with the latest trends.
              </p>
              <p className="mt-4 text-gray-600">
                Barosa Trendz Fashion specializes in bespoke tailoring and custom clothing design for Ladies, Gents, and Children. You can experience the luxury of custom-fitted clothing from the comfort of your home.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={aboutus} 
                alt="Tailoring Service"
                className="w-full h-64 object-contain"
              />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Book an Appointment */}
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                  Book an Appointment
                </h4>
                <p className="mt-2 text-gray-600 text-center">
                  A quick call or WhatsApp message, and we'll be at your doorstep.
                </p>
              </div>

              {/* Personalized Consultation */}
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                  Personalized Consultation
                </h4>
                <p className="mt-2 text-gray-600 text-center">
                  Our expert tailors bring fabrics, style guides, and a keen eye for details. Choose your fit; we are right there with you!
                </p>
              </div>

              {/* On-The-Spot Measurements */}
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                  On-The-Spot Measurements
                </h4>
                <p className="mt-2 text-gray-600 text-center">
                  Ensuring the perfect fit every time for every individual customer, while also fitting into your budget.
                </p>
              </div>

              {/* Fast Turnaround */}
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                  Fast Turnaround
                </h4>
                <p className="mt-2 text-gray-600 text-center">
                  Get your bespoke clothes delivered swiftly to you.
                </p>
              </div>

              {/* Alterations */}
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                  Alterations
                </h4>
                <p className="mt-2 text-gray-600 text-center">
                  If you have clothing in your wardrobe that you particularly like the tailoring of, we can adapt to your desired fit.
                </p>
              </div>

              {/* Perfect For */}
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                  Perfect For
                </h4>
                <p className="mt-2 text-gray-600 text-center">
                  Busy professionals, special events, or anyone that values convenience and style.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">
            We aim to provide an exhilarating experience to our customers in terms of quality and pricing, with the best fabric and material being used for customers' outfits. We invite people from all walks of life who want to look and feel their best to experience our services.
          </p>
          <p className="mt-6 text-2xl font-bold text-gray-900">
            Barosa Trendz Fashion - Where Style Meets Elegance
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;