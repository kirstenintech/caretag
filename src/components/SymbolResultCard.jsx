import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  LinearProgress,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
  Grid,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getImageUrl } from "../utils/imageUtils";

// Fixed category colors (stable across app, not confidence-based)
const CATEGORY_CONFIG = {
  washing: { label: "Washing", color: "primary" }, // Blue
  drying: { label: "Drying", color: "warning" }, // Orange
  ironing: { label: "Ironing", color: "error" }, // Red
  bleach: { label: "Bleach", color: "secondary" }, // Purple
  "dry-cleaning": { label: "Dry Cleaning", color: "info" }, // Pink/Info
};

const SymbolResultCard = ({ symbol }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Get image URL from fileId
  const imageUrl = symbol.image ? getImageUrl(symbol.image) : null;

  // Get category config
  const categoryConfig = CATEGORY_CONFIG[symbol.category] || {
    label: symbol.category,
    color: "default",
  };

  // Format confidence as percentage
  const confidencePercent = Math.round((symbol.confidence || 0) * 100);

  // Parse Do's and Don'ts (split by newline only)
  const parseDosAndDonts = (text) => {
    if (!text || typeof text !== "string") return [];
    return text
      .split(/\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const dosList = parseDosAndDonts(symbol.dos);
  const dontsList = parseDosAndDonts(symbol.donts);

  const hasMoreInfo = dosList.length > 0 || dontsList.length > 0;

  return (
    <Card
      sx={{
        mb: 3,
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        {/* Better grid structure: fixed columns for icon and confidence */}
        <Grid container spacing={3} alignItems="flex-start">
          {/* Left column: Image + Confidence on mobile */}
          <Grid size={{ xs: 12, sm: 2, md: 1.5 }}>
            <Stack
              direction={{ xs: "row", sm: "column" }}
              spacing={2}
              alignItems={{ xs: "center", sm: "flex-start" }}
              justifyContent={{ xs: "space-between", sm: "flex-start" }}
            >
              {/* Symbol Image */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {!imageLoaded && !imageError && imageUrl && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ position: "absolute" }}
                  />
                )}
                {imageUrl && !imageError ? (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={symbol.title || "Care symbol"}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      console.error("Failed to load image:", imageUrl);
                      setImageError(true);
                    }}
                    sx={{
                      width: "90%",
                      height: "90%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    align="center"
                  >
                    {imageError ? "Failed to load" : "No image"}
                  </Typography>
                )}
              </Box>

              {/* Confidence on mobile - pushed to right */}
              <Box sx={{ display: { xs: "block", sm: "none" } }}>
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography
                    variant="h3"
                    component="div"
                    color={
                      confidencePercent >= 80 ? "success.main" : "warning.main"
                    }
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {confidencePercent}%
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    confidence
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Content - Flexible middle column */}
          <Grid size="grow">
            <Stack spacing={2}>
              {/* Title */}
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                {symbol.title || "Unknown Symbol"}
              </Typography>

              {/* Category Chip - Soft filled blue */}
              {symbol.category && (
                <Box>
                  <Chip
                    label={categoryConfig.label}
                    size="small"
                    sx={{
                      bgcolor: "#E6F2FF",
                      color: "text.primary",
                      fontWeight: 500,
                      "& .MuiChip-label": {
                        px: 2,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Short Description */}
              {symbol.shortDescription && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {symbol.shortDescription}
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Confidence Block - Desktop only, fixed width column on right */}
          <Grid size="auto" sx={{ display: { xs: "none", sm: "block" } }}>
            <Stack
              spacing={0.5}
              alignItems="flex-end"
              sx={{
                minWidth: 100,
                textAlign: "right",
              }}
            >
              <Typography
                variant="h3"
                component="div"
                color={
                  confidencePercent >= 80 ? "success.main" : "warning.main"
                }
                sx={{
                  fontWeight: 700,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {confidencePercent}%
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap" }}
              >
                confidence
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* More Info Section */}
        {hasMoreInfo && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="Show more information"
                size="large"
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <ExpandMoreIcon fontSize="large" />
              </IconButton>
              <Typography
                variant="body1"
                color="primary"
                fontWeight={500}
                sx={{ cursor: "pointer" }}
                onClick={handleExpandClick}
              >
                {expanded ? "Hide" : "Show"} care instructions
              </Typography>
            </Box>

            {/* Collapsible Content */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                  {/* Do's Box */}
                  {dosList.length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          bgcolor: "#E8F5E9",
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        {/* Header Row */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <CheckCircleIcon
                            sx={{ color: "success.main", fontSize: 24 }}
                          />
                          <Typography
                            variant="h6"
                            color="success.main"
                            sx={{ fontWeight: 600 }}
                          >
                            Do's
                          </Typography>
                        </Box>

                        {/* List Items */}
                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                          {dosList.map((item, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{ lineHeight: 1.6 }}
                              >
                                {item}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {/* Don'ts Box */}
                  {dontsList.length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          bgcolor: "#FFEBEE",
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        {/* Header Row */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <CancelIcon
                            sx={{ color: "error.main", fontSize: 24 }}
                          />
                          <Typography
                            variant="h6"
                            color="error.main"
                            sx={{ fontWeight: 600 }}
                          >
                            Don'ts
                          </Typography>
                        </Box>

                        {/* List Items */}
                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                          {dontsList.map((item, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{ lineHeight: 1.6 }}
                              >
                                {item}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SymbolResultCard;
