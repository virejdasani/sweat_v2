import { DropResult } from 'react-beautiful-dnd';
import {
  Programme,
  ModuleInstance,
  Module,
} from '../../../types/admin/ProgrammeDesigner';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export function handleOnDragEnd(
  result: DropResult,
  programmes: Programme[],
  setProgrammes: (programmes: Programme[]) => void,
  moduleInstances: ModuleInstance[],
  setModuleInstances: (moduleInstances: ModuleInstance[]) => void,
  selectedYear: number | null,
  searchResults: Module[],
  selectedModuleType: string | null,
) {
  if (!result.destination) return;

  const { source, destination } = result;

  const newProgrammes = Array.from(programmes);
  const newModuleInstances = Array.from(moduleInstances);

  if (source.droppableId === destination.droppableId) {
    const programme = newProgrammes.find((p) => p.id === source.droppableId);
    if (programme) {
      const newModuleInstanceIds = Array.from(programme.moduleInstanceIds);
      const [draggedModuleInstanceId] = newModuleInstanceIds.splice(
        source.index,
        1,
      );
      newModuleInstanceIds.splice(
        destination.index,
        0,
        draggedModuleInstanceId,
      );
      programme.moduleInstanceIds = newModuleInstanceIds;
    }
  } else {
    const sourceProgramme = newProgrammes.find(
      (p) => p.id === source.droppableId,
    );
    const destinationProgramme = newProgrammes.find(
      (p) => p.id === destination.droppableId,
    );
    if (sourceProgramme && destinationProgramme) {
      const [draggedModuleInstanceId] =
        sourceProgramme.moduleInstanceIds.splice(source.index, 1);
      destinationProgramme.moduleInstanceIds.splice(
        destination.index,
        0,
        draggedModuleInstanceId,
      );
      const draggedModuleInstance = newModuleInstances.find(
        (instance) => instance.id === draggedModuleInstanceId,
      );
      if (draggedModuleInstance) {
        draggedModuleInstance.programmeId = destinationProgramme.id;
      }
    }
  }

  const filteredModuleInstances = newModuleInstances.filter((instance) => {
    const module = searchResults.find((m) => m.id === instance.moduleId);
    return (
      module &&
      (!selectedYear || module.year === selectedYear) &&
      (!selectedModuleType || module.type === selectedModuleType)
    );
  });

  setProgrammes(newProgrammes);
  setModuleInstances(filteredModuleInstances);
}

export const saveAllProgrammes = (programmeState: Programme[]) => {
  // Perform save logic for all programmes
  console.log('Saved all programmes:', programmeState);
};

export const handleSaveAllProgrammes = (
  programmeState: Programme[],
  event: React.MouseEvent<HTMLButtonElement>,
) => {
  event.preventDefault(); // Prevent default button behavior
  saveAllProgrammes(programmeState);
};

export const handleFilterChange = (
  year: number | null,
  setSelectedYear: (year: number | null) => void,
) => {
  setSelectedYear(year);
};

export const handleSearchChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  onSearch: (results: Module[]) => void,
  modules: Module[],
) => {
  const query = event.target.value;
  setSearchQuery(query);

  // Filter modules based on the search query
  const filteredModules = modules.filter((module) => {
    const lowercaseQuery = query.toLowerCase();
    return (
      module.id.toLowerCase().includes(lowercaseQuery) ||
      module.name.toLowerCase().includes(lowercaseQuery)
    );
  });

  onSearch(filteredModules);
};

export const handleModuleTypeFilterChange = (
  moduleType: string | null,
  setSelectedModuleType: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setSelectedModuleType(moduleType);
};

export const handleSearch = (
  results: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
) => {
  setSearchResults(results);
};

export const getModuleInstanceById = (
  moduleInstanceId: string,
  moduleInstanceState: ModuleInstance[],
) => {
  return moduleInstanceState.find(
    (instance) => instance.id === moduleInstanceId,
  );
};

export const useModuleActions = (
  searchResults: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
  programmeState: Programme[],
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>,
  moduleInstanceState: ModuleInstance[],
  setModuleInstanceState: React.Dispatch<
    React.SetStateAction<ModuleInstance[]>
  >,
) => {
  const handleEditModule = useCallback(
    (
      module: Module,
      setModalMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
      setSelectedModule: React.Dispatch<
        React.SetStateAction<Module | undefined>
      >,
      setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      openEditModuleModal(
        module,
        setModalMode,
        setSelectedModule,
        setIsModuleModalOpen,
      );
    },
    [],
  );

  const handleRemoveModule = useCallback(
    (moduleId: string, programmeId: string) => {
      const module = searchResults.find((m) => m.id === moduleId);
      if (module) {
        const confirmRemove = window.confirm(
          `Are you sure you want to remove the module "${module.name}" from the programme?`,
        );
        if (confirmRemove) {
          // Remove the module instance from the specific programme
          setProgrammeState(
            programmeState.map((programme) =>
              programme.id === programmeId
                ? {
                    ...programme,
                    moduleInstanceIds: programme.moduleInstanceIds.filter(
                      (id) =>
                        getModuleInstanceById(id, moduleInstanceState)
                          ?.moduleId !== moduleId,
                    ),
                  }
                : programme,
            ),
          );

          // Remove the module instance associated with the module and programme
          setModuleInstanceState(
            moduleInstanceState.filter(
              (instance) =>
                !(
                  instance.moduleId === moduleId &&
                  instance.programmeId === programmeId
                ),
            ),
          );

          toast.success(
            `Module "${module.name}" has been removed from the programme.`,
          );
        }
      }
    },
    [
      searchResults,
      programmeState,
      setProgrammeState,
      moduleInstanceState,
      setModuleInstanceState,
    ],
  );

  return {
    handleEditModule,
    handleRemoveModule,
  };
};

export const handleAddModuleClick = (
  setIsAddModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setIsAddModuleModalOpen(true);
};

export const openAddModuleModal = (
  setModalMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
  setSelectedModule: React.Dispatch<React.SetStateAction<Module | undefined>>,
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setModalMode('add');
  setSelectedModule(undefined);
  setIsModuleModalOpen(true);
};

export const openEditModuleModal = (
  module: Module,
  setModalMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
  setSelectedModule: React.Dispatch<React.SetStateAction<Module | undefined>>,
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setModalMode('edit');
  setSelectedModule(module);
  setIsModuleModalOpen(true);
};

export const closeModuleModal = (
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setIsModuleModalOpen(false);
};

export const handleModuleSubmit = (
  module: Module,
  modalMode: 'add' | 'edit',
  closeModuleModal: () => void,
  searchResults: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
) => {
  if (modalMode === 'add') {
    handleAddModule(module, searchResults, setSearchResults);
  } else if (modalMode === 'edit') {
    handleUpdateModule(module, searchResults, setSearchResults);
  }
  closeModuleModal();
};

export const handleAddModule = (
  module: Module,
  searchResults: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
) => {
  // Add the new module to the searchResults array
  setSearchResults([...searchResults, module]);
};

export const handleUpdateModule = (
  module: Module,
  searchResults: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
) => {
  // Update the existing module in the searchResults array
  setSearchResults(searchResults.map((m) => (m.id === module.id ? module : m)));
};
