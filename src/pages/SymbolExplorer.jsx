import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Paper,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SymbolCard from "../components/SymbolCard";
import { getAllSymbols } from "../services/symbolService";
import { getImageUrl } from "../utils/imageUtils";

const categories = [
  { id: "washing", label: "Washing", emoji: "🧺" },
  { id: "bleach", label: "Bleach", emoji: "🧪" },
  { id: "drying", label: "Drying", emoji: "👕" },
  { id: "ironing", label: "Ironing", emoji: "🔥" },
  { id: "dry-cleaning", label: "Dry Cleaning", emoji: "✨" },
];

const SymbolExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState("washing");
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Fetch symbols from Appwrite on component mount
  useEffect(() => {
    // Prevent duplicate calls in StrictMode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchSymbols = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllSymbols();

        // Log first symbol to check structure
        if (data.length > 0) {
          console.log("Sample symbol data:", data[0]);
        }

        // Transform data and construct image URLs
        const transformedData = data.map((symbol) => ({
          id: symbol.$id,
          category: symbol.category,
          title: symbol.title,
          shortDescription: symbol.shortDescription || symbol.description,
          image: symbol.image ? getImageUrl(symbol.image) : null,
        }));

        setSymbols(transformedData);
      } catch (err) {
        setError(
          err.message || "Failed to load symbols. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  const handleCategoryChange = (_event, newValue) => {
    setSelectedCategory(newValue);
  };

  // Filter symbols by selected category
  const filteredSymbols = symbols.filter(
    (symbol) => symbol.category === selectedCategory
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
        alignItems: "center",
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
          <Typography
            variant="h1"
            color="text.primary"
            component="h1"
            sx={{
              mb: 2,
            }}
          >
            Explore Care Symbols
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Browse and learn about laundry care symbols by category
          </Typography>
          <MuiLink
            component={RouterLink}
            to="/upload"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Have a care label photo? Upload it for instant identification →
          </MuiLink>
        </Box>

        {/* Category Filter Tabs */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            centered={false}
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: { xs: "flex-start", md: "center" },
              },
              "& .MuiTab-root": {
                minHeight: 64,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 500,
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                minWidth: { xs: "auto", sm: 120 },
              },
              "& .Mui-selected": {
                fontWeight: 600,
              },
              "& .MuiTabs-scrollButtons": {
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span style={{ fontSize: "1.2rem" }}>{category.emoji}</span>
                    <span>{category.label}</span>
                  </Box>
                }
                value={category.id}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Symbol Grid */}
        {!loading && !error && (
          <Box
            sx={{
              transition: "opacity 0.3s ease",
            }}
          >
            <Grid container spacing={3}>
              {filteredSymbols.map((symbol) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={symbol.id}>
                  <SymbolCard symbol={symbol} />
                </Grid>
              ))}
            </Grid>

            {/* Empty State */}
            {filteredSymbols.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No symbols found in this category
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SymbolExplorer;
