import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Module, Programme } from '../../../shared/types';
import {
  handleFilterChange,
  handleModuleTypeFilterChange,
  handleOnDragEnd,
  handleSaveAllProgrammes,
  handleSearch,
  handleSearchChange,
  openAddModuleModal,
  closeModuleModal,
  handleModuleSubmit,
  fetchData,
} from '../../../utils/admin/ProgrammeDesigner';
import ModuleList from './ModuleCard';
import './ProgrammeDesigner.css';
import { Button as MuiButton } from '@mui/material';
import ModuleFilterButtons from './ModuleFilterButtons';
import SearchBar from './SearchBar';
import ModuleTypeFilterButtons from './ModuleTypeFilterButtons';
import ModuleForm from './ModuleForm';
import { useModuleActions } from '../../../utils/admin/ProgrammeDesigner';
import { ModuleInstance } from '../../../types/admin/ProgrammeDesigner';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>([]);
  const [searchResults, setSearchResults] = useState<Module[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleType, setSelectedModuleType] = useState<string | null>(
    null,
  );
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedModule, setSelectedModule] = useState<Module | undefined>(
    undefined,
  );
  const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);

  useEffect(() => {
    fetchData(setProgrammeState, setSearchResults, setModuleInstances);
  }, []);

  const { handleEditModule } = useModuleActions(
    moduleInstances,
    setModuleInstances,
    programmeState,
    setProgrammeState,
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
              searchResults,
              selectedYear,
              selectedModuleType,
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
        <MuiButton
          variant="contained"
          color="primary"
          onClick={() =>
            openAddModuleModal(
              setModalMode,
              setSelectedModule,
              setIsModuleModalOpen,
            )
          }
        >
          Add Module
        </MuiButton>
      </div>
      <DragDropContext
        onDragEnd={(result: DropResult) =>
          handleOnDragEnd(
            result,
            moduleInstances,
            setModuleInstances,
            searchResults,
            setSearchResults,
            programmeState,
            setProgrammeState,
          )
        }
      >
        <div className="programme-container">
          {programmeState.map((programme) => (
            <Droppable droppableId={programme.id} key={programme.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="programme-box"
                >
                  <h2 className="programme-name">{programme.name}</h2>
                  <div className="module-list-container">
                    {moduleInstances
                      .filter(
                        (mi) =>
                          mi.programmeId === programme.id &&
                          (!selectedYear || mi.module.year === selectedYear) &&
                          (!selectedModuleType ||
                            mi.module.type === selectedModuleType) &&
                          (searchQuery === '' ||
                            mi.module.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            mi.module.id
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())),
                      )
                      .map((mi, index) => (
                        <Draggable
                          key={mi.uniqueId}
                          draggableId={mi.uniqueId}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="module-item"
                            >
                              <ModuleList
                                modules={[mi.module]}
                                programmeId={programme.id}
                                moduleInstances={moduleInstances}
                                setModuleInstances={setModuleInstances}
                                programmeState={programmeState}
                                setProgrammeState={setProgrammeState}
                                onEdit={() =>
                                  handleEditModule(
                                    mi,
                                    setModalMode,
                                    setSelectedModule,
                                    setIsModuleModalOpen,
                                  )
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className="save-button-container">
        <MuiButton
          variant="contained"
          color="primary"
          onClick={(event) => handleSaveAllProgrammes(event, programmeState)}
          className="save-programme-button"
        >
          Save All Programmes
        </MuiButton>
      </div>
      {isModuleModalOpen && (
        <ModuleForm
          mode={modalMode}
          module={selectedModule}
          onClose={() => closeModuleModal(setIsModuleModalOpen)}
          onSubmit={(module) =>
            handleModuleSubmit(
              module,
              modalMode,
              () => closeModuleModal(setIsModuleModalOpen),
              searchResults,
              setSearchResults,
            )
          }
        />
      )}
    </div>
  );
}

export default ProgrammeDesigner;
