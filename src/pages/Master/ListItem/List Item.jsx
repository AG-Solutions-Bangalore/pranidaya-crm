import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import EnquiryFilter from "../../../components/EnquiryFilter";
import { Spinner } from "@material-tailwind/react";

const OpenListEnquiry = () => {
  const [openListData, setOpenListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-item-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data.item;

        if (Array.isArray(responseData)) {
          const tempRows = responseData.map((item, index) => [
            index + 1,
            item.item_name,
            item.item_status,
            item.id,
          ]);
          setOpenListData(tempRows);
        } else {
          console.error("Expected an array but received", responseData);
          setOpenListData([]);
        }
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
      name: "SlNo",
      label: "SlNo",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Status",
      label: "Status",
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
              <MdEdit
                onClick={() => navigate(`/edit-enquiry/${id}`)}
                title="edit item"
                className="h-5 w-5 cursor-pointer text-blue-500"
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
    print: false,
    setRowProps: () => ({
      style: {
        borderBottom: "10px solid #f1f7f9",
      },
    }),
  };
  let usertype = localStorage.getItem("user_type_id");

  return (
    <Layout>
      <EnquiryFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Items List
        </h3>
        <Link
          to="/add-enquiry"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          style={{ display: usertype == 2 ? "inline-block" : "none" }}
        >
          + Add Item
        </Link>
      </div>
      {/* <div className="mt-5">
        <MUIDataTable data={openListData} columns={columns} options={options} />
      </div> */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            data={openListData}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default OpenListEnquiry;
