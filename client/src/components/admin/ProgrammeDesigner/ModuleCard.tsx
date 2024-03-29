import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import {
  ModuleCardProps,
  ModuleListProps,
} from '../../../types/admin/ProgrammeDesigner';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import './ModuleCard.css';

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <Accordion className="module-card">
      <AccordionSummary
        expandIcon={<ExpandCircleDownIcon />}
        className="module-card-summary"
      >
        <Typography variant="subtitle1" className="module-card-title">
          <span className="module-id">{module.id}</span> - {module.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">Credits: {module.credits}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  return (
    <div className="module-list">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
};

export default ModuleList;
