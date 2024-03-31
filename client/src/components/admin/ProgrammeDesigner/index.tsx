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
  handleFilterChange,
  handleOnDragEnd,
  handleSaveAllProgrammes,
} from '../../../utils/admin/ProgrammeDesigner';
import ModuleList from './ModuleCard';
import './ProgrammeDesigner.css';
import { Button as MuiButton } from '@mui/material';
import ModuleFilterButtons from './ModuleFilterButtons';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>(programmes);
  const [moduleState, setModuleState] = useState<Module[]>(modules);
  const [moduleInstanceState, setModuleInstanceState] =
    useState<ModuleInstance[]>(moduleInstances);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const getModuleById = (moduleId: string) => {
    return moduleState.find((module) => module.id === moduleId);
  };

  const getModuleInstanceById = (moduleInstanceId: string) => {
    return moduleInstanceState.find(
      (instance) => instance.id === moduleInstanceId,
    );
  };

  const filteredModuleInstances = selectedYear
    ? moduleInstanceState.filter(
        (instance) => getModuleById(instance.moduleId)?.year === selectedYear,
      )
    : moduleInstanceState;

  return (
    <div className="programme-designer">
      <ModuleFilterButtons
        onFilterChange={(year) => handleFilterChange(year, setSelectedYear)}
        selectedYear={selectedYear}
      />
      <DragDropContext
        onDragEnd={(result: DropResult) =>
          handleOnDragEnd(
            result,
            programmeState,
            setProgrammeState,
            moduleInstanceState,
            setModuleInstanceState,
            selectedYear,
            moduleState,
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
                    {programme.moduleInstanceIds
                      .map((moduleInstanceId) => {
                        const moduleInstance =
                          getModuleInstanceById(moduleInstanceId);
                        const module = moduleInstance
                          ? getModuleById(moduleInstance.moduleId)
                          : null;
                        return { moduleInstance, module };
                      })
                      .filter(
                        ({ module }) =>
                          !selectedYear || module?.year === selectedYear,
                      )
                      .map(({ moduleInstance, module }, index) => (
                        <Draggable
                          key={moduleInstance?.id}
                          draggableId={moduleInstance?.id || ''}
                          index={index}
                        >
                          {(provided) => (
                            <div>
                              {module ? (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ModuleList modules={[module]} />
                                </div>
                              ) : null}
                            </div>
                          )}
                        </Draggable>
                      ))}
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
