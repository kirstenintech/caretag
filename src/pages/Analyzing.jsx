import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  LinearProgress,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import { uploadImage } from '../services/uploadService';
import { detectSymbols } from '../services/inferenceService';

// Loading stages
const STAGES = {
  UPLOADING: 'uploading',
  ANALYZING: 'analyzing',
  PREPARING: 'preparing',
};

const STAGE_MESSAGES = {
  [STAGES.UPLOADING]: 'Uploading your image…',
  [STAGES.ANALYZING]: 'Analyzing care symbols…',
  [STAGES.PREPARING]: 'Preparing your results…',
};

const Analyzing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState(STAGES.UPLOADING);
  const [error, setError] = useState(null);

  // Get the file from navigation state
  const file = location.state?.file;

  useEffect(() => {
    // If no file provided, redirect back to upload
    if (!file) {
      navigate('/upload', { replace: true });
      return;
    }

    // Start the analysis process
    analyzeImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzeImage = async () => {
    try {
      // Stage 1: Upload image
      setStage(STAGES.UPLOADING);
      setError(null);

      const fileId = await uploadImage(file);

      // Stage 2: Analyze symbols
      setStage(STAGES.ANALYZING);

      const results = await detectSymbols(fileId);

      // Stage 3: Prepare results
      setStage(STAGES.PREPARING);

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to results page with data
      navigate('/results', {
        state: {
          results: results.results || [],
          fileId: results.fileId || fileId,
        },
        replace: true,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
    }
  };

  const handleRetry = () => {
    analyzeImage();
  };

  const handleBack = () => {
    navigate('/upload', { replace: true });
  };

  // Calculate progress percentage based on stage
  const getProgress = () => {
    switch (stage) {
      case STAGES.UPLOADING:
        return 33;
      case STAGES.ANALYZING:
        return 66;
      case STAGES.PREPARING:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4 },
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
          }}
        >
          {!error ? (
            <Box sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Title */}
              <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                sx={{ fontWeight: 600, mb: 1 }}
              >
                Analyzing your photo
              </Typography>

              {/* Current stage message */}
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                role="status"
                aria-live="polite"
                sx={{ mb: 5 }}
              >
                {STAGE_MESSAGES[stage]}
              </Typography>

              {/* Animated illustration */}
              <Box
                sx={{
                  width: { xs: 120, sm: 160 },
                  height: { xs: 120, sm: 160 },
                  mx: 'auto',
                  mb: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Outer rotating ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: 3,
                    borderColor: 'primary.light',
                    borderRadius: '50%',
                    borderTopColor: 'primary.main',
                    borderRightColor: 'primary.main',
                    animation: 'spin 2s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />

                {/* Inner pulsing circle */}
                <Box
                  sx={{
                    width: '70%',
                    height: '70%',
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    opacity: 0.1,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(0.8)',
                        opacity: 0.1,
                      },
                      '50%': {
                        transform: 'scale(1)',
                        opacity: 0.2,
                      },
                    },
                  }}
                />

                {/* Center icon - changes based on stage */}
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {stage === STAGES.UPLOADING && (
                    <CloudUploadIcon
                      sx={{
                        fontSize: { xs: 60, sm: 80 },
                        color: 'primary.main',
                      }}
                    />
                  )}
                  {stage === STAGES.ANALYZING && (
                    <SearchIcon
                      sx={{
                        fontSize: { xs: 60, sm: 80 },
                        color: 'primary.main',
                      }}
                    />
                  )}
                  {stage === STAGES.PREPARING && (
                    <DescriptionIcon
                      sx={{
                        fontSize: { xs: 60, sm: 80 },
                        color: 'primary.main',
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Progress bar */}
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgress()}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                      transition: 'transform 0.4s ease',
                    },
                  }}
                />
              </Box>

              {/* Helper text */}
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                display="block"
                sx={{ mb: 2 }}
              >
                This may take up to 15 seconds.
              </Typography>

              {/* Cancel button */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="text"
                  onClick={handleBack}
                  color="inherit"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Error state */}
              <Typography
                variant="h5"
                component="h1"
                align="center"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Analysis Error
              </Typography>

              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>

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
                  onClick={handleRetry}
                  fullWidth
                  sx={{ maxWidth: { sm: 200 } }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  fullWidth
                  sx={{ maxWidth: { sm: 200 } }}
                >
                  Back to Upload
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Analyzing;
