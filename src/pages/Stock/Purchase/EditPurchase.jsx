import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

// Unit options for dropdown
const unitOptions = [
  { value: "Kg", label: "Kg" },
  { value: "Ton", label: "Ton" },
];

const EditPurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [purchase, setPurchase] = useState({
    purchase_date: "",
    purchase_vendor: "",
    purchase_bill_no: "",
    purchase_total_bill: "",
  });

  const initialUserTemplate = {
    purchase_sub_item: "",
    purchase_sub_amount: "",
    purchase_sub_qnty: "",
    purchase_sub_unit: "",
  };

  const [users, setUsers] = useState([initialUserTemplate]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
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

    const fetchPurchaseData = async () => {
      const response = await axios.get(
        `${BaseUrl}/fetch-purchase-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPurchase(response.data.purchase);
      setUsers(response.data.purchaseSub);
    };

    fetchVendorData();
    fetchItemData();
    fetchPurchaseData();
  }, [id]);

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

  const addItem = () => {
    setUsers([...users, initialUserTemplate]);
  };

  const removeUser = (index) => {
    const filteredUsers = users.filter((_, i) => i !== index);
    setUsers(filteredUsers);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      purchase_date: purchase.purchase_date,
      purchase_vendor: purchase.purchase_vendor,
      purchase_bill_no: purchase.purchase_bill_no,
      purchase_total_bill: purchase.purchase_total_bill,
      purchase_sub_data: users,
    };

    const isValid = document.getElementById("addIndiv").checkValidity();
    console.log(data);
    if (isValid) {
      setIsButtonDisabled(true);
      try {
        const res = await axios.put(`${BaseUrl}/update-purchase/${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.code == "200") {
          toast.success("Purchase Updated Successfully");
          navigate("/purchase");
        } else {
          toast.error("Error occurred");
        }
      } catch {
        toast.error("An error occurred, please try again.");
      } finally {
        setIsButtonDisabled(false);
      }
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
            Edit Purchase
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
                  disabled
                  labelProps={{
                    className: "!text-gray-900",
                  }}
                  className="border rounded p-2 w-full border-gray-400"
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
                />
              </div>
              <div className="mb-4">
                <Fields
                  required
                  label="Bill No"
                  type="textField"
                  value={purchase.purchase_bill_no}
                  onChange={onInputChange}
                  name="purchase_bill_no"
                />
              </div>
              <div className="mb-4">
                <Input
                  required
                  label="Bill Amount"
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
                className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-4 mt-4"
              >
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
                <Input
                  required
                  label="Quantity"
                  type="number"
                  value={user.purchase_sub_qnty}
                  name="purchase_sub_qnty"
                  onChange={(e) => onItemChange(e, index)}
                />
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
                <Input
                  required
                  label="Amount"
                  type="number"
                  value={user.purchase_sub_amount}
                  name="purchase_sub_amount"
                  onChange={(e) => onItemChange(e, index)}
                />
              </div>
            ))}

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

export default EditPurchase;
