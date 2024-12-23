// import Layout from "../../../layout/Layout";
// import { Card, Button } from "@material-tailwind/react";
// import { LuDownload } from "react-icons/lu";
// import { MdEmail, MdKeyboardBackspace } from "react-icons/md";
// import { IoIosPrint } from "react-icons/io";
// import { BaseUrl } from "../../../base/BaseUrl";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import { FaWhatsapp } from "react-icons/fa";

// function ViewMaterialRecepit() {
//   const [receipts, setReceipts] = useState(null);
//   const [company, setCompany] = useState({});
//   const [donor, setDonor] = useState(null);
//   const [recepitsub, setRecepitsub] = useState(null);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios({
//       url: `${BaseUrl}/fetch-m-receipt-by-id/${id}`,
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     })
//       .then((res) => {
//         setReceipts(res?.data?.receipts || {});
//         setCompany(res?.data?.company || {});
//         setDonor(res?.data?.donor);
//         setRecepitsub(res?.data?.receiptSub || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching receipt data:", error);
//       });
//   }, [id]);

//   const downloadReceipt = (e) => {
//     e.preventDefault();
//     let check = (window.location.href = BaseUrl + "/download-receiptsm/" + id);
//     if (check) {
//       toast.success("Receipt Downloaded Successfully");
//     } else {
//       toast.error("Receipt Not Downloaded");
//     }
//   };

