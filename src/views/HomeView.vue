<template>
  <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
    <div class="px-4 py-5 sm:px-6">
      <h2 class="text-lg font-medium text-gray-900">Upload a document for analysis</h2>
      <p class="mt-1 text-sm text-gray-500">
        The document will be analyzed by Claude AI to classify its type, summarize content, and extract actions.
      </p>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <FileUploader />
    </div>
    <div v-if="documentStore.document" class="px-4 py-5 sm:p-6">
      <DocumentAnalysis />
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/document';
import FileUploader from '../components/FileUploader.vue';
import DocumentAnalysis from '../components/DocumentAnalysis.vue';

const documentStore = useDocumentStore();
</script>
