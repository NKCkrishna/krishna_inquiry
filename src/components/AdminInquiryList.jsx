import InquiryList from "./InquiryList";
import React from "react";
export default function AdminInquiryList({ inquiries, onSelectInquiry, selectedInquiryId }) {
  return <InquiryList inquiries={inquiries} onSelectInquiry={onSelectInquiry} selectedInquiryId={selectedInquiryId} />;
}
