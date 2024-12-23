import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import WebDonation from "./pages/WebDonation/WebDonation";
import DonorList from "./pages/DonorList/DonorList";
import OpenListEnquiry from "./pages/Master/ListItem/List Item";
import PurchaseList from "./pages/Stock/Purchase/PurchaseList";
import RecepitCashRecepit from "./pages/Recepits/CashRecepits/CashRecepit";
import PendingListTask from "./pages/Reports/StockReport";
import EnquiryDownload from "./pages/download/EnquiryDownload";
import VendorList from "./pages/Master/Vendors List/VendorList";
import Consumption from "./pages/Stock/Consumption/consumption";
import MaterialRecepits from "./pages/Recepits/MaterialRecepits/MaterialRecepits";
import Donor from "./pages/Dowloads/Donor/Donor";
import Students from "./pages/Dowloads/Purchase/CashPurchase";
import Cash from "./pages/Dowloads/Delivery/Cash";
import Exam from "./pages/Dowloads/MaterialReceipts/MaterialReceipts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEnquiry from "./pages/Master/ListItem/AddItem";
import EditList from "./pages/Master/ListItem/EditList";
import AddVendors from "./pages/Master/Vendors List/AddVendors";
import EditVendors from "./pages/Master/Vendors List/EditVendors";
import AddPurchase from "./pages/Stock/Purchase/AddPurchase";
import EditPurchase from "./pages/Stock/Purchase/EditPurchase";
import AddConsumption from "./pages/Stock/Consumption/Addconsumption";
import EditConsumption from "./pages/Stock/Consumption/EditConsumption";
import Stock from "./pages/Stock/StockList/StockList";
import EditRecepit from "./pages/Recepits/CashRecepits/EditRecepits";
import ViewCashRecepit from "./pages/Recepits/CashRecepits/ViewRecepit";
import EditMaterial from "././pages/Recepits/MaterialRecepits/EditMaterial";
import ViewMaterial from "./pages/Recepits/MaterialRecepits/ViewMaterial";
import ViewStockSummary from "./pages/Reports/ViewStockSummary";
import DowloadConsumption from "./pages/Dowloads/Consumption/DowloadConsumption";
import DownloadWebDonation from "./pages/Dowloads/WebDonation/DownloadWebDonation";
import AddDonorList from "./pages/DonorList/AddDonorList";
import EditDonorList from "./pages/DonorList/EditDonorList";
import CreateDonor from "./pages/DonorList/CreateDonorMaterialRecepit";
import CreateDonorRecepit from "./pages/DonorList/CreateDonorCashRecepit";
import ViewDonorDetails from "./pages/DonorList/ViewDonorDetails";
import DonorReceiptsDetails from "./pages/DonorList/DonorReceiptsDetails";
import FamilyList from "./pages/DonorList/FamilyMembers/FamilyList";
import AddFamilyMembers from "./pages/DonorList/FamilyMembers/AddFamilyMembers";
import DonationSummary from "./pages/Reports/DonationSummary/DonationSummary";
import DonationSummaryView from "./pages/Reports/DonationSummary/DonationSummaryView";
import DuplicateDonorList from "./pages/DonorList/Duplicate/DuplicateDonorList";
import ListOccasion from "./pages/Master/Occasion/Listoccasion";
import AddOccasion from "./pages/Master/Occasion/Addoccasion";
import EditOccasion from "./pages/Master/Occasion/Editoccasion";
import EditDuplicate from "./pages/DonorList/Duplicate/EditDuplicate";
import Test from "./pages/test";
import MaterialRecepitAll from "./pages/DonorList/MaterialRecepitAll";
import CashRecepitAll from "./pages/DonorList/CashRecepitAll";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        {/* <Route path="/enquiry-now" element={<EnquiryNow />} /> */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/donor-list" element={<DonorList />} />
        <Route path="/add-donor/:id?" element={<AddDonorList />} />
        <Route path="/edit-donor/:id" element={<EditDonorList />} />
        <Route path="/create-donor/:id" element={<CreateDonor />} />
        <Route path="/create-family/:id" element={<FamilyList />} />
        <Route path="/add-family" element={<AddFamilyMembers />} />
        <Route path="/duplicate" element={<DuplicateDonorList />} />
        <Route path="/edit-duplicate/:id" element={<EditDuplicate />} />
        <Route
          path="/createrecepit-donor/:id?"
          element={<CreateDonorRecepit />}
        />
        <Route path="/cashrecepitall/:id?" element={<CashRecepitAll />} />
        <Route path="/materialrecepitall" element={<MaterialRecepitAll />} />
        <Route path="/viewdonor-list/:id" element={<ViewDonorDetails />} />
        <Route
          path="/recepitdonor-list/:id"
          element={<DonorReceiptsDetails />}
        />
        {/* MASTER  */}
        <Route path="/master-list" element={<OpenListEnquiry />} />
        <Route path="/add-enquiry" element={<AddEnquiry />} />
        <Route path="/edit-enquiry/:id" element={<EditList />} />
        <Route path="/occasion" element={<ListOccasion />} />
        <Route path="/add-occasion" element={<AddOccasion />} />
        <Route path="/edit-occasion/:id" element={<EditOccasion />} />
        <Route path="/addVendor" element={<AddVendors />} />
        <Route path="/purchase" element={<PurchaseList />} />
        <Route path="/consumption" element={<Consumption />} />
        <Route path="/cashrecepit" element={<RecepitCashRecepit />} />
        <Route path="recepit-material" element={<MaterialRecepits />} />
        {/* Reports  */}
        <Route path="/stock-summary" element={<PendingListTask />} />
        <Route path="/d-summary" element={<DonationSummary />} />
        <Route path="/d-summary-view" element={<DonationSummaryView />} />
        <Route path="/view-stock" element={<ViewStockSummary />} />
        <Route path="/download-enquiry" element={<EnquiryDownload />} />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />
        {/* Download  */}
        <Route path="/donor" element={<ProtectedRoute element={<Donor />} />} />
        <Route
          path="/cashpurchase"
          element={<ProtectedRoute element={<Students />} />}
        />
        <Route path="/cash" element={<ProtectedRoute element={<Cash />} />} />
        <Route
          path="/M-recepit"
          element={<ProtectedRoute element={<Exam />} />}
        />
        <Route
          path="/D-consumption"
          element={<ProtectedRoute element={<DowloadConsumption />} />}
        />
        {/* ///NEW  */}
        <Route
          path="/VendorList"
          element={<ProtectedRoute element={<VendorList />} />}
        />
        <Route
          path="/EditVendors/:id"
          element={<ProtectedRoute element={<EditVendors />} />}
        />
        <Route
          path="/add-purchase"
          element={<ProtectedRoute element={<AddPurchase />} />}
        />
        <Route
          path="/edit-purchase/:id"
          element={<ProtectedRoute element={<EditPurchase />} />}
        />
        <Route
          path="/add-consumption"
          element={<ProtectedRoute element={<AddConsumption />} />}
        />
        <Route
          path="/edit-consumption/:id"
          element={<ProtectedRoute element={<EditConsumption />} />}
        />
        {/* //STOCK */}
        <Route path="/stock" element={<ProtectedRoute element={<Stock />} />} />
        <Route
          path="/recepit-edit/:id"
          element={<ProtectedRoute element={<EditRecepit />} />}
        />
        <Route
          path="/recepit-view/:id"
          element={<ProtectedRoute element={<ViewCashRecepit />} />}
        />
        {/* //MATERIAL Recepits */}
        <Route
          path="/material-edit/:id"
          element={<ProtectedRoute element={<EditMaterial />} />}
        />
        <Route
          path="/material-view/:id"
          element={<ProtectedRoute element={<ViewMaterial />} />}
        />
        //DOWLOAD
        <Route
          path="/web-donation"
          element={<ProtectedRoute element={<DownloadWebDonation />} />}
        />
        <Route path="/webdonation" element={<WebDonation />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
};

export default App;
