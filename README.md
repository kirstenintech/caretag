# CareTag - AI-Powered Clothing Care Label Recognition

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/kirstenintech/caretag/workflows/CI/badge.svg)](https://github.com/kirstenintech/caretag/actions)
[![Built with Appwrite](https://img.shields.io/badge/Built%20with-Appwrite-f02e65?logo=appwrite)](https://appwrite.io)

A full-stack web application built for the **Appwrite 2025 Hacktoberfest Hackathon** that uses AI to identify and explain clothing care symbols from photos.

🔗 **Live Demo**: https://caretag.appwrite.network/

## 🧺 The Problem

Clothing care labels are confusing. They're covered in cryptic symbols that most people don't understand. This leads to:

- Googling symbols every time you buy new clothes
- Accidentally ruining garments with wrong care
- Wasting time trying to decipher washing instructions

## ✨ The Solution

CareTag uses computer vision to instantly identify care symbols from a photo of your clothing tag. Simply upload an image, and get:

- **Instant identification** of all care symbols
- **Clear explanations** of what each symbol means
- **Do's and don'ts** for caring for your garment
- **Confidence scores** for each detection

No photo? Browse our comprehensive symbol library organized by category.

## 🚀 Features

### 🔍 AI-Powered Image Recognition

- Upload photos of clothing tags
- TensorFlow Lite model detects multiple symbols
- Real-time inference via Appwrite Functions
- Confidence scores for each detection

### 📚 Symbol Library

Browse 50+ care symbols organized by category:

- 🧺 Washing
- 🧪 Bleaching
- 👕 Drying
- 🔥 Ironing
- ✨ Dry Cleaning

### ⚡ Performance

- 24-hour caching with React Query
- Lazy-loaded routes and components
- Optimized TensorFlow Lite model
- Fast symbol lookup

### 📱 Accessibility & UX

- Responsive design (mobile, tablet, desktop)
- Semantic HTML and ARIA labels
- Keyboard navigation support
- Loading states and error handling
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Material UI 7** - Component library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend (Appwrite)

- **Database** - Store care symbol metadata
- **Storage** - Handle image uploads
- **Functions** - Run TensorFlow inference

### AI/ML

- **TensorFlow Lite** - Image recognition
- **Python 3.11** - Inference function runtime
- **Transfer Learning** - Fine-tuned symbol detection model

### Dev Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD
- **Dependabot** - Dependency updates

## 📁 Project Structure

```
caretag/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── SymbolCard.jsx
│   │   └── SymbolResultCard.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── Analyzing.jsx
│   │   ├── Results.jsx
│   │   ├── SymbolExplorer.jsx
│   │   └── About.jsx
│   ├── services/           # API and business logic
│   │   ├── uploadService.js
│   │   ├── inferenceService.js
│   │   └── symbolService.js
│   ├── utils/              # Helper functions
│   ├── theme/              # MUI theme
│   └── lib/                # Appwrite SDK setup
├── functions/
│   └── care-symbols-infer/ # TensorFlow inference function
│       ├── main.py
│       ├── predict.py
│       └── requirements.txt
├── public/                 # Static assets
├── .github/
│   └── workflows/          # CI/CD pipelines
└── README.md
```

## 🏃 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Appwrite Cloud** account ([sign up free](https://cloud.appwrite.io))
- (Optional) Python 3.9+ for local function testing

### Installation

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

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Appwrite credentials (see Appwrite Setup below).

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Linting

```bash
npm run lint     # Run ESLint
```

## ☁️ Appwrite Setup

### 1. Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Copy your Project ID

### 2. Create Database

1. Navigate to **Databases** → **Create Database**
2. Name it `caretag-db`
3. Create a collection named `care_symbols`
4. Add the following attributes:

| Attribute        | Type   | Size | Required |
| ---------------- | ------ | ---- | -------- |
| title            | String | 255  | Yes      |
| category         | String | 50   | Yes      |
| shortDescription | String | 500  | Yes      |
| description      | String | 2000 | No       |
| dos              | String | 1000 | No       |
| donts            | String | 1000 | No       |
| image            | String | 255  | Yes      |

5. Set permissions to allow **Read** access for **Any** user

### 3. Create Storage Bucket

1. Navigate to **Storage** → **Create Bucket**
2. Name it `care-label-uploads`
3. Set max file size to `10MB`
4. Allow file extensions: `jpg, jpeg, png, webp`
5. Set permissions to allow **Create** for **Any** user

### 4. Deploy Appwrite Function

See detailed instructions in [`functions/care-symbols-infer/README.md`](./functions/care-symbols-infer/README.md)

**Quick steps:**

1. Navigate to **Functions** → **Create Function**
2. Upload function code (main.py, predict.py, requirements.txt)
3. Set runtime to **Python 3.11**
4. Add environment variables (see function README)
5. Deploy function

### 5. Update Environment Variables

Add all IDs to your `.env` file:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_SYMBOLS_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_APPWRITE_FUNCTION_ID=your_function_id
```

## 🎯 How It Works

1. **User uploads image** → File stored in Appwrite Storage
2. **Frontend calls Appwrite Function** → Passes file ID
3. **Function downloads image** → Loads TensorFlow model from Storage
4. **Model runs inference** → Detects care symbols with confidence scores
5. **Function enriches results** → Queries database for symbol metadata
6. **Results returned to frontend** → Displayed with explanations

## 🌐 Deployment

### Frontend

```bash
npm run build
```

Deploy the `dist/` folder to your hosting platform.

### Function

The Appwrite Function is deployed directly to Appwrite Cloud. See [`functions/care-symbols-infer/README.md`](./functions/care-symbols-infer/README.md).

## ♿ Accessibility

CareTag is built with accessibility in mind:

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Color contrast compliance
- ✅ Responsive text sizing

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build project
npm run build

# Run dev server
npm run dev
```

## 📊 Performance Optimizations

- **Code splitting**: Routes lazy-loaded
- **Caching**: 24-hour React Query cache
- **Optimized images**: WebP format support
- **Bundle size**: Vite tree-shaking
- **Model efficiency**: TensorFlow Lite (2MB vs 615MB)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Kirsten Chong**

- Software Engineer & Product Manager
- Based in Panama, working remotely for the US
- LinkedIn: [@kirstenintech](https://www.linkedin.com/in/kirstenintech/)
- GitHub: [@kirstenintech](https://github.com/kirstenintech)

## 🎉 Hackathon Submission

Built for **Appwrite 2025 Hacktoberfest Hackathon**

**What we built with Appwrite:**

- 🗄️ **Database** - Store and query care symbol metadata
- 📦 **Storage** - Handle user image uploads and ML model storage
- ⚡ **Functions** - Run TensorFlow inference server-side

**Technical Highlights:**

- Clean, modular React architecture
- Comprehensive error handling
- Production-ready CI/CD pipeline
- Accessible, responsive UI
- Performance optimizations (caching, lazy loading)
- Complete documentation

## 🙏 Acknowledgments

- Built with [Appwrite](https://appwrite.io)
- UI components from [Material UI](https://mui.com)
- Powered by [TensorFlow](https://www.tensorflow.org)
- Icons from [Material Icons](https://fonts.google.com/icons)

---

**Made with ❤️ for the Appwrite Community**
