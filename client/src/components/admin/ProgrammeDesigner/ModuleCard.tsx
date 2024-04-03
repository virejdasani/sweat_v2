import React from 'react';
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
import './ModuleCard.css';

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  programmeId,
  onEdit,
  onRemove,
}) => {
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
              onRemove(module.id, programmeId);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">Credits: {module.credits}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  programmeId,
  onEdit,
  onRemove,
}) => {
  return (
    <div className="module-list">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          programmeId={programmeId}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ModuleList;
