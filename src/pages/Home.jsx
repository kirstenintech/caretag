import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GridViewIcon from "@mui/icons-material/GridView";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Home = () => {
  const features = [
    {
      icon: <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Upload & Scan",
      description:
        "Simply upload a photo of your care label and get instant results with our AI-powered scanner.",
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Learn & Explore",
      description:
        "Browse our comprehensive library of care symbols and learn what each one means.",
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Care Tips",
      description:
        "Get personalized care recommendations to keep your clothes looking their best.",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        {/* Top Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          {/* Tagline */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Never ruin your favorite clothes again
            </Typography>
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              color: "text.primary",
            }}
          >
            Understand Your{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Clothing Care
            </Box>{" "}
            Labels
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: "auto",
              color: "text.secondary",
              fontSize: "1.125rem",
            }}
          >
            Upload a photo of your care label or browse our complete symbol
            guide to learn exactly how to care for your garments.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={RouterLink}
              to="/upload"
              variant="contained"
              size="large"
              startIcon={<CloudUploadIcon />}
              sx={{ px: 4 }}
            >
              Upload Care Label
            </Button>
            <Button
              component={RouterLink}
              to="/explore"
              variant="outlined"
              size="large"
              startIcon={<GridViewIcon />}
              sx={{ px: 4 }}
            >
              Browse Symbols
            </Button>
          </Box>
        </Box>

        {/* Feature Cards Section */}
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 4,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ color: "text.primary", mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
