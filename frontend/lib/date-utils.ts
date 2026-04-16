/**
 * Date utility functions for consistent London timezone handling
 */

/**
 * Get current date formatted for London timezone
 * @param format - The format type: 'display' for DD/MM/YYYY, 'filename' for DD-MM-YYYY
 * @returns Formatted date string in London timezone
 */
export const getLondonDate = (format: 'display' | 'filename' = 'display'): string => {
  const londonDate = new Date().toLocaleDateString('en-GB', {
    timeZone: 'Europe/London',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  if (format === 'filename') {
    return londonDate.replace(/\//g, '-');
  }
  
  return londonDate;
};

/**
 * Get current date and time formatted for London timezone
 * @returns Full date and time string in London timezone
 */
export const getLondonDateTime = (): string => {
  return new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Format a filename with London date
 * @param baseName - The base filename without extension
 * @param extension - The file extension (with or without dot)
 * @returns Formatted filename with London date
 */
export const formatFilenameWithLondonDate = (baseName: string, extension: string = 'pdf'): string => {
  const cleanExtension = extension.startsWith('.') ? extension : `.${extension}`;
  const londonDate = getLondonDate('filename');
  const cleanBaseName = baseName.replace(/\s+/g, '-').toLowerCase();
  
  return `${cleanBaseName}-${londonDate}${cleanExtension}`;
};