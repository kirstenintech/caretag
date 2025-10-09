import { Card, CardContent, Typography, Box } from '@mui/material';

const SymbolCard = ({ symbol }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 3,
          '&:last-child': {
            pb: 3,
          },
        }}
      >
        {/* Symbol Image */}
        <Box
          sx={{
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <img
            src={symbol.image}
            alt={symbol.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Symbol Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          {symbol.title}
        </Typography>

        {/* Symbol Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '0.9rem' },
            lineHeight: 1.5,
          }}
        >
          {symbol.shortDescription}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SymbolCard;
