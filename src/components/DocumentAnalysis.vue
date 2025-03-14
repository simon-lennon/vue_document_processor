<template>
  <div class="space-y-8">
    <h2 class="text-xl font-semibold text-gray-900 pb-2 border-b">Document Analysis</h2>
    
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
</script>
