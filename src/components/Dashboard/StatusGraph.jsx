import React from 'react';
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";

const StatusGraph = ({ subTitle, upOrDown, totalNumber, percentNumber, yearlyCount }) => {
  // Function to determine background color based on the trend
  const getBackgroundColor = (trend) => {
    return trend === "up" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
  };

  const getTextColor = (trendText) => {
    return trendText === "up" ? "text-green-700" : "text-red-700";
  }

  return (
    <div className="border-[1.4px] rounded-lg bg-white p-4">
      {/* Subtitle */}
      <p className="capitalize text-gray-600 text-sm">{subTitle}</p>
      
      {/* Main Content */}
      <div className="flex items-center">
        {/* Total Number */}
        <h3 className="text-xl font-semibold pr-3">{totalNumber}</h3>

        {/* Percentage with Trend Icon */}
        <span
          className={`w-auto h-6 px-3 flex justify-center items-center gap-2 rounded-md text-sm border-[1px] ${getBackgroundColor(upOrDown)}`}
        >
          {upOrDown === "up" ? <IoIosTrendingUp /> : <IoIosTrendingDown />} {percentNumber}%
        </span>
      </div>

      {/* Yearly Count */}
      <p className="text-sm mt-5">You made an extra <span className={`font-semibold ${getTextColor(upOrDown)}`}>{yearlyCount}</span> this year</p>
    </div>
  );
};

export default StatusGraph;
