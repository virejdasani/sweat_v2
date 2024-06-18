import React, { useState } from 'react';
import {
  Card,
  Heading,
  Text,
  IconButton,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  GridItem,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import DeleteModal from '../Modals/DeleteModal';
import { useModuleActions } from '../../../../utils/admin/ProgrammeDesigner';
import {
  ModuleCardProps,
  ModuleListProps,
} from '../../../../types/admin/ProgrammeDesigner';
import ModuleCardStyles from './ModuleCardStyles';
import { ModuleDocument } from '../../../../types/admin/CreateModule';

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  programmeId,
  moduleInstances,
  setModuleInstances,
  programmeState,
  setProgrammeState,
  onEdit,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { handleRemoveFromProgramme, handleRemoveFromDatabase } =
    useModuleActions(
      moduleInstances,
      setModuleInstances,
      programmeState,
      setProgrammeState,
    );

  return (
    <Card sx={ModuleCardStyles.card}>
      <Grid
        templateColumns="auto 1fr"
        alignItems="center"
        sx={ModuleCardStyles.cardHeader}
      >
        <GridItem>
          <Heading sx={ModuleCardStyles.moduleId}>
            {module.moduleSetup.moduleCode} - {module.moduleSetup.moduleTitle}
          </Heading>
        </GridItem>
        <GridItem>
          <Flex direction="column" align="center">
            <IconButton
              aria-label="Edit module"
              icon={<EditIcon />}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(module);
              }}
              sx={ModuleCardStyles.iconButton}
            />
            <IconButton
              aria-label="Delete module"
              icon={<DeleteIcon />}
              onClick={(event) => {
                event.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              sx={ModuleCardStyles.iconButton}
            />
          </Flex>
        </GridItem>
      </Grid>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton sx={ModuleCardStyles.accordionButton}>
            <Box flex="1" textAlign="left">
              Module Details
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel sx={ModuleCardStyles.accordionPanel}>
            <Text>Year: {module.moduleSetup.studyYear}</Text>
            <Text>Type: {module.moduleSetup.type}</Text>
            <Text>Programme: {module.moduleSetup.programme.join(', ')}</Text>
            <Text>Semester: {module.moduleSetup.semester}</Text>
            <Text>Credits: {module.moduleSetup.moduleCredit}</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onRemoveFromProgramme={() =>
          handleRemoveFromProgramme(module.moduleSetup.moduleCode, programmeId)
        }
        onRemoveFromDatabase={() =>
          handleRemoveFromDatabase(module.moduleSetup.moduleCode)
        }
      />
    </Card>
  );
};

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  programmeId,
  moduleInstances,
  setModuleInstances,
  programmeState,
  setProgrammeState,
  onEdit,
}) => {
  return (
    <div className="module-list">
      {modules.map((module: ModuleDocument) => (
        <ModuleCard
          key={module.moduleSetup.moduleCode}
          module={module}
          programmeId={programmeId}
          moduleInstances={moduleInstances}
          setModuleInstances={setModuleInstances}
          programmeState={programmeState}
          setProgrammeState={setProgrammeState}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ModuleList;
