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
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL + 'settings/editing-status/';

function ProgrammeDesigner() {
  const [programmeState, setProgrammeState] = useState<Programme[]>([]);
  const [searchResults, setSearchResults] = useState<ModuleDocument[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleType, setSelectedModuleType] = useState<string | null>(
    null,
  );
  const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);
  const [editingStatus, setEditingStatus] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(setProgrammeState, setSearchResults, setModuleInstances);
    fetchEditingStatus();
  }, []);

  const fetchEditingStatus = async () => {
    try {
      const response = await axios.get(baseURL);
      setEditingStatus(response.data.editingStatus);
      console.log('Editing status:', response.data.editingStatus);
    } catch (error) {
      console.error('Error fetching editing status:', error);
    }
  };

  const { handleEditModule } = useModuleActions(
    moduleInstances,
    setModuleInstances,
    programmeState,
    setProgrammeState,
  );

  return (
    <>
      <div className="programme-designer">
        {/* Disclaimer Section */}
        {!editingStatus && (
          <p style={{ color: '#Fa8072' }} className="disclaimer">
            Editing has been disabled by the admin, this page is now read-only
          </p>
        )}

        {editingStatus && (
          <p style={{ color: 'gray' }} className="disclaimer">
            Editing is currently enabled
          </p>
        )}

        <button
          className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
          onClick={() => {
            window.history.back();
          }}
        >
          Home
        </button>
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
              const year =
                yearString !== null ? parseInt(yearString, 10) : null;
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
          <div className="programme-layout">
            <Droppable droppableId="all-modules">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="programme-box all-modules-box"
                >
                  <h2 className="programme-name">All Modules</h2>
                  <div className="module-list-container">
                    {moduleInstances
                      .filter(
                        (mi) =>
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
                                programmeId={'null'}
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
                          .filter((mi) => mi.programmeId === programme.id)
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
          </div>
        </DragDropContext>
        <div className="save-button-container">
          {editingStatus ? (
            <Button
              colorScheme="blue"
              onClick={(event) =>
                handleSaveAllProgrammes(event, programmeState)
              }
              className="save-programme-button"
            >
              Save All Programmes
            </Button>
          ) : (
            <Button
              colorScheme="red"
              isDisabled
              className="save-programme-button"
            >
              CANNOT EDIT
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProgrammeDesigner;
