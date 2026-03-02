import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/adminLayout";
import api from "../../utils/api";
import {
  FiUsers,
  FiDollarSign,
  FiCheckCircle,
  FiTrendingUp,
  FiCalendar,
  FiPackage,
  FiShoppingBag,
  FiMapPin,
  FiRefreshCw,
  FiActivity,
  FiBarChart2,
  FiCreditCard,
  FiUserCheck,
  FiUserX,
  FiDownload,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Dashboard = () => {
  return (
    <AdminLayout>
      <h1>ADMIN DASHBOARD</h1>
    </AdminLayout>
  );
};

export default Dashboard;
