import { Client, Databases, Storage } from 'appwrite';

// Appwrite configuration
const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  symbolsCollectionId: import.meta.env.VITE_APPWRITE_SYMBOLS_COLLECTION_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};

// Validate configuration
const validateConfig = () => {
  const requiredVars = [
    'endpoint',
    'projectId',
    'databaseId',
    'symbolsCollectionId',
    'bucketId',
  ];

  const missing = requiredVars.filter(
    (key) => !appwriteConfig[key] || appwriteConfig[key] === `your_${key}_here`
  );

  if (missing.length > 0) {
    console.error(
      'Missing or invalid Appwrite configuration:',
      missing.map((key) => `VITE_APPWRITE_${key.toUpperCase()}`)
    );
    return false;
  }

  return true;
};

// Initialize Appwrite client
const client = new Client();

if (validateConfig()) {
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);
}

// Initialize services
const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage, appwriteConfig, validateConfig };
