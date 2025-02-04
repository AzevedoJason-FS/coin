import React from "react";
import Chart from "react-apexcharts";

const CryptoLineChart = ({ coin, priceHistory }) => {
  if (!priceHistory || priceHistory.length === 0) {
    return <p>No data available for {coin}</p>;
  }

  const chartData = {
    series: [
      {
        name: coin,
        data: priceHistory.map((entry) => ({
          x: new Date(entry.time),
          y: entry.price,
        })),
      },
    ],
    options: {
      chart: {
        type: "line",
        width: 80,  // ✅ Adjust as needed
        height: 30,  // ✅ Adjust as needed
        sparkline: { enabled: true },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        width: 2, // ✅ Ensures the line is visible
        curve: "smooth",
      },
      tooltip: { 
         enabled: false ,
      },
      markers: {
        hover: {
          size: 0, // Prevent markers from growing on hover
        },
      },
      dataLabels: {
        enabled: false, // Remove labels that may show on hover
      },
      xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { show: false } },
      
    }
  }

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="line" height={30} width={80} />
    </div>
  );
};

export default CryptoLineChart;
