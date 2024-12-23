import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace, MdDelete } from "react-icons/md";
import axios from "axios";
import Layout from "../../layout/Layout";
import Fields from "../../components/common/TextField/TextField";
import { toast, Toaster } from "react-hot-toast";
import { BaseUrl } from "../../base/BaseUrl";
import moment from "moment/moment";
import { Button, ButtonGroup, Input } from "@material-tailwind/react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress, FormLabel } from "@mui/material";
import Dropdown from "../../components/common/DropDown";

// Unit options for dropdown
const unitOptions = [
  { value: "Kg", label: "Kg" },
  { value: "Ton", label: "Ton" },
];
const exemption = [
  {
    value: "80G",
    label: "80G",
  },
  {
    value: "Non 80G",
    label: "Non 80G",
  },
  {
    value: "FCRA",
    label: "FCRA",
  },
  {
    value: "CSR",
    label: "CSR",
  },
];

const pay_mode = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Cheque",
    label: "Cheque",
  },
  {
    value: "Credit Card",
    label: "Credit Card",
  },
  {
    value: "Online",
    label: "Online",
  },
  {
    value: "Others",
    label: "Others",
  },
];

const pay_mode_2 = [
  {
    value: "Cheque",
    label: "Cheque",
  },
  {
    value: "Credit Card",
    label: "Credit Card",
  },
  {
    value: "Online",
    label: "Online",
  },
  {
    value: "Others",
    label: "Others",
  },
];

const family_check = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

const donation_type = [
  {
    value: "Gopalak",
    label: "Gopalak",
  },
  {
    value: "Wet/Dry-Grass",
    label: "Wet/Dry-Grass",
  },
  {
    value: "FIne/Rough Bran",
    label: "FIne/Rough Bran",
  },
  {
    value: "Gou-Daan",
    label: "Gou-Daan",
  },
  {
    value: "Building Fund",
    label: "Building Fund",
  },
  {
    value: "Pigeon Feeds",
    label: "Pigeon Feeds",
  },
  {
    value: "General Fund/Others",
    label: "General Fund/Others",
  },
];

const donation_type_2 = [
  {
    value: "Gopalak",
    label: "Gopalak",
  },
  {
    value: "Wet/Dry-Grass",
    label: "Wet/Dry-Grass",
  },
  {
    value: "FIne/Rough Bran",
    label: "FIne/Rough Bran",
  },
  {
    value: "Gou-Daan",
    label: "Gou-Daan",
  },
  {
    value: "Building Fund",
    label: "Building Fund",
  },
  {
    value: "Pigeon Feeds",
    label: "Pigeon Feeds",
  },
  {
    value: "General Fund/Others",
    label: "General Fund/Others",
  },
];

