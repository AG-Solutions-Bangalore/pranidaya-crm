import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import axios from "axios";
import { BaseUrl } from "../../base/BaseUrl";
import { Spinner } from "@material-tailwind/react";

const WebDonation = () => {
  const [webdonation, setWebDonation] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingRData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BaseUrl}/fetch-website-donation-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const res = response.data?.website_donation || [];
        const tempRows = res.map((item, index) => [
          index + 1,
          item["payment_user"],
          item["payment_mobile"],
          moment(item["payment_date"]).format("DD-MM-YYYY"),
          item["payment_exemption_type"],
          item["payment_donation_type"],
          item["payment_amount"],
          item["id"],
        ]);
        setWebDonation(tempRows);
      } catch (error) {
        console.error("Error fetching pending list request data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRData();
  }, []);

  const columns = [
    {
      name: "SlNo",
      label: "Sl No",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Name",
      label: " Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Mobile",
      label: " Mobile",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Date",
      label: " Date",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Exemption Type",
      label: " Exemption Type",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Donation Type",
      label: " Donation Type",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Amount ",
      label: " Amount ",
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
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Website Donation List
        </h3>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            data={webdonation}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default WebDonation;
