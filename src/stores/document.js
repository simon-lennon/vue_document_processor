import { defineStore } from 'pinia';
import { claudeService } from '../services/claude-service';

export const useDocumentStore = defineStore('document', {
  state: () => ({
    document: null,
    loading: false,
    error: null,
  }),
  actions: {
    async uploadAndAnalyze(file) {
      this.loading = true;
      this.error = null;
      
      try {
        // Read the file
        const fileContent = await readFileAsBase64(file);
        
        // Prepare the prompt for Claude
        const prompt = `I'm sending you a document to analyze. Please: 
1. Classify what type of document this is (e.g. invoice, contract, memo, report, etc.)
2. Provide a short summary of the key points (3-5 sentences)
3. List any specific actions or follow-ups required based on the document

Respond with a JSON object with the following structure:
{
  "classification": "Document Type",
  "summary": "Summary of the document...",
  "actions": ["Action 1", "Action 2", ...]
}

Here is the document content: ${fileContent}`;
        
        // Send to Claude API
        const analysisResult = await claudeService.analyzeDocument(prompt);
        
        // Parse and store the result
        this.document = analysisResult;
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
      this.error = null;
    },
  },
});

// Helper function to read file as base64
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 content (remove the data URL prefix)
      const base64Content = reader.result.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
}
