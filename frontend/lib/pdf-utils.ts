import jsPDF from 'jspdf';
import { getLondonDate, formatFilenameWithLondonDate } from './date-utils';

export interface FormData {
  [key: string]: any;
}

export const downloadFormAsPDF = (formData: FormData, formTitle: string, formType: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(formTitle, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('ASTA Property Management', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  const currentDate = getLondonDate('display');
  doc.text(`Generated on: ${currentDate} (London time)`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Add a line separator
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;
  
  // Form content
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  
  const addNewPageIfNeeded = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };
  
  const addSection = (title: string, content: string | string[], isArray: boolean = false) => {
    addNewPageIfNeeded(30);
    
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    
    if (isArray && Array.isArray(content)) {
      content.forEach((item, index) => {
        addNewPageIfNeeded();
        doc.text(`${index + 1}. ${item}`, 25, yPosition);
        yPosition += 6;
      });
    } else if (typeof content === 'string') {
      const lines = doc.splitTextToSize(content || 'Not specified', pageWidth - 40);
      lines.forEach((line: string) => {
        addNewPageIfNeeded();
        doc.text(line, 25, yPosition);
        yPosition += 6;
      });
    }
    yPosition += 5;
  };
  
  // Generate content based on form type
  if (formType === 'ast-room-only') {
    addSection('Landlord Information', formData.landlordName || 'Not specified');
    addSection('Landlord Address', formData.landlordAddress || 'Not specified');
    addSection('Tenant(s)', formData.tenantNames?.filter(Boolean).join(', ') || 'Not specified');
    addSection('Property Address', formData.propertyAddress || 'Not specified');
    addSection('Room Description', formData.roomDescription || 'Not specified');
    addSection('Rent Amount', formData.rentAmount ? `£${formData.rentAmount} ${formData.rentPeriod}` : 'Not specified');
    addSection('Deposit Amount', formData.depositAmount ? `£${formData.depositAmount}` : 'Not specified');
    addSection('Shared Facilities', formData.sharedFacilities || 'Not specified');
    
    // Utilities section
    if (formData.utilities) {
      const utilitiesText = Object.entries(formData.utilities)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value === 'landlord' ? 'Landlord pays' : 'Tenant pays'}`)
        .join('\n');
      addSection('Utilities Responsibility', utilitiesText);
    }
  } else if (formType === 'joint-ast') {
    addSection('Landlord Information', formData.landlordName || 'Not specified');
    addSection('Landlord Address', formData.landlordAddress || 'Not specified');
    addSection('Tenants', formData.tenants?.map((t: any) => t.name).filter(Boolean).join(', ') || 'Not specified');
    addSection('Property Address', formData.propertyAddress || 'Not specified');
    addSection('Rent Amount', formData.rentAmount ? `£${formData.rentAmount} ${formData.rentPeriod}` : 'Not specified');
    addSection('Deposit Amount', formData.depositAmount ? `£${formData.depositAmount}` : 'Not specified');
    addSection('Lead Tenant', formData.leadTenant || 'Not specified');
    
    // Utilities section
    if (formData.utilities) {
      const utilitiesText = Object.entries(formData.utilities)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value === 'landlord' ? 'Landlord pays' : 'Tenant pays'}`)
        .join('\n');
      addSection('Utilities Responsibility', utilitiesText);
    }
  } else if (formType === 'how-to-rent') {
    addSection('How to Rent Guide', 'This is the official government guide for renting in England (October 2023).');
    addSection('Purpose', 'This guide provides essential information for tenants about their rights and responsibilities when renting privately.');
    addSection('Key Sections Covered', [
      'Before you start renting',
      'Looking for your new home',
      'When you\'ve found a place',
      'Living in your rented home',
      'At the end of the fixed period',
      'If things go wrong'
    ], true);
    addSection('Important Note', 'This guide must be provided by landlords to tenants at the start of an assured shorthold tenancy.');
  } else if (formType === 'nrla-checklist') {
    addSection('NRLA Checklist', 'Comprehensive checklist for landlords and tenants to ensure compliance.');
    addSection('Categories Covered', [
      'Landlord Pre-Tenancy Requirements',
      'Tenant Pre-Tenancy Preparation',
      'Legal Requirements and Compliance',
      'Safety and Compliance Measures'
    ], true);
    addSection('Purpose', 'This checklist helps ensure all legal requirements are met and both parties understand their obligations.');
  }
  
  // Footer
  addNewPageIfNeeded(30);
  yPosition = pageHeight - 30;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by ASTA Property Management Forms System', pageWidth / 2, yPosition, { align: 'center' });
  doc.text('This document is for reference purposes only. Please consult legal advice for specific situations.', pageWidth / 2, yPosition + 5, { align: 'center' });
  
  // Download the PDF
  const fileName = formatFilenameWithLondonDate(formTitle);
  doc.save(fileName);
};

export const downloadStaticPDF = (title: string, content: string[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('ASTA Property Management', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;
  
  const currentDate = getLondonDate('display');
  doc.text(`Generated on: ${currentDate} (London time)`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Add a line separator
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 15;
  
  // Content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const addNewPageIfNeeded = (requiredSpace: number = 15) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };
  
  content.forEach((paragraph) => {
    addNewPageIfNeeded();
    const lines = doc.splitTextToSize(paragraph, pageWidth - 40);
    lines.forEach((line: string) => {
      addNewPageIfNeeded();
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });
    yPosition += 4; // Extra space between paragraphs
  });
  
  // Footer
  yPosition = pageHeight - 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by ASTA Property Management Forms System', pageWidth / 2, yPosition, { align: 'center' });
  
  // Download the PDF
  const fileName = formatFilenameWithLondonDate(title);
  doc.save(fileName);
};