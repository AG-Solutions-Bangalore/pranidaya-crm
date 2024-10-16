import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";

const FamilyList = () => {
  const [FamilyList, setFamilyList] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdeliveryDData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        localStorage.setItem("donor_fts_id", id);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BaseUrl}/fetch-family-member-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const res = response.data?.donor;
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            item["family_full_name"],
            item["family_status"],

            item["id"],
          ]);
          console.log(tempRows, "tempRows");
          setFamilyList(tempRows);
        }
      } catch (error) {
        console.error("Error fetching deliverd list Delivery data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdeliveryDData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "#",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: " Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: " Status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
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
          Family Member List{" "}
        </h3>

        <Link
          to="/add-family"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          style={{
            display:
              localStorage.getItem("user_type_id") == 2
                ? "inline-block"
                : "none",
          }}
        >
          + Add Family Member
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={FamilyList ? FamilyList : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default FamilyList;
