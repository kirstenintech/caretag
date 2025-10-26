import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SymbolExplorer from './pages/SymbolExplorer';
import Upload from './pages/Upload';
import Analyzing from './pages/Analyzing';
import Results from './pages/Results';
import About from './pages/About';

function App() {
  return (
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
  );
}

export default App;
