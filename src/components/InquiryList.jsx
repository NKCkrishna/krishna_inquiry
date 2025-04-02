import { formatDistanceToNow } from "date-fns";

export default function InquiryList({ inquiries, onSelectInquiry, selectedInquiryId }) {
  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-600">No inquiries found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          onClick={() => onSelectInquiry(inquiry)}
          className={`p-4 rounded-md border cursor-pointer transition-colors ${
            selectedInquiryId === inquiry.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">{inquiry.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800`}>
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1).replace("-", " ")}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 truncate">{inquiry.description}</p>
          <p className="mt-2 text-xs text-gray-500">
            {inquiry.createdAt ? formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true }) : "Recently"}
          </p>
        </div>
      ))}
    </div>
  );
}