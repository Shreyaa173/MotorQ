import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  PackageOpen,
  Search,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import CheckOutForm from "../components/Luggage/CheckOutForm";
import LuggageSearch from "../components/Luggage/LuggageSearch";

const CheckOut = () => {
  const [activeTab, setActiveTab] = useState("checkout");
  const [selectedLuggage, setSelectedLuggage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [recentCheckOuts, setRecentCheckOuts] = useState([]);
  const [pendingCheckOuts, setPendingCheckOuts] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recent_checkouts") || "[]");
    const pending = JSON.parse(localStorage.getItem("pending_checkouts") || "[]");
    setRecentCheckOuts(recent.slice(0, 5));
    setPendingCheckOuts(pending);
  }, []);

  const handleCheckOutSuccess = (checkOutData) => {
    const updatedRecent = [checkOutData, ...recentCheckOuts].slice(0, 5);
    setRecentCheckOuts(updatedRecent);
    localStorage.setItem("recent_checkouts", JSON.stringify(updatedRecent));

    const updatedPending = pendingCheckOuts.filter(
      (item) => item.tagNumber !== checkOutData.tagNumber
    );
    setPendingCheckOuts(updatedPending);
    localStorage.setItem("pending_checkouts", JSON.stringify(updatedPending));

    toast.success(`Luggage checked out successfully! Tag: ${checkOutData.tagNumber}`);
    setSelectedLuggage(null);
  };

  const handleLuggageSelect = (luggage) => {
    setSelectedLuggage(luggage);
    setActiveTab("checkout");
  };

  const tabs = [
    { id: "checkout", label: "Check-out", icon: PackageOpen },
    { id: "search", label: "Search & Select", icon: Search },
    { id: "pending", label: "Pending", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <PackageOpen className="text-orange-600" size={32} />
                Luggage Check-Out
              </h1>
              <p className="text-gray-600 mt-2">
                Process luggage retrievals and finalize storage
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <div className="text-sm text-gray-600">Today's Check-outs</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingCheckOuts.length}
                </div>
                <div className="text-sm text-gray-600">Pending Retrievals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.id === "pending" && pendingCheckOuts.length > 0 && (
                    <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {pendingCheckOuts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            {activeTab === "checkout" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Process Check-Out</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedLuggage
                      ? "Complete the check-out process"
                      : "Select luggage to check out"}
                  </p>
                </div>
                <div className="p-6">
                  {selectedLuggage ? (
                    <CheckOutForm
                      selectedLuggage={selectedLuggage}
                      onSuccess={handleCheckOutSuccess}
                      onCancel={() => setSelectedLuggage(null)}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <PackageOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Luggage Selected
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Use the search tab to find luggage for check-out
                      </p>
                      <button
                        onClick={() => setActiveTab("search")}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Search size={16} className="mr-2" />
                        Search Luggage
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "search" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Search Stored Luggage
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Find luggage available for check-out
                    </p>
                  </div>
                  <div className="p-6">
                    <LuggageSearch
                      onResults={setSearchResults}
                      filterStatus="stored"
                      showSelectButton={true}
                      onSelect={handleLuggageSelect}
                    />
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        Available for Check-out
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {searchResults.map((item, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <PackageOpen className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.tagNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.ownerName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Stored: {item.checkInDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">
                                  Ready
                                </p>
                                <p className="text-sm text-gray-500">
                                  Location: {item.storageLocation}
                                </p>
                              </div>
                              <button
                                onClick={() => handleLuggageSelect(item)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-orange-600 hover:bg-orange-700"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "pending" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pending Check-outs
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Luggage awaiting owner pickup
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {pendingCheckOuts.length > 0 ? (
                    pendingCheckOuts.map((item, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Clock className="h-8 w-8 text-yellow-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.tagNumber}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.ownerName}
                              </p>
                              <p className="text-xs text-gray-400">
                                Requested: {item.requestTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium text-yellow-600">
                                Pending
                              </p>
                              <p className="text-sm text-gray-500">
                                Wait time: {item.waitTime}
                              </p>
                            </div>
                            <button
                              onClick={() => handleLuggageSelect(item)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-orange-600 hover:bg-orange-700"
                            >
                              Process
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Pending Check-outs
                      </h3>
                      <p className="text-gray-500">
                        All check-out requests have been processed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedLuggage && (
              <div className="bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selected Luggage
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedLuggage.tagNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedLuggage.ownerName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Phone: {selectedLuggage.ownerPhone}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Location: {selectedLuggage.storageLocation}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Stored: {selectedLuggage.checkInDate}
                  </p>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-900">
                      Total Fees: ₹{selectedLuggage.fees}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Check-outs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Check-outs
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentCheckOuts.length > 0 ? (
                  recentCheckOuts.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.tagNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.ownerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">
                            {item.checkOutTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <PackageOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm">No recent check-outs</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={() => setActiveTab("search")}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Search size={16} className="mr-2" />
                  Search Luggage
                </button>
                <button
                  onClick={() => {
                    const exportData = {
                      recentCheckOuts,
                      pendingCheckOuts,
                      exportDate: new Date().toISOString(),
                    };
                    const dataStr = JSON.stringify(exportData, null, 2);
                    const dataUri =
                      "data:application/json;charset=utf-8," +
                      encodeURIComponent(dataStr);
                    const exportFileDefaultName = "checkout-report.json";
                    const linkElement = document.createElement("a");
                    linkElement.setAttribute("href", dataUri);
                    linkElement.setAttribute("download", exportFileDefaultName);
                    linkElement.click();
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FileText size={16} className="mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
