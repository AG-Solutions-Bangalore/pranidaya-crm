import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";

// import { ToastContainer } from "react-toastify";
import { Input } from "@material-tailwind/react";

const unitOptions = [
  { value: "Kg", label: "Kg" },
  { value: "Ton", label: "Ton" },
];

const EditConsumption = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [cons, setCons] = useState({
    cons_date: "",
    cons_count: "",
    cons_sub_data: [],
  });
  const [users, setUsers] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchItemData = async () => {
      const response = await axios.get(`${BaseUrl}/fetch-item`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems(response.data.item);
    };

    const fetchConsumptionData = async () => {
      const response = await axios.get(`${BaseUrl}/fetch-cons-by-id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCons(response.data.cons);
      setUsers(response.data.consSub);
    };
    fetchItemData();
    fetchConsumptionData();
  }, [id]);

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const onInputChange = (e) => {
    setCons({
      ...cons,
      [e.target.name]: e.target.value,
    });
  };

  const handleBackButton = () => {
    navigate("/consumption");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      cons_date: cons.cons_date,
      cons_count: cons.cons_count,
      cons_sub_data: users,
    };

    setIsButtonDisabled(true);
    try {
      const response = await axios.put(`${BaseUrl}/update-cons/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.code == 200) {
        toast.success("Consumption is Updated Successfully");
        navigate("/consumption");
      } else {
        toast.error("Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating consumption:", error);
      toast.error("An error occurred while updating consumption.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      {/* <ToastContainer /> */}
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Edit Consumption
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            {/* Consumption Details */}
            <div className="mb-4">
              <Input
                type="date"
                id="cons_date"
                name="cons_date"
                label="Date"
                disabled
                value={cons.cons_date}
                onChange={onInputChange}
                required
                labelProps={{
                  className: "!text-gray-900",
                }}
                className="border rounded p-2 w-full border-gray-400"
              />
            </div>

            {/* Line Items */}
            {users.length === 0 ? (
              <p>No items found.</p>
            ) : (
              users.map((user, index) => (
                <div
                  key={index}
                  className="flex flex-wrap lg:flex-nowrap gap-3 mb-4 mt-4"
                >
                  <Fields
                    required
                    select
                    title="Item"
                    type="itemdropdown"
                    value={user.cons_sub_item}
                    name="cons_sub_item"
                    onChange={(e) => onChange(e, index)}
                    options={items}
                  />
                  <Input
                    required
                    label="Quantity"
                    type="number"
                    value={user.cons_sub_qnty}
                    name="cons_sub_qnty"
                    onChange={(e) => onChange(e, index)}
                  />
                  <Fields
                    required
                    select
                    title="Unit"
                    type="whatsappDropdown"
                    value={user.cons_sub_unit}
                    name="cons_sub_unit"
                    onChange={(e) => onChange(e, index)}
                    options={unitOptions}
                  />
                </div>
              ))
            )}

            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isButtonDisabled}
                className="mt-4"
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className="mt-4"
                onClick={handleBackButton}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditConsumption;
