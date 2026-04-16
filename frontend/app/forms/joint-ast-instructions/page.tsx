"use client";

import Link from "next/link";
import { ArrowLeft, Users, AlertCircle, CheckCircle, Info, Download, FileText } from "lucide-react";
import { formatFilenameWithLondonDate } from "@/lib/date-utils";

export default function JointASTInstructionsPage() {
  const handleDownload = () => {
    const filename = formatFilenameWithLondonDate('NRLA-joint-AST-completion-instructions-2025', 'pdf');
    const link = document.createElement('a');
    link.href = '/asta-forms/NRLA-joint-AST-completion-instructions-2025.pdf';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const instructionSections = [
    {
      id: "overview",
      title: "Overview",
      icon: Info,
      content: [
        {
          subtitle: "When to Use Joint AST",
          points: [
            "Renting entire property to a group of tenants",
            "Tenants want shared responsibility for the whole property",
            "Suitable for families, couples, or groups of friends",
            "Different from room-only tenancies where only individual rooms are let"
          ]
        },
        {
          subtitle: "Document Versions",
          points: [
            "Version 5.0JS: Standard joint tenancy agreement",
            "Version 5.0JF: Joint tenancy with furnished property options",
            "Both follow the same completion process",
            "Choose based on whether property is furnished or unfurnished"
          ]
        }
      ]
    },
    {
      id: "before-start",
      title: "Before You Start",
      icon: AlertCircle,
      content: [
        {
          subtitle: "Technical Requirements",
          points: [
            "Use Adobe Acrobat Reader for best compatibility",
            "Avoid completing in web browsers to prevent data loss",
            "Download our Adobe Reader guide for setup instructions",
            "Ensure stable internet connection for form saving"
          ]
        },
        {
          subtitle: "Information Gathering",
          points: [
            "Collect all tenant details and contact information",
            "Prepare property address and description",
            "Decide on rent amount and payment terms",
            "Choose deposit protection scheme",
            "Complete right to rent checks for all tenants"
          ]
        }
      ]
    },
    {
      id: "main-terms",
      title: "Section A - Main Terms",
      icon: FileText,
      content: [
        {
          subtitle: "Landlord Information",
          points: [
            "Enter full legal name(s) of all landlords",
            "Use names exactly as they appear on property deeds",
            "Include all parties who own the property",
            "Ensure consistent spelling throughout document"
          ]
        },
        {
          subtitle: "Tenant Details",
          points: [
            "List full names and titles of all tenants",
            "Joint tenancies can have multiple tenants (typically 2-6)",
            "All tenants share joint and several liability",
            "Each tenant is responsible for the full rent amount"
          ]
        },
        {
          subtitle: "Property Description",
          points: [
            "Enter complete property address including postcode",
            "Describe the entire property being let",
            "Include any gardens, parking, or outbuildings",
            "Reference inventory for furniture and fixtures"
          ]
        },
        {
          subtitle: "Rent Structure",
          points: [
            "Specify total rent amount for entire property",
            "Choose payment frequency (monthly is most common)",
            "Set first payment due date (usually move-in date)",
            "Example: £1000 due on 15th of every month, first payment by 1st September 2024"
          ]
        }
      ]
    },
    {
      id: "term-facilities",
      title: "Term and Facilities",
      icon: FileText,
      content: [
        {
          subtitle: "Tenancy Term",
          points: [
            "Set initial fixed term length (typically 6-12 months)",
            "Choose commencement date when tenants can move in",
            "Commencement can be later than signing date",
            "Consider seasonal factors for student properties"
          ]
        },
        {
          subtitle: "Additional Occupiers",
          points: [
            "List anyone else permitted to live in the property",
            "Joint tenancies often allow 'nobody' additional",
            "Consider HMO licensing if adding more occupiers",
            "Additional occupiers don't have tenancy rights"
          ]
        },
        {
          subtitle: "Shared Facilities",
          points: [
            "For joint tenancies, tenants typically have access to entire property",
            "List any communal areas in multi-unit buildings",
            "Specify parking arrangements and allocations",
            "Include garden, garage, or storage access"
          ]
        }
      ]
    },
    {
      id: "utilities-bills",
      title: "Utilities and Bills",
      icon: FileText,
      content: [
        {
          subtitle: "Responsibility Assignment",
          points: [
            "Mark who pays each utility: landlord ('we') or tenants ('you')",
            "Joint tenancies commonly have tenants pay all utilities",
            "Bills-inclusive options available but less common due to energy costs",
            "Consider bill-splitting services like Glide for tenant convenience"
          ]
        },
        {
          subtitle: "Council Tax",
          points: [
            "Joint tenancies: tenants typically responsible for council tax",
            "Different from room-only lets where landlord pays",
            "Tenants must register with local authority",
            "Consider student exemptions if applicable"
          ]
        },
        {
          subtitle: "Deposit Calculation",
          points: [
            "Enter total deposit amount from all tenants combined",
            "Maximum 5 weeks' rent (under £50k annual) or 6 weeks' rent (over £50k)",
            "All tenants jointly liable for any deposit deductions",
            "Consider individual tenant contributions for record-keeping"
          ]
        }
      ]
    },
    {
      id: "contact-details",
      title: "Contact Information",
      icon: FileText,
      content: [
        {
          subtitle: "Landlord Contact Details",
          points: [
            "Provide comprehensive contact information",
            "Include postal address, email, and phone number",
            "Information will be copied to notice-serving sections",
            "Ensure 24/7 emergency contact availability"
          ]
        },
        {
          subtitle: "Tenant Communications",
          points: [
            "Enter email and name for each tenant",
            "Used for serving legal documents electronically",
            "Include gas safety certificates, EPC, How to Rent guide",
            "Confirm tenants consent to electronic service"
          ]
        }
      ]
    },
    {
      id: "deposit-management",
      title: "Deposit Management",
      icon: FileText,
      content: [
        {
          subtitle: "Deposit Holder (Clause 5.1)",
          points: [
            "Name the person/organization holding the deposit",
            "May be landlord, agent, or custodial scheme",
            "Can differ from who initially received payment",
            "Must be clearly identified for tenant reference"
          ]
        },
        {
          subtitle: "Protection Scheme (Clause 5.2)",
          points: [
            "Choose government-approved scheme: DPS, MyDeposits, or TDS",
            "Must protect within 30 days of receipt",
            "Provide prescribed information to all tenants",
            "Can transfer between schemes if needed"
          ]
        },
        {
          subtitle: "Lead Tenant (Clause 5.6)",
          points: [
            "Designate one tenant to manage deposit at tenancy end",
            "They handle deduction discussions with landlord",
            "Responsible for distributing deposit shares to other tenants",
            "Insert 'n/a' if only one tenant"
          ]
        },
        {
          subtitle: "Third Party Contributors (Clause 5.7)",
          points: [
            "List non-tenants who contributed to deposit (e.g., guarantors, parents)",
            "Include full names and addresses",
            "They must receive prescribed information",
            "Put 'N/A' if only tenants contributed"
          ]
        }
      ]
    },
    {
      id: "notices-signing",
      title: "Notices and Signing",
      icon: FileText,
      content: [
        {
          subtitle: "Notice Address (Clause 7.3)",
          points: [
            "Confirm address for tenant notices to landlord",
            "Information copied from contact details section",
            "Verify accuracy of postal and email addresses",
            "Changes here update information throughout document"
          ]
        },
        {
          subtitle: "Tenant Signatures",
          points: [
            "Insert each tenant's name in signature section",
            "All tenants must sign and date the agreement",
            "Ensure signatures match identity documents",
            "Complete before landlord signs"
          ]
        },
        {
          subtitle: "Landlord Signature",
          points: [
            "Sign only after all tenants have signed",
            "Agent signing should use their own name and address",
            "Include any addendum documents in signing process",
            "Date signature when completed"
          ]
        },
        {
          subtitle: "Execution Date",
          points: [
            "Return to page 1 to insert execution date",
            "Only complete when agreement should become binding",
            "Ensure all conditions precedent are met",
            "This activates all legal obligations"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-white mb-2">
                Joint AST Completion Instructions
              </h1>
              <p className="text-elegant-muted">
                Comprehensive guide for completing joint tenancy agreements for multiple tenants (2025 edition)
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/forms/joint-ast-agreement"
                className="btn-primary"
              >
                Complete Form
              </Link>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div className="flex gap-4">
            <Users className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">Joint Tenancy Agreement</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                This agreement is for renting an entire property to a group of tenants who share 
                joint responsibility. All tenants are jointly and severally liable for rent and 
                property care. Suitable for families, couples, and groups renting whole properties.
              </p>
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
          <h3 className="font-semibold text-yellow-200 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Key Differences from Room-Only Tenancies
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-yellow-100 mb-2">Joint AST (Whole Property)</h4>
              <ul className="space-y-1 text-sm text-yellow-100">
                <li>• Tenants rent entire property together</li>
                <li>• Shared responsibility for all areas</li>
                <li>• Tenants typically pay council tax</li>
                <li>• All tenants jointly liable for full rent</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-100 mb-2">Room-Only AST</h4>
              <ul className="space-y-1 text-sm text-yellow-100">
                <li>• Tenants rent individual rooms only</li>
                <li>• Shared access to common areas</li>
                <li>• Landlord pays council tax</li>
                <li>• Each tenant liable for their room only</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions Content */}
        <div className="space-y-8">
          {instructionSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="rounded-2xl border border-white/10 bg-panel/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((subsection, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-medium text-white mb-3">{subsection.subtitle}</h3>
                      <ul className="space-y-2">
                        {subsection.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-elegant-muted text-sm leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Best Practices */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Best Practices for Joint Tenancies</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-white mb-3">Before Signing</h3>
              <ul className="space-y-2 text-sm text-elegant-muted">
                <li>• Verify all tenants can afford joint liability</li>
                <li>• Discuss bill-splitting arrangements</li>
                <li>• Agree on lead tenant responsibilities</li>
                <li>• Ensure all understand joint liability</li>
                <li>• Complete comprehensive referencing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-3">During Tenancy</h3>
              <ul className="space-y-2 text-sm text-elegant-muted">
                <li>• Maintain clear communication channels</li>
                <li>• Document any changes to tenant composition</li>
                <li>• Regular property condition checks</li>
                <li>• Prompt response to maintenance requests</li>
                <li>• Annual review of terms and conditions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/forms/joint-ast-agreement" className="btn-primary">
            Start Joint AST Form
          </Link>
          <Link href="/forms/ast-room-instructions" className="btn-outline">
            Room-Only Instructions
          </Link>
          <Link href="/contact-us" className="btn-outline">
            Get Expert Help
          </Link>
        </div>
      </div>
    </div>
  );
}