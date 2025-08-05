import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Package,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const CheckInForm = ({ onSuccess, onCancel, prefilledData = {} }) => {
  const [formData, setFormData] = useState({
    ownerName: prefilledData.ownerName || "",
    ownerPhone: prefilledData.ownerPhone || "",
    ownerEmail: prefilledData.ownerEmail || "",
    description: prefilledData.description || "",
    weight: prefilledData.weight || "",
    specialInstructions: prefilledData.specialInstructions || "",
    storageLocation: prefilledData.storageLocation || "",
    estimatedDuration: prefilledData.estimatedDuration || "1",
    fees: prefilledData.fees || "",
    emergencyContact: prefilledData.emergencyContact || "",
    emergencyPhone: prefilledData.emergencyPhone || "",
    hasValuables: prefilledData.hasValuables || false,
    valuablesDescription: prefilledData.valuablesDescription || "",
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Calculate fees based on duration and weight
  const calculateFees = (durationInHours) => {
    const hours = parseFloat(durationInHours);

    if (isNaN(hours) || hours <= 0) return 0;

    if (hours <= 1) return 100;
    if (hours <= 3) return 200;
    if (hours <= 6) return 300;

    return 500; // max per day
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Auto-calculate fees when duration or weight changes
    if (name === "estimatedDuration" || name === "weight") {
      const duration =
        name === "estimatedDuration" ? value : formData.estimatedDuration;
      const weight =
        name === "weight" ? parseFloat(value) : parseFloat(formData.weight);

      if (duration && weight) {
        const calculatedFees = calculateFees(duration, weight);
        setFormData((prev) => ({
          ...prev,
          fees: calculatedFees.toFixed(2),
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
      }
      if (!formData.ownerPhone.trim()) {
        newErrors.ownerPhone = "Phone number is required";
      } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.ownerPhone)) {
        newErrors.ownerPhone = "Please enter a valid phone number";
      }
      if (!formData.ownerEmail.trim()) {
        newErrors.ownerEmail = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Please enter a valid email address";
      }
    }

    if (step === 2) {
      if (!formData.description.trim()) {
        newErrors.description = "Luggage description is required";
      }
      if (!formData.weight) {
        newErrors.weight = "Weight is required";
      } else if (parseFloat(formData.weight) <= 0) {
        newErrors.weight = "Weight must be greater than 0";
      }
      if (!formData.storageLocation.trim()) {
        newErrors.storageLocation = "Storage location is required";
      }
      if (formData.hasValuables && !formData.valuablesDescription.trim()) {
        newErrors.valuablesDescription = "Please describe valuable items";
      }
    }

    if (step === 3) {
      if (!formData.agreedToTerms) {
        newErrors.agreedToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate tag number
      const tagNumber = `LUG-${Date.now().toString().slice(-6)}`;

      const checkInData = {
        ...formData,
        tagNumber,
        checkInDate: new Date().toISOString().split("T")[0],
        checkInTime: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "stored",
      };

      // Save to localStorage (in real app, this would be API call)
      const existingLuggage = JSON.parse(
        localStorage.getItem("luggage_storage") || "[]"
      );
      existingLuggage.push(checkInData);
      localStorage.setItem("luggage_storage", JSON.stringify(existingLuggage));

      if (onSuccess) {
        onSuccess(checkInData);
      }
    } catch (error) {
      console.error("Check-in failed:", error);
      setErrors({ submit: "Failed to check in luggage. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Owner Information</h3>
        <p className="text-sm text-gray-500">Please provide contact details</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User size={16} className="inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.ownerName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter full name"
          />
          {errors.ownerName && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone size={16} className="inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.ownerPhone ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.ownerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail size={16} className="inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.ownerEmail ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="email@example.com"
          />
          {errors.ownerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Phone
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Emergency phone number"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Luggage Details</h3>
        <p className="text-sm text-gray-500">
          Provide information about your luggage
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Package size={16} className="inline mr-1" />
            Luggage Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.description ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Describe your luggage (color, size, type, distinctive features)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.weight ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="0.0"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock size={16} className="inline mr-1" />
              Estimated Duration (days)
            </label>
            <select
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select duration</option>
              <option value="1">0–1 hour</option>
              <option value="3">1–3 hours</option>
              <option value="6">3–6 hours</option>
              <option value="12">6+ hours</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="inline mr-1" />
            Storage Location *
          </label>
          <select
            name="storageLocation"
            value={formData.storageLocation}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.storageLocation ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Select storage location</option>
            <option value="A-01">Section A - Shelf 01</option>
            <option value="A-02">Section A - Shelf 02</option>
            <option value="A-03">Section A - Shelf 03</option>
            <option value="B-01">Section B - Shelf 01</option>
            <option value="B-02">Section B - Shelf 02</option>
            <option value="C-01">Section C - Shelf 01</option>
            <option value="C-02">Section C - Shelf 02</option>
          </select>
          {errors.storageLocation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.storageLocation}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              nameid="hasValuables"
              name="hasValuables"
              checked={formData.hasValuables}
              onChange={handleInputChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label
              htmlFor="hasValuables"
              className="ml-2 block text-sm text-gray-900"
            >
              Contains valuable items
            </label>
          </div>
          {formData.hasValuables && (
            <div className="mt-2">
              <textarea
                name="valuablesDescription"
                value={formData.valuablesDescription}
                onChange={handleInputChange}
                rows={2}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.valuablesDescription
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Describe valuable items (jewelry, electronics, etc.)"
              />
              {errors.valuablesDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.valuablesDescription}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FileText size={16} className="inline mr-1" />
            Special Instructions
          </label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Any special handling instructions or notes"
          />
        </div>

        {formData.estimatedDuration && formData.weight && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                <DollarSign size={16} className="inline mr-1" />
                Estimated Storage Fee:
              </span>
              <span className="text-lg font-semibold text-orange-600">
                ₹{formData.fees}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {formData.estimatedDuration} day(s) and {formData.weight}
              kg
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Review & Confirm</h3>
        <p className="text-sm text-gray-500">
          Please review your information before submitting
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Owner Information
            </h4>
            <p className="text-sm text-gray-600">Name: {formData.ownerName}</p>
            <p className="text-sm text-gray-600">
              Phone: {formData.ownerPhone}
            </p>
            <p className="text-sm text-gray-600">
              Email: {formData.ownerEmail}
            </p>
            {formData.emergencyContact && (
              <p className="text-sm text-gray-600">
                Emergency: {formData.emergencyContact} (
                {formData.emergencyPhone})
              </p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Luggage Details</h4>
            <p className="text-sm text-gray-600">
              Description: {formData.description}
            </p>
            <p className="text-sm text-gray-600">Weight: {formData.weight}kg</p>
            <p className="text-sm text-gray-600">
              Duration: {formData.estimatedDuration} day(s)
            </p>
            <p className="text-sm text-gray-600">
              Location: {formData.storageLocation}
            </p>
            {formData.hasValuables && (
              <p className="text-sm text-gray-600">
                Valuables: {formData.valuablesDescription}
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">
              Total Storage Fee:
            </span>
            <span className="text-xl font-bold text-orange-600">
              ₹{formData.fees}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Terms and Conditions
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Storage fees must be paid in advance</li>
                <li>Items must be collected within the agreed duration</li>
                <li>
                  We are not responsible for valuable items unless declared
                </li>
                <li>Late pickup may incur additional charges</li>
                <li>Items left over 30 days past due may be disposed of</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreedToTerms"
          name="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={handleInputChange}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label
          htmlFor="agreedToTerms"
          className="ml-2 block text-sm text-gray-900"
        >
          I agree to the terms and conditions *
        </label>
      </div>
      {errors.agreedToTerms && (
        <p className="text-sm text-red-600">{errors.agreedToTerms}</p>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Luggage Check-In</h2>
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? "bg-orange-500 text-white"
                    : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Complete Check-In"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckInForm;
