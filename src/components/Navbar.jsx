import { useRef, useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import { Link, useLocation } from "react-router-dom";

// Array containing navigation items
const navItems = [
  { label: "Home", path: "/" },
  { label: "Upload", path: "/upload" },
  { label: "Browse Symbols", path: "/explore" },
  { label: "About", path: "/about" },
];

/**
 * Component representing the navigation drawer content.
 */
const DrawerElement = ({ boxHeight, handleDrawerToggle, location }) => {
  return (
    <Box sx={{ textAlign: "center", height: `calc(100% - ${boxHeight}px)` }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: "center", px: 4.25 }}>
              <Link
                to={item.path}
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Button
                  disableElevation
                  size="large"
                  onClick={handleDrawerToggle}
                  sx={{
                    width: 1,
                    justifyContent: "center",
                    py: 2,
                    textTransform: "none",
                    backgroundColor:
                      location.pathname === item.path
                        ? "primary.main"
                        : "transparent",
                    color:
                      location.pathname === item.path
                        ? "common.white"
                        : "text.primary",
                  }}
                  variant="contained"
                >
                  {item.label}
                </Button>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

/**
 * Main navigation bar component for the application.
 */
const Navbar = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const boxRef = useRef(null);
  const location = useLocation();

  // Handle scroll lock when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  // Close drawer when route changes
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileOpen]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prevState) => !prevState);
  }, []);

  const boxHeight = boxRef.current
    ? boxRef.current.getBoundingClientRect().height
    : 0;

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      id="appbar"
      ref={boxRef}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <CssBaseline />
      <AppBar
        position="relative"
        color="transparent"
        component="nav"
        sx={{
          boxShadow: {
            xs: "0",
            lg: "0px 2px 4px rgba(0, 0, 0, 0.10)",
          },
          bgcolor: "white",
        }}
      >
        <Toolbar
          sx={{
            pl: 4,
            display: "flex",
            justifyContent: "space-between",
            mt: { xs: 3.75, md: 0 },
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <LocalLaundryServiceIcon sx={{ color: "primary.main" }} />
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                fontWeight: 700,
              }}
            >
              CareTag
            </Typography>
          </Link>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
                lg: "block",
                xl: "block",
              },
            }}
          >
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <Button
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "text.secondary",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          <IconButton
            color="primary"
            aria-label="Open navigation menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "block", sm: "block", md: "none" },
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="bottom"
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              height: `calc(100% - ${boxHeight}px)`,
              transition: "opacity 0.3s ease-in-out !important",
              opacity: mobileOpen ? 1 : 0,
              pointerEvents: mobileOpen ? "auto" : "none",
              boxShadow: "none",
            },
            "& .MuiModal-backdrop": {
              backgroundColor: "transparent",
            },
          }}
        >
          <DrawerElement
            handleDrawerToggle={handleDrawerToggle}
            boxHeight={boxHeight}
            location={location}
          />
        </Drawer>
      </nav>
    </Box>
  );
};

export default Navbar;
