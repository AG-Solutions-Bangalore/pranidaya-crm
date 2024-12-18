import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace, MdDelete } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
// import { Button, IconButton } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";
import moment from "moment/moment";
import { Button, Card, CardBody, Input } from "@material-tailwind/react";

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

const EditRecepit = () => {
  const navigate = useNavigate();
  const [userfamilydata, setUserfFamilydata] = React.useState("");
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

  const [donor, setDonor] = useState({
    c_receipt_date: "",
    c_receipt_exemption_type: "",
    c_receipt_total_amount: "",
    c_receipt_count: "",
    c_receipt_tran_pay_mode: "",
    c_receipt_tran_pay_details: "",
    c_receipt_remarks: "",
    c_receipt_reason: "",
    c_receipt_email_count: "",
    c_receipt_occasional: "",
    c_manual_receipt_no: "",
    c_receipt_sub_data: "",
    family_full_check: "",
    family_full_name: "",
    donor: {
      donor_full_name: "",
      donor_pan_no: "",
      donor_fts_id: "",
    },
  });

  const useTemplate = {
    id: "",
    c_receipt_sub_donation_type: "",
    c_receipt_sub_amount: "",
  };

  const [users, setUsers] = useState([useTemplate]);
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

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
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
      c_receipt_total_amount: donor.c_receipt_total_amount,
      c_receipt_tran_pay_mode: donor.c_receipt_tran_pay_mode,
      c_receipt_tran_pay_details: donor.c_receipt_tran_pay_details,
      c_receipt_remarks: donor.c_receipt_remarks,
      c_receipt_reason: donor.c_receipt_reason,
      c_receipt_count: donor.c_receipt_count,
      c_manual_receipt_no: donor.c_manual_receipt_no,
      c_receipt_sub_data: users,
      c_receipt_occasional: donor.c_receipt_occasional,
      c_receipt_exemption_type: donor.c_receipt_exemption_type,
      family_full_check: donor.family_full_check,
      family_full_name: donor.family_full_name,
    };

    const isValid = document.getElementById("addIndiv").checkValidity();

    if (isValid) {
      setIsButtonDisabled(true);

      axios
        .put(`${BaseUrl}/update-c-receipt/${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status == 200 && res.data.code == "200") {
            toast.success(res.data.msg || "Donor Created Successfully");
            navigate("/cashrecepit");
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
    navigate("/cashrecepit");
  };

  useEffect(() => {
    axios({
      url: BaseUrl + "/fetch-c-receipt-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setUsers(res.data.receiptSub || []);
      setUserfFamilydata(res.data.familyMember);
      setDonor(res.data.receipts);
      setUserdata(res.data.donor);
      console.log("datatable", res.data.donor);
    });
  }, [id]);
  //DAY CLOSE
  console.log(users, "sers");

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Cash Receipt
          </h1>
        </div>
        <Card className=" mt-5 bg-white shadow-md rounded-lg">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 gap-4 mb-4">
              <div className="text-gray-700">
                <strong>Name:</strong>
                <div className="text-blue-400 inline-flex ml-1">
                  {" "}
                  {userdata.donor_full_name}
                </div>
              </div>
              <div className="text-gray-700">
                <strong>PDS ID:</strong>
                <div className="text-blue-400 inline-flex ml-1">
                  {" "}
                  {userdata.donor_fts_id}
                </div>
              </div>
              <div className="text-gray-700">
                <strong>Pan No:</strong>
                <div className="text-blue-400 inline-flex ml-1"> {pan}</div>
              </div>
              <div className="text-gray-700">
                <strong>Receipt Date:</strong>{" "}
                <div className="text-blue-400 inline-flex ml-1">
                  {" "}
                  {moment(check ? dayClose : dayClose).format(
                    "DD-MM-YYYY"
                  )}{" "}
                </div>
              </div>
              <div className="text-gray-700">
                <strong>Year:</strong>
                <div className="text-blue-400 inline-flex ml-1">
                  {" "}
                  {finalyear}
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-1">
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
                  name="c_receipt_total_amount"
                  value={donor?.c_receipt_total_amount || ""}
                  onChange={(e) => onInputChange(e)}
                  disabled
                  className="disabled:opacity-50"
                  labelProps={{
                    className: "!text-gray-500",
                  }}
                />
              </div>
              <div className="md:col-span-1">
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
              <div className="md:col-span-2">
                <Fields
                  type="textField"
                  label="Transaction Pay Details"
                  name="c_receipt_tran_pay_details"
                  value={donor.c_receipt_tran_pay_details}
                  onChange={(e) => onInputChange(e)}
                />
              </div>{" "}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <div className="mb-4">
              <Fields
                type="textField"
                name="c_receipt_remarks"
                value={donor.c_receipt_remarks}
                onChange={(e) => onInputChange(e)}
                label="Remarks"
              />
            </div>{" "}
            <div className="mb-4">
              <Fields
                type="textField"
                name="c_receipt_reason"
                value={donor.c_receipt_reason}
                onChange={(e) => onInputChange(e)}
                label="Reason"
              />
            </div>
            {/* Line Items */}
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
              >
                <div className="md:col-span-3">
                  <Fields
                    select
                    required
                    title="Purpose"
                    type="TransactionType1"
                    name="c_receipt_sub_donation_type"
                    value={user.c_receipt_sub_donation_type}
                    onChange={(e) => onChange(e, index)}
                    donor={donor}
                    donation_type={donation_type}
                    donation_type_2={donation_type_2}
                  ></Fields>
                </div>
                <div className="md:col-span-1">
                  <Fields
                    label="Amount"
                    type="textField"
                    required
                    value={user.c_receipt_sub_amount}
                    name="c_receipt_sub_amount"
                    onChange={(e) => {
                      onChange(e, index);
                      AmountCal(index);
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                className="mt-4 bg-blue-400"
              >
                Update
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

export default EditRecepit;
