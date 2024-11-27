import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Doughnut } from "react-chartjs-2";
import { NumericFormat } from "react-number-format";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../base/BaseUrl";
import { Chart, ArcElement, registerables } from "chart.js";
import Layout from "../../layout/Layout";
import ApexCharts from "apexcharts";
import RefreshIcon from "@mui/icons-material/Refresh";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";

const NewsDashboard = () => {
  Chart.register(ArcElement, ...registerables);

  const [results, setResults] = useState([]);
  const [stock, setStock] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [isBarVisible, setIsBarVisible] = useState(true);
  const [isBarMinimized, setIsBarMinimized] = useState(false);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const [isPieVisible, setIsPieVisible] = useState(true);
  const [isPieMinimized, setIsPieMinimized] = useState(false);
  const [currentYear, setCurrentYear] = useState("");

  const [graph1, setGraph1] = useState([]);
  const [graph2, setGraph2] = useState([]);
  const [graph3, setGraph3] = useState([]);
  const [graph4, setGraph4] = useState([]);

  const navigate = useNavigate();
  const dateyear = currentYear;
  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCurrentYear(response.data.year.current_year);
        console.log(response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (currentYear) {
        try {
          const res = await axios({
            url: `${BaseUrl}/fetch-dashboard-data-by/${currentYear}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          setResults(res.data);
          setStock(res.data.stock);

          // Extract bar and pie chart data
          const barLabels = res.data.graphbar.map(
            (item) => item.c_receipt_sub_donation_type
          );
          const barValues = res.data.graphbar.map((item) =>
            parseInt(item.total_amount)
          );
          const pieLabels = res.data.graphpie.map(
            (item) => item.c_receipt_tran_pay_mode
          );
          const pieValues = res.data.graphpie.map((item) =>
            parseInt(item.total_amount)
          );

          // Set chart data
          setGraph1(barLabels);
          setGraph2(barValues);
          setGraph3(pieLabels);
          setGraph4(pieValues);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    };

    fetchData();
  }, [currentYear, navigate]);
  const handleReload = () => {
    console.log("Reloading data...");
    fetchData();
  };

  useEffect(() => {
    if (graph1.length > 0 && graph2.length > 0) {
      setGraphData({
        labels: graph1,
        datasets: [
          {
            data: graph2,
            backgroundColor: [
              "#1C64F2",
              "#16BDCA",
              "#FDBA8C",
              "#E74694",
              "#F59E0B",
              "#10B981",
              "#6366F1",
            ],
            hoverBackgroundColor: [
              "#1654C0",
              "#13A5B0",
              "#FC9D7C",
              "#D93B84",
              "#E78F0A",
              "#0F9872",
              "#5458E0",
            ],
          },
        ],
      });
    }
  }, [graph1, graph2]);

  const renderBarChart = () => {
    if (!graphData || graphData.datasets[0].data.length === 0) {
      return;
    }

    if (barChartInstance) {
      barChartInstance.destroy();
    }

    const chartConfig = {
      series: [
        { name: "Donation Distribution", data: graphData.datasets[0].data },
      ],
      chart: { type: "bar", height: 360, toolbar: { show: false } },
      dataLabels: { enabled: false },
      colors: ["#020617"],
      plotOptions: { bar: { columnWidth: "40%", borderRadius: 2 } },
      xaxis: {
        categories: graphData.labels,
        labels: {
          style: { colors: "#616161", fontSize: "12px", fontWeight: 400 },
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#616161", fontSize: "12px", fontWeight: 400 },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        padding: { top: 5, right: 20 },
      },
      tooltip: { theme: "dark" },
    };

    const chart = new ApexCharts(
      document.querySelector("#bar-chart"),
      chartConfig
    );
    chart.render();
    setBarChartInstance(chart);
  };

  useEffect(() => {
    if (
      graphData &&
      graphData.datasets[0].data.length > 0 &&
      isBarVisible &&
      !isBarMinimized
    ) {
      renderBarChart();
    }
  }, [graphData, isBarVisible, isBarMinimized]);

  useEffect(() => {
    if (graphData && isBarVisible && !isBarMinimized) {
      renderBarChart();
    }
  }, [graphData, isBarVisible, isBarMinimized]);

  return (
    <Layout>
      <div className="news-dashboard-wrapper mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Donor Count */}
          {results.length !== 0 && (
            <div className="bg-gray-500 text-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.25)] rounded-md text-center min-h-[100px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold">Total Donors</h3>
              <p className="text-4xl font-bold">
                <CountUp
                  start={0}
                  end={results.total_donor_count}
                  duration={2.75}
                />
              </p>
            </div>
          )}

          {/* Total Website Donation */}
          {results.length !== 0 && (
            <div className="bg-blue-500 text-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.25)] rounded-md text-center min-h-[100px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold">Total Website Donation</h3>
              <p className="text-4xl font-bold">
                <CountUp
                  start={0}
                  end={results.total_website_donation}
                  duration={2.75}
                />
              </p>
            </div>
          )}

          {/* Total Material Donation */}
          {results.length !== 0 && (
            <div className="bg-purple-500 text-white  rounded-md text-center min-h-[100px] flex flex-col items-center justify-center ">
              <h3 className="text-xl font-bold">Total Material Donation</h3>
              <p className="text-4xl font-bold">
                <CountUp
                  start={0}
                  end={results.total_material_donation}
                  duration={2.75}
                />
              </p>
            </div>
          )}
          {/* Total Donation */}
          {results.length !== 0 && (
            <div className="bg-green-500 text-white  rounded-md text-center min-h-[100px] flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold">Total Donation</h3>
              <p className="text-4xl font-bold">
                <CountUp
                  start={0}
                  end={results.total_donation}
                  duration={2.75}
                />
              </p>
            </div>
          )}
        </div>

        {/* Current Month Stocks */}
        <h3 className="mt-4 text-lg text-black font-medium">
          Current Month Stocks (in Kgs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
          {stock.map((value, index) => (
            <div
              key={index}
              className="bg-white p-4 shadow rounded-md text-center max-w-full"
            >
              <span className="block font-bold text-lg text-ellipsis overflow-hidden">
                <NumericFormat
                  thousandSeparator={true}
                  thousandsGroupStyle="lakh"
                  displayType={"text"}
                  value={
                    value.openpurch -
                    value.closesale +
                    (value.purch - value.sale)
                  }
                />
              </span>
              <span className="block text-sm">{value.item_name}</span>
            </div>
          ))}
        </div>

        <div className="news-dashboard-wrapper ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              {isPieVisible && (
                <div
                  className={`relative flex flex-col rounded-xl bg-white text-gray-700 shadow-md mt-8 ${
                    isPieMinimized ? "h-16" : "h-"
                  }`}
                >
                  {" "}
                  <div className="flex justify-between items-center p-4">
                    <h3 className="text-lg font-bold ">Cash Receipts</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleReload}
                        className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
                      >
                        <RefreshIcon />
                      </button>
                      <button
                        onClick={() => setIsPieMinimized(!isPieMinimized)}
                        className="p-2 hover:bg-gray-200 rounded-full transition duration-200 mb-2"
                      >
                        <MinimizeIcon />
                      </button>

                      <button
                        onClick={() => setIsPieVisible(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                  <div className="h-96 flex justify-center ">
                    {!isPieMinimized && graphData && (
                      <Doughnut data={graphData} />
                    )}
                  </div>{" "}
                </div>
              )}
            </div>

            <div>
              {isBarVisible && (
                <div
                  className={`relative flex flex-col rounded-xl bg-white text-gray-100 shadow-md mt-8 ${
                    isBarMinimized ? "h-16" : "h-auto"
                  }`}
                >
                  <div className="relative mx-4 flex items-center justify-between p-4 ">
                    <h4 className="text-lg font-bold ">Cash Receipts</h4>
                    <div className="flex space-x-2">
                      <button
                        aria-label="reload"
                        className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
                        onClick={handleReload}
                      >
                        <RefreshIcon />
                      </button>
                      <button
                        aria-label="minimize"
                        className="p-2 hover:bg-gray-200 rounded-full transition duration-200 mb-2"
                        onClick={() => setIsBarMinimized(!isBarMinimized)}
                      >
                        <MinimizeIcon />
                      </button>
                      <button
                        aria-label="close"
                        className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
                        onClick={() => setIsBarVisible(false)}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                  {!isBarMinimized && (
                    <div className="h-96 justify-center align-middle">
                      <div id="bar-chart" className="h-full" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDashboard;
