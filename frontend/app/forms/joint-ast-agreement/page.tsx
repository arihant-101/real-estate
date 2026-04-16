"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Save, Users, AlertCircle, Info, Calendar, PoundSterling, Plus, Minus } from "lucide-react";
import { formatFilenameWithLondonDate } from "@/lib/date-utils";

export default function JointASTAgreementPage() {
  const [formData, setFormData] = useState({
    // Landlord Details
    landlordName: "",
    landlordAddress: "",
    landlordEmail: "",
    landlordPhone: "",
    
    // Tenant Details
    tenants: [{ name: "", email: "" }],
    
    // Property Details
    propertyAddress: "",
    sharedFacilities: "",
    allocatedParking: "",
    
    // Tenancy Terms
    executionDate: "",
    rentAmount: "",
    rentPeriod: "monthly",
    firstPaymentDate: "",
    subsequentPaymentDate: "",
    paymentMethod: "",
    
    // Term Details
    fixedTermLength: "",
    commencementDate: "",
    
    // Permitted Occupiers
    permittedOccupiers: "",
    
    // Utilities
    utilities: {
      water: "tenant",
      gas: "tenant",
      electricity: "tenant",
      tv: "tenant",
      broadband: "tenant",
      telephone: "tenant",
      councilTax: "tenant",
      other: "tenant",
    },
    
    // Deposit
    depositAmount: "",
    depositHolder: "",
    depositScheme: "",
    leadTenant: "",
    thirdPartyContributors: "",
    
    // Contact Details
    noticeAddress: "",
    noticeEmail: "",
  });

  const [currentSection, setCurrentSection] = useState("landlord");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sections = [
    { id: "landlord", title: "Landlord Details", icon: Users },
    { id: "tenant", title: "Tenant Details", icon: Users },
    { id: "property", title: "Property Details", icon: Users },
    { id: "tenancy", title: "Tenancy Terms", icon: PoundSterling },
    { id: "utilities", title: "Utilities & Services", icon: Users },
    { id: "deposit", title: "Deposit Protection", icon: Users },
    { id: "review", title: "Review & Sign", icon: Users },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTenantChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      tenants: prev.tenants.map((tenant, i) => 
        i === index ? { ...tenant, [field]: value } : tenant
      )
    }));
  };

  const addTenant = () => {
    setFormData(prev => ({
      ...prev,
      tenants: [...prev.tenants, { name: "", email: "" }]
    }));
  };

  const removeTenant = (index: number) => {
    if (formData.tenants.length > 1) {
      setFormData(prev => ({
        ...prev,
        tenants: prev.tenants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUtilityChange = (utility: string, payer: string) => {
    setFormData(prev => ({
      ...prev,
      utilities: { ...prev.utilities, [utility]: payer }
    }));
  };

  const handleDownload = () => {
    const filename = formatFilenameWithLondonDate('NRLA-joint-ast-family-couple-individual-2022', 'pdf');
    const link = document.createElement('a');
    link.href = '/asta-forms/NRLA-joint-ast-family-couple-individual-2022.pdf';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "landlord":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Landlord Information</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name(s) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange("landlordName", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter landlord's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.landlordEmail}
                  onChange={(e) => handleInputChange("landlordEmail", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="landlord@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.landlordAddress}
                  onChange={(e) => handleInputChange("landlordAddress", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter full postal address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.landlordPhone}
                  onChange={(e) => handleInputChange("landlordPhone", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        );

      case "tenant":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Tenant Information</h3>
              <button
                onClick={addTenant}
                className="flex items-center gap-2 rounded-lg bg-primary/20 border border-primary/30 px-4 py-2 text-primary hover:bg-primary/30 transition text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Tenant
              </button>
            </div>
            
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Joint and Several Liability</p>
                  <p>All tenants are jointly and separately liable for rent and property obligations. Each tenant can be held responsible for the full rent amount and any damages.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {formData.tenants.map((tenant, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-white">Tenant {index + 1}</h4>
                    {formData.tenants.length > 1 && (
                      <button
                        onClick={() => removeTenant(index)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={tenant.name}
                        onChange={(e) => handleTenantChange(index, "name", e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="Enter tenant's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={tenant.email}
                        onChange={(e) => handleTenantChange(index, "email", e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="tenant@example.com"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "property":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Property Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Property Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter full property address including postcode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Shared Facilities (if applicable)
                </label>
                <textarea
                  value={formData.sharedFacilities}
                  onChange={(e) => handleInputChange("sharedFacilities", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="e.g., Communal garden, shared laundry facilities, building entrance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Allocated Parking
                </label>
                <input
                  type="text"
                  value={formData.allocatedParking}
                  onChange={(e) => handleInputChange("allocatedParking", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="e.g., Two designated parking spaces, Driveway, Street parking, N/A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Permitted Occupiers
                </label>
                <input
                  type="text"
                  value={formData.permittedOccupiers}
                  onChange={(e) => handleInputChange("permittedOccupiers", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter names of additional permitted occupiers, or 'None'"
                />
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium mb-1">Whole Property Tenancy</p>
                  <p>This agreement covers the entire property. All tenants have equal rights to all areas unless specifically restricted.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "tenancy":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Tenancy Terms</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Total Rent Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-elegant-muted" />
                  <input
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) => handleInputChange("rentAmount", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-surface/50 pl-10 pr-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-elegant-muted">Total rent for entire property</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Rent Period
                </label>
                <select
                  value={formData.rentPeriod}
                  onChange={(e) => handleInputChange("rentPeriod", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  First Payment Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.firstPaymentDate}
                  onChange={(e) => handleInputChange("firstPaymentDate", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Subsequent Payment Date
                </label>
                <input
                  type="text"
                  value={formData.subsequentPaymentDate}
                  onChange={(e) => handleInputChange("subsequentPaymentDate", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="e.g., 15th of each month"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Fixed Term Length
                </label>
                <input
                  type="text"
                  value={formData.fixedTermLength}
                  onChange={(e) => handleInputChange("fixedTermLength", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="e.g., 12 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Commencement Date
                </label>
                <input
                  type="date"
                  value={formData.commencementDate}
                  onChange={(e) => handleInputChange("commencementDate", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Payment Method Details
                </label>
                <textarea
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Bank transfer details, standing order information, etc."
                />
              </div>
            </div>
          </div>
        );

      case "utilities":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Utilities & Services</h3>
            
            <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
              <p className="text-elegant-muted mb-6">
                Select who is responsible for paying each utility and service:
              </p>
              
              <div className="space-y-4">
                {[
                  { key: "water", label: "Water Charges" },
                  { key: "gas", label: "Gas" },
                  { key: "electricity", label: "Electricity" },
                  { key: "tv", label: "Television Licence" },
                  { key: "broadband", label: "Broadband" },
                  { key: "telephone", label: "Telephone" },
                  { key: "councilTax", label: "Council Tax" },
                  { key: "other", label: "Other Services" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-white font-medium">{label}</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value="landlord"
                          checked={formData.utilities[key as keyof typeof formData.utilities] === "landlord"}
                          onChange={() => handleUtilityChange(key, "landlord")}
                          className="text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm text-elegant-muted">Landlord</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={key}
                          value="tenant"
                          checked={formData.utilities[key as keyof typeof formData.utilities] === "tenant"}
                          onChange={() => handleUtilityChange(key, "tenant")}
                          className="text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm text-elegant-muted">Tenant</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Joint Tenancy Bills</p>
                  <p>For joint tenancies, tenants are typically responsible for all utilities and council tax. Consider bill-splitting services for easier management.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "deposit":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Deposit Protection</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Total Deposit Amount
                </label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-elegant-muted" />
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-surface/50 pl-10 pr-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-elegant-muted">Combined deposit from all tenants</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Deposit Holder
                </label>
                <input
                  type="text"
                  value={formData.depositHolder}
                  onChange={(e) => handleInputChange("depositHolder", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Name of person/organization holding deposit"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Deposit Protection Scheme
                </label>
                <select
                  value={formData.depositScheme}
                  onChange={(e) => handleInputChange("depositScheme", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">Select a scheme</option>
                  <option value="dps">Deposit Protection Service (DPS)</option>
                  <option value="mydeposits">MyDeposits</option>
                  <option value="tds">Tenancy Deposit Scheme (TDS)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Lead Tenant
                </label>
                <select
                  value={formData.leadTenant}
                  onChange={(e) => handleInputChange("leadTenant", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">Select lead tenant</option>
                  {formData.tenants.map((tenant, index) => (
                    <option key={index} value={tenant.name}>
                      {tenant.name || `Tenant ${index + 1}`}
                    </option>
                  ))}
                  <option value="n/a">N/A (Single tenant)</option>
                </select>
                <p className="mt-1 text-xs text-elegant-muted">Manages deposit at end of tenancy</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Third Party Contributors
                </label>
                <input
                  type="text"
                  value={formData.thirdPartyContributors}
                  onChange={(e) => handleInputChange("thirdPartyContributors", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white placeholder-elegant-muted focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Names and addresses of non-tenants who paid towards deposit, or N/A"
                />
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Review & Sign</h3>
            
            <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
              <h4 className="font-medium text-white mb-4">Agreement Summary</h4>
              
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <p className="text-elegant-muted">Landlord:</p>
                  <p className="text-white">{formData.landlordName || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-elegant-muted">Tenants:</p>
                  <p className="text-white">
                    {formData.tenants.filter(t => t.name).map(t => t.name).join(", ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-elegant-muted">Property:</p>
                  <p className="text-white">{formData.propertyAddress || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-elegant-muted">Rent:</p>
                  <p className="text-white">
                    {formData.rentAmount ? `£${formData.rentAmount} ${formData.rentPeriod}` : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-elegant-muted">Deposit:</p>
                  <p className="text-white">{formData.depositAmount ? `£${formData.depositAmount}` : "Not specified"}</p>
                </div>
                <div>
                  <p className="text-elegant-muted">Lead Tenant:</p>
                  <p className="text-white">{formData.leadTenant || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-200">
                    <p className="font-medium mb-1">Joint and Several Liability</p>
                    <p>All tenants are jointly and separately liable for the full rent amount and all tenancy obligations. Each tenant can be held responsible for the entire rent and any damages.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Execution Date
                </label>
                <input
                  type="date"
                  value={formData.executionDate}
                  onChange={(e) => handleInputChange("executionDate", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-surface/50 px-4 py-3 text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <p className="mt-1 text-xs text-elegant-muted">
                  Only complete this date when all parties have signed and you want the agreement to become binding.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const nextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id);
    }
  };

  const prevSection = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/forms"
              className="flex items-center gap-2 text-elegant-muted hover:text-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Forms</span>
            </Link>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Joint AST Agreement</h1>
              <p className="text-elegant-muted">
                Joint Assured Shorthold Tenancy Agreement for families, couples, and individuals
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-white hover:border-primary/50 md:w-auto md:justify-start md:py-2"
              >
                <Save className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">Save Draft</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-primary hover:bg-primary/20 md:w-auto md:justify-start md:py-2"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">Download</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {sections.map((section, index) => {
                const IconComponent = section.icon;
                const isActive = currentSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-primary/20 border-primary/30 text-primary border"
                        : "border border-white/10 text-elegant-muted hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-current">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-panel/50 p-8">
              {renderSection()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={prevSection}
                  disabled={currentSection === sections[0].id}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentSection === sections[sections.length - 1].id ? (
                  <button className="btn-primary">
                    Generate Agreement
                  </button>
                ) : (
                  <button
                    onClick={nextSection}
                    className="btn-primary"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}