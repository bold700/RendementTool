import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, sm: 3 } }}>
      <Card elevation={1}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}; 