# Document Processor

A Vue 3 application that allows users to upload documents for analysis by Claude AI. The application classifies document types, summarizes content, and extracts action items.

## Features

- Upload documents for analysis
- Client-side preprocessing to handle large files
- Connect to Claude API for document processing
- Document classification (e.g., Insurance certificate, Meeting minutes, etc.)
- Content summarization
- Action item extraction
- Clean, responsive UI with Tailwind CSS

## Tech Stack

- Vue 3 with Composition API
- Pinia for state management
- Axios for API communication
- TailwindCSS for styling
- Vite for build tooling
- PapaParse for CSV parsing
- SheetJS for Excel file processing

## Setup

```bash
# Clone the repository
git clone https://github.com/simon-lennon/vue_document_processor.git
cd vue_document_processor

# Install dependencies
npm install

# Create a .env file with your Claude API key
echo "VITE_CLAUDE_API_KEY=your_api_key_here" > .env

# Start development server
npm run dev
```

## API Configuration

You need to obtain an API key from Anthropic to use Claude. Visit [Anthropic's website](https://www.anthropic.com/) to get an API key, then add it to your `.env` file.

## How It Handles Large Files

This application addresses the Claude API context window limitations by:

1. **Client-side preprocessing**: Files are processed in the browser before sending to Claude
2. **Intelligent summarization**: For large files (CSV, Excel), it creates a concise summary
3. **Content truncation**: If text is still too large, it's intelligently truncated
4. **Metadata extraction**: File metadata is preserved and displayed

This approach allows for analyzing documents that would otherwise exceed Claude's context window.

## Supported File Types

- **Text files (.txt)**: Full text is extracted and truncated if needed
- **CSV files (.csv)**: Summarized with column names and sample rows
- **Excel files (.xlsx, .xls)**: Sheet information and sample data extracted
- **PDF files (.pdf)**: Basic support (would require PDF.js in production)
- **Word documents (.docx)**: Basic support (would require additional libraries in production)

## Usage

1. Upload your document using the file upload component
2. The document is preprocessed in the browser to extract key information
3. The processed content is sent to Claude for analysis
4. View the document classification, summary, and action items

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── assets/             # Application assets
│   ├── components/         # Vue components
│   │   ├── FileUploader.vue    # File upload component
│   │   └── DocumentAnalysis.vue # Document analysis display
│   ├── router/             # Vue Router
│   ├── services/           # API services
│   │   ├── claude-service.js  # Claude API integration
│   │   └── file-processor.js  # File processing service
│   ├── stores/             # Pinia stores
│   │   └── document.js     # Document state management
│   ├── views/              # Page components
│   │   └── HomeView.vue    # Main application view
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── .env                    # Environment variables (create this)
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## License

MIT
