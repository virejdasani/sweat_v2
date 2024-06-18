import React from 'react';
import ProgrammeDesigner from '../../../components/admin/ProgrammeDesigner/ProgrammeDesigner';
import { ChakraProvider } from '@chakra-ui/react';

const ProgrammeDesignPage: React.FC = () => {
  return (
    <ChakraProvider>
      <div>
        <h1>Programme Design</h1>
        <ProgrammeDesigner />
      </div>
    </ChakraProvider>
  );
};

export default ProgrammeDesignPage;
