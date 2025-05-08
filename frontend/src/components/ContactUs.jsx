import React from 'react';

const ContactUs = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get in touch with Barosa Trendz Fashion to elevate your style.
          </p>
        </div>

        {/* Contact Details Section */}
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {/* Telephone */}
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 text-center w-full sm:w-1/2 lg:w-1/4">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mt-4">Telephone</h4>
            <p className="mt-2 text-gray-600">+971 2 445 9032</p>
          </div>

          {/* Email */}
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 text-center w-full sm:w-1/2 lg:w-1/4">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mt-4">Email</h4>
            <p className="mt-2 text-gray-600">barosatrendz@gmail.com</p>
          </div>

          {/* Elevate Your Style */}
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300 text-center w-full sm:w-1/2 lg:w-1/4">
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mt-4">Elevate Your Style</h4>
            <p className="mt-2 text-gray-600">Barosa Trendz Fashion</p>
          </div>
        </div>

        {/* Closing Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600">
            We are here to assist you with any inquiries. Feel free to reach out to us via phone, email, or visit our website for more information.
          </p>
          <p className="mt-6 text-2xl font-bold text-gray-900">
            Barosa Trendz Fashion - Where Style Meets Elegance
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;