import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { Programme } from '../../../shared/types';
import {
  handleFilterChange,
  handleModuleTypeFilterChange,
  handleOnDragEnd,
  handleSaveAllProgrammes,
  handleSearch,
  handleSearchChange,
  fetchData,
} from '../../../utils/admin/ProgrammeDesigner';
import ModuleList from './ModuleCard/ModuleCard';
import './ProgrammeDesigner.css';
import SearchBar from './ModuleFilters/SearchBar/SearchBar';
import { useModuleActions } from '../../../utils/admin/ProgrammeDesigner';
import { ModuleInstance } from '../../../types/admin/ProgrammeDesigner';
import { Button } from '@chakra-ui/react';
import ModuleYearFilter from './ModuleFilters/YearFilter/YearFilter';
import ModuleTypeFilter from './ModuleFilters/TypeFilter/TypeFilter';
import { ModuleDocument } from '../../../types/admin/CreateModule';
import { useNavigate } from 'react-router-dom';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>([]);
  const [searchResults, setSearchResults] = useState<ModuleDocument[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleType, setSelectedModuleType] = useState<string | null>(
    null,
  );
  const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(setProgrammeState, setSearchResults, setModuleInstances);
  }, []);

  console.log(moduleInstances);

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
        <ModuleYearFilter
          onFilterChange={(yearString: string | null) => {
            const year = yearString !== null ? parseInt(yearString, 10) : null;
            handleFilterChange(year, setSelectedYear);
          }}
          selectedYear={selectedYear}
        />
        <ModuleTypeFilter
          onFilterChange={(moduleType) =>
            handleModuleTypeFilterChange(moduleType, setSelectedModuleType)
          }
          selectedModuleType={selectedModuleType}
        />
      </div>
      <div className="add-module-button-container">
        <Button
          colorScheme="blue"
          onClick={() => navigate('/admin/create-module')}
        >
          Add Module
        </Button>
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
                          (!selectedYear ||
                            mi.module.moduleSetup.studyYear === selectedYear) &&
                          (!selectedModuleType ||
                            mi.module.moduleSetup.type ===
                              selectedModuleType) &&
                          (searchQuery === '' ||
                            mi.module.moduleSetup.moduleTitle
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            mi.module.moduleSetup.moduleCode
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
                                onEdit={() => handleEditModule(mi)}
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
        <Button
          colorScheme="blue"
          onClick={(event) => handleSaveAllProgrammes(event, programmeState)}
          className="save-programme-button"
        >
          Save All Programmes
        </Button>
      </div>
    </div>
  );
}

export default ProgrammeDesigner;
