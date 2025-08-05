import React, { useState } from 'react';
import {
  PackageOpen,
  User,
  Phone,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const CheckOutForm = ({ selectedLuggage, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call or confirmation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedItem = {
        ...selectedLuggage,
        checkOutDate: new Date().toISOString().split('T')[0],
        checkOutTime: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'checked-out',
      };

      // Update localStorage (mocking DB update)
      const stored = JSON.parse(localStorage.getItem('luggage_storage') || '[]');
      const updatedStorage = stored.map((item) =>
        item.tagNumber === selectedLuggage.tagNumber ? updatedItem : item
      );
      localStorage.setItem('luggage_storage', JSON.stringify(updatedStorage));

      // Callback
      if (onSuccess) onSuccess(updatedItem);
    } catch (err) {
      console.error('Check-out failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Luggage Info */}
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <PackageOpen size={16} />
              Tag Number:
            </p>
            <p className="font-medium text-gray-900">{selectedLuggage.tagNumber}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <User size={16} />
              Owner:
            </p>
            <p className="font-medium text-gray-900">{selectedLuggage.ownerName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone size={16} />
              Phone:
            </p>
            <p className="font-medium text-gray-900">{selectedLuggage.ownerPhone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin size={16} />
              Location:
            </p>
            <p className="font-medium text-gray-900">{selectedLuggage.storageLocation}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Clock size={16} />
              Check-in Date:
            </p>
            <p className="font-medium text-gray-900">{selectedLuggage.checkInDate}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <DollarSign size={16} />
              Fee:
            </p>
            <p className="font-medium text-orange-600">
              ₹{selectedLuggage.fees || '0.00'}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">Description:</p>
          <p className="text-gray-900">{selectedLuggage.description}</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Please ensure that the luggage has been physically verified and
            returned to the rightful owner before completing this check-out.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Check-Out
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckOutForm;
