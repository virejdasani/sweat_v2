import React from 'react';
import ProgrammeDesigner from '../../../components/admin/ProgrammeDesigner/ProgrammeDesigner';
import { ChakraProvider } from '@chakra-ui/react';

const ProgrammeDesignPage: React.FC = () => {
  return (
    <ChakraProvider>
      <div>
        <h1 className="mt-5 mx-5 pt-4 px-1 text-center">Programme Design</h1>
        <ProgrammeDesigner />
      </div>
    </ChakraProvider>
  );
};

export default ProgrammeDesignPage;
