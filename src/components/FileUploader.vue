<template>
  <div>
    <form @submit.prevent="uploadFile" class="space-y-4">
      <div class="flex items-center justify-center w-full">
        <label
          for="file-upload"
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500">PDF, DOCX, TXT, CSV, XLSX (MAX. 10MB)</p>
          </div>
          <input
            id="file-upload"
            type="file"
            class="hidden"
            accept=".pdf,.docx,.txt,.csv,.xlsx"
            @change="handleFileChange"
          />
        </label>
      </div>

      <div v-if="selectedFile" class="flex items-center space-x-2">
        <svg
          class="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <span class="text-sm font-medium">{{ selectedFile.name }}</span>
        <button
          type="button"
          @click="removeFile"
          class="text-red-500 hover:text-red-700"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <button
        type="submit"
        :disabled="!selectedFile || isUploading"
        class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isUploading" class="flex items-center justify-center">
          <svg
            class="w-5 h-5 mr-2 -ml-1 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
        <span v-else>Analyze Document</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDocumentStore } from '../stores/document';

const documentStore = useDocumentStore();
const selectedFile = ref(null);
const isUploading = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const removeFile = () => {
  selectedFile.value = null;
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  try {
    await documentStore.uploadAndAnalyze(selectedFile.value);
  } catch (error) {
    console.error('Error processing document:', error);
    alert('Failed to process document. Please try again.');
  } finally {
    isUploading.value = false;
  }
};
</script>
