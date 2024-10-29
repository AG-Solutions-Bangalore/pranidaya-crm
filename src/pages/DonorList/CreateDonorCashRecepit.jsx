import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace, MdDelete } from "react-icons/md";
import axios from "axios";
import Layout from "../../layout/Layout";
import Fields from "../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { BaseUrl } from "../../base/BaseUrl";
import moment from "moment/moment";
import { Button, Card, CardBody, Input } from "@material-tailwind/react";
import year from "../../components/common/year";

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
    value: "Transfer",
    label: "Transfer",
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
    value: "Transfer",
    label: "Transfer",
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

const DonorDonationReceipt = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const [userdata, setUserdata] = useState("");

  const [userfamilydata, setUserfFamilydata] = useState("");

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

    fetch(BaseUrl + "/fetch-c-receipt-date", requestOptions)
      .then((response) => response.json())
      .then((data) => setDayClose(data.latestdate.c_receipt_date));
  }, []);
  const [donor, setDonor] = useState({
    indicomp_fts_id: "",
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
    family_full_check: "",
    family_full_name: "",
  });

  const useTemplate = {
    c_receipt_sub_donation_type: "",
    c_receipt_sub_amount: "0",
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
      dateField.setAttribute("max", todayback); // Set max attribute for date input
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

  const onInputChange = (e) => {
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

    let data = {
      donor_fts_id: userdata.donor_fts_id,
      c_receipt_financial_year: year,
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

    if (isValid) {
      setIsButtonDisabled(true);

      axios
        .post(`${BaseUrl}/create-c-receipt`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200 && res.data.code == "200") {
            toast.success(res.data.msg || "Donor Created Successfully");
            navigate(`/recepit-view/${res.data.latestid.id}`);
          } else {
            toast.error(res.data.message || "Error occurred");
          }
        })
        .catch((err) => {
          // Improved error logging
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
      setUserfFamilydata(res.data.familyMember);
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
  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 mt-6">
          <div className="flex items-center">
            <MdKeyboardBackspace
              onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2 mb-2 md:mb-0">
              Donation Receipt
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
              <Button disabled color="danger" className="bg-red-400">
                + Day Close
              </Button>
            ) : (
              <Button
                onClick={dayClose === todayback ? null : (e) => onDayClose(e)}
                className="btn-get-started"
                color="danger"
              >
                + Day Close
              </Button>
            )}
          </div>
        </div>
        <Card className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div className="text-gray-700">
                <strong>Name:</strong>
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
            {donor.c_receipt_total_amount > 2000 &&
            donor.c_receipt_exemption_type == "80G" &&
            pan == "NA" ? (
              <span className="amounterror">
                Max amount allowedwithout Pan card is 2000
              </span>
            ) : (
              ""
            )}
          </CardBody>
        </Card>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <Fields
                  required
                  select
                  title="Category"
                  type="whatsappDropdown"
                  name="c_receipt_exemption_type"
                  value={donor.c_receipt_exemption_type}
                  onChange={(e) => onInputChange(e)}
                  options={exemption}
                />
              </div>

              <div>
                {/* <label
                  className={`${
                    donor?.c_receipt_total_amount
                      ? "label-active"
                      : "label-inactive"
                  } text-xs text-gray-500`}
                >
                  Total Amount*
                </label> */}
                <Input
                  type="text"
                  label="Total Amount"
                  name="m_receipt_total_amount"
                  value={donor?.c_receipt_total_amount || ""}
                  onChange={(e) => onInputChange(e)}
                  disabled
                  // className="disabled:opacity-50"
                  className={`${
                    donor?.c_receipt_total_amount
                      ? "label-active"
                      : "label-inactive"
                  } text-sm text-gray-500`}
                />
              </div>
              <div>
                <Fields
                  required
                  select
                  title="Transaction Type"
                  type="TransactionType"
                  name="c_receipt_tran_pay_mode"
                  value={donor.c_receipt_tran_pay_mode}
                  onChange={(e) => onInputChange(e)}
                  donor={donor}
                  pay_mode={pay_mode}
                  pay_mode_2={pay_mode_2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
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
                  select
                  title="On Occasion"
                  type="occasionDropdown"
                  name="c_receipt_occasional"
                  value={donor.c_receipt_occasional}
                  onChange={(e) => onInputChange(e)}
                  options={occasion}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <Fields
                  type="textField"
                  name="c_receipt_remarks"
                  value={donor.c_receipt_remarks}
                  onChange={onInputChange}
                  label="Remarks"
                />
              </div>

              <div>
                <Fields
                  select
                  title="Family Member"
                  type="whatsappDropdown"
                  name="family_full_check"
                  value={donor.family_full_check}
                  onChange={(e) => onInputChange(e)}
                  options={family_check}
                />
              </div>
              {donor.family_full_check == "Yes" ? (
                <div>
                  <Fields
                    select
                    title="Family Member Name"
                    type="familyDropdown"
                    name="family_full_name"
                    value={donor.family_full_name}
                    onChange={(e) => onInputChange(e)}
                    options={userfamilydata}
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Line Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4"
              >
                <div className="md:col-span-2">
                  <Fields
                    required
                    select
                    title="Purpose"
                    type="TransactionType1"
                    name="c_receipt_sub_donation_type"
                    value={donor.c_receipt_sub_donation_type}
                    onChange={(e) => onChange(e, index)}
                    donor={donor}
                    donation_type={donation_type}
                    donation_type_2={donation_type_2}
                  ></Fields>
                </div>
                <div className="md:col-span-2">
                  <Input
                    required
                    label="Amount"
                    type="number"
                    value={users.c_receipt_sub_amount}
                    name="c_receipt_sub_amount"
                    onChange={(e) => {
                      onChange(e, index);
                      AmountCal(index);
                    }}
                  />
                </div>

                <button
                  color="error"
                  onClick={() => removeUser(index)}
                  className="flex items-center justify-center  text-red-600"
                  aria-label="Delete"
                >
                  {" "}
                  <MdDelete />
                </button>
              </div>
            ))}

            <div className="display-flex justify-start">
              <Button
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
                className="mt-4  bg-blue-400"
              >
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
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
