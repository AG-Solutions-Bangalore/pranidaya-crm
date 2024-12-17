import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace, MdDelete } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { Button, IconButton } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

const unitOptions = [
  { value: "Kg", label: "Kg" },
  { value: "Ton", label: "Ton" },
];

const AddConsumption = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentYear, setCurrentYear] = useState("");
  console.log("years", currentYear);
  const [cons, setCons] = useState({
    cons_date: new Date().toISOString().split("T")[0],
    cons_year: currentYear,
    cons_count: "",
    cons_sub_data: [],
  });
  const [fabric_inward_count, setCount] = useState(1);
  const useTemplate = {
    cons_sub_item: "",
    cons_sub_qnty: "",
    cons_sub_unit: "",
  };
  const [users, setUsers] = useState([useTemplate]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //FRTCH YEAR
  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCurrentYear(response.data.year.current_year);
        console.log(response.data.year.current_year, "year");
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);
  useEffect(() => {
    const fetchItemData = async () => {
      const response = await axios.get(`${BaseUrl}/fetch-item`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems(response.data.item);
    };

    fetchItemData();
  }, []);

  const addItem = () => {
    setUsers([...users, { ...useTemplate }]);
    setCount(fabric_inward_count + 1);
  };

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const removeUser = (index) => {
    const filteredUsers = users.filter((_, i) => i !== index);
    setUsers(filteredUsers);
    setCount(fabric_inward_count - 1);
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
    const data = {
      cons_date: cons.cons_date,
      cons_year: currentYear,
      cons_count: fabric_inward_count,
      cons_sub_data: users,
    };

    setIsButtonDisabled(true);
    try {
      const response = await axios.post(`${BaseUrl}/create-cons`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.code == "200") {
        toast.success("Consumption is Created Successfully");
        navigate("/consumption");
      } else {
        toast.error("Duplicate Entry");
      }
    } catch (error) {
      console.error("Error creating consumption:", error);
      toast.error("An error occurred while creating consumption.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Create Consumption
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            {/* Consumption Details */}
            <div className="mb-4">
              <Input
                type="date"
                id="purchase_date"
                name="cons_date"
                label="Date"
                value={cons.cons_date}
                onChange={onInputChange}
                required
                className="border rounded p-2 w-full border-gray-400 "
                placeholder="Date"
              />
            </div>

            {/* Line Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="flex flex-wrap lg:flex-nowrap gap-3 mb-4 mt-4"
              >
                <div className="w-full lg:w-1/4">
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
                </div>

                <div className="w-full lg:w-1/4">
                  <Input
                    required
                    label="Quantity"
                    type="number"
                    value={user.cons_sub_qnty}
                    name="cons_sub_qnty"
                    onChange={(e) => onChange(e, index)}
                  />
                </div>

                <div className="w-full lg:w-1/4">
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

                <div className="w-full lg:w-20 flex justify-center items-center">
                  <IconButton color="error" onClick={() => removeUser(index)}>
                    <MdDelete />
                  </IconButton>
                </div>
              </div>
            ))}

            <div className="display-flex justify-start">
              <Button
                variant="contained"
                color="primary"
                onClick={addItem}
                className="mt-4"
              >
                Add More
              </Button>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isButtonDisabled}
                className="mt-4"
              >
                Submit
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

export default AddConsumption;
