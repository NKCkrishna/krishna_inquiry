
import { createContext, useContext, useState, useEffect } from "react";

const InquiryContext = createContext();

export function useInquiry() {
  return useContext(InquiryContext);
}

export function InquiryProvider({ children }) {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const storedInquiries = JSON.parse(localStorage.getItem("inquiries")) || [];
    setInquiries(storedInquiries);
  }, []);

  useEffect(() => {
    localStorage.setItem("inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  function addInquiry(inquiry) {
    const newInquiry = {
      id: Date.now().toString(),
      ...inquiry,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  }

  function updateInquiry(id, updatedData) {
    setInquiries((prev) =>
      prev.map((inquiry) => (inquiry.id === id ? { ...inquiry, ...updatedData } : inquiry))
    );
  }

  function deleteInquiry(id) {
    setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id));
  }

  return (
    <InquiryContext.Provider value={{ inquiries, addInquiry, updateInquiry, deleteInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}