const CashRecepitAll = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const [userdata, setUserdata] = useState("");
  const [donorListData, setDonorListData] = useState([]);

  const [userfamilydata, setUserfFamilydata] = useState("");
  console.log(userfamilydata, "userfamilydata");
  // console.log(id);
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
  //fetchyear
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
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BaseUrl + "/fetch-c-receipt-date", requestOptions)
      .then((response) => response.json())
      .then((data) => setDayClose(data.latestdate.c_receipt_date));
  }, []);
  const [donor, setDonor] = useState({
    indicomp_fts_id: "",
    donor_fts_id: "",
    c_receipt_financial_year: "",
    c_receipt_date: check ? dayClose : dayClose,
    c_receipt_exemption_type: "",
    c_receipt_total_amount: "0",
    c_receipt_count: "",
    c_receipt_tran_pay_mode: "",
    c_receipt_tran_pay_details: "",
    c_receipt_occasional: "",
    c_receipt_email_count: "",
    c_receipt_reason: "",
    c_receipt_remarks: "",
    c_manual_receipt_no: "",
    c_receipt_sub_data: "",
    family_full_check: "No",
    family_full_name: "",
  });

  const useTemplate = {
    c_receipt_sub_donation_type: "",
    c_receipt_sub_amount: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [fabric_inward_count, setCount] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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

  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-donor-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDonorListData(response?.data?.donor);
      } catch (error) {
        console.error("Error fetching open list enquiry data", error);
      }
    };

    fetchOpenData();
  }, []);
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
      dateField.setAttribute("max", todayback); // Set max attribute for date input
    }
  }, [todayback]);

  const isAddMoreDisabled = () => {
    return users.some(
      (item) =>
        item.c_receipt_sub_donation_type === "" ||
        item.c_receipt_sub_amount === ""
    );
  };

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
    console.log(e.target.value);
    if (e.target.name == "c_receipt_total_amount") {
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
    if (e.target.name == "c_receipt_sub_amount") {
      if (validateOnlyNumber(e.target.value)) {
        const updatedUsers = users.map((user, i) =>
          index == i
            ? Object.assign(user, { [e.target.name]: e.target.value })
            : user
        );
        console.log(updatedUsers);

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

  const AmountCal = (selectedValue) => {
    const tempUsers = [...users];
    setUsers(tempUsers);
    const result = [];
    for (let i = 0; i < users.length; i++) {
      result.push(users[i].c_receipt_sub_amount);
    }
    const valu = result.reduce((acc, curr) => acc + parseInt(curr), 0);
    const total = +parseInt(valu || 0);
    setDonor((donor) => ({
      ...donor,
      c_receipt_total_amount: total,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      { field: donor.c_receipt_exemption_type, name: "Category" },
      { field: donor.c_receipt_tran_pay_mode, name: "Transaction Type" },
      { field: donor.donor_fts_id, name: "Donor Name" },
    ];

    const emptyFields = requiredFields.filter((item) => !item.field);

    if (emptyFields.length > 0) {
      emptyFields.forEach((item) => toast.error(`Please select ${item.name}`));
      return;
    }

    let data = {
      donor_fts_id: donor.donor_fts_id,
      c_receipt_financial_year: currentYear,
      c_receipt_date: check ? dayClose : dayClose,
      c_receipt_exemption_type: donor.c_receipt_exemption_type,
      c_receipt_total_amount: donor.c_receipt_total_amount,
      c_receipt_count: fabric_inward_count,
      c_receipt_tran_pay_mode: donor.c_receipt_tran_pay_mode,
      c_receipt_tran_pay_details: donor.c_receipt_tran_pay_details,
      c_receipt_occasional: donor.c_receipt_occasional,
      c_receipt_remarks: donor.c_receipt_remarks,
      c_receipt_reason: donor.c_receipt_reason,
      c_receipt_email_count: donor.c_receipt_email_count,
      c_manual_receipt_no: donor.c_manual_receipt_no,
      c_receipt_sub_data: users,
      family_full_check: donor.family_full_check,
      family_full_name: donor.family_full_name,
    };

    const isValid = document.getElementById("addIndiv").checkValidity();
    console.log(data, "finaldat");
    if (isValid) {
      setIsButtonDisabled(true);

      axios
        .post(`${BaseUrl}/create-c-receipt`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200 || res.data.code === "200") {
            toast.success("Donor Created Successfully");
            setTimeout(() => {
              navigate(`/recepit-view/${res.data?.latestid?.id}`);
            }, 100);
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
    if (donor && donor.donor_fts_id) {
      axios({
        url: `${BaseUrl}/fetch-donor-by-id/${donor.donor_fts_id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          setUserfFamilydata(res.data.familyMember);
          setUserdata(res.data.donor);
          console.log("Selected Donor Data", res.data.donor);
        })
        .catch((error) => {
          console.error("Error fetching donor data", error);
        });
    }
  }, [donor?.donor_fts_id]);
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
      url: BaseUrl + "/update-c-receipt-date/1",
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.data.code) {
          console.log(res.data, "dayclose");
          toast.success;
          setDayClose(res.data.latestdate.c_receipt_date);
        }
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
      url: BaseUrl + "/update-c-receipt-date-open/1",
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 401) {
        toast.error("In that Date there is already Receipt is Created");
      } else {
        setDayClose(res.data.latestdate.c_receipt_date);
      }
    });
  };

  const handleButtonGroupChange = (stateName, value) => {
    console.log(value);

    setDonor((prevDonor) => ({
      ...prevDonor,
      [stateName]: value,
    }));
  };

  const renderButtonGroup = (options, stateName, currentValue) => (
    <ButtonGroup className="w-full h-9 flex flex-wrap  ">
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => handleButtonGroupChange(stateName, option.value)}
          className={`flex-grow ${
            currentValue === option.value
              ? "bg-green-500 text-black"
              : "bg-[#E1F5FA] text-blue-gray-700 hover:bg-blue-100"
          } text-[10px] lg:text-xs py-2 lg:py-0
            w-1/2 md:w-1/3 lg:w-auto rounded-none  mt-1 lg:mt-0   `}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
  //   const handleDonorChange = (selectedDonor) => {
  //     console.log(selectedDonor.donor_fts_id);
  //     setDonor(selectedDonor.donor_fts_id);
  //   };

  const handleDonorChange = (selectedDonor) => {
    console.log(selectedDonor.donor_fts_id);

    setDonor((prevDonor) => ({
      ...prevDonor,
      donor_fts_id: selectedDonor.donor_fts_id,
    }));
  };
  console.log(donor.donor_fts_id, "out");

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <Layout>
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 mt-6">
          <div className="flex items-center">
            <MdKeyboardBackspace
              onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2 mb-2 md:mb-0">
              Direct Donation Receipt
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:ml-auto md:space-x-2">
            {localStorage.getItem("user_type_id") === "2" ? (
              <Button
                onClick={(e) => onDayOpen(e)}
                className="mb-2 md:mb-0 bg-red-400"
              >
                + Day Open
              </Button>
            ) : (
              ""
            )}
            {dayClose === todayback ? (
              <Button disabled className="bg-red-400">
                + Day Close
              </Button>
            ) : (
              <Button
                onClick={dayClose === todayback ? null : (e) => onDayClose(e)}
                className="btn-get-started bg-red-400"
              >
                + Day Close
              </Button>
            )}
          </div>
        </div>

        <div className="p-6  bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Autocomplete
                  disablePortal
                  name="donor_fts_id"
                  options={donorListData.map((donor) => ({
                    ...donor,
                    label: `${donor.donor_full_name} (${donor.donor_mobile})`,
                    id: donor.donor_fts_id,
                  }))}
                  loading={donorListData.length === 0}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.label}
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.donor_fts_id === value.donor_fts_id
                  }
                  onChange={(event, selectedOption) =>
                    handleDonorChange(selectedOption)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Donor"
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 40,
                          fontSize: "1rem",
                        },
                      }}
                    />
                  )}
                  loadingText="Loading donors..."
                />
              </div>

              <div className="flex items-center">
                <h3 className="text-md font-semibold text-black">
                  Pan No: {pan || "N/A"}
                </h3>
              </div>

              <div className="flex items-center">
                <h3 className="text-md font-semibold text-black">
                  Mobile: {userdata.donor_mobile || "N/A"}
                </h3>
              </div>
            </div>
            {/* <div className="mb-4">
              <Autocomplete
                disablePortal
                options={donorListData.map((donor) => ({
                  label: donor.donor_full_name,
                  id: donor.donor_fts_id,
                }))}
                loading={donorListData.length === 0}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.label}
                  </li>
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, selectedOption) =>
                  handleDonorChange(selectedOption)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Donor"
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 40,
                        fontSize: "1rem",
                      },
                    }}
                  />
                )}
                loadingText="Loading donors..."
              />
            </div> */}

            <div className="grid grid-cols-1 gap-20 md:gap-4 lg:grid-cols-2">
              <div className="col-span-1">
                <FormLabel required>Category</FormLabel>
                {renderButtonGroup(
                  exemption,
                  "c_receipt_exemption_type",
                  donor.c_receipt_exemption_type
                )}
              </div>

              <div className="col-span-1">
                <FormLabel required>Transaction Type</FormLabel>
                {renderButtonGroup(
                  donor.c_receipt_exemption_type === "80G" &&
                    donor.c_receipt_total_amount > 2000
                    ? pay_mode_2
                    : pay_mode,
                  "c_receipt_tran_pay_mode",
                  donor.c_receipt_tran_pay_mode
                )}
              </div>

              {/* <div className="flex flex-wrap gap-5 lg:gap-4 lg:flex-nowrap"> */}
              <div
                className={`flex flex-wrap gap-5 lg:gap-4 lg:flex-nowrap ${
                  typeof donor.donor_fts_id === "string" &&
                  donor.donor_fts_id.trim() === ""
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <div className="flex flex-col flex-1 sm:mt-10px md:mt-0">
                  <FormLabel required>Family Member</FormLabel>
                  {renderButtonGroup(
                    family_check,
                    "family_full_check",
                    donor.family_full_check
                  )}
                </div>

                {donor.family_full_check === "Yes" && (
                  <div className="flex flex-1 mt-5">
                    <Dropdown
                      select
                      label="Family Member"
                      name="family_full_name"
                      value={donor.family_full_name}
                      onChange={(e) => onInputChange(e)}
                      options={userfamilydata}
                      className="flex-1"
                      size="small"
                    />
                  </div>
                )}
              </div>

              <div className="col-span-1  mt-5">
                <Fields
                  select
                  title="On Occasion"
                  type="occasionDropdown"
                  name="c_receipt_occasional"
                  value={donor.c_receipt_occasional}
                  onChange={(e) => onInputChange(e)}
                  options={occasion}
                />
              </div>
            </div>

            <div className="grid grid-cols-1  lg:grid-cols-3 gap-4 mb-4 my-5 ">
              <div>
                <Fields
                  type="textField"
                  label="Transaction Pay Details"
                  name="c_receipt_tran_pay_details"
                  value={donor.c_receipt_tran_pay_details}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div>
                <Fields
                  type="textField"
                  name="c_manual_receipt_no"
                  value={donor.c_manual_receipt_no}
                  onChange={(e) => onInputChange(e)}
                  label="Manual Receipt No"
                />
              </div>
              <div>
                <Fields
                  type="textField"
                  name="c_receipt_remarks"
                  value={donor.c_receipt_remarks}
                  onChange={onInputChange}
                  label="Remarks"
                />
              </div>
            </div>

            {users.map((user, index) => (
              <div key={index} className="flex flex-wrap gap-4 mb-4">
                <div className="w-full sm:w-1/2 md:w-3/5 lg:w-3/5">
                  <Fields
                    required
                    select
                    title="Purpose"
                    type="TransactionType1"
                    name="c_receipt_sub_donation_type"
                    value={user.c_receipt_sub_donation_type}
                    onChange={(e) => onChange(e, index)}
                    donor={user}
                    donation_type={donation_type}
                    donation_type_2={donation_type_2}
                  />
                </div>

                <div className="w-full sm:w-1/4 lg:w-1/5">
                  <Input
                    required
                    label="Amount"
                    type="number"
                    value={user.c_receipt_sub_amount}
                    name="c_receipt_sub_amount"
                    onChange={(e) => {
                      onChange(e, index);
                      AmountCal(index);
                    }}
                  />
                </div>

                <div className="w-full sm:w-1/4 lg:w-1 flex items-center justify-start lg:justify-center">
                  <button
                    // color="error"
                    onClick={() => removeUser(index)}
                    className="text-2xl text-red-600"
                    aria-label="Delete"
                    type="button"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-4 mt-4">
              {/* Add More Button */}
              <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                <Button
                  onClick={addItem}
                  className="bg-blue-400 flex justify-center"
                  disabled={isAddMoreDisabled()}
                >
                  Add More
                </Button>
              </div>

              {/* Total Amount Input */}
              <div className="w-full sm:w-56">
                <Input
                  type="text"
                  label="Total Amount"
                  name="m_receipt_total_amount"
                  value={donor?.c_receipt_total_amount || ""}
                  onChange={(e) => onInputChange(e)}
                  disabled
                  labelProps={{
                    className: "!text-gray-900",
                  }}
                  className="text-lg"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                className="mt-4  bg-blue-400"
              >
                Submit
              </Button>
              <Button className="mt-4 bg-red-400" onClick={handleBackButton}>
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CashRecepitAll;