//   const sendEmail = (e) => {
//     e.preventDefault();
//     axios({
//       url: BaseUrl + "/send-receiptm/" + id,
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }).then((res) => {
//       toast.success("Email Sent Successfully");
//     });
//   };

//   const printReceipt = (e) => {
//     e.preventDefault();
//     axios({
//       url: BaseUrl + "/print-receiptm/" + id,
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }).then((res) => {
//       window.open(BaseUrl + "/print-receiptm/" + id, "_blank");
//     });
//   };

//   const whatsApp = (e) => {
//     e.preventDefault();
//     const phoneNumber = donor.donor_whatsapp;
//     const message = "Hello!";
//     const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
//       message
//     )}`;
//     window.open(whatsappLink, "_blank");
//   };

//   return (
//     <Layout>
//       <ToastContainer />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-2 bg-white rounded-lg">
//         <div className="flex flex-row justify-start items-center p-2">
//           <MdKeyboardBackspace
//             className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
//             onClick={() => navigate("/recepit-material")}
//           />
//           <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
//             Material Receipt
//           </h1>
//         </div>
//         <div
//           className="flex justify-end "
//           onClick={() => {
//             navigate("/donor-list");
//           }}
//         >
//           <Button color="red">Add New Recepit</Button>
//         </div>
//       </div>
//       {receipts && (
//         <div>
//           <div className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-4 md:space-y-0 md:space-x-4">
//             <Button
//               variant="text"
//               className="flex items-center space-x-2"
//               onClick={downloadReceipt}
//               style={{
//                 display:
//                   localStorage.getItem("user_type_id") == 4 ? "none" : "",
//               }}
//             >
//               <LuDownload className="text-lg" />
//               <span>Download</span>
//             </Button>

//             <Button
//               variant="text"
//               className="flex items-center space-x-2"
//               onClick={whatsApp}
//               style={{
//                 display:
//                   localStorage.getItem("user_type_id") == 4 ? "none" : "",
//               }}
//             >
//               <FaWhatsapp className="text-lg text-green-400" />
//               <span className="text-green-400">Whatsapp</span>
//             </Button>

//             {/* Email Section */}
//             <div className=" p-4">
//               {donor !== null &&
//                 typeof donor !== "undefined" &&
//                 donor.donor_email !== null && (
//                   <a>
//                     <Button
//                       variant="text"
//                       className="flex items-center bg-green-400"
//                       onClick={sendEmail}
//                     >
//                       <MdEmail className="text-lg" />
//                       <span>Email</span>
//                     </Button>
//                     {receipts?.receipt_email_count == null ? (
//                       <small style={{ fontSize: "10px" }}>
//                         Email Sent 0 Times
//                       </small>
//                     ) : (
//                       <small style={{ fontSize: "10px" }}>
//                         Email Sent {receipts.receipt_email_count} Times
//                       </small>
//                     )}
//                   </a>
//                 )}

//               {/* {receipts !== null &&
//                 typeof donor !== "undefined" &&
//                 donor.donor_email == null && (
//                   <p style={{ color: "red" }}>
//                     <i className="mr-10 ti-email"></i> Email not found
//                   </p>
//                 )} */}
//               {receipts !== null &&
//                 donor !== null && // Ensure donor is not null
//                 donor.donor_email === null && ( // Now it's safe to access donor.donor_email
//                   <p style={{ color: "red" }}>
//                     <i className="mr-10 ti-email"></i> Email not found
//                   </p>
//                 )}
//             </div>

//             <Button
//               variant="text"
//               className="flex items-center space-x-2"
//               onClick={printReceipt}
//             >
//               <IoIosPrint className="text-lg" />
//               <span>Print Receipt</span>
//             </Button>
//           </div>

//           <hr></hr>

//           <div className="flex justify-center mt-2">
//             <Card className="p-4 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
//               <div className="border border-black">
//                 <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
//                   <div className="border-b border-r border-black px-4 py-2 flex items-center">
//                     <strong>Receipt No:</strong>
//                     <p className="text-black font-bold text-sm ml-2">
//                       {receipts.m_receipt_no}
//                     </p>
//                   </div>
//                   <div className="border-b border-black px-4 py-2 flex items-center">
//                     <strong>Date:</strong>
//                     <p className="text-black font-bold text-sm ml-2">
//                       {new Date(receipts.m_receipt_date).toLocaleDateString()}{" "}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
//                   <strong>Received with thanks from:</strong>
//                   <p className="text-black font-bold text-sm ml-2">
//                     {donor?.donor_title} {donor?.donor_full_name},{" "}
//                     {donor?.donor_city} - {donor?.donor_pin_code},{" "}
//                     {donor?.donor_state}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
//                   <div className="border-b border-r border-black px-4 py-2 flex items-center">
//                     <strong>Vehicle :</strong>
//                     <p className="text-black font-bold text-sm ml-2">
//                       {receipts.m_receipt_vehicle_no}{" "}
//                     </p>
//                   </div>
//                   <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
//                     <strong>Occasion of:</strong>
//                     <p className="text-black font-bold text-sm ml-2">
//                       {receipts.m_receipt_occasional}{" "}
//                     </p>
//                   </div>
//                 </div>

//                 {/* <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
//                   <strong>In Account of:</strong>
//                   <p className="text-black font-bold text-sm ml-2">
//                     {recepitsub[0]?.purchase_sub_item} -{" "}
//                     {recepitsub[0]?.purchase_sub_qnty}
//                     {recepitsub[0]?.purchase_sub_unit}
//                   </p>
//                 </div> */}

//                 <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
//                   <strong>On Account of:</strong>
//                   {recepitsub.map((item, index) => (
//                     <div key={index} className="flex items-center">
//                       <p className="text-black font-bold text-sm ml-2">
//                         {item.purchase_sub_item} - {item.purchase_sub_qnty},
//                         {item.purchase_sub_unit},
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
//                   <div className=" border-black px-4 py-2 flex items-center">
//                     <strong>Donor Sign:</strong>
//                     <p className="text-black font-bold text-sm ml-2">
//                       ({donor?.donor_title} {donor?.donor_full_name})
//                     </p>
//                   </div>
//                   <div className=" border-black px-4 py-2 flex items-center">
//                     <strong>Receiver Sign:</strong>
//                     <p className="text-black font-bold text-sm ml-2">
//                       ({company?.company_authsign})
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

// export default ViewMaterialRecepit;
import Layout from "../../../layout/Layout";
import { Card, Button } from "@material-tailwind/react";
import { LuDownload } from "react-icons/lu";
import { MdEmail, MdKeyboardBackspace } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { BaseUrl } from "../../../base/BaseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";

function ViewMaterialRecepit() {
  const [receipts, setReceipts] = useState(null);
  const [company, setCompany] = useState({});
  const [donor, setDonor] = useState(null);
  const [recepitsub, setRecepitsub] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    axios({
      url: `${BaseUrl}/fetch-m-receipt-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setReceipts(res?.data?.receipts || {});
        setCompany(res?.data?.company || {});
        setDonor(res?.data?.donor || {});
        setRecepitsub(res?.data?.receiptSub || []);
      })
      .catch((error) => {
        console.error("Error fetching receipt data:", error);
        toast.error("Failed to fetch receipt data.");
      });
  }, [id]);

  // Handle receipt download
  const downloadReceipt = (e) => {
    e.preventDefault();
    const downloadUrl = BaseUrl + "/download-receiptsm/" + id;
    window.location.href = downloadUrl;
    toast.success("Receipt Downloaded Successfully");
  };

  // Handle sending email
  const sendEmail = (e) => {
    e.preventDefault();
    axios({
      url: BaseUrl + "/send-receiptm/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        toast.success("Email Sent Successfully");
      })
      .catch(() => {
        toast.error("Failed to send email.");
      });
  };

  // Handle printing receipt
  const printReceipt = (e) => {
    e.preventDefault();
    window.open(BaseUrl + "/print-receiptm/" + id, "_blank");
  };

  // Handle WhatsApp link
  const whatsApp = (e) => {
    e.preventDefault();
    if (donor?.donor_whatsapp) {
      const phoneNumber = donor.donor_whatsapp;
      const message = "Hello!";
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappLink, "_blank");
    } else {
      toast.error("Donor's WhatsApp number is not available.");
    }
  };

  // const whatsApp = (e) => {
  //   e.preventDefault();
  //   const phoneNumber = donor.donor_whatsapp;
  //   const message = "Hello!";
  //   const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  //     message
  //   )}`;
  //   window.open(whatsappLink, "_blank");
  // };

  return (
    <Layout>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-2 bg-white rounded-lg">
        <div className="flex flex-row justify-start items-center p-2">
          <MdKeyboardBackspace
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            onClick={() => navigate("/recepit-material")}
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Material Receipt
          </h1>
        </div>
        <div className="flex justify-end space-x-3">
          <div
            className="flex justify-end"
            onClick={() => navigate("/materialrecepitall")}
          >
            <Button color="red">Create Recepit</Button>
          </div>
          <div
            className="flex justify-end"
            onClick={() => navigate("/donor-list")}
          >
            <Button color="red">Donor List</Button>
          </div>
        </div>
      </div>

      {receipts && (
        <div>
          <div className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Download Receipt */}
            <Button
              variant="text"
              className="flex items-center space-x-2"
              onClick={downloadReceipt}
              style={{
                display:
                  localStorage.getItem("user_type_id") === "4" ? "none" : "",
              }}
            >
              <LuDownload className="text-lg" />
              <span>Download</span>
            </Button>

            {/* WhatsApp Link */}
            <Button
              variant="text"
              className="flex items-center space-x-2"
              onClick={whatsApp}
              style={{
                display:
                  localStorage.getItem("user_type_id") === "4" ? "none" : "",
              }}
            >
              <FaWhatsapp className="text-lg text-green-400" />
              <span className="text-green-400">WhatsApp</span>
            </Button>

            {/* Email Section */}
            {donor?.donor_email ? (
              <div className="p-4">
                <Button
                  variant="text"
                  className="flex items-center bg-green-400"
                  onClick={sendEmail}
                >
                  <MdEmail className="text-lg" />
                  <span>Email</span>
                </Button>
                {receipts?.receipt_email_count == null ? (
                  <small style={{ fontSize: "10px" }}>Email Sent 0 Times</small>
                ) : (
                  <small style={{ fontSize: "10px" }}>
                    Email Sent {receipts.receipt_email_count} Times
                  </small>
                )}
              </div>
            ) : (
              <p style={{ color: "red" }}>
                <i className="mr-10 ti-email"></i> Email not found
              </p>
            )}

            {/* Print Receipt */}
            <Button
              variant="text"
              className="flex items-center space-x-2"
              onClick={printReceipt}
            >
              <IoIosPrint className="text-lg" />
              <span>Print Receipt</span>
            </Button>
          </div>

          <hr />

          {/* Receipt Details */}
          <div className="flex justify-center mt-2">
            <Card className="p-4 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
              <div className="border border-black">
                <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
                  <div className="border-b border-r border-black px-4 py-2 flex items-center">
                    <strong>Receipt No:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {receipts.m_receipt_no}
                    </p>
                  </div>
                  <div className="border-b border-black px-4 py-2 flex items-center">
                    <strong>Date:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {new Date(receipts.m_receipt_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                  <strong>Received with thanks from:</strong>
                  <p className="text-black font-bold text-sm ml-2">
                    {donor?.donor_title} {donor?.donor_full_name},{" "}
                    {donor?.donor_city} - {donor?.donor_pin_code},{" "}
                    {donor?.donor_state}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
                  <div className="border-b border-r border-black px-4 py-2 flex items-center">
                    <strong>Vehicle:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {receipts.m_receipt_vehicle_no}
                    </p>
                  </div>
                  <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                    <strong>Occasion of:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {receipts.m_receipt_occasional}
                    </p>
                  </div>
                </div>

                <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                  <strong>On Account of:</strong>
                  {recepitsub.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <p className="text-black font-bold text-sm ml-2">
                        {item.purchase_sub_item} - {item.purchase_sub_qnty},{" "}
                        {item.purchase_sub_unit}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
                  <div className="border-black px-4 py-2 flex items-center">
                    <strong>Donor Sign:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      ({donor?.donor_title} {donor?.donor_full_name})
                    </p>
                  </div>
                  <div className="border-black px-4 py-2 flex items-center">
                    <strong>Receiver Sign:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      ({company?.company_authsign})
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ViewMaterialRecepit;
