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
  programmes,
  ModuleInstance,
  moduleInstances,
  modules,
} from '../../../types/admin/ProgrammeDesigner';
import {
  getModuleInstanceById,
  handleFilterChange,
  handleModuleTypeFilterChange,
  handleOnDragEnd,
  handleSaveAllProgrammes,
  handleSearch,
  handleSearchChange,
} from '../../../utils/admin/ProgrammeDesigner';
import ModuleList from './ModuleCard';
import './ProgrammeDesigner.css';
import { Button as MuiButton } from '@mui/material';
import ModuleFilterButtons from './ModuleFilterButtons';
import SearchBar from './SearchBar';
import ModuleTypeFilterButtons from './ModuleTypeFilterButtons';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>(programmes);
  const [moduleInstanceState, setModuleInstanceState] =
    useState<ModuleInstance[]>(moduleInstances);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Module[]>(modules);
  const [selectedModuleType, setSelectedModuleType] = useState<string | null>(
    null,
  );

  return (
    <div className="programme-designer">
      <div className="search-bar-container">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(event) =>
            handleSearchChange(
              event,
              setSearchQuery,
              (results) => handleSearch(results, setSearchResults),
              modules,
            )
          }
          onSearch={(results) => handleSearch(results, setSearchResults)}
        />
      </div>
      <div className="filter-buttons-container">
        <ModuleFilterButtons
          onFilterChange={(year) => handleFilterChange(year, setSelectedYear)}
          selectedYear={selectedYear}
        />
        <ModuleTypeFilterButtons
          onFilterChange={(moduleType) =>
            handleModuleTypeFilterChange(moduleType, setSelectedModuleType)
          }
          selectedModuleType={selectedModuleType}
        />
      </div>
      <DragDropContext
        onDragEnd={(result: DropResult) =>
          handleOnDragEnd(
            result,
            programmeState,
            setProgrammeState,
            moduleInstanceState,
            setModuleInstanceState,
            selectedYear,
            searchResults,
            selectedModuleType,
          )
        }
      >
        <div className="programme-container">
          {programmeState.map((programme) => (
            <div key={programme.id} className="programme-box">
              <h2 className="programme-name">{programme.name}</h2>
              <Droppable droppableId={programme.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="module-list-container"
                  >
                    {programme.moduleInstanceIds
                      .map((moduleInstanceId) => {
                        const moduleInstance = getModuleInstanceById(
                          moduleInstanceId,
                          moduleInstanceState,
                        );
                        const module = moduleInstance
                          ? searchResults.find(
                              (m) => m.id === moduleInstance.moduleId,
                            )
                          : null;
                        return { moduleInstance, module };
                      })
                      .filter(
                        ({ module }) =>
                          module &&
                          (!selectedYear || module.year === selectedYear) &&
                          (!selectedModuleType ||
                            module.type === selectedModuleType),
                      )
                      .map(({ moduleInstance, module }, index) => (
                        <Draggable
                          key={moduleInstance?.id}
                          draggableId={moduleInstance?.id || ''}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="module-item"
                            >
                              {module && <ModuleList modules={[module]} />}
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
