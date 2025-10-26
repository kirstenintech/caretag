# CareTag - Clothing Care Label Recognition

A full-stack web application built for the Appwrite 2025 Hacktoberfest Hackathon that uses AI to identify and explain clothing care symbols from photos.

## The Problem

Clothing tags are confusing. Most of the time they're just a bunch of symbols that don't make sense at first glance. This leads to people searching online every time they buy new clothes, which is annoying and time-consuming.

## The Solution

CareTag lets you upload a picture of your clothing tag and automatically identifies the care symbols using computer vision. It tells you what each symbol means—whether it should be washed, ironed, dry cleaned, or not bleached. If you don't have a photo, you can also browse through all the symbols and check their meanings directly.

## Live Demo

[Add your deployed URL here]

## Tech Stack

- **Frontend**: React, Material UI, Vite
- **Backend**: Appwrite (Database, Storage, Functions)
- **AI/ML**: TensorFlow Lite for image recognition
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router

## Project Structure

This is a monorepo containing both the frontend application and the Appwrite Function:

```
caretag/
├── src/                          # React frontend application
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components
│   ├── services/                 # API and business logic
│   ├── theme/                    # MUI theme configuration
│   └── utils/                    # Utility functions
├── functions/                    # Appwrite Functions
│   └── care-symbols-infer/       # AI inference function
│       ├── main.py               # Function entrypoint
│       ├── predict.py            # ML inference logic
│       └── requirements.txt      # Python dependencies
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## Features

### 🔍 Image Recognition

Upload a photo of your care label and get instant AI-powered symbol identification with confidence scores.

### 📚 Symbol Explorer

Browse a comprehensive library of all care symbols organized by category:

- Washing
- Bleaching
- Drying
- Ironing
- Dry Cleaning

### ⚡ Smart Caching

Symbols are cached for 24 hours using React Query to minimize API calls and improve performance.

### 📱 Responsive Design

Works seamlessly on desktop, tablet, and mobile devices.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (for the Appwrite Function)
- An Appwrite account (Cloud or self-hosted)

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/kirstenintech/caretag.git
   cd caretag
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_SYMBOLS_COLLECTION_ID=your_collection_id
   VITE_APPWRITE_BUCKET_ID=your_bucket_id
   VITE_APPWRITE_FUNCTION_ID=your_function_id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Appwrite Function Setup

See the [Function README](./functions/care-symbols-infer/README.md) for detailed setup instructions.

**Quick Start:**

1. Navigate to the function directory:

   ```bash
   cd functions/care-symbols-infer
   ```

2. Deploy to Appwrite:

   ```bash
   appwrite deploy function
   ```

3. Configure environment variables in Appwrite Console (see Function README for details)

## Database Schema

### Care Symbols Collection

| Field              | Type   | Description                                                      |
| ------------------ | ------ | ---------------------------------------------------------------- |
| `title`            | string | Symbol name (e.g., "Do Not Bleach")                              |
| `category`         | string | Symbol category (washing, bleach, drying, ironing, dry-cleaning) |
| `shortDescription` | string | Brief explanation                                                |
| `description`      | string | Detailed explanation                                             |
| `dos`              | string | What you should do                                               |
| `donts`            | string | What you should avoid                                            |
| `image`            | string | File ID of symbol image                                          |

## API Usage

### Detect Symbols

**Endpoint**: `POST /v1/functions/{functionId}/executions`

**Request Body**:

```json
{
  "fileId": "uploaded_image_file_id",
  "topK": 5,
  "threshold": 0.4
}
```

**Response**:

```json
{
  "success": true,
  "results": [
    {
      "title": "Do Not Bleach",
      "confidence": 0.9977,
      "shortDescription": "Do not use bleach on this garment",
      "dos": "Use color-safe alternatives",
      "donts": "Don't use any type of bleach",
      "category": "bleach"
    }
  ]
}
```

## Development

### Frontend Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Project Scripts

- Development server runs on `http://localhost:5173`
- Hot module replacement (HMR) enabled
- Material UI with custom theming

## Deployment

### Frontend (Vercel/Netlify)

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting platform

### Appwrite Function

See [Function README](./functions/care-symbols-infer/README.md) for deployment instructions.

## Contributing

This project was built for the Appwrite 2025 Hacktoberfest Hackathon. Contributions, issues, and feature requests are welcome!

## Hackathon Submission

**Key Features**:

- Full-stack application using Appwrite Database, Storage, and Functions
- Image recognition with TensorFlow
- Responsive React frontend with Material UI
- Smart caching with React Query

## Author

**Kirsten Chong**

- Software Engineer & Product Manager
- Based in Panama, working remotely for the US
- [LinkedIn](https://www.linkedin.com/in/kirstenintech/)

## License

MIT

## Acknowledgments

- Built with [Appwrite](https://appwrite.io)
- UI components from [Material UI](https://mui.com)
- Powered by [TensorFlow](https://www.tensorflow.org)
