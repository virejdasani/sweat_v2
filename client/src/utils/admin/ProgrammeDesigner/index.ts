import { DropResult } from 'react-beautiful-dnd';
import {
  Programme,
  ModuleInstance,
  Module,
} from '../../../types/admin/ProgrammeDesigner';

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
