import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from '@mui/material';
import {
  ModuleCardProps,
  ModuleListProps,
} from '../../../types/admin/ProgrammeDesigner';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from './DeleteModal';
import './ModuleCard.css';
import { useModuleActions } from '../../../utils/admin/ProgrammeDesigner';
import { Module } from '../../../shared/types';

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
    <Accordion className="module-card">
      <AccordionSummary
        expandIcon={<ExpandCircleDownIcon />}
        className="module-card-summary"
      >
        <Typography variant="subtitle1" className="module-card-title">
          <span className="module-id">{module.id}</span> - {module.name}
        </Typography>
        <div>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              onEdit(module);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">Credits: {module.credits}</Typography>
      </AccordionDetails>

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onRemoveFromProgramme={() =>
          handleRemoveFromProgramme(module.id, programmeId)
        }
        onRemoveFromDatabase={() => handleRemoveFromDatabase(module.id)}
      />
    </Accordion>
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
      {modules.map((module: Module) => (
        <ModuleCard
          key={module.id}
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
