import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiBookOpen,
  FiEdit,
} from "react-icons/fi";
import { MdOutlineSchool, MdOutlineWorkspacePremium } from "react-icons/md";
import { FaGraduationCap, FaUniversity, FaUserGraduate } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ViewDetails = ({ isOpen, onClose, user }) => {
  console.log("users", user);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusMap = {
      verified:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      rejected: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
      submitted: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      pending: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      success:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      failed: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
      active: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      inactive: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
      under_review: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
      approved:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    };
    return (
      statusMap[status?.toLowerCase()] ||
      "bg-amber-500/20 text-amber-300 border border-amber-500/30"
    );
  };

  const handleUpdate = async (field) => {
    try {
      let payload = { [field]: editValue };

      // 🔥 RESET DEGREE IF PRE MATRIC
      if (field === "educationLevel" && editValue === "Pre Matric") {
        payload.degreeLevel = null;
      }

      await api.put(`/admin/user/${user._id}`, payload);

      toast.success("Updated successfully");
      setEditingField(null);
      window.location.reload();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full border border-white/20 shadow-2xl my-8 pointer-events-auto overflow-hidden">
              {/* Header with gradient */}
              <div className="p-6 border-b border-white/20 sticky top-0 bg-slate-800 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <FaUserGraduate className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent flex items-start">
                        User Details
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Complete information about the user
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                  >
                    <FiX className="text-slate-400" size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Basic Information */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <FiUser className="text-amber-400" size={18} />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* FULL NAME */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-400">Full Name</p>
                        <FiEdit
                          className="cursor-pointer text-slate-400 hover:text-white"
                          size={14}
                          onClick={() => {
                            setEditingField("fullName");
                            setEditValue(user.fullName);
                          }}
                        />
                      </div>

                      {editingField === "fullName" ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-800 text-white px-2 py-1 rounded w-full text-sm"
                          />
                          <button
                            className="text-emerald-400"
                            onClick={() => handleUpdate("fullName")}
                          >
                            ✔
                          </button>
                        </div>
                      ) : (
                        <p className="text-white font-medium mt-1">
                          {user.fullName}
                        </p>
                      )}
                    </div>

                    {/* USER ID */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <p className="text-sm text-slate-400">User ID</p>
                      <p className="text-white font-medium mt-1">
                        {user.userId}
                      </p>
                    </div>

                    {/* EMAIL */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-400">Email</p>
                        <FiEdit
                          className="cursor-pointer text-slate-400 hover:text-white"
                          size={14}
                          onClick={() => {
                            setEditingField("email");
                            setEditValue(user.email);
                          }}
                        />
                      </div>

                      {editingField === "email" ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-800 text-white px-2 py-1 rounded w-full text-sm"
                          />
                          <button
                            className="text-emerald-400"
                            onClick={() => handleUpdate("email")}
                          >
                            ✔
                          </button>
                        </div>
                      ) : (
                        <p className="text-white font-medium mt-1 break-all">
                          {user.email}
                        </p>
                      )}
                    </div>

                    {/* PHONE */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-400">Phone</p>
                        <FiEdit
                          className="cursor-pointer text-slate-400 hover:text-white"
                          size={14}
                          onClick={() => {
                            setEditingField("phone");
                            setEditValue(user.phone);
                          }}
                        />
                      </div>

                      {editingField === "phone" ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-800 text-white px-2 py-1 rounded w-full text-sm"
                          />
                          <button
                            className="text-emerald-400"
                            onClick={() => handleUpdate("phone")}
                          >
                            ✔
                          </button>
                        </div>
                      ) : (
                        <p className="text-white font-medium mt-1">
                          {user.phone}
                        </p>
                      )}
                    </div>

                    {/* EDUCATION LEVEL */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-400">
                          Education Level
                        </p>
                        <FiEdit
                          className="cursor-pointer text-slate-400 hover:text-white"
                          size={14}
                          onClick={() => {
                            setEditingField("educationLevel");
                            setEditValue(user.educationLevel);
                          }}
                        />
                      </div>

                      {editingField === "educationLevel" ? (
                        <div className="flex gap-2 mt-1">
                          <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-800 text-white px-2 py-1 rounded w-full text-sm"
                          >
                            <option value="Pre Matric">Pre Matric</option>
                            <option value="Post Matric">Post Matric</option>
                          </select>

                          <button
                            className="text-emerald-400"
                            onClick={() => handleUpdate("educationLevel")}
                          >
                            ✔
                          </button>
                        </div>
                      ) : (
                        <p className="text-white font-medium mt-1">
                          {user.educationLevel || "N/A"}
                        </p>
                      )}
                    </div>

                    {/* DEGREE LEVEL */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-400">Degree Level</p>
                        <FiEdit
                          className="cursor-pointer text-slate-400 hover:text-white"
                          size={14}
                          onClick={() => {
                            setEditingField("degreeLevel");
                            setEditValue(user.degreeLevel);
                          }}
                        />
                      </div>

                      {editingField === "degreeLevel" ? (
                        user.educationLevel === "Post Matric" ? (
                          <div className="flex gap-2 mt-1">
                            <select
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="bg-slate-800 text-white px-2 py-1 rounded w-full text-sm"
                            >
                              <option value="Undergraduate">
                                Undergraduate
                              </option>
                              <option value="Postgraduate">Postgraduate</option>
                              <option value="PhD">PhD</option>
                            </select>

                            <button
                              className="text-emerald-400"
                              onClick={() => handleUpdate("degreeLevel")}
                            >
                              ✔
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1">
                            Not applicable (Pre Matric)
                          </p>
                        )
                      ) : (
                        <p className="text-white font-medium mt-1">
                          {user.degreeLevel || "N/A"}
                        </p>
                      )}
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <p className="text-sm text-slate-400">Status</p>

                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusBadge(
                            user.isActive ? "active" : "inactive",
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-400" : "bg-rose-400"
                            }`}
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* REGISTERED */}
                    <div className="flex flex-col justify-between min-h-[65px]">
                      <p className="text-sm text-slate-400">Registered On</p>
                      <p className="text-white font-medium mt-1">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <FiFileText className="text-violet-400" size={18} />
                    Applications ({user.applications?.length || 0})
                  </h3>
                  {user.applications?.length > 0 ? (
                    <div className="space-y-3">
                      {user.applications.map((app, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-start gap-2">
                                <FiAward
                                  className="text-amber-400 mt-0.5 flex-shrink-0"
                                  size={16}
                                />
                                <div>
                                  <p className="text-white font-medium break-words">
                                    {app.scholarshipName || "N/A"}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1 flex items-start">
                                    Applied: {formatDate(app.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* <span
                              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap self-start ${getStatusBadge(
                                app.status,
                              )}`}
                            >
                              {app.status || "submitted"}
                            </span> */}
                            <select
                              value={app.status || "submitted"}
                              onChange={async (e) => {
                                const newStatus = e.target.value;

                                try {
                                  const res = await api.put(
                                    `/admin/application/${app._id}/status`,
                                    { status: newStatus },
                                  );

                                  toast.success(
                                    res.data.message ||
                                      "Application status updated",
                                  );

                                  // 🔥 SIMPLE REFRESH (same as your docs)
                                  window.location.reload();
                                } catch (err) {
                                  toast.error(
                                    "Failed to update application status",
                                  );
                                }
                              }}
                              className={`px-2 py-1 rounded-full text-xs border cursor-pointer ${getStatusBadge(
                                app.status,
                              )}`}
                            >
                              <option value="submitted">Submitted</option>
                              <option value="under_review">Under Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiFileText className="text-4xl text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        No applications yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Documents (Scholarship-wise Required vs Uploaded) */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <FiFileText className="text-blue-400" size={18} />
                    Documents Status
                  </h3>

                  {user.applications?.length > 0 ? (
                    user.applications.map((app, idx) => {
                      // 🔥 ALL uploaded document names
                      const uploadedDocs =
                        user.documents?.map((d) => d.document?.documentName) ||
                        [];

                      return (
                        <div key={idx} className="mb-6">
                          {/* Scholarship Name */}
                          <p className="text-white font-semibold mb-3">
                            {app.scholarshipName}
                          </p>

                          {/* Required Documents */}
                          <div className="space-y-2">
                            {app.requiredDocuments?.length > 0 ? (
                              app.requiredDocuments.map((reqDoc, i) => {
                                const uploadedDoc = user.documents?.find(
                                  (d) =>
                                    d.document?.documentName === reqDoc.title,
                                );

                                const isUploaded = !!uploadedDoc;
                                const verificationStatus =
                                  uploadedDoc?.document?.verificationStatus ||
                                  "missing";

                                return (
                                  <div
                                    key={i}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white/5 px-3 py-3 rounded-lg border border-white/10"
                                  >
                                    {/* LEFT SIDE */}
                                    <div className="flex-1">
                                      <p className="text-sm text-white font-medium flex items-start">
                                        {reqDoc.title}
                                      </p>

                                      {isUploaded && (
                                        <p className="text-xs text-slate-400 mt-1 flex items-start">
                                          Uploaded:{" "}
                                          {formatDate(uploadedDoc.uploadedAt)}
                                        </p>
                                      )}
                                    </div>

                                    {/* RIGHT SIDE */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {/* Upload Status */}
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          isUploaded
                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                        }`}
                                      >
                                        {isUploaded ? "Uploaded" : "Missing"}
                                      </span>

                                      {isUploaded && (
                                        <select
                                          value={verificationStatus}
                                          onChange={async (e) => {
                                            const newStatus = e.target.value;

                                            try {
                                              await api.put(
                                                `/admin/document/${uploadedDoc._id}/status`,
                                                { status: newStatus },
                                              );

                                              toast.success(
                                                "Document status updated",
                                              );

                                              window.location.reload();
                                            } catch (err) {
                                              toast.error(
                                                "Failed to update status",
                                              );
                                            }
                                          }}
                                          className={`px-2 py-1 rounded-full text-xs border cursor-pointer ${getStatusBadge(
                                            verificationStatus,
                                          )}`}
                                        >
                                          <option value="pending">
                                            Pending
                                          </option>
                                          <option value="verified">
                                            Verified
                                          </option>
                                          <option value="rejected">
                                            Rejected
                                          </option>
                                        </select>
                                      )}

                                      {/* View File */}
                                      {uploadedDoc?.fileUrl && (
                                        <a
                                          href={uploadedDoc.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                                        >
                                          <FiFileText size={12} />
                                          View
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-slate-400 text-sm">
                                No required documents defined
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <FiFileText className="text-4xl text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        No applications found
                      </p>
                    </div>
                  )}
                </div>

                {/* Membership Subscription */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <MdOutlineWorkspacePremium
                      className="text-yellow-400"
                      size={18}
                    />
                    Membership Plan
                  </h3>

                  {user.subscription ? (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {user.subscription.planTitle}
                        </p>
                        <p className="text-sm text-slate-400 mt-1 flex items-start">
                          Duration: {user.subscription.planDuration} days
                        </p>
                        <p className="text-sm text-slate-400 flex items-start">
                          Start: {formatDate(user.subscription.startDate)}
                        </p>
                        <p className="text-sm text-slate-400 flex items-start">
                          Expiry: {formatDate(user.subscription.expiryDate)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">
                          ₹{user.subscription.planAmount}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(
                            user.subscription.status,
                          )}`}
                        >
                          {user.subscription.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      No active subscription
                    </p>
                  )}
                </div>

                {/* Payments */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-emerald-400" size={18} />
                    Payments ({user.payments?.length || 0})
                  </h3>
                  {user.payments?.length > 0 ? (
                    <div className="space-y-3">
                      {user.payments.map((payment, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-white font-medium">
                                  {formatCurrency(payment.amount)}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-2">
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <FiClock
                                    size={12}
                                    className="flex-shrink-0"
                                  />
                                  <span>
                                    Date: {formatDate(payment.createdAt)}
                                  </span>
                                </div>
                                {/* <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <FiAward
                                    size={12}
                                    className="flex-shrink-0"
                                  />
                                  <span>
                                    Plan: {payment.plan?.planTitle || "N/A"}
                                  </span>
                                </div> */}
                              </div>
                              <p className="text-xs text-slate-400 mt-2 break-all flex items-start">
                                Razorpay Payment Id: {payment.razorpayOrderId}
                              </p>
                              {payment.paymentType === "upgrade" &&
                                user.subscription?.upgradeHistory?.length > 0 &&
                                (() => {
                                  const upgrade =
                                    user.subscription.upgradeHistory.find(
                                      (u) => u.paidAmount === payment.amount,
                                    );

                                  if (!upgrade) return null;

                                  return (
                                    <div className="mt-2">
                                      <p className="text-xs text-amber-400 font-medium">
                                        Upgrade: {upgrade.fromPlanTitle} →{" "}
                                        {upgrade.toPlanTitle}
                                      </p>
                                    </div>
                                  );
                                })()}
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap self-start ${getStatusBadge(
                                payment.status,
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiDollarSign className="text-4xl text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No payments yet</p>
                    </div>
                  )}
                </div>

                {/* Documents */}
                {/* {user.documents?.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FiFileText className="text-blue-400" size={18} />
                      Documents ({user.documents.length})
                    </h3>
                    <div className="space-y-3">
                      {user.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <p className="text-white font-medium break-words flex items-start">
                                {doc.document?.documentName || "Document"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <FiCalendar className="text-slate-400 text-xs flex-shrink-0 flex items-start" />
                                <p className="text-xs text-slate-400">
                                  Uploaded: {formatDate(doc.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusBadge(
                                  doc.document?.verificationStatus,
                                )}`}
                              >
                                {doc.document?.verificationStatus || "pending"}
                              </span>
                              {doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FiFileText size={12} />
                                  View Document →
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewDetails;
