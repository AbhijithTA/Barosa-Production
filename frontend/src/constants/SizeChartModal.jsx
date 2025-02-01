import React from "react";

const SizeChartModal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Size Chart</h2>
              <button
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col lg:flex-row">
              {/* Size Table */}
              <div className="lg:w-2/3 mb-6 lg:mb-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b text-gray-600">Size</th>
                      <th className="px-4 py-2 border-b text-gray-600">
                        Chest
                      </th>
                      <th className="px-4 py-2 border-b text-gray-600">
                        Shoulder
                      </th>
                      <th className="px-4 py-2 border-b text-gray-600">
                        Length
                      </th>
                      <th className="px-4 py-2 border-b text-gray-600">
                        Sleeve Length
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        size: "S",
                        chest: 35,
                        shoulder: 16.5,
                        length: 25.5,
                        sleeve: 24.25,
                      },
                      {
                        size: "M",
                        chest: 37,
                        shoulder: 17,
                        length: 26.5,
                        sleeve: 24.5,
                      },
                      {
                        size: "L",
                        chest: 39,
                        shoulder: 17.5,
                        length: 27.5,
                        sleeve: 24.75,
                      },
                      {
                        size: "XL",
                        chest: 41,
                        shoulder: 18,
                        length: 28.5,
                        sleeve: 25,
                      },
                      {
                        size: "XXL",
                        chest: 43,
                        shoulder: 18.5,
                        length: 29.5,
                        sleeve: 25.25,
                      },
                      {
                        size: "3XL",
                        chest: 45,
                        shoulder: 19,
                        length: 30.5,
                        sleeve: 25.5,
                      },
                      {
                        size: "4XL",
                        chest: 47,
                        shoulder: 19.5,
                        length: 31.5,
                        sleeve: 25.75,
                      },
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-b">{row.size}</td>
                        <td className="px-4 py-2 border-b">{row.chest}</td>
                        <td className="px-4 py-2 border-b">{row.shoulder}</td>
                        <td className="px-4 py-2 border-b">{row.length}</td>
                        <td className="px-4 py-2 border-b">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measuring Guide */}
              <div className="lg:w-1/3 lg:pl-6">
                <h3 className="font-semibold mb-3 text-lg">
                  Measuring T-Shirt Size
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Not sure about your t-shirt size? Follow these steps to figure
                  it out:
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-600 space-y-2">
                  <li>
                    <strong>Shoulder:</strong> Measure edge to edge with arms
                    relaxed.
                  </li>
                  <li>
                    <strong>Chest:</strong> Measure around the fullest part of
                    your chest.
                  </li>
                  <li>
                    <strong>Sleeve:</strong> Measure from shoulder seam to cuff.
                  </li>
                  <li>
                    <strong>Length:</strong> Measure from highest point of the
                    shoulder to the bottom hem.
                  </li>
                </ul>
                <img
                  src="https://img.freepik.com/premium-vector/illustration-contoured-man-women-boy-full-length-with-measurement-lines-body-parameters-man-women-child-sizes-measurements_111701-239.jpg?uid=P153408150&semt=ais_hybrid"
                  alt="Measuring Guide"
                  className="mt-4 w-full object-contain rounded-md border"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeChartModal;
