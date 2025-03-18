import "apexcharts/dist/apexcharts.css";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "../../App.css";
const DashboardGraphCart = () => {
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: "Spline Chart",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    yaxis: {
      title: {
        text: "Values",
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    markers: {
      size: 5,
    },
  });

  const [series, setSeries] = React.useState([
    {
      name: "Website",
      data: [20, 40, 35, 50, 49, 60, 70, 91, 125],
    },
    {
      name: "Facebook",
      data: [30, 50, 15, 50, 89, 30, 70, 123, 155],
    },
    {
      name: "TikTok",
      data: [42, 5, 66, 20, 60, 30, 40, 153, 175],
    },
  ]);
  return (
    <div>
      <div>
        <h2>Dashboard Graph</h2>
        <div id="chart" className="w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardGraphCart;
