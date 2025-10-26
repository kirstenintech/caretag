import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExploreIcon from '@mui/icons-material/Explore';
import SymbolResultCard from '../components/SymbolResultCard';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get results from navigation state
  const results = location.state?.results;

  useEffect(() => {
    // If accessed without data (e.g., page refresh), show error state
    if (results === undefined) {
      // Error will be shown by the conditional rendering below
    }
  }, [results]);

  // Sort results by confidence (descending)
  const sortedResults = results
    ? [...results].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    : [];

  // No data state (page accessed directly or after refresh)
  if (results === undefined) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <InfoOutlinedIcon
              sx={{
                fontSize: 64,
                color: 'info.main',
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              No Analysis in Progress
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              It looks like you don't have any analysis results. Please upload a
              care label image to get started.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/upload')}
              startIcon={<UploadFileIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Upload Image
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Empty results state (analysis completed but found nothing)
  if (sortedResults.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{ mb: 2 }}
            >
              Detected Symbols
            </Typography>
          </Box>

          {/* Empty State */}
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              We couldn't detect any symbols
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              The image may not contain clear care label symbols, or the lighting
              might be too low. Try taking another photo with better lighting and
              a closer view of the care label.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/upload')}
                startIcon={<UploadFileIcon />}
                sx={{ px: 4 }}
              >
                Upload Another Image
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/explore')}
                startIcon={<ExploreIcon />}
                sx={{ px: 4 }}
              >
                Browse All Symbols
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Success state with results
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Page Header */}
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Detected Symbols
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 3,
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            We found {sortedResults.length} care symbol
            {sortedResults.length !== 1 ? 's' : ''} on your label
          </Typography>
        </Box>

        {/* Symbol Cards */}
        <Box sx={{ mb: 4 }}>
          {sortedResults.map((symbol, index) => (
            <SymbolResultCard
              key={symbol.title || index}
              symbol={symbol}
              index={index}
            />
          ))}
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            pb: 4,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/upload')}
            startIcon={<UploadFileIcon />}
          >
            Analyze Another Image
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/explore')}
            startIcon={<ExploreIcon />}
          >
            Browse All Symbols
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Results;
