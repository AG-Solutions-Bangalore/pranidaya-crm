import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import TaskManagerFilter from "../../../components/TaskManagerFilter";
import { Link, useNavigate } from "react-router-dom";

import { Input, Button } from "@material-tailwind/react";

const DonationSummary = () => {
  const navigate = useNavigate();
  const [downloadDonation, setDonationDownload] = useState({
    receipt_from_date: "",
    receipt_to_date: "",
  });
  const onInputChange = (e) => {
    setDonationDownload({
      ...downloadDonation,
      [e.target.name]: e.target.value,
    });
  };

  const onReportView = (e) => {
    e.preventDefault();
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    if (v) {
      localStorage.setItem(
        "receipt_from_date",
        downloadDonation.receipt_from_date
      );
      localStorage.setItem("receipt_to_date", downloadDonation.receipt_to_date);
      navigate("/d-summary-view");
    }
  };

  return (
    <Layout>
      <TaskManagerFilter />
      <div className="bg-white mt-5 p-2 rounded-lg ">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
            Donation Summary
          </h3>
        </div>

        <form id="dowRecp" autoComplete="off" className="my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <Input
                type="date"
                label="From Date "
                className="required"
                required
                name="receipt_from_date"
                value={downloadDonation.receipt_from_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Input
                type="date"
                label="To Date"
                required
                className="required"
                value={downloadDonation.receipt_to_date}
                onChange={(e) => onInputChange(e)}
                name="receipt_to_date"
              />
            </div>

            <div className="w-full">
              <Button color="blue" fullWidth onClick={onReportView}>
                View
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DonationSummary;
