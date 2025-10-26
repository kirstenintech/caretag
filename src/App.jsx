import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SymbolExplorer from './pages/SymbolExplorer';
import Upload from './pages/Upload';
import Analyzing from './pages/Analyzing';
import Results from './pages/Results';
import About from './pages/About';

// Create a client with 24 hour cache time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (formerly cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<SymbolExplorer />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analyzing" element={<Analyzing />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
