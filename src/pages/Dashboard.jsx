import { useState } from "react";
import { useInquiry } from "../context/InquiryContext";
import InquiryForm from "../components/InquiryForm";
import InquiryList from "../components/InquiryList";
import InquiryDetail from "../components/InquiryDetail";
import Header from "../components/Header";

export default function Dashboard() {
  const { inquiries, addInquiry } = useInquiry();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInquirySelect = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsFormOpen(false);
  };

  const handleNewInquiry = () => {
    setSelectedInquiry(null);
    setIsFormOpen(true);
  };

  const handleBackToList = () => {
    setSelectedInquiry(null);
    setIsFormOpen(false);
  };

  const filteredInquiries = inquiries.filter((inq) =>
    searchTerm
      ? inq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container px-4 mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
          <button
            onClick={handleNewInquiry}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Inquiry
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className={`md:col-span-4 ${selectedInquiry || isFormOpen ? "hidden md:block" : ""}`}>
            <div className="p-4 bg-white rounded-lg shadow">
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
              />
              <InquiryList
                inquiries={filteredInquiries}
                onSelectInquiry={handleInquirySelect}
                selectedInquiryId={selectedInquiry?.id}
              />
            </div>
          </div>
          <div className={`md:col-span-8 ${!selectedInquiry && !isFormOpen ? "hidden md:block" : ""}`}>
            <div className="p-4 bg-white rounded-lg shadow">
              {isFormOpen ? (
                <>
                  <button onClick={handleBackToList} className="mr-2 text-gray-600 hover:text-gray-900 md:hidden">
                    ← Back
                  </button>
                  <h2 className="text-xl font-semibold">Submit New Inquiry</h2>
                  <InquiryForm onSuccess={handleBackToList} />
                </>
              ) : selectedInquiry ? (
                <>
                  <button onClick={handleBackToList} className="mr-2 text-gray-600 hover:text-gray-900 md:hidden">
                    ← Back
                  </button>
                  <h2 className="text-xl font-semibold">Inquiry Details</h2>
                  <InquiryDetail inquiry={selectedInquiry} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="mb-4 text-gray-600">Select an inquiry or create a new one</p>
                  <button
                    onClick={handleNewInquiry}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    New Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}