import Layout from "../../../layout/Layout";
import PageTitle from "../../../components/common/PageTitle";
import Dropdown from "../../../components/common/DropDown";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@material-tailwind/react";
import Moment from "moment";
import { useState, useEffect } from "react";
import { BaseUrl } from "../../../base/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DownloadCommon from "../../download/DeliveryDownload";

function DownloadWebDonation() {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const unit = [
    { value: "Kg", label: "Kg" },
    { value: "Ton", label: "Ton" },
    { value: "Bag", label: "Bag" },
  ];

  // Get the first and last date
  const todayback = Moment().format("YYYY-MM-DD");
  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  const [receiptsdwn, setWebsiteDonationDownload] = useState({
    payment_from_date: firstdate,
    payment_to_date: todayback,
  });

  // Input change handler for native inputs
  const onInputChangeN = (name, value) => {
    setWebsiteDonationDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };

  const onInputChange = (e) => {
    setWebsiteDonationDownload({
      ...receiptsdwn,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler for download
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      payment_from_date: receiptsdwn.payment_from_date,
      payment_to_date: receiptsdwn.payment_to_date,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/download-website-donation",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "website_donation_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Website Donation is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Website Donation is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  return (
    <Layout>
      <DownloadCommon />
      <ToastContainer />
      <div className="mt-4 mb-6">
        <PageTitle title={"Download Website Donation"}  />
      </div>
      <Card className="p-4">
        <h3 className="text-red-500 mb-5">
          Leave blank if you want all records.
        </h3>

        <form id="dowRecp" autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <Input
                required
                type="date"
                label="From Date"
                name="payment_from_date"
                className="required"
                value={receiptsdwn.payment_from_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Input
                required
                type="date"
                label="To Date"
                className="required"
                name="payment_to_date"
                value={receiptsdwn.payment_to_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>

            <div className="w-77">
              <Button
                color="blue"
                fullWidth
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Downloading..." : "Download"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </Layout>
  );
}

export default DownloadWebDonation;
