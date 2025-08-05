import React from 'react';
import { 
  Package, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  DollarSign, 
  FileText,
  CheckCircle,
  Printer,
  Download
} from 'lucide-react';

const Receipt = ({ checkoutData, onClose, onPrint, onDownload }) => {
  const calculateStorageDuration = () => {
    const checkInDate = new Date(checkoutData.checkInTimestamp || checkoutData.checkInDate);
    const checkOutDate = new Date(checkoutData.checkOutTimestamp || new Date());
    const diffInMs = checkOutDate - checkInDate;
    const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = diffInHours % 24;

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
    } else if (remainingHours === 0) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const receiptNumber = `RCP-${checkoutData.tagNumber}-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Luggage Storage Receipt - ${checkoutData.tagNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .company-name { 
              font-size: 28px; 
              font-weight: bold; 
              color: #2563eb;
              margin-bottom: 5px;
            }
            .receipt-title { 
              font-size: 20px; 
              margin: 10px 0; 
            }
            .receipt-number { 
              font-size: 14px; 
              color: #666; 
            }
            .section { 
              margin: 20px 0; 
              padding: 15px; 
              border: 1px solid #ddd; 
              border-radius: 8px;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 10px; 
              color: #2563eb;
            }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0; 
              padding: 4px 0;
            }
            .info-label { 
              font-weight: 500; 
              color: #555;
            }
            .info-value { 
              font-weight: bold; 
            }
            .total-row { 
              border-top: 2px solid #333; 
              padding-top: 10px; 
              font-size: 18px; 
              font-weight: bold; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              font-size: 12px; 
              color: #666;
            }
            .status-completed {
              color: #059669;
              font-weight: bold;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    if (onPrint) onPrint();
  };

  const handleDownload = () => {
    const receiptData = {
      receiptNumber,
      luggageDetails: checkoutData,
      generatedAt: new Date().toISOString(),
      duration: calculateStorageDuration(),
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `receipt-${checkoutData.tagNumber}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    if (onDownload) onDownload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with actions */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white no-print">
          <h2 className="text-xl font-bold text-gray-900">Checkout Receipt</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div id="receipt-content" className="p-6">
          {/* Header */}
          <div className="header text-center border-b-2 border-gray-300 pb-6 mb-8">
            <div className="company-name text-3xl font-bold text-blue-600 mb-2">
              SecureStore Luggage
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Professional Luggage Storage Services
            </div>
            <div className="receipt-title text-xl font-semibold text-gray-900 mb-2">
              CHECKOUT RECEIPT
            </div>
            <div className="receipt-number text-sm text-gray-500">
              Receipt #: {receiptNumber}
            </div>
            <div className="text-sm text-gray-500">
              Generated: {formatDateTime(new Date())}
            </div>
          </div>

          {/* Customer Information */}
          <div className="section bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="section-title text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <User size={18} />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Name:</span>
                <span className="info-value font-semibold">{checkoutData.ownerName}</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Phone:</span>
                <span className="info-value font-semibold">{checkoutData.ownerPhone}</span>
              </div>
              <div className="info-row flex justify-between md:col-span-2">
                <span className="info-label text-gray-600">Email:</span>
                <span className="info-value font-semibold">{checkoutData.ownerEmail}</span>
              </div>
            </div>
          </div>

          {/* Luggage Information */}
          <div className="section bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="section-title text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <Package size={18} />
              Luggage Information
            </h3>
            <div className="space-y-3">
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Tag Number:</span>
                <span className="info-value font-bold text-lg text-blue-600">{checkoutData.tagNumber}</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Description:</span>
                <span className="info-value font-semibold">{checkoutData.description}</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Weight:</span>
                <span className="info-value font-semibold">{checkoutData.weight} kg</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Storage Location:</span>
                <span className="info-value font-semibold">{checkoutData.storageLocation}</span>
              </div>
              {checkoutData.hasValuables && (
                <div className="info-row flex justify-between">
                  <span className="info-label text-gray-600">Valuables:</span>
                  <span className="info-value font-semibold text-orange-600">
                    {checkoutData.valuablesDescription || 'Contains valuable items'}
                  </span>
                </div>
              )}
              {checkoutData.specialInstructions && (
                <div className="info-row flex flex-col gap-1">
                  <span className="info-label text-gray-600">Special Instructions:</span>
                  <span className="info-value font-semibold text-sm bg-yellow-50 p-2 rounded">
                    {checkoutData.specialInstructions}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="section bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="section-title text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <Clock size={18} />
              Service Details
            </h3>
            <div className="space-y-3">
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Check-in Time:</span>
                <span className="info-value font-semibold">
                  {formatDateTime(checkoutData.checkInTimestamp)}
                </span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Check-out Time:</span>
                <span className="info-value font-semibold">
                  {formatDateTime(checkoutData.checkOutTimestamp || new Date())}
                </span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Total Duration:</span>
                <span className="info-value font-semibold text-blue-600">
                  {calculateStorageDuration()}
                </span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Status:</span>
                <span className="info-value font-semibold status-completed flex items-center gap-1">
                  <CheckCircle size={16} />
                  COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="section bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
            <h3 className="section-title text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <DollarSign size={18} />
              Billing Summary
            </h3>
            <div className="space-y-2">
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Base Storage Fee:</span>
                <span className="info-value font-semibold">₹{checkoutData.fees || '0.00'}</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Additional Charges:</span>
                <span className="info-value font-semibold">₹0.00</span>
              </div>
              <div className="info-row flex justify-between">
                <span className="info-label text-gray-600">Tax (0%):</span>
                <span className="info-value font-semibold">₹0.00</span>
              </div>
              <div className="total-row flex justify-between text-xl font-bold border-t-2 border-blue-300 pt-3 mt-3">
                <span>TOTAL AMOUNT:</span>
                <span className="text-blue-600">₹{checkoutData.fees || '0.00'}</span>
              </div>
              <div className="text-center mt-3">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ PAYMENT COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer text-center border-t border-gray-300 pt-6 mt-8 text-sm text-gray-600">
            <div className="mb-2">
              <strong>Thank you for using SecureStore Luggage!</strong>
            </div>
            <p className="mb-1">
              For support or inquiries, contact us at: support@securestore.com | +91 98765 43210
            </p>
            <p className="mb-1">
              Visit us: 123 Storage Street, Delhi, India 110001
            </p>
            <p className="text-xs mt-3 text-gray-500">
              This is a computer-generated receipt. Please retain this for your records.
            </p>
            <p className="text-xs text-gray-500">
              Receipt generated on {new Date().toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;