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

function DowloadConsumption() {
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

  const [receiptsdwn, setConsumptionDownload] = useState({
    cons_from_date: firstdate,
    cons_to_date: todayback,
    cons_sub_item: "",
    cons_sub_unit: "",
  });

  // Input change handler for native inputs
  const onInputChangeN = (name, value) => {
    setConsumptionDownload({
      ...receiptsdwn,
      [name]: value,
    });
  };

  const onInputChange = (e) => {
    setConsumptionDownload({
      ...receiptsdwn,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler for download
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      cons_from_date: receiptsdwn.cons_from_date,
      cons_to_date: receiptsdwn.cons_to_date,
      cons_sub_item: receiptsdwn.cons_sub_item,
      cons_sub_unit: receiptsdwn.cons_sub_unit,
    };

    if (document.getElementById("dowRecp").reportValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/download-consumption",
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
          link.setAttribute("download", "consumption_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Consumption is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Consumption is Not Downloaded");
          console.error("Download error:", err.response);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  // Fetch item data
  const [item, setItem] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    fetch(BaseUrl + "/fetch-item", requestOptions)
      .then((response) => response.json())
      .then((data) => setItem(data.item));
  }, []);

  return (
    <Layout>
      <DownloadCommon />
      <ToastContainer />
      <div className="mt-4 mb-6">
        <PageTitle title={"Download Consumption"} />
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
                name="cons_from_date"
                className="required"
                value={receiptsdwn.cons_from_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Input
                required
                type="date"
                label="To Date"
                className="required"
                name="cons_to_date"
                value={receiptsdwn.cons_to_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Dropdown
                label="Item"
                className="required"
                name="cons_sub_item"
                value={receiptsdwn.cons_sub_item}
                options={item.map((item) => ({
                  value: item.item_name,
                  label: item.item_name,
                }))}
                onChange={(value) => onInputChangeN("cons_sub_item", value)}
              />
            </div>

            <div className="w-full">
              <Dropdown
                label="Unit"
                className="required"
                name="cons_sub_unit"
                value={receiptsdwn.cons_sub_unit}
                options={unit.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) => onInputChangeN("cons_sub_unit", value)}
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

export default DowloadConsumption;
