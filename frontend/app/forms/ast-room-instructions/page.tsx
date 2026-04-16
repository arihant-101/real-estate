"use client";

import Link from "next/link";
import { ArrowLeft, FileText, AlertCircle, CheckCircle, Info, Download } from "lucide-react";
import { formatFilenameWithLondonDate } from "@/lib/date-utils";

export default function ASTRoomInstructionsPage() {
  const handleDownload = () => {
    const filename = formatFilenameWithLondonDate('NRLA-AST-room-only-completion-instructions-2025', 'pdf');
    const link = document.createElement('a');
    link.href = '/asta-forms/NRLA-AST-room-only-completion-instructions-2025.pdf';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const instructionSections = [
    {
      id: "before-start",
      title: "Before You Start",
      icon: Info,
      content: [
        {
          subtitle: "Document Requirements",
          points: [
            "These documents are designed for use in Adobe Acrobat Reader",
            "Avoid filling out in internet browsers to prevent data loss",
            "Download our guide to using Adobe Reader for best results",
            "Ensure you have all necessary information before beginning"
          ]
        },
        {
          subtitle: "When to Complete",
          points: [
            "Only date the agreement after all parties have signed",
            "Ensure tenant has paid deposit and first month's rent",
            "Complete right to rent checks before dating",
            "Obtain any required guarantor documentation first"
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
          subtitle: "Landlord Details",
          points: [
            "Enter your full legal name(s) in the first box",
            "Include all landlords if there are multiple owners",
            "Use the exact names as they appear on property deeds",
            "Ensure spelling is correct for legal documents"
          ]
        },
        {
          subtitle: "Tenant Information",
          points: [
            "List full names and titles of all tenants",
            "For room-only tenancy, usually one or two tenants maximum",
            "All listed tenants share joint responsibility",
            "Ensure names match identity documents exactly"
          ]
        },
        {
          subtitle: "Room Description",
          points: [
            "Describe the specific room being let (e.g., 'front bedroom on first floor')",
            "Include the full property address where the room is located",
            "Be specific about which room if there are multiple bedrooms",
            "Reference any room numbers or unique identifiers"
          ]
        },
        {
          subtitle: "Rent Details",
          points: [
            "Specify the exact rent amount in pounds",
            "Choose the payment frequency (weekly, monthly, etc.)",
            "Set the first payment due date clearly",
            "Example: £1000 due on 1st of every calendar month, first payment by 1st September 2024"
          ]
        }
      ]
    },
    {
      id: "term-details",
      title: "Term and Occupancy",
      icon: FileText,
      content: [
        {
          subtitle: "Fixed Term Length",
          points: [
            "Specify the initial fixed term (normally 6-12 months)",
            "Set the commencement date when tenants can move in",
            "Commencement date can be later than signing date",
            "Common for student lets to sign in spring for September start"
          ]
        },
        {
          subtitle: "Permitted Occupiers",
          points: [
            "List anyone else allowed to live in the room besides the tenant",
            "Room-only tenancies normally put 'nobody' in this section",
            "Particularly important if property is subject to HMO licensing",
            "Additional occupiers may affect licensing requirements"
          ]
        },
        {
          subtitle: "Shared Facilities",
          points: [
            "List all shared areas tenants can access (kitchen, bathroom, dining room)",
            "Specify any allocated parking arrangements",
            "Include garden access if applicable",
            "Be clear about any restrictions on shared areas"
          ]
        }
      ]
    },
    {
      id: "utilities",
      title: "Utilities and Services",
      icon: FileText,
      content: [
        {
          subtitle: "Responsibility Assignment",
          points: [
            "Use checkboxes and text boxes to assign utility responsibilities",
            "Mark items tenant pays with 'you' and landlord pays with 'we'",
            "Council tax is always landlord's responsibility for room-only lets (as of 1 December 2023)",
            "This is pre-selected and cannot be changed in the template"
          ]
        },
        {
          subtitle: "Deposit Information",
          points: [
            "Enter total deposit amount required from all tenants",
            "If no deposit is taken, insert 'Nil'",
            "Ensure deposit complies with legal caps (5-6 weeks' rent)",
            "Deposit must be protected in approved scheme within 30 days"
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
            "Provide full contact information for landlord or agent",
            "Include postal address, email, and phone number",
            "This information will be copied to notice serving sections",
            "Tenants must be able to contact landlord for emergencies"
          ]
        },
        {
          subtitle: "Tenant Email Addresses",
          points: [
            "Enter email address and name for each tenant",
            "This will be used for serving documents electronically",
            "Include How to Rent guide, gas safety certificates, etc.",
            "Ensure tenants consent to electronic service of documents"
          ]
        }
      ]
    },
    {
      id: "deposit-section",
      title: "Section 5.0 - The Deposit",
      icon: FileText,
      content: [
        {
          subtitle: "Deposit Holder Details",
          points: [
            "Insert name of person/organization holding the deposit (Clause 5.1)",
            "May differ from who initially received the deposit",
            "Could be agent, landlord, or custodial scheme",
            "Must be clearly identified for tenant reference"
          ]
        },
        {
          subtitle: "Protection Scheme",
          points: [
            "Specify which government-approved scheme will be used (Clause 5.2)",
            "Choose from: Deposit Protection Service, MyDeposits, or Tenancy Deposit Scheme",
            "Must be protected within 30 days of receipt",
            "Prescribed information must be provided to tenants"
          ]
        },
        {
          subtitle: "Lead Tenant (Multiple Tenants)",
          points: [
            "Designate lead tenant to manage deposit at tenancy end (Clause 5.6)",
            "They will discuss deductions and receive returned deposit",
            "Responsible for distributing shares to other tenants",
            "If only one tenant, type 'n/a'"
          ]
        },
        {
          subtitle: "Third Party Contributors",
          points: [
            "List anyone other than tenants who paid towards deposit (Clause 5.7)",
            "Include their full names and addresses",
            "They must receive prescribed information from deposit scheme",
            "If only tenants paid, put 'N/A' in both boxes"
          ]
        }
      ]
    },
    {
      id: "notices",
      title: "Section 7.3 - Notice Address",
      icon: FileText,
      content: [
        {
          subtitle: "Service of Notices",
          points: [
            "Confirm where tenant notices must be sent",
            "Information copied from your contact details on page 2",
            "Double-check accuracy of postal and email addresses",
            "Any amendments here will update page 2 information"
          ]
        }
      ]
    },
    {
      id: "signing",
      title: "Signing the Agreement",
      icon: FileText,
      content: [
        {
          subtitle: "Tenant Signatures",
          points: [
            "Insert names of each tenant in the signature boxes",
            "Tenants must sign and date next to their names",
            "Ensure all tenants sign before landlord",
            "Keep copies of signed agreement for all parties"
          ]
        },
        {
          subtitle: "Landlord Signature",
          points: [
            "Sign and date only after tenants have signed",
            "If agent signing on behalf, they should use their own name",
            "Include any addendum documents in signing process",
            "Agent should input their own address if signing on behalf"
          ]
        },
        {
          subtitle: "Final Step - Execution Date",
          points: [
            "Return to page 1 to insert execution date",
            "Only complete when ready for contract to be binding",
            "This makes the agreement legally effective",
            "Ensure all conditions precedent are met first"
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
                AST Room Only Completion Instructions
              </h1>
              <p className="text-elegant-muted">
                Step-by-step guide for completing the NRLA AST Room Only agreement (2025 edition)
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/forms/ast-room-only"
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
        <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-200 mb-2">Important Notice</h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                This tenancy agreement grants the tenant exclusive occupation over their room and shared 
                access to communal parts with other tenants. This type is ideal for houses in multiple 
                occupation (HMOs). Ensure you understand all legal requirements before proceeding.
              </p>
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

        {/* Quick Reference */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Reference Checklist</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-white mb-2">Before Starting</h3>
              <ul className="space-y-1 text-sm text-elegant-muted">
                <li>• Adobe Acrobat Reader installed</li>
                <li>• All tenant and property information ready</li>
                <li>• Deposit protection scheme chosen</li>
                <li>• Right to rent checks completed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">After Completion</h3>
              <ul className="space-y-1 text-sm text-elegant-muted">
                <li>• All parties have signed</li>
                <li>• Execution date added</li>
                <li>• Copies provided to all tenants</li>
                <li>• Deposit protected within 30 days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/forms/ast-room-only" className="btn-primary">
            Start Completing Form
          </Link>
          <Link href="/forms/nrla-checklist" className="btn-outline">
            View Checklist
          </Link>
          <Link href="/contact-us" className="btn-outline">
            Get Help
          </Link>
        </div>
      </div>
    </div>
  );
}