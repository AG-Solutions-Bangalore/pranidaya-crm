import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import RequestFilter from "../../../components/RequestFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
const RecepitCashRecepit = () => {
  const [pendingRListData, setPendingRListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchPendingRData = async () => {
      const userTypeId = localStorage.getItem("user_type_id");

      setUserType(userTypeId);

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-c-receipt-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = response.data?.receipts;
        console.log(res);
        setPendingRListData(res);
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
      name: "c_receipt_no",
      label: "Receipt No",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "donor_full_name",
      label: "Name",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "c_receipt_date",
      label: "Date",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "c_receipt_exemption_type",
      label: "Exemption Type",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },

    {
      name: "c_receipt_total_amount",
      label: "Amount",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "c_receipt_count",
      label: "No of Item",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <Link
                to={`/recepit-view/${id}`}
                // style={{ display: userType === "4" ? "none" : "" }}
              >
                <MdOutlineRemoveRedEye
                  title="View"
                  className="h-5 w-5 cursor-pointer text-blue-500"
                />
              </Link>
              <Link
                to={`/recepit-edit/${id}`}
                style={{ display: userType === "2" ? "" : "none" }}
              >
                <MdEdit
                  title="Edit"
                  className="h-5 w-5 cursor-pointer text-blue-500"
                />
              </Link>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    filter: false,
    responsive: "standard",
    download: false,
    print: false,
  };

  return (
    <Layout>
      <RequestFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Donation Receipts List
        </h3>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <MUIDataTable
            data={pendingRListData || []}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Layout>
  );
};

export default RecepitCashRecepit;
