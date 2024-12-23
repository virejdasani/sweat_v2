import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import SetDefaultFormFactor from './FormFactor/SetDefaultFormFactor';
import adminSettingsStyles from './adminSettingsStyles';
import EditingStatus from './EditingStatus';

const AdminSettings: React.FC = () => {
  const handleFormFactorChange = (value: number) => {
    console.log('Form factor changed to:', value);
  };

  return (
    <Box style={adminSettingsStyles.container}>
      <Heading as="h2" size="lg" style={adminSettingsStyles.heading}>
        Admin Settings
      </Heading>
      <Box style={adminSettingsStyles.formFactorContainer}>
        <SetDefaultFormFactor onFormFactorChange={handleFormFactorChange} />
      </Box>

      <Box style={{ marginTop: '20px' }}>
        <EditingStatus />
      </Box>
    </Box>
  );
};

export default AdminSettings;
