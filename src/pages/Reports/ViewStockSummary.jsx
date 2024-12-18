import Layout from "../../layout/Layout";
import { Card, Typography, Button, Spinner } from "@material-tailwind/react";
import { LuDownload } from "react-icons/lu";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { BaseUrl } from "../../base/BaseUrl";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment/moment";
import html2pdf from "html2pdf.js";

const TABLE_HEAD = [
  "Items Name",
  "Open Balance",
  "Received",
  "Consumption",
  "Close Balance",
];

function ViewStockSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stocksummary, setStockSummary] = useState([]);
  const [loader, setLoader] = useState(true);
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const componentRef = useRef();

  const PrintRecepit = () => {
    const printContent = componentRef.current;
    const printWindow = window.open("", "", "height=500,width=800");

    printWindow.document.write("<html><head><title>Print Receipt</title>");

    // Add CSS styles to the print window
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          console.log(
            "Accessing cross-origin styles is not allowed, skipping."
          );
          return "";
        }
      })
      .join("");
    printWindow.document.write(`<style>
    ${styles}
    .print-container {
      margin: 20px; /* Adjust margin as needed */
    }
  </style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const downloadPDF = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.2, // Reduced margin to 0.5 inches (adjust as needed)
      filename: `Stock_Summary_${from_date}_to_${to_date}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Use html2pdf to create and download the PDF
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .catch((error) => {
        console.error("PDF generation error:", error);
        toast.error("Failed to download PDF.");
      });
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_type_id");
    if (!isLoggedIn) {
      window.location = "/signin";
      return;
    }

    const data = {
      receipt_from_date: localStorage.getItem("receipt_from_date"),
      receipt_to_date: localStorage.getItem("receipt_to_date"),
    };

    setFromDate(moment(data.receipt_from_date).format("DD-MM-YYYY"));
    setToDate(moment(data.receipt_to_date).format("DD-MM-YYYY"));

    axios({
      url: `${BaseUrl}/fetch-stock-summary`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setStockSummary(res.data.stock);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching stock summary:", error);
        setLoader(false);
      });
  }, []);

  return (
    <Layout>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-2 bg-white rounded-lg">
        <div className="flex flex-row justify-start p-2">
          <MdKeyboardBackspace
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            onClick={() => navigate("/stock-summary")}
          />
          <h1 className="text-xl md:text-2xl text-[#464D69] font-semibold ml-2">
            Stock Summary (In Kgs)
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-4 md:space-y-0 md:space-x-4">
          <Button
            variant="text"
            className="flex items-center space-x-2"
            onClick={downloadPDF}
          >
            <LuDownload className="text-lg" />
            <span> PDF</span>
          </Button>
          <Button
            variant="text"
            className="flex items-center space-x-2"
            onClick={PrintRecepit}
          >
            <IoIosPrint className="text-lg" />
            <span>Print Receipt</span>
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-4" ref={componentRef}>
        <Card className="p-4 w-full overflow-x-auto">
          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <div className="overflow-x-auto print-container">
              <div className="flex justify-center">
                <div className="p-4 text-xl md:text-2xl flex justify-center font-bold">
                  Stock Summary - From: {from_date} To: {to_date}
                </div>
              </div>
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border border-gray-300 p-4 text-left"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stocksummary.length > 0 ? (
                    stocksummary.map((stockItem, index) => {
                      const { item_name, openpurch, purch, sale, closesale } =
                        stockItem;
                      const isLast = index === stocksummary.length - 1;
                      const classes = isLast
                        ? "border-t border-gray-300 p-4"
                        : "border-t border-b border-gray-300 p-4";

                      const numberFormatter = new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      });

                      return (
                        <tr key={item_name}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {item_name}
                            </Typography>
                          </td>
                          <td className={`${classes} bg-blue-gray-50/50`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal flex justify-end"
                            >
                              {numberFormatter.format(openpurch)}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal flex justify-end"
                            >
                              {numberFormatter.format(purch)}
                            </Typography>
                          </td>
                          <td className={`${classes} bg-blue-gray-50/50`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal flex justify-end"
                            >
                              {numberFormatter.format(sale)}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal flex justify-end"
                            >
                              {numberFormatter.format(closesale)}
                            </Typography>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default ViewStockSummary;
