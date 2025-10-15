import { useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  validateImageFile,
  getAcceptedFileTypes,
  formatFileSize,
} from "../utils/fileValidation";

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Clear any previous errors
    setError(null);

    // Set selected file
    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  // Handle analyze image - navigate to analyzing page
  const handleAnalyzeImage = () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    // Prevent double-submission
    if (isAnalyzing) return;

    setIsAnalyzing(true);

    // Navigate to analyzing page with the file
    navigate('/analyzing', {
      state: { file: selectedFile },
    });
  };

  // Handle click on upload zone
  const handleUploadZoneClick = () => {
    fileInputRef.current?.click();
  };

  const tips = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Clear Photo",
      description: "Make sure all symbols are visible and in focus",
    },
    {
      icon: <LightModeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Good Lighting",
      description: "Use natural light when possible for best results",
    },
    {
      icon: <ZoomInIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Close Up",
      description: "Get close to the label to capture all details",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Page Header */}
        <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          <Typography
            variant="h1"
            color="text.primary"
            component="h1"
            sx={{ mb: 2 }}
          >
            Upload Your Care Label
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Take a clear photo of your garment's care label and we'll identify
            all the symbols
          </Typography>
          <MuiLink
            component={RouterLink}
            to="/explore"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Don't have a photo? Browse all care symbols →
          </MuiLink>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Upload Zone or Image Preview */}
        {!selectedFile ? (
          <Box sx={{ mb: 4 }}>
            {/* Upload Zone */}
            <Box
              onClick={handleUploadZoneClick}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: isDragging ? "primary.dark" : "primary.main",
                borderRadius: 2,
                backgroundColor: isDragging
                  ? "action.hover"
                  : "background.paper",
                p: 6,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.dark",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ImageIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
                Add your care label image
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Click to select from your device or take a new photo
              </Typography>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptedFileTypes()}
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept={getAcceptedFileTypes()}
                capture="environment"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
            </Box>
          </Box>
        ) : (
          // Image Preview
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Preview Image */}
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 400,
                    borderRadius: 2,
                    mb: 2,
                  }}
                />

                {/* File Info */}
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  {selectedFile.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {formatFileSize(selectedFile.size)}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzing}
                    sx={{ px: 4 }}
                  >
                    {isAnalyzing ? "Starting Analysis..." : "Analyze Image"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                    color="error"
                    disabled={isAnalyzing}
                  >
                    Remove Image
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
          >
            Tips for Best Results
          </Typography>
          <Grid container spacing={3}>
            {tips.map((tip, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box sx={{ mb: 2 }}>{tip.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      {tip.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tip.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Upload;
