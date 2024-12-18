import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";

const Consumption = () => {
  const [consumptionList, setConsumptionList] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdeliveryDData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-cons-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = response.data?.cons;
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            moment(item["cons_date"]).format("DD-MM-YYYY"),
            item["cons_count"],
            item["id"],
          ]);
          console.log(tempRows, "tempRows");
          setConsumptionList(tempRows);
        }
      } catch (error) {
        console.error("Error fetching deliverd list Delivery data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdeliveryDData();
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
      name: "Date",
      label: "Date",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "No of Item ",
      label: " No of Item ",
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
                style={{
                  display:
                    localStorage.getItem("user_type_id") == 1 ? "none" : "",
                }}
                onClick={() => navigate(`/edit-consumption/${id}`)}
                title="edit country list"
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
          Consumption List
        </h3>

        <Link
          to="/add-consumption"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Consumption
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            data={consumptionList ? consumptionList : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Consumption;
