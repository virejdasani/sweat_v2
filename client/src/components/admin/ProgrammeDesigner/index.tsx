import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  Programme,
  Module,
  modules,
  programmes,
  ModuleInstance,
  moduleInstances,
} from '../../../types/admin/ProgrammeDesigner';
import {
  handleOnDragEnd,
  handleSaveAllProgrammes,
} from '../../../utils/admin/ProgrammeDesigner';
import ModuleList from './ModuleCard';
import './ProgrammeDesigner.css';
import { Button as MuiButton } from '@mui/material';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>(programmes);
  const [moduleState, setModuleState] = useState<Module[]>(modules);
  const [moduleInstanceState, setModuleInstanceState] =
    useState<ModuleInstance[]>(moduleInstances);

  const getModuleById = (moduleId: string) => {
    return moduleState.find((module) => module.id === moduleId);
  };

  const getModuleInstanceById = (moduleInstanceId: string) => {
    return moduleInstanceState.find(
      (instance) => instance.id === moduleInstanceId,
    );
  };

  return (
    <div className="programme-designer">
      <DragDropContext
        onDragEnd={(result: DropResult) =>
          handleOnDragEnd(
            result,
            programmeState,
            setProgrammeState,
            moduleInstanceState,
            setModuleInstanceState,
          )
        }
      >
        <div className="programme-container">
          {programmeState.map((programme) => (
            <div key={programme.id} className="programme-box">
              <h2>{programme.name}</h2>
              <Droppable droppableId={programme.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {programme.moduleInstanceIds.map(
                      (moduleInstanceId, index) => {
                        const moduleInstance =
                          getModuleInstanceById(moduleInstanceId);
                        const module = moduleInstance
                          ? getModuleById(moduleInstance.moduleId)
                          : null;

                        return moduleInstance && module ? (
                          <Draggable
                            key={moduleInstance.id}
                            draggableId={moduleInstance.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ModuleList modules={[module]} />
                              </div>
                            )}
                          </Draggable>
                        ) : null;
                      },
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <div className="save-button-container">
        <MuiButton
          variant="contained"
          color="primary"
          onClick={(event) => handleSaveAllProgrammes(programmeState, event)}
          className="save-programme-button"
        >
          Save All Programmes
        </MuiButton>
      </div>
    </div>
  );
}

export default ProgrammeDesigner;
