
import { useState } from "react";
import { format, formatDistance } from "date-fns";

export default function InquiryDetail({ inquiry, onEdit }) {
  const [expandDescription, setExpandDescription] = useState(false);

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-600 font-medium">No inquiry selected</p>
        <p className="text-gray-500 text-sm">Select an inquiry from the list to view details</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "on-hold":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "closed":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border border-red-100";
      case "urgent":
        return "bg-red-100 text-red-800 border border-red-200";
      case "medium":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "low":
        return "bg-gray-50 text-gray-700 border border-gray-100";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  const formatStatus = (status) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatCategory = (category) => {
    const categories = {
      "general": "General Question",
      "technical": "Technical Support",
      "billing": "Billing Issue",
      "feedback": "Feedback"
    };
    
    return categories[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const displayDate = (dateString) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    const formattedDate = format(date, "PPP");
    const formattedTime = format(date, "p");
    const timeAgo = formatDistance(date, new Date(), { addSuffix: true });
    
    return (
      <>
        <span className="font-medium">{formattedDate}</span>
        <span className="text-gray-500"> at {formattedTime}</span>
        <span className="ml-1 text-gray-500">({timeAgo})</span>
      </>
    );
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-gray-900 leading-tight">{inquiry.title}</h2>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(inquiry)} 
                className="text-gray-500 hover:text-gray-700"
                title="Edit Inquiry"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(inquiry.status)}`}>
              {formatStatus(inquiry.status)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-y-3 gap-x-2 mt-2">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{displayDate(inquiry.createdAt)}</span>
          </div>
          
          {inquiry.resolvedAt && (
            <div className="flex items-center text-sm ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-700">Resolved {formatDistance(new Date(inquiry.resolvedAt), new Date(), { addSuffix: true })}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-sm font-medium text-gray-900">{formatCategory(inquiry.category || "general")}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Priority</p>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                {inquiry.priority?.toUpperCase() || "MEDIUM"}
              </span>
            </div>
          </div>
          
          {inquiry.assignedTo && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Assigned To</p>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">{inquiry.assignedTo}</p>
              </div>
            </div>
          )}
          
          {inquiry.lastUpdated && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-900">{formatDistance(new Date(inquiry.lastUpdated), new Date(), { addSuffix: true })}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Description</p>
            {inquiry.description && inquiry.description.length > 200 && (
              <button 
                onClick={() => setExpandDescription(!expandDescription)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                {expandDescription ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
          <div className={`bg-gray-50 p-4 rounded-md ${!expandDescription && inquiry.description && inquiry.description.length > 200 ? "max-h-48 overflow-hidden relative" : ""}`}>
            {!expandDescription && inquiry.description && inquiry.description.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
            )}
            <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.description}</p>
          </div>
        </div>
        
        {inquiry.attachments && inquiry.attachments.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                {inquiry.attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {inquiry.resolution && (
          <div>
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-700">Resolution</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.resolution}</p>
              {inquiry.resolvedAt && (
                <p className="text-xs text-gray-600 mt-2">
                  Resolved on {format(new Date(inquiry.resolvedAt), "PPP")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}