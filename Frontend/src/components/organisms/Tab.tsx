import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Link } from 'react-router-dom';
import MainCard from 'components/MainCard';

interface TabConfig {
  label: string;
  to: string;
  content: React.ReactNode;
  icon?: React.ReactElement;
}

interface TabbedCardProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: TabConfig[];
}

const TabbedCard: React.FC<TabbedCardProps> = ({ value, handleChange, tabs }) => (
  <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
      <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} component={Link} to={tab.to} icon={tab.icon} iconPosition="start" />
        ))}
      </Tabs>
    </Box>
    <Box sx={{ mt: 2.5 }}>
      <MainCard content={false}>{tabs[value].content}</MainCard>
    </Box>
  </>
);

export default TabbedCard;
