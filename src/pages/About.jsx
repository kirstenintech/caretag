import { Box, Container, Typography, Paper, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const About = () => {
  const sections = [
    {
      title: "The Problem",
      content: [
        "Clothing tags are confusing. Most of the time they're just a bunch of symbols that don't make sense at first glance. I noticed that whenever I bought new clothes, I'd end up searching online to figure out what each one meant. It was annoying and time consuming, so I decided to build something that could make that part easier.",
      ],
    },
    {
      title: "The Solution",
      content: [
        "This app lets you upload a picture of your clothing tag and automatically identifies the care symbols. It tells you what each one means: whether it should be washed, ironed, dry cleaned, or not bleached.",
        "If you don't have a photo, you can also browse through all the symbols and check their meanings directly.",
      ],
    },
    {
      icon: "🎯",
      title: "Built For",
      content: [
        "I built this during the Appwrite 2025 Hacktoberfest Hackathon.",
      ],
    },
    {
      title: "Tech Stack",
      content: [
        "TensorFlow Lite for image recognition",
        "Material UI for the interface",
        "Appwrite for the backend and file storage",
        "Vite for development setup",
      ],
      isList: true,
    },
    {
      title: "Who Built It",
      content: [
        "I'm Kirsten Chong, a software engineer and product manager based in Panama, currently working remotely for the US. I enjoy building products that are user centered and that actually solve problems.",
      ],
      link: {
        text: "If you're on LinkedIn let's connect",
        url: "https://www.linkedin.com/in/kirstenintech/",
      },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 8,
      }}
    >
      <Container maxWidth="md">
        {/* Page Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              color: "text.primary",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
            }}
          >
            About This Project
          </Typography>
        </Box>

        {/* Content Sections */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sections.map((section, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  color: "text.primary",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {section.icon && <span>{section.icon}</span>}
                {section.title}
              </Typography>
              {section.isList ? (
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {section.content.map((item, i) => (
                    <Typography
                      key={i}
                      component="li"
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8,
                        mb: 0.5,
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <>
                  {section.content.map((paragraph, i) => (
                    <Typography
                      key={i}
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8,
                        mb: i < section.content.length - 1 ? 2 : 0,
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                  {section.link && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.8,
                          mb: 1.5,
                        }}
                      >
                        {section.link.text}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                        href={section.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textTransform: "none",
                          borderColor: "divider",
                          color: "text.primary",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        LinkedIn
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default About;
