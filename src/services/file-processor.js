import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Maximum character limit to send to Claude (adjust based on your needs)
const MAX_CHAR_LIMIT = 50000;

export const fileProcessor = {
  /**
   * Process file based on its type
   * @param {File} file - The file to process
   * @returns {Promise<string>} - Extracted text or summary
   */
  async processFile(file) {
    const fileType = getFileType(file);
    
    switch (fileType) {
      case 'txt':
        return this.processTxtFile(file);
      case 'csv':
        return this.processCsvFile(file);
      case 'xlsx':
      case 'xls':
        return this.processExcelFile(file);
      case 'pdf':
        return this.processPdfFile(file);
      case 'docx':
        return this.processDocxFile(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  },

  /**
   * Process plain text file
   */
  async processTxtFile(file) {
    const text = await readFileAsText(file);
    return this.truncateContent(text);
  },

  /**
   * Process CSV file
   */
  async processCsvFile(file) {
    const text = await readFileAsText(file);
    
    // Parse CSV
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true
    });
    
    // Generate summary
    const summary = this.generateCsvSummary(result);
    return summary;
  },

  /**
   * Process Excel file
   */
  async processExcelFile(file) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // Read workbook
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Generate summary from workbook
    const summary = this.generateExcelSummary(workbook);
    return summary;
  },

  /**
   * Process PDF file (placeholder - requires PDF.js in production)
   */
  async processPdfFile(file) {
    // In a real implementation, you'd use PDF.js to extract text
    // This is a simplified placeholder
    return `PDF file detected: ${file.name}. 
    This file type requires PDF.js library for full text extraction.
    For this demo, we're sending this placeholder text to Claude.`;
  },

  /**
   * Process DOCX file (placeholder - requires docx library in production)
   */
  async processDocxFile(file) {
    // In a real implementation, you'd use a library like docx to extract text
    // This is a simplified placeholder
    return `DOCX file detected: ${file.name}.
    This file type requires additional libraries for full text extraction.
    For this demo, we're sending this placeholder text to Claude.`;
  },

  /**
   * Create a summary of a CSV file
   */
  generateCsvSummary(parseResult) {
    const { data, meta } = parseResult;
    
    if (!data || data.length === 0) {
      return "CSV file appears to be empty.";
    }
    
    const rowCount = data.length;
    const columns = meta.fields || [];
    const columnCount = columns.length;
    
    // Sample a few rows (first 3 and last 3 if available)
    const sampleSize = Math.min(3, Math.floor(rowCount / 2));
    const firstRows = data.slice(0, sampleSize);
    const lastRows = rowCount > sampleSize * 2 ? data.slice(-sampleSize) : [];
    
    let summary = `CSV file contains ${rowCount} rows and ${columnCount} columns.\n\n`;
    summary += `Columns: ${columns.join(', ')}\n\n`;
    
    // Add sample rows to the summary
    summary += "Sample data (first few rows):\n";
    firstRows.forEach((row, i) => {
      const rowSummary = columns.map(col => `${col}: ${row[col]}`).join(' | ');
      summary += `Row ${i+1}: ${rowSummary}\n`;
    });
    
    if (lastRows.length > 0) {
      summary += "\nSample data (last few rows):\n";
      lastRows.forEach((row, i) => {
        const rowSummary = columns.map(col => `${col}: ${row[col]}`).join(' | ');
        summary += `Row ${rowCount - lastRows.length + i + 1}: ${rowSummary}\n`;
      });
    }
    
    return this.truncateContent(summary);
  },

  /**
   * Create a summary of an Excel file
   */
  generateExcelSummary(workbook) {
    // Get sheet names
    const sheetNames = workbook.SheetNames;
    
    let summary = `Excel file contains ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}\n\n`;
    
    // Process each sheet (up to first 3 sheets)
    const processSheetCount = Math.min(3, sheetNames.length);
    
    for (let i = 0; i < processSheetCount; i++) {
      const sheetName = sheetNames[i];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length > 0) {
        const rowCount = jsonData.length;
        const colCount = jsonData[0]?.length || 0;
        
        summary += `Sheet "${sheetName}": ${rowCount} rows x ${colCount} columns\n`;
        
        // Sample data (headers plus first few rows)
        const headers = jsonData[0] || [];
        summary += `Headers: ${headers.join(', ')}\n`;
        
        // Add sample rows (up to 3)
        const sampleSize = Math.min(3, rowCount - 1);
        if (sampleSize > 0) {
          summary += "Sample data:\n";
          for (let r = 1; r <= sampleSize; r++) {
            if (jsonData[r]) {
              const rowData = jsonData[r].map((cell, idx) => {
                const header = headers[idx] || `Column ${idx+1}`;
                return `${header}: ${cell}`;
              }).join(' | ');
              summary += `Row ${r}: ${rowData}\n`;
            }
          }
        }
        
        summary += "\n";
      } else {
        summary += `Sheet "${sheetName}" appears to be empty.\n\n`;
      }
    }
    
    if (sheetNames.length > processSheetCount) {
      summary += `Note: Only showing details for the first ${processSheetCount} sheets.\n`;
    }
    
    return this.truncateContent(summary);
  },

  /**
   * Truncate content to fit within context window
   */
  truncateContent(content) {
    if (content.length <= MAX_CHAR_LIMIT) {
      return content;
    }
    
    // Simple truncation with note
    const truncated = content.substring(0, MAX_CHAR_LIMIT - 100);
    return truncated + "\n\n[Note: Content has been truncated due to size limitations. This is a summary of the beginning of the document.]";
  }
};

/**
 * Helper function to get file type from File object
 */
function getFileType(file) {
  return file.name.split('.').pop().toLowerCase();
}

/**
 * Helper function to read file as text
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Helper function to read file as ArrayBuffer
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
