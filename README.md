# Document Processor

A Vue 3 application that allows users to upload documents for analysis by Claude AI. The application classifies document types, summarizes content, and extracts action items.

## Features

- Upload documents for analysis
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

## Usage

1. Upload your document using the file upload component
2. The document will be sent to Claude API for analysis
3. View the document classification, summary, and action items

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
│   │   └── claude-service.js  # Claude API integration
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

## How It Works

1. Users upload documents through the `FileUploader` component
2. The file is converted to Base64 and sent to the Claude API
3. Claude analyzes the document and returns a structured JSON response
4. The application displays the classification, summary, and action items

## Supported File Types

- PDF
- DOCX (Microsoft Word)
- TXT (Plain text)
- CSV (Comma-separated values)
- XLSX (Microsoft Excel)

## License

MIT
