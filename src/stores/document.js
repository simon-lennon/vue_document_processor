import { defineStore } from 'pinia';
import { claudeService } from '../services/claude-service';
import { fileProcessor } from '../services/file-processor';

export const useDocumentStore = defineStore('document', {
  state: () => ({
    document: null,
    originalFile: null,
    loading: false,
    error: null,
  }),
  
  actions: {
    async uploadAndAnalyze(file) {
      this.loading = true;
      this.error = null;
      this.originalFile = file;
      
      try {
        // Process the file to extract content or create a summary
        const processedContent = await fileProcessor.processFile(file);
        
        // Prepare the prompt for Claude
        const prompt = `I'm sending you information extracted from a document to analyze. 
Please analyze this and:
1. Classify what type of document this appears to be (e.g. invoice, contract, memo, report, insurance certificate, etc.)
2. Provide a short summary of the key points (3-5 sentences)
3. List any specific actions or follow-ups required based on the document content

Respond with a JSON object with the following structure:
{
  "classification": "Document Type",
  "summary": "Summary of the document...",
  "actions": ["Action 1", "Action 2", ...]
}

Here is the extracted content or summary from the document: 

${processedContent}`;
        
        // Send to Claude API
        const analysisResult = await claudeService.analyzeDocument(prompt);
        
        // Store the result
        this.document = {
          ...analysisResult,
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
        };
      } catch (error) {
        console.error('Error in document analysis:', error);
        this.error = error.message || 'Failed to analyze document';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    clearDocument() {
      this.document = null;
      this.originalFile = null;
      this.error = null;
    },
  },
});
