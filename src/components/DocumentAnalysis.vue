<template>
  <div class="space-y-8">
    <h2 class="text-xl font-semibold text-gray-900 pb-2 border-b">Document Analysis</h2>
    
    <!-- File Metadata -->
    <div>
      <h3 class="text-lg font-medium text-gray-900">File Information</h3>
      <div class="mt-2 p-3 bg-gray-50 rounded-md">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div class="text-gray-500">Filename:</div>
          <div>{{ document.filename }}</div>
          
          <div class="text-gray-500">File Type:</div>
          <div>{{ formatFileType(document.fileType) }}</div>
          
          <div class="text-gray-500">Size:</div>
          <div>{{ formatFileSize(document.fileSize) }}</div>
        </div>
      </div>
    </div>
    
    <!-- Document Type -->
    <div>
      <h3 class="text-lg font-medium text-gray-900">Document Type</h3>
      <div class="mt-2 p-3 bg-gray-50 rounded-md">
        <div class="flex items-center">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ document.classification }}
          </span>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div>
      <h3 class="text-lg font-medium text-gray-900">Summary</h3>
      <div class="mt-2 p-3 bg-gray-50 rounded-md">
        <p class="text-sm text-gray-600 whitespace-pre-line">{{ document.summary }}</p>
      </div>
    </div>

    <!-- Action Items -->
    <div v-if="document.actions && document.actions.length > 0">
      <h3 class="text-lg font-medium text-gray-900">Action Items</h3>
      <div class="mt-2 space-y-2">
        <ul class="list-disc list-inside pl-4">
          <li
            v-for="(action, index) in document.actions"
            :key="index"
            class="text-sm text-gray-600"
          >
            {{ action }}
          </li>
        </ul>
      </div>
    </div>

    <!-- No Actions -->
    <div v-else>
      <h3 class="text-lg font-medium text-gray-900">Action Items</h3>
      <div class="mt-2 p-3 bg-gray-50 rounded-md">
        <p class="text-sm text-gray-500 italic">No action items identified.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDocumentStore } from '../stores/document';

const documentStore = useDocumentStore();

const document = computed(() => documentStore.document);

// Format file size to human-readable format
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Format file type for display
const formatFileType = (type) => {
  if (!type) return 'Unknown';
  
  // Map MIME types to more readable names
  const mimeMap = {
    'application/pdf': 'PDF Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'text/plain': 'Plain Text',
    'text/csv': 'CSV File'
  };
  
  return mimeMap[type] || type;
};
</script>
