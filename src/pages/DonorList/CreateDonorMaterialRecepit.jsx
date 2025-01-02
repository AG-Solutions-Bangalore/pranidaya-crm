import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace, MdDelete } from "react-icons/md";
import axios from "axios";
import Layout from "../../layout/Layout";
import Fields from "../../components/common/TextField/TextField";
import { toast } from "react-toastify";
// import { Button, IconButton } from "@mui/material";
import { BaseUrl } from "../../base/BaseUrl";
import moment from "moment/moment";
import {
  Button,
  Card,
  CardBody,
  IconButton,
  Input,
} from "@material-tailwind/react";

// Unit options for dropdown
const unitOptions = [
  { value: "Kg", label: "Kg" },
  { value: "Ton", label: "Ton" },
  { value: "Bag", label: "Bag" },
];

const DonorDonationReceipt = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const [userdata, setUserdata] = useState("");

  console.log(id);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  var d = document.getElementById("datefield");
  if (d) {
    document.getElementById("datefield").setAttribute("max", todayback);
  }

  var todayyear = new Date().getFullYear();
  var twoDigitYear = todayyear.toString().substr(-2);
  var preyear = todayyear;
  var finyear = +twoDigitYear + 1;
  var finalyear = preyear + "-" + finyear;
  const [dayClose, setDayClose] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [check, setCheck] = useState(false);

  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BaseUrl + "/fetch-m-receipt-date", requestOptions)
      .then((response) => response.json())
      .then((data) => setDayClose(data.latestdate.c_receipt_date));
  }, []);
  const [donor, setDonor] = useState({
    indicomp_fts_id: "",
    m_receipt_financial_year: "",
    m_receipt_date: check ? dayClose : dayClose,
    m_receipt_total_amount: "",
    m_receipt_tran_pay_mode: "",
    m_receipt_tran_pay_details: "",
    m_receipt_email_count: "",
    m_receipt_count: "",
    m_receipt_reason: "",
    m_receipt_remarks: "",
    m_receipt_sub_data: "",
    m_receipt_occasional: "",
    m_manual_receipt_no: "",
    m_receipt_vehicle_no: "",
  });

  const useTemplate = {
    m_receipt_sub_item: "",
    m_receipt_sub_quantity: "",
    m_receipt_sub_unit: "",
    m_receipt_sub_amount: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [fabric_inward_count, setCount] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  //fetch year
  const [currentYear, setCurrentYear] = useState("");
  useEffect(() => {
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

    fetchYearData();
  }, []);
  //FETCH OCCASION
  const [occasion, setOccasion] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BaseUrl + "/fetch-occasion", requestOptions)
      .then((response) => response.json())
      .then((data) => setOccasion(data.occasion));
  }, []);
  // Fetch vendors and items on mount
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

    fetchVendorData();
    fetchItemData();

    const dateField = document.getElementById("datefield");
    if (dateField) {
      dateField.setAttribute("max", todayback);
    }
  }, [todayback]);

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
  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };
  const onInputChange = (e) => {
    if (e.target.name == "m_receipt_total_amount") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setDonor({
        ...donor,
        [e.target.name]: e.target.value,
      });
    }
  };

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  //ONCHNAGE FOR USER
  const onChange = (e, index) => {
    if (e.target.name == "m_receipt_sub_quantity") {
      if (validateOnlyNumber(e.target.value)) {
        const updatedUsers = users.map((user, i) =>
          index == i
            ? Object.assign(user, { [e.target.name]: e.target.value })
            : user
        );
        setUsers(updatedUsers);
      }
    } else {
      const updatedUsers = users.map((user, i) =>
        index == i
          ? Object.assign(user, { [e.target.name]: e.target.value })
          : user
      );
      setUsers(updatedUsers);
    }
  };

  const pan = userdata.donor_pan_no == "" ? "NA" : userdata.donor_pan_no;

  const onSubmit = (e) => {
    e.preventDefault();

    let data = {
      indicomp_fts_id: userdata.donor_fts_id,
      m_receipt_financial_year: currentYear,
      m_receipt_date: check ? dayClose : dayClose,
      m_receipt_total_amount: donor.m_receipt_total_amount,
      m_receipt_tran_pay_mode: donor.m_receipt_tran_pay_mode,
      m_receipt_tran_pay_details: donor.m_receipt_tran_pay_details,
      m_receipt_remarks: donor.m_receipt_remarks,
      m_receipt_reason: donor.m_receipt_reason,
      m_receipt_email_count: donor.m_receipt_email_count,
      m_manual_receipt_no: donor.m_manual_receipt_no,
      m_receipt_count: fabric_inward_count,
      m_receipt_sub_data: users,
      m_receipt_vehicle_no: donor.m_receipt_vehicle_no,
      m_receipt_occasional: donor.m_receipt_occasional,
    };
    console.log(data, "MATERIAL DATA");
    const isValid = document.getElementById("addIndiv").checkValidity();

    if (isValid) {
      setIsButtonDisabled(true);

      axios
        .post(`${BaseUrl}/create-m-receipt`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200 && res.data.code == "200") {
            // toast.success("Donor Created Successfully");
            // const ids = res.data.latestid.id;
            // console.log(id);
            navigate(`/material-view/${res.data.latestid.id}`);
          } else {
            toast.error(res.data.message || "Error occurred");
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(
              `Error: ${
                err.response.data.message || "An error occurred on the server"
              }`
            );
            console.error("Server Error:", err.response);
          } else if (err.request) {
            toast.error("No response from the server.");
            console.error("No Response:", err.request);
          } else {
            toast.error(`Error: ${err.message}`);
            console.error("Error Message:", err.message);
          }
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const handleBackButton = () => {
    navigate("/donor-list");
  };

  useEffect(() => {
    axios({
      url: BaseUrl + "/fetch-donor-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setUserdata(res.data.donor);
      console.log("datatable", res.data.donor);
    });
  }, []);
  //DAY CLOSE

  //DAY close
  const onDayClose = (e) => {
    e.preventDefault();
    setCheck(true);

    const receivedDate = new Date(dayClose);

    if (isNaN(receivedDate)) {
      console.error("Invalid dayClose date:", dayClose);
      return;
    }

    receivedDate.setDate(receivedDate.getDate() + 1);

    const year = receivedDate.getFullYear();
    const month = String(receivedDate.getMonth() + 1).padStart(2, "0"); // Get month from 0-11, add 1 and pad with zero
    const day = String(receivedDate.getDate()).padStart(2, "0"); // Get day and pad with zero

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate, "formattedDate");
    let data = {
      c_receipt_date: formattedDate,
    };

    // Making the API call
    axios({
      url: BaseUrl + "/update-m-receipt-date/2",
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log(res.data, "dayclose"); // Log the response data for debugging
        // Set the new dayClose value
        setDayClose(res.data.latestdate.c_receipt_date);
      })
      .catch((error) => {
        console.error("Error updating receipt date:", error);
      });
  };
  const isValidDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    return !isNaN(parsedDate);
  };

  const onDayOpen = (e) => {
    e.preventDefault();
    setCheck(true);
    const receivedDate = new Date(dayClose);
    receivedDate.setDate(receivedDate.getDate() - 1);

    const year = receivedDate.getFullYear();
    const month = String(receivedDate.getMonth() + 1).padStart(2, "0");
    const day = String(receivedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    let data = {
      c_receipt_date: formattedDate,
    };
    axios({
      url: BaseUrl + "/update-m-receipt-date-open/2",
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 401) {
        NotificationManager.error(
          "In that Date there is already Receipt is Created"
        );
      } else {
        setDayClose(res.data.latestdate.c_receipt_date);
      }
    });
  };
  // const isAddMoreDisabled = () => {
  //   return users.some(
  //     (item) =>
  //       item.m_receipt_sub_item === "" ||
  //       item.m_receipt_sub_quantity === "" ||
  //       item.m_receipt_sub_unit === ""
  //   );
  // };
  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 mt-6">
          <div className="flex items-center">
            <MdKeyboardBackspace
              onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
              Material Receipt
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center md:space-x-4 mt-4 md:mt-0">
            {localStorage.getItem("user_type_id") === "2" && (
              <Button
                onClick={(e) => onDayOpen(e)}
                className="mb-2 md:mb-0  bg-red-400"
              >
                + Day Open
              </Button>
            )}

            <Button
              disabled={dayClose === todayback}
              onClick={dayClose !== todayback ? (e) => onDayClose(e) : null}
              className="btn-get-started  bg-red-400"
              // color="danger"
            >
              + Day Close
            </Button>
          </div>
        </div>

        {/* <div className="p-4 ">
          <div className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div className="text-gray-700">
                {userdata.donor_full_name}
              </div>
              <div className="text-gray-700">
                <strong>PDS ID:</strong>
                {userdata.donor_fts_id}
              </div>
              <div className="text-gray-700">
                <strong>Pan No:</strong>
                {pan}
              </div>
              <div className="text-gray-700">
                <strong>Receipt Date:</strong>{" "}
                {moment(check ? dayClose : dayClose).format("DD-MM-YYYY")}{" "}
              </div>
              <div className="text-gray-700">
                <strong>Year:</strong>
                {finalyear}
              </div>
            </div>
            {donor.m_receipt_total_amount > 2000 &&
            donor.c_receipt_exemption_type == "80G" &&
            pan == "NA" ? (
              <span className="amounterror">
                Max amount allowedwithout Pan card is 2000
              </span>
            ) : (
              ""
            )}
          </div>
        </div> */}
        <div className="p-4 bg-white rounded-b-xl shadow-xl mb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-black">
                {userdata.donor_full_name}
              </h3>
              <p className="text-xs font-semibold text-black">
                PDS Id: {userdata.donor_fts_id}
              </p>
            </div>
            <div className="space-y-1 relative">
              <div className="flex items-center">
                <h3 className="text-md font-semibold text-black">
                  Pan No: {pan}
                </h3>
              </div>

              <p className="   text-xs font-semibold text-black">
                Receipt Date:{" "}
                {moment(check ? dayClose : dayClose).format("DD-MM-YYYY")} (
                {finalyear})
              </p>
            </div>
            {donor.c_receipt_total_amount > 2000 &&
            donor.c_receipt_exemption_type == "80G" &&
            pan == "NA" ? (
              <span className="amounterror">
                Max amount allowedwithout Pan card is 2000
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="p-6  bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {/* Purchase Details */}
              <div>
                <Fields
                  type="textField"
                  label="Approx Value"
                  name="m_receipt_total_amount"
                  value={donor.m_receipt_total_amount}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <Fields
                  type="textField"
                  label="Vehicle No"
                  name="m_receipt_vehicle_no"
                  value={donor.m_receipt_vehicle_no}
                  onChange={onInputChange}
                />
              </div>

              <div>
                <Fields
                  select
                  title="On Occasion"
                  type="occasionDropdown"
                  name="m_receipt_occasional"
                  value={donor.m_receipt_occasional}
                  onChange={onInputChange}
                  options={occasion}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <Fields
                  type="textField"
                  name="m_receipt_remarks"
                  value={donor.m_receipt_remarks}
                  onChange={onInputChange}
                  label="Remarks"
                />
              </div>

              <div className="mb-4">
                <Fields
                  type="textField"
                  name="m_manual_receipt_no"
                  value={donor.m_manual_receipt_no}
                  onChange={onInputChange}
                  label="Manual Receipt No"
                />
              </div>
            </div>

            {/* Line Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4"
              >
                <div className="md:col-span-2">
                  <Fields
                    required
                    select
                    title="Item"
                    type="itemdropdown"
                    value={user.m_receipt_sub_item}
                    name="m_receipt_sub_item"
                    onChange={(e) => onChange(e, index)}
                    options={items}
                  />
                </div>

                <Fields
                  required
                  label="Quantity"
                  type="textField"
                  value={user.m_receipt_sub_quantity}
                  name="m_receipt_sub_quantity"
                  onChange={(e) => onChange(e, index)}
                />
                <Fields
                  required
                  select
                  title="Unit"
                  type="whatsappDropdown"
                  name="m_receipt_sub_unit"
                  value={user.m_receipt_sub_unit}
                  onChange={(e) => onChange(e, index)}
                  options={unitOptions}
                />
                <div
                  className="flex justify-start text-2xl text-red-500 bg-white cursor-pointer"
                  onClick={() => removeUser(index)}
                >
                  {/* <IconButton
                    className="text-red-500 bg-white"
                  
                  > */}
                  <MdDelete />
                  {/* </IconButton> */}
                </div>
              </div>
            ))}

            <div className="display-flex justify-start ">
              <Button
                onClick={addItem}
                className="mt-4 bg-blue-400"
                // disabled={isAddMoreDisabled()}
              >
                Add More
              </Button>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                className="mt-4 bg-blue-400"
              >
                Submit
              </Button>
              <Button
                className="mt-4 bg-red-400"
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

export default DonorDonationReceipt;
