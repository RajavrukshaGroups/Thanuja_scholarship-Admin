import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/layout/adminLayout";
import api from "../../utils/api";
const ViewPayments = () => {
  return (
    <>
      <AdminLayout>
        <h1>View Payment Details</h1>
      </AdminLayout>
    </>
  );
};

export default ViewPayments;
