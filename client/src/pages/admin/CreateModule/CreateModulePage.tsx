import CreateModule from '../../../components/admin/CreateModule/CreateModule';
import { ChakraProvider } from '@chakra-ui/react';

const CreateModulePage = () => {
  return (
    <ChakraProvider>
      <CreateModule />
    </ChakraProvider>
  );
};

export default CreateModulePage;
