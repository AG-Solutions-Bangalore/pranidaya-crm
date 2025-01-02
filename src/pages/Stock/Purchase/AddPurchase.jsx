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

// Unit options for dropdown
const unitOptions = [
  { value: "Kg", label: "Kg" },
  { value: "Ton", label: "Ton" },
  { value: "Bag", label: "Bag" },
];

const AddPurchase = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [purchase, setPurchase] = useState({
    purchase_date: new Date().toISOString().split("T")[0],
    purchase_vendor: "",
    purchase_bill_no: "",
    purchase_total_bill: "",
  });

  const useTemplate = {
    purchase_sub_item: "",
    purchase_sub_amount: "",
    purchase_sub_qnty: "",
    purchase_sub_unit: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [fabric_inward_count, setCount] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Fetch vendors and items on mount
  const fetchVendorData = async () => {
    const response = await axios.get(`${BaseUrl}/fetch-vendor`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setVendors(response.data.vendor);
  };

  const fetchItemData = async () => {
    const response = await axios.get(`${BaseUrl}/fetch-item`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setItems(response.data.item);
  };

  const [currentYear, setCurrentYear] = useState("");

  const fetchYearData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/fetch-year`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCurrentYear(response.data.year.current_year);
      console.log(response.data.year.current_year);
    } catch (error) {
      console.error("Error fetching year data:", error);
    }
  };
  useEffect(() => {
    fetchYearData();

    fetchVendorData();
    fetchItemData();
  }, []);

  const addItem = () => {
    setUsers([...users, useTemplate]);
    setCount(fabric_inward_count + 1);
  };

  const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
    setCount(fabric_inward_count - 1);
  };

  const onInputChange = (e) => {
    setPurchase({
      ...purchase,
      [e.target.name]: e.target.value,
    });
  };

  const onItemChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      purchase_date: purchase.purchase_date,
      purchase_vendor: purchase.purchase_vendor,
      purchase_bill_no: purchase.purchase_bill_no,
      purchase_total_bill: purchase.purchase_total_bill,
      purchase_count: fabric_inward_count,
      purchase_sub_data: users,
      purchase_year: currentYear,
    };

    const isValid = document.getElementById("addIndiv").checkValidity();

    if (isValid) {
      setIsButtonDisabled(true);
      axios
        .post(`${BaseUrl}/create-purchase`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success("Purchase Created Successfully");
            navigate("/purchase");
          } else {
            toast.error("Error occurred");
          }
        })
        .catch(() => {
          toast.error("An error occurred, please try again.");
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const handleBackButton = () => {
    navigate("/purchase");
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
            Create Purchase
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            {/* Purchase Details */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-4 mt-4">
              <div className="mb-4">
                <Input
                  type="date"
                  id="purchase_date"
                  name="purchase_date"
                  label="Date"
                  value={purchase.purchase_date}
                  onChange={onInputChange}
                  required
                  className="border rounded p-2 w-full border-gray-400 "
                  placeholder="Date"
                />
              </div>
              <div className="mb-4">
                <Fields
                  required
                  title="Vendor"
                  type="venderDropdown"
                  select
                  value={purchase.purchase_vendor}
                  options={vendors}
                  onChange={onInputChange}
                  name="purchase_vendor"
                ></Fields>
              </div>

              <div className="mb-4">
                <Fields
                  required
                  type="textField"
                  label="Bill No"
                  value={purchase.purchase_bill_no}
                  onChange={onInputChange}
                  name="purchase_bill_no"
                />
              </div>

              <div className="mb-4">
                <Input
                  required
                  label="Bill Amount"
                  // type="textField"
                  type="number"
                  value={purchase.purchase_total_bill}
                  onChange={onInputChange}
                  name="purchase_total_bill"
                />
              </div>
            </div>
            <hr></hr>

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
                    value={user.purchase_sub_item}
                    name="purchase_sub_item"
                    onChange={(e) => onItemChange(e, index)}
                    options={items}
                  />
                </div>

                <div className="w-full lg:w-1/4">
                  <Input
                    required
                    label="Quantity"
                    // type="textField"
                    type="number"
                    value={user.purchase_sub_qnty}
                    name="purchase_sub_qnty"
                    onChange={(e) => onItemChange(e, index)}
                  />
                </div>

                <div className="w-full lg:w-1/4">
                  <Fields
                    required
                    select
                    title="Unit"
                    type="whatsappDropdown"
                    value={user.purchase_sub_unit}
                    name="purchase_sub_unit"
                    onChange={(e) => onItemChange(e, index)}
                    options={unitOptions}
                  />
                </div>

                <div className="w-full lg:w-1/4">
                  <Input
                    required
                    label="Amount"
                    type="number"
                    value={user.purchase_sub_amount}
                    name="purchase_sub_amount"
                    onChange={(e) => onItemChange(e, index)}
                  />
                </div>
                <div className=" md:w-full lg:w-20 flex justify-center mb-4">
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
                className="mt-4 bg-blue-400"
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

export default AddPurchase;
