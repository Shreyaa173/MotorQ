import React, { useState } from "react";
import {
  PackageOpen,
  User,
  Phone,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import Receipt from './Receipt';

const CheckOutForm = ({ selectedLuggage, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call or confirmation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const currentDate = new Date();
      const updatedItem = {
        ...selectedLuggage,
        checkOutDate: currentDate.toISOString().split("T")[0],
        checkOutTime: currentDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        checkOutTimestamp: currentDate.toISOString(),
        status: "checked-out",
        updatedAt: currentDate.toISOString(),
      };

      // Update in-memory storage for artifacts compatibility
      if (window.luggageStorage) {
        const updatedStorage = window.luggageStorage.map((item) =>
          item.tagNumber === selectedLuggage.tagNumber ? updatedItem : item
        );
        window.luggageStorage = updatedStorage;
        localStorage.setItem('luggageStorage', JSON.stringify(updatedStorage));
      }

      // Trigger update event for components listening to changes
      window.dispatchEvent(
        new CustomEvent("luggageUpdated", {
          detail: { type: "checkout", data: updatedItem },
        })
      );

      // Store checkout data for receipt
      setCheckoutData(updatedItem);
      
      // Show receipt
      setShowReceipt(true);

      // Callback
      if (onSuccess) onSuccess(updatedItem);
    } catch (err) {
      console.error("Check-out failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateStorageDuration = () => {
    const checkInDate = new Date(
      selectedLuggage.checkInTimestamp || selectedLuggage.checkInDate
    );
    const now = new Date();
    const diffInHours = Math.ceil((now - checkInDate) / (1000 * 60 * 60));
    const diffInDays = Math.ceil(diffInHours / 24);

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""}`;
    }
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Luggage Check-Out
        </h2>
        <p className="text-gray-600">
          Please verify the luggage details before completing checkout
        </p>
      </div>

      <div className="space-y-6">
        {/* Luggage Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Luggage Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <PackageOpen size={16} />
                Tag Number:
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                {selectedLuggage.tagNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <User size={16} />
                Owner:
              </p>{" "}
              <p className="font-semibold text-gray-900 text-lg">
                {selectedLuggage.ownerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Phone size={16} />
                Contact:
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                {selectedLuggage.ownerPhone || selectedLuggage.contactNumber || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <MapPin size={16} />
                Location:
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                {selectedLuggage.storageLocation || selectedLuggage.location || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Clock size={16} />
                Check-in Time:
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                {selectedLuggage.checkInTimestamp 
                  ? new Date(selectedLuggage.checkInTimestamp).toLocaleString("en-IN")
                  : `${selectedLuggage.checkInDate || 'N/A'} ${selectedLuggage.checkInTime || ''}`
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Clock size={16} />
                Storage Duration:
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                {calculateStorageDuration()}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          {selectedLuggage.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Description:</p>
              <p className="text-sm text-gray-900">{selectedLuggage.description}</p>
            </div>
          )}

          {selectedLuggage.weight && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Weight:</p>
              <p className="text-sm text-gray-900">{selectedLuggage.weight} kg</p>
            </div>
          )}

          {selectedLuggage.specialInstructions && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Special Instructions:</p>
              <p className="text-sm text-gray-900">{selectedLuggage.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Fees & Confirmation */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Checkout Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <DollarSign size={16} />
                Total Fee:
              </p>
              <p className="font-semibold text-gray-900 text-lg">
                ₹{selectedLuggage.fees || selectedLuggage.fee || "0.00"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <CheckCircle size={16} />
                Status:
              </p>
              <p className="font-semibold text-green-600 text-lg capitalize">
                {selectedLuggage.status || 'Ready for checkout'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Confirm Checkout
              </>
            )}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && checkoutData && (
        <Receipt
          checkoutData={checkoutData}
          onClose={() => setShowReceipt(false)}
          onPrint={() => console.log('Receipt printed')}
          onDownload={() => console.log('Receipt downloaded')}
        />
      )}
    </div>
  );
};

export default CheckOutForm;