import React from "react";
import Chart from "react-apexcharts";

const USDLineChart = ({ usdHistory }) => {
  if (!usdHistory || usdHistory.length === 0) {
    return <p style={{ color: "white" }}>Loading chart...</p>; // ✅ Ensure fallback content
  }

  const chartData = {
    series: [
      {
        name: "Invested Amount",
        data: (usdHistory || []).map((entry) => ({
          x: new Date(entry.time),
          y: entry.invested || 0, // ✅ Ensures valid values
        })),
      },
    ],
    options: {
      chart: {
        type: "area", // ✅ Ensures it's an area chart, not just a line
        height: 100,
        width: "100%",
        sparkline: { enabled: true },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        width: 2,
        curve: "smooth",
        colors: ["#16C784"], // ✅ Line color
      },
      fill: {
        type: "gradient", // ✅ Apply gradient to the area, not the stroke
        gradient: {
          shadeIntensity: 1,
          gradientToColors: ["#16C784"], // ✅ Ensures fill color matches line
          opacityFrom: 0.3, // ✅ 30% opacity at the bottom
          opacityTo: 0, // ✅ Fully fades at the top
          stops: [0, 100], // ✅ Ensures smooth transition
        },
      },
      colors: ["#16C784"], // ✅ Ensures line and gradient use the same color
      tooltip: { enabled: false },
      markers: { hover: { size: 0 } },
      dataLabels: { enabled: false },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { show: false } },
    },
  };
  
  return <Chart options={chartData.options} series={chartData.series} type="area" height={100} />;
};

export default USDLineChart;
