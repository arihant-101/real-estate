"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, BookOpen, CheckCircle, AlertCircle, FileText, ClipboardList, HelpCircle } from "lucide-react";
import { formatFilenameWithLondonDate } from "@/lib/date-utils";

export default function HowToRentPage() {
  const [selectedSection, setSelectedSection] = useState("overview");
  
  const handleDownload = () => {
    const filename = formatFilenameWithLondonDate('how-to-rent-october-2023', 'pdf');
    const link = document.createElement('a');
    link.href = '/asta-forms/how-to-rent-october-2023.pdf';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [checklist, setChecklist] = useState({
    beforeStart: false,
    lookingForHome: false,
    foundPlace: false,
    livingInHome: false,
    endOfPeriod: false,
    thingsGoWrong: false,
  });

  const sections = [
    { id: "overview", title: "Overview", icon: FileText },
    { id: "before-start", title: "Before You Start", icon: ClipboardList },
    { id: "looking", title: "Looking for Your Home", icon: BookOpen },
    { id: "found-place", title: "When You've Found a Place", icon: CheckCircle },
    { id: "living", title: "Living in Your Rented Home", icon: BookOpen },
    { id: "end-period", title: "At the End of the Fixed Period", icon: AlertCircle },
    { id: "problems", title: "If Things Go Wrong", icon: HelpCircle },
  ];

  const handleChecklistUpdate = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSectionContent = () => {
    switch (selectedSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">About This Guide</h3>
              <p className="text-elegant-muted leading-relaxed">
                This guide is for people who are renting a home privately under an assured shorthold tenancy, 
                either direct from a landlord or through a letting agency. Most of it will also apply if you 
                are in a shared property but in certain cases, your rights and responsibilities will vary.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                <h4 className="font-medium text-white mb-2">What's Covered</h4>
                <ul className="space-y-1 text-sm text-elegant-muted">
                  <li>• Key questions before renting</li>
                  <li>• Property search guidance</li>
                  <li>• Tenancy agreement requirements</li>
                  <li>• Rights and responsibilities</li>
                </ul>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-panel/50 p-4">
                <h4 className="font-medium text-white mb-2">Not Covered</h4>
                <ul className="space-y-1 text-sm text-elegant-muted">
                  <li>• Lodgers living with landlords</li>
                  <li>• Property guardians</li>
                  <li>• Non-main residence tenancies</li>
                  <li>• Commercial properties</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "before-start":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Key Questions Before You Start</h3>
            
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Fees and Deposits
                </h4>
                <div className="space-y-3 text-sm text-elegant-muted">
                  <p><strong>Prohibited fees:</strong> Since 1 June 2019, most fees charged in connection with a tenancy are banned. Viewing fees and tenancy set-up fees are not allowed.</p>
                  <p><strong>Deposit cap:</strong> Maximum deposit is 5 weeks' rent (annual rent under £50,000) or 6 weeks' rent (annual rent £50,000+).</p>
                  <p><strong>Holding deposit:</strong> Maximum one week's rent to reserve a property (refundable).</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Affordability Check
                </h4>
                <div className="space-y-3 text-sm text-elegant-muted">
                  <p><strong>Budget guideline:</strong> 35% of your take-home pay is typically the maximum affordable rent.</p>
                  <p><strong>Benefits:</strong> Check if you're entitled to Housing Benefit or Universal Credit to help with rent costs.</p>
                  <p><strong>Right to rent:</strong> Ensure you have the legal right to rent in the UK before applying.</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Documentation Required
                </h4>
                <div className="grid gap-2 text-sm text-elegant-muted sm:grid-cols-2">
                  <div>
                    <p><strong>Identity documents:</strong></p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Passport or driving licence</li>
                      <li>Proof of address</li>
                      <li>Right to rent documentation</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Financial documents:</strong></p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Employment contract</li>
                      <li>Recent payslips</li>
                      <li>Bank statements</li>
                      <li>Credit report</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.beforeStart}
                  onChange={() => handleChecklistUpdate('beforeStart')}
                  className="rounded border-primary/30 bg-transparent text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-white">I've reviewed all the key questions and requirements</span>
              </label>
            </div>
          </div>
        );

      case "looking":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Looking for Your New Home</h3>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Essential Checks</h4>
                  <ul className="space-y-2 text-sm text-elegant-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Deposit protection in government-approved scheme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Smoke alarms on every floor and carbon monoxide detectors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Property safety and fitness for human habitation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Landlord's name and contact details</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Licensing Requirements</h4>
                  <div className="space-y-3 text-sm text-elegant-muted">
                    <p><strong>HMO Licensing:</strong> Properties with 3+ unrelated people sharing facilities may need licensing.</p>
                    <p><strong>Selective Licensing:</strong> Some areas require all private rentals to be licensed.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Permitted Fees</h4>
                  <div className="space-y-2 text-sm text-elegant-muted">
                    <div className="flex justify-between">
                      <span>Rent</span>
                      <span className="text-primary">✓ Allowed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit (capped)</span>
                      <span className="text-primary">✓ Allowed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holding deposit</span>
                      <span className="text-primary">✓ Allowed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilities & council tax</span>
                      <span className="text-primary">✓ Allowed</span>
                    </div>
                    <hr className="border-white/10" />
                    <div className="flex justify-between">
                      <span>Viewing fees</span>
                      <span className="text-red-400">✗ Banned</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Setup fees</span>
                      <span className="text-red-400">✗ Banned</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out fees</span>
                      <span className="text-red-400">✗ Banned</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.lookingForHome}
                      onChange={() => handleChecklistUpdate('lookingForHome')}
                      className="rounded border-primary/30 bg-transparent text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-white">I understand what to check when looking for a property</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "found-place":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">When You've Found a Place</h3>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Essential Paperwork</h4>
                  <ul className="space-y-2 text-sm text-elegant-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Written tenancy agreement (read carefully before signing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Inventory or check-in report with photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Meter readings (photo with date/time)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Emergency contact details</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Accessibility</h4>
                  <p className="text-sm text-elegant-muted">
                    If you're disabled or have a long-term condition, you can request reasonable 
                    adjustments from your landlord, including home adaptations and changes to 
                    tenancy terms. Check eligibility for Disabled Facilities Grants.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Landlord Must Provide</h4>
                  <ul className="space-y-2 text-sm text-elegant-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Copy of "How to rent" guide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Gas safety certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Deposit protection paperwork</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Energy performance certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Electrical installation report</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Smoke/carbon monoxide alarm evidence</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.foundPlace}
                      onChange={() => handleChecklistUpdate('foundPlace')}
                      className="rounded border-primary/30 bg-transparent text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-white">I know what paperwork to check and request</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "living":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Living in Your Rented Home</h3>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Tenant Must Do</h4>
                  <ul className="space-y-2 text-sm text-elegant-muted">
                    <li>• Pay rent on time (default fee after 14 days late)</li>
                    <li>• Pay bills you're responsible for</li>
                    <li>• Look after the property (get permission for repairs/decorating)</li>
                    <li>• Be considerate to neighbours</li>
                    <li>• Don't sublet without permission</li>
                    <li>• Report repairs promptly</li>
                    <li>• Test smoke alarms monthly</li>
                    <li>• Get contents insurance</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Tenant Should Do</h4>
                  <ul className="space-y-2 text-sm text-elegant-muted">
                    <li>• Learn how to operate boiler and appliances</li>
                    <li>• Know location of stopcock, fuse box, meters</li>
                    <li>• Consider smart meters installation</li>
                    <li>• Register to vote at new address</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                  <h4 className="font-medium text-white mb-3">Landlord Must Do</h4>
                  <ul className="space-y-2 text-sm text-elegant-muted">
                    <li>• Maintain structure and exterior</li>
                    <li>• Ensure property is free from serious hazards</li>
                    <li>• Fit and maintain smoke/carbon monoxide alarms</li>
                    <li>• Deal with water, electricity, gas supply problems</li>
                    <li>• Maintain supplied appliances and furniture</li>
                    <li>• Carry out most repairs</li>
                    <li>• Annual gas safety check</li>
                    <li>• 5-yearly electrical safety check</li>
                    <li>• Give 24 hours' notice for visits</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.livingInHome}
                      onChange={() => handleChecklistUpdate('livingInHome')}
                      className="rounded border-primary/30 bg-transparent text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm text-white">I understand my rights and responsibilities as a tenant</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "end-period":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">At the End of the Fixed Period</h3>
            
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                <h4 className="font-medium text-white mb-3">If You Want to Stay</h4>
                <div className="space-y-3 text-sm text-elegant-muted">
                  <p>You can either sign a new fixed-term agreement or continue on a 'rolling periodic tenancy' with the same terms but no fixed end date.</p>
                  <p><strong>Rent increases:</strong> Your landlord can increase rent by agreement, as set out in your tenancy agreement, or by serving a notice proposing new rent (which you can challenge in tribunal).</p>
                  <p><strong>Deposit refund:</strong> You may be entitled to a partial deposit refund due to the Tenant Fees Act 2019 deposit cap.</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                <h4 className="font-medium text-white mb-3">If You or Landlord Want to End Tenancy</h4>
                <div className="space-y-4">
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <p className="text-sm text-yellow-200">
                      <strong>Important:</strong> The government plans to end 'no fault' section 21 evictions, 
                      but landlords can still issue section 21 notices until new legislation comes into effect.
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-sm text-elegant-muted">
                    <p><strong>Giving notice:</strong> Landlords must give proper notice and allow any fixed period to expire. Notice periods vary by tenancy type and reason.</p>
                    <p><strong>If you don't leave:</strong> Landlords need a court order and warrant executed by bailiffs to evict you.</p>
                    <p><strong>Seek advice:</strong> Contact Shelter, Citizens Advice, or Civil Legal Advice if you receive an eviction notice.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                <h4 className="font-medium text-white mb-3">When You Leave</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-white mb-2">Before Leaving:</p>
                    <ul className="space-y-1 text-sm text-elegant-muted">
                      <li>• Keep rent payments up to date</li>
                      <li>• Don't leave bills unpaid</li>
                      <li>• Clean thoroughly</li>
                      <li>• Remove all possessions</li>
                      <li>• Take final meter readings</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-2">Final Steps:</p>
                    <ul className="space-y-1 text-sm text-elegant-muted">
                      <li>• Return all keys</li>
                      <li>• Attend check-out inspection</li>
                      <li>• Provide forwarding address</li>
                      <li>• Take photos of final condition</li>
                      <li>• Dispose of unwanted furniture properly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.endOfPeriod}
                    onChange={() => handleChecklistUpdate('endOfPeriod')}
                    className="rounded border-primary/30 bg-transparent text-primary focus:ring-primary/30"
                  />
                  <span className="text-sm text-white">I understand the end-of-tenancy procedures</span>
                </label>
              </div>
            </div>
          </div>
        );

      case "problems":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">If Things Go Wrong</h3>
            
            <div className="space-y-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Emergency Situations
                </h4>
                <div className="space-y-2 text-sm text-elegant-muted">
                  <p><strong>Harassment or illegal eviction:</strong> Contact local council immediately, or dial 999 if urgent.</p>
                  <p><strong>Unsafe property:</strong> Report to local council and Trading Standards if landlord won't repair.</p>
                  <p><strong>Forced out illegally:</strong> Contact local council, Shelter, or Civil Legal Advice.</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                    <h4 className="font-medium text-white mb-3">Common Issues</h4>
                    <ul className="space-y-2 text-sm text-elegant-muted">
                      <li>• <strong>Letting agent complaints:</strong> Use their redress scheme</li>
                      <li>• <strong>Early termination:</strong> Discuss with landlord, may incur costs</li>
                      <li>• <strong>Rent arrears:</strong> Speak to landlord early, contact council/Shelter</li>
                      <li>• <strong>Repairs:</strong> Take landlord to court under Fitness for Human Habitation Act</li>
                      <li>• <strong>Prohibited fees:</strong> Report to council, apply to tribunal for refund</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                    <h4 className="font-medium text-white mb-3">Protection from Eviction</h4>
                    <p className="text-sm text-elegant-muted mb-3">
                      Landlords must follow strict procedures. They can only legally remove you with:
                    </p>
                    <ul className="space-y-1 text-sm text-elegant-muted">
                      <li>• Correct notice period</li>
                      <li>• Court order for possession</li>
                      <li>• Warrant executed by court bailiffs</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                    <h4 className="font-medium text-white mb-3">Get Help</h4>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="font-medium text-white text-sm">Housing Loss Prevention Advice Service</p>
                        <p className="text-xs text-elegant-muted">Free legal advice if facing loss of home</p>
                      </div>
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="font-medium text-white text-sm">Civil Legal Advice</p>
                        <p className="text-xs text-elegant-muted">Free advice for housing and debt matters</p>
                      </div>
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="font-medium text-white text-sm">Citizens Advice & Shelter</p>
                        <p className="text-xs text-elegant-muted">Independent advice on rights and responsibilities</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-panel/50 p-6">
                    <h4 className="font-medium text-white mb-3">Rent Repayment Orders</h4>
                    <p className="text-sm text-elegant-muted">
                      You may be able to claim back rent if there's been illegal eviction, 
                      unlicensed property, or breach of banning orders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.thingsGoWrong}
                    onChange={() => handleChecklistUpdate('thingsGoWrong')}
                    className="rounded border-primary/30 bg-transparent text-primary focus:ring-primary/30"
                  />
                  <span className="text-sm text-white">I know where to get help if problems arise</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const completedSections = Object.values(checklist).filter(Boolean).length;
  const progressPercentage = (completedSections / Object.keys(checklist).length) * 100;

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
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">How to Rent Guide</h1>
              <p className="text-elegant-muted">
                The checklist for renting in England (October 2023)
              </p>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-elegant-muted">Progress</span>
              <span className="text-sm text-primary">{completedSections}/6 sections completed</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const isActive = selectedSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-primary/20 border-primary/30 text-primary border"
                        : "border border-white/10 text-elegant-muted hover:text-white hover:border-white/20"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                    <span>{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-panel/50 p-8">
              {renderSectionContent()}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact-us"
            className="btn-primary"
          >
            Need Help? Contact Us
          </Link>
          <Link
            href="/forms"
            className="btn-outline"
          >
            View All Forms
          </Link>
        </div>
      </div>
    </div>
  );
}