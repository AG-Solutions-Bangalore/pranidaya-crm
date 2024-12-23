import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl } from "../../base/BaseUrl";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { MdEdit, MdOutlineStickyNote2 } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { PiNotebook } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import CommonListing from "./CommonListing";
import { Spinner } from "@material-tailwind/react";

const DonorList = () => {
  const [donorListData, setDonorListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-donor-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDonorListData(response?.data?.donor);
      } catch (error) {
        console.error("Error fetching open list enquiry data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenData();
  }, []);

  const columns = [
    {
      name: "donor_fts_id",
      label: "PDS ID",
      options: {
        filter: false,
        print: false,
        download: false,
        display: "included",
        sort: false,
      },
    },
    {
      name: "donor_full_name",
      label: " Name ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "donor_mobile",
      label: " Mobile ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "donor_email",
      label: " Email ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <IoEye
                onClick={() => navigate(`/viewdonor-list/${id}`)}
                title="View "
                className="h-5 w-5 cursor-pointer text-blue-500 "
              />
              <MdEdit
                onClick={() => navigate(`/edit-donor/${id}`)}
                title="Edit"
                className="h-5 w-5 cursor-pointer text-blue-500 "
              />
              <PiNotebook
                onClick={() => navigate(`/createrecepit-donor/${id}`)}
                title="Cash Recepit"
                className="h-5 w-5 cursor-pointer text-blue-500 mr-2"
              />
              <MdOutlineStickyNote2
                onClick={() => navigate(`/create-donor/${id}`)}
                title="Material Recepit"
                className="h-5 w-5 cursor-pointer text-blue-500 mr-2"
              />
              <FaUsers
                onClick={() => navigate(`/create-family/${id}`)}
                title="Family Members"
                className="h-5 w-5 cursor-pointer text-blue-500 mr-2"
              />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    filter: false,
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
      <CommonListing />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-4 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Donor List
        </h3>

        <div className="md:space-x-5 space-y-5 md:space-y-0  flex flex-col md:flex-row ">
          <Link
            to="/cashrecepitall"
            className="btn btn-primary text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md w-full md:w-auto"
          >
            + CashRecepit
          </Link>
          {/* <Link
            to="/materialrecepitall"
            className="btn btn-primary text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md w-full md:w-auto"
          >
            + DirectMaterialRecepit{" "}
          </Link> */}
          <Link
            to="/add-donor"
            className="btn btn-primary text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md w-full md:w-auto"
          >
            + Add Donor
          </Link>
        </div>
      </div>

      {/* Show spinner while loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title="Donor List"
            data={donorListData ? donorListData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default DonorList;
