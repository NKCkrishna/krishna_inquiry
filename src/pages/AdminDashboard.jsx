
import { useState } from "react";
import { useInquiry } from "../context/InquiryContext";
import Header from "../components/Header";
import AdminInquiryList from "../components/AdminInquiryList";
import InquiryDetail from "../components/InquiryDetail";
import InquiryStatusManager from "../components/InquiryStatusManager";

export default function AdminDashboard() {
  const { inquiries, updateInquiry, deleteInquiry } = useInquiry();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInquirySelect = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const handleStatusUpdate = (inquiryId, newStatus) => {
    updateInquiry(inquiryId, { status: newStatus, updatedAt: new Date().toISOString() });
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleDelete = (inquiryId) => {
    deleteInquiry(inquiryId);
    setSelectedInquiry(null);
  };

  const filteredInquiries = inquiries
    .filter((inq) => (filter === "all" ? true : inq.status === filter))
    .filter((inq) =>
      searchTerm
        ? inq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inq.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={true} />
      <main className="container px-4 mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className={`md:col-span-4 ${selectedInquiry ? "hidden md:block" : ""}`}>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <AdminInquiryList
                inquiries={filteredInquiries}
                onSelectInquiry={handleInquirySelect}
                selectedInquiryId={selectedInquiry?.id}
              />
            </div>
          </div>
          <div className={`md:col-span-8 ${!selectedInquiry ? "hidden md:block" : ""}`}>
            <div className="p-4 bg-white rounded-lg shadow">
              {selectedInquiry ? (
                <>
                  <button onClick={() => setSelectedInquiry(null)} className="mb-2 text-gray-600 hover:text-gray-900 md:hidden">
                    ← Back
                  </button>
                  <InquiryStatusManager inquiry={selectedInquiry} onStatusUpdate={handleStatusUpdate} />
                  <InquiryDetail inquiry={selectedInquiry} />
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Inquiry
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-gray-600">Select an inquiry to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
