import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { NumericFormat } from "react-number-format";
import { Spinner } from "@material-tailwind/react";

const Stock = () => {
  const [stockList, setStockList] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        setLoading(true);
        const response = await axios.post(
          `${BaseUrl}/fetch-item-stock`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response, "response of stock");

        const res = response.data?.stock;
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            item["item_name"],
            <NumericFormat
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              displayType={"text"}
              prefix={""}
              value={item["openpurch"]}
            />,
            <NumericFormat
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              displayType={"text"}
              prefix={""}
              value={item["purch"]}
            />,
            <NumericFormat
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              displayType={"text"}
              prefix={""}
              value={item["sale"]}
            />,
            <NumericFormat
              thousandSeparator={true}
              thousandsGroupStyle="lakh"
              displayType={"text"}
              prefix={""}
              value={
                item["openpurch"] -
                item["closesale"] +
                (item["purch"] - item["sale"])
              }
            />,
          ]);
          console.log(tempRows, "tempRows");
          setStockList(tempRows);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: "SlNo",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Item Name",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Open Balance ",
      label: " Open Balance ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Received ",
      label: " Received ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Consumption ",
      label: " Consumption ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Close Balance ",
      label: " Close Balance ",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,

    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <DeliveryFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Stocks List ( In Kgs )
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title={"Current Month"}
            data={stockList ? stockList : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Stock;
