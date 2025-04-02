
import { useState, useEffect } from "react";
import { useInquiry } from "../context/InquiryContext";

export default function InquiryStatusManager({ inquiry }) {
  const { updateInquiry } = useInquiry();
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolution, setResolution] = useState("");
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    if (inquiry) {
      setResolution(inquiry.resolution || "");
      setStatusHistory(inquiry.statusHistory || []);
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const addStatusHistoryEntry = (newStatus) => {
    const historyEntry = {
      from: inquiry.status,
      to: newStatus,
      timestamp: new Date().toISOString(),
      by: "Current User" 
    };
    return [...(statusHistory || []), historyEntry];
  };

  const handleStatusChange = async (newStatus) => {
    if (inquiry.status === newStatus) return;
    
    if (newStatus === "closed" && !inquiry.resolution) {
      setShowResolutionForm(true);
      return;
    }

    if (inquiry.status === "closed" && !confirmClose) {
      setConfirmClose(true);
      return;
    }

    setIsUpdating(true);
    try {
      const updatedHistory = addStatusHistoryEntry(newStatus);
      await updateInquiry(inquiry.id, { 
        status: newStatus,
        statusHistory: updatedHistory,
        lastUpdated: new Date().toISOString()
      });
      setStatusHistory(updatedHistory);
      setConfirmClose(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolutionSubmit = async (e) => {
    e.preventDefault();
    if (!resolution.trim()) return;

    setIsUpdating(true);
    try {
      const updatedHistory = addStatusHistoryEntry("closed");
      await updateInquiry(inquiry.id, { 
        resolution, 
        status: "closed",
        statusHistory: updatedHistory,
        resolvedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      setStatusHistory(updatedHistory);
      setShowResolutionForm(false);
    } catch (error) {
      console.error("Failed to save resolution:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-green-100 text-green-800 border-green-200";
      case "on-hold":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Status Management</h4>
      
      {confirmClose && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 mb-2">Are you sure you want to reopen this closed inquiry?</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleStatusChange("open")} 
              className="px-3 py-1 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700"
            >
              Confirm Reopen
            </button>
            <button 
              onClick={() => setConfirmClose(false)} 
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {showResolutionForm ? (
        <form onSubmit={handleResolutionSubmit} className="mb-3">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resolution Details <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Explain how this inquiry was resolved..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This will be visible to the inquiry submitter
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              type="submit" 
              disabled={isUpdating} 
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Close & Save Resolution"
              )}
            </button>
            <button 
              type="button" 
              onClick={() => setShowResolutionForm(false)} 
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={() => handleStatusChange("open")} 
              disabled={inquiry.status === "open" || isUpdating} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${inquiry.status === "open" 
                ? getStatusBadgeClass("open") 
                : "bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              Open
            </button>
            <button 
              onClick={() => handleStatusChange("in-progress")} 
              disabled={inquiry.status === "in-progress" || isUpdating} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${inquiry.status === "in-progress" 
                ? getStatusBadgeClass("in-progress") 
                : "bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => handleStatusChange("on-hold")} 
              disabled={inquiry.status === "on-hold" || isUpdating} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${inquiry.status === "on-hold" 
                ? getStatusBadgeClass("on-hold") 
                : "bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              On Hold
            </button>
            <button 
              onClick={() => handleStatusChange("closed")} 
              disabled={inquiry.status === "closed" || isUpdating} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${inquiry.status === "closed" 
                ? getStatusBadgeClass("closed") 
                : "bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              Close
            </button>
          </div>
          
          {inquiry.resolution && (
            <button
              onClick={() => setShowResolutionForm(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Resolution
            </button>
          )}
        </>
      )}
      
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Status History</h5>
          <div className="space-y-2">
            {statusHistory.map((entry, index) => (
              <div key={index} className="flex items-start text-xs">
                <div className="mr-2 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                </div>
                <div>
                  <p className="text-gray-800">
                    Changed from <span className="font-medium">{entry.from || "new"}</span> to <span className="font-medium">{entry.to}</span>
                  </p>
                  <p className="text-gray-500">
                    {entry.by}, {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}