/* eslint-disable @typescript-eslint/no-explicit-any */
import { DropResult } from 'react-beautiful-dnd';
import { Coursework, Module, Programme } from '../../../shared/types';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createModule,
  deleteModuleById,
  removeModuleFromProgramme,
  updateModuleById,
  updateModuleIdsForAllProgrammes,
  updateProgrammeArrayInModules,
} from '../../../services/admin/ProgrammeDesigner';
import { getAllProgrammes, getAllModules } from '../../../shared/api';
import { ModuleInstance } from '../../../types/admin/ProgrammeDesigner';
import { SelectChangeEvent } from '@mui/material';

export function handleOnDragEnd(
  result: DropResult,
  moduleInstances: ModuleInstance[],
  setModuleInstances: (moduleInstances: ModuleInstance[]) => void,
  searchResults: Module[],
  setSearchResults: (searchResults: Module[]) => void,
  programmeState: Programme[],
  setProgrammeState: (programmeState: Programme[]) => void,
) {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const newModuleInstances = [...moduleInstances];
  const draggedModuleIndex = newModuleInstances.findIndex(
    (mi) => mi.uniqueId === draggableId,
  );

  if (draggedModuleIndex === -1) return;

  const draggedModule = newModuleInstances[draggedModuleIndex];

  newModuleInstances.splice(draggedModuleIndex, 1);

  if (destination.droppableId === source.droppableId) {
    newModuleInstances.splice(destination.index, 0, draggedModule);
  } else {
    const destinationProgrammeModules = newModuleInstances.filter(
      (mi) => mi.programmeId === destination.droppableId,
    );
    const destinationIndex = destination.index;

    newModuleInstances.splice(
      newModuleInstances.indexOf(destinationProgrammeModules[destinationIndex]),
      0,
      {
        ...draggedModule,
        programmeId: destination.droppableId,
      },
    );
  }

  setModuleInstances(newModuleInstances);

  // Update the moduleIds in the Programme state
  const updatedProgrammeState = programmeState.map((programme) => ({
    ...programme,
    moduleIds: newModuleInstances
      .filter((mi) => mi.programmeId === programme.id)
      .map((mi) => mi.module.id),
  }));

  setProgrammeState(updatedProgrammeState);

  setSearchResults(
    searchResults.map((module) => {
      const foundInstance = newModuleInstances.find(
        (mi) => mi.module.id === module.id,
      );
      return foundInstance ? foundInstance.module : module;
    }),
  );
}

export const handleSaveAllProgrammes = async (
  event: React.MouseEvent<HTMLButtonElement>,
  programmes: Programme[],
) => {
  event.preventDefault();

  try {
    await Promise.all(
      programmes.map(async (programme) => {
        try {
          await updateModuleIdsForAllProgrammes(
            programme.id,
            programme.moduleIds,
          );
        } catch (error) {
          console.error(
            `Error updating module IDs for programme ${programme.id}:`,
            error,
          );
          throw error;
        }
      }),
    );

    try {
      await updateProgrammeArrayInModules();
    } catch (error) {
      console.error('Error updating programme array in modules:', error);
      throw error;
    }

    toast.success('All programmes saved successfully');
  } catch (error) {
    console.error('Error updating module IDs for programmes:', error);
    toast.error('Error saving programmes. Please try again');
  }
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
  selectedYear: number | null,
  selectedModuleType: string | null,
) => {
  const query = event.target.value;
  setSearchQuery(query);

  // Filter modules based on the search query
  let filteredModules = modules.filter((module) => {
    const lowercaseQuery = query.toLowerCase();
    return (
      module.id.toLowerCase().includes(lowercaseQuery) ||
      module.name.toLowerCase().includes(lowercaseQuery)
    );
  });

  // Apply year filter if a specific year is selected
  if (selectedYear) {
    filteredModules = filteredModules.filter(
      (module) => module.year === selectedYear,
    );
  }

  // Apply module type filter if a specific type is selected
  if (selectedModuleType) {
    filteredModules = filteredModules.filter(
      (module) => module.type === selectedModuleType,
    );
  }

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

export const useModuleActions = (
  moduleInstances: ModuleInstance[],
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>,
  programmeState: Programme[],
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>,
) => {
  const handleEditModule = useCallback(
    (
      moduleInstance: ModuleInstance,
      setModalMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
      setSelectedModule: React.Dispatch<
        React.SetStateAction<Module | undefined>
      >,
      setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      openEditModuleModal(
        moduleInstance.module,
        setModalMode,
        setSelectedModule,
        setIsModuleModalOpen,
      );
    },
    [],
  );

  const handleRemoveFromProgramme = useCallback(
    async (moduleId: string, programmeId: string) => {
      try {
        // Remove the module from the specific programme using the API request
        const updatedProgramme = await removeModuleFromProgramme(
          programmeId,
          moduleId,
        );

        // Update the programmeState with the updated programme
        setProgrammeState(
          programmeState.map((programme) =>
            programme.id === programmeId ? updatedProgramme : programme,
          ),
        );

        // Remove the ModuleInstance object from the moduleInstances array
        const updatedModuleInstances = moduleInstances.filter(
          (mi) =>
            !(mi.module.id === moduleId && mi.programmeId === programmeId),
        );
        setModuleInstances(updatedModuleInstances);

        toast.success(`Module has been removed from the programme.`);
        toast.info('Please remember to save all programmes.');
      } catch (error) {
        console.error('Error removing module from programme:', error);
        toast.error(
          'An error occurred while removing the module from the programme.',
        );
      }
    },
    [moduleInstances, programmeState, setProgrammeState, setModuleInstances],
  );

  const handleRemoveFromDatabase = useCallback(
    async (moduleId: string) => {
      try {
        // Delete the module from the database using the API request
        await deleteModuleById(moduleId);

        // Remove the ModuleInstance objects with the deleted module from the moduleInstances array
        const updatedModuleInstances = moduleInstances.filter(
          (mi) => mi.module.id !== moduleId,
        );
        setModuleInstances(updatedModuleInstances);

        toast.success(`Module has been deleted from the database.`);
      } catch (error) {
        console.error('Error deleting module from database:', error);
        toast.error(
          'An error occurred while deleting the module from the database.',
        );
      }
    },
    [moduleInstances, setModuleInstances],
  );

  const handleSubmit = useCallback(
    async (moduleData: Partial<Module>, onCloseCallback?: () => void) => {
      if (!validateModuleData(moduleData, toast)) {
        return;
      }
      const mappedModule = {
        id: (moduleData.id || '').trim(),
        name: (moduleData.name || '').trim(),
        year: moduleData.year as 1 | 2 | 3 | 4,
        type: moduleData.type || 'core',
        programme: moduleData.programme || [],
        semester: moduleData.semester || 'first',
        credits: moduleData.credits || 7.5,
        timetabledHours: moduleData.timetabledHours || 0,
        lectures: {
          hours: moduleData.lectures?.hours || 0,
        },
        seminars: {
          hours: moduleData.seminars?.hours || 0,
        },
        tutorials: {
          hours: moduleData.tutorials?.hours || 0,
        },
        labs: {
          hours: moduleData.labs?.hours || 0,
        },
        fieldworkPlacement: {
          hours: moduleData.fieldworkPlacement?.hours || 0,
        },
        other: {
          hours: moduleData.other?.hours || 0,
        },
        courseworks: moduleData.courseworks || [],
      };
      try {
        await createModule(mappedModule);

        // Display the success message
        toast.success(
          moduleData.id
            ? 'Module updated successfully!'
            : 'Module created successfully!',
          {
            autoClose: 3000, // Display the success message for 2 seconds
          },
        );

        // Display the refresh message
        toast.info('The page will refresh to reflect the changes.', {
          autoClose: 3000, // Display the refresh message for 3 seconds
          onClose: () => {
            window.location.reload();
            onCloseCallback?.();
          },
        });
      } catch (error) {
        console.error('Error saving module:', error);
        toast.error('Failed to save module. Please try again.');
      }
    },
    [],
  );

  return {
    handleEditModule,
    handleRemoveFromProgramme,
    handleRemoveFromDatabase,
    handleSubmit,
  };
};

const validateModuleData = (
  moduleData: Partial<Module>,
  toast: any,
): boolean => {
  // Check if all required fields are present and not empty strings
  if (
    !moduleData.id ||
    !moduleData.name ||
    !moduleData.year ||
    !moduleData.type ||
    !moduleData.programme ||
    !moduleData.semester ||
    !moduleData.credits ||
    moduleData.credits <= 0 ||
    moduleData.timetabledHours === undefined ||
    moduleData.timetabledHours < 0
  ) {
    toast.error('Please fill in all required fields.');
    return false;
  }

  // Calculate the sum of teaching hours
  const teachingHoursSum =
    (moduleData.lectures?.hours || 0) +
    (moduleData.seminars?.hours || 0) +
    (moduleData.tutorials?.hours || 0) +
    (moduleData.labs?.hours || 0) +
    (moduleData.fieldworkPlacement?.hours || 0) +
    (moduleData.other?.hours || 0);

  // Check if timetabled hours match the sum of teaching hours
  if (moduleData.timetabledHours !== teachingHoursSum) {
    toast.error('Timetabled hours must match the sum of teaching hours.');
    return false;
  }

  // Check if timetabled hours are not greater than 10 times the module credit
  if (moduleData.timetabledHours > moduleData.credits * 10) {
    toast.error(
      'Timetabled hours cannot be greater than 10 times the module credit.',
    );
    return false;
  }

  // Check if the sum of coursework weights is equal to 100
  const courseworkWeightSum =
    moduleData.courseworks?.reduce((sum, coursework) => {
      const weight =
        typeof coursework.weight === 'string'
          ? parseFloat(coursework.weight)
          : coursework.weight || 0;
      return sum + weight;
    }, 0) || 0;

  if (courseworkWeightSum !== 100) {
    toast.error('The sum of coursework weights must be equal to 100.');
    return false;
  }

  // Check if any number is negative
  if (
    moduleData.credits < 0 ||
    moduleData.timetabledHours < 0 ||
    (moduleData.lectures?.hours || 0) < 0 ||
    (moduleData.seminars?.hours || 0) < 0 ||
    (moduleData.tutorials?.hours || 0) < 0 ||
    (moduleData.labs?.hours || 0) < 0 ||
    (moduleData.fieldworkPlacement?.hours || 0) < 0 ||
    (moduleData.other?.hours || 0) < 0 ||
    moduleData.courseworks?.some((coursework) => {
      const weight =
        typeof coursework.weight === 'string'
          ? parseFloat(coursework.weight)
          : coursework.weight;
      return weight !== undefined && weight < 0;
    })
  ) {
    toast.error('Negative numbers are not allowed.');
    return false;
  }

  return true;
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

export const handleAddModule = async (
  module: Module,
  searchResults: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
) => {
  try {
    // Create a new module using the API
    const newModule = await createModule(module);

    // Add the new module to the searchResults array
    setSearchResults([...searchResults, newModule]);
  } catch (error) {
    console.error('Error adding module:', error);
  }
};

export const handleUpdateModule = async (
  module: Module,
  searchResults: Module[],
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
) => {
  try {
    // Update the existing module using the API
    const updatedModule = await updateModuleById(module.id, module);

    // Update the existing module in the searchResults array
    setSearchResults(
      searchResults.map((m) => (m.id === updatedModule.id ? updatedModule : m)),
    );
  } catch (error) {
    console.error('Error updating module:', error);
  }
};

export const fetchData = async (
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>,
  setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>,
) => {
  try {
    const programmes = await getAllProgrammes();
    const modules = await getAllModules();

    setProgrammeState(programmes);
    setSearchResults(modules);

    // Initialize moduleInstances with uniqueId
    const moduleInstancesData: ModuleInstance[] = programmes
      .flatMap((programme) =>
        programme.moduleIds.map((moduleId) => {
          const foundModule = modules.find((m) => m.id === moduleId);
          return foundModule
            ? {
                module: foundModule,
                programmeId: programme.id,
                uniqueId: `${moduleId}-${programme.id}`, // Generate uniqueId here
              }
            : null;
        }),
      )
      .filter((mi): mi is ModuleInstance => mi !== null);

    setModuleInstances(moduleInstancesData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const isValidModuleKey = (key: string): key is keyof Module => {
  const validKeys: Array<keyof Module> = [
    'id',
    'name',
    'year',
    'type',
    'programme',
    'semester',
    'credits',
    'totalStudyHours',
    'timetabledHours',
    'privateStudyHours',
    'lectures',
    'seminars',
    'tutorials',
    'labs',
    'fieldworkPlacement',
    'other',
    'examPrep',
    'courseworks',
    'totalHours',
  ];

  return validKeys.includes(key as keyof Module);
};
export const updateTeachingScheduleProperty = (
  prevData: Partial<Module>,
  propertyName: keyof Module,
  value: number,
): Partial<Module> => {
  if (
    propertyName === 'lectures' ||
    propertyName === 'seminars' ||
    propertyName === 'tutorials' ||
    propertyName === 'labs' ||
    propertyName === 'fieldworkPlacement' ||
    propertyName === 'other'
  ) {
    const updatedProperty = {
      ...prevData[propertyName],
      hours: value,
    };

    return {
      ...prevData,
      [propertyName]: updatedProperty,
    };
  }

  return prevData;
};

export const handleChangeStep1 = (
  event:
    | SelectChangeEvent<string | number | string[]>
    | React.ChangeEvent<{ value: unknown; name?: string }>,
  setModuleData: React.Dispatch<React.SetStateAction<Partial<Module>>>,
) => {
  const { name, value } = event.target;

  if (name === 'timetabledHours') {
    setModuleData((prevData: Partial<Module>) => ({
      ...prevData,
      timetabledHours: value === '' ? 0 : parseInt(value as string, 10),
    }));
  } else {
    setModuleData((prevData: Partial<Module>) => ({
      ...prevData,
      [name as string]: value,
    }));
  }
};

export const handleChangeStep2 = (
  event: React.ChangeEvent<{ value: unknown; name?: string }>,
  setModuleData: React.Dispatch<React.SetStateAction<Partial<Module>>>,
) => {
  const { name, value } = event.target;
  if (typeof name === 'string') {
    const hours = value === '' ? 0 : parseInt(value as string, 10);
    setModuleData((prevData: Partial<Module>) => ({
      ...prevData,
      [name]: {
        hours,
      },
    }));
  }
};
export const handleChangeStep3 = (
  index: number,
  field: keyof Coursework,
  value: string | number,
  setModuleData: React.Dispatch<React.SetStateAction<Partial<Module>>>,
) => {
  setModuleData((prevData) => ({
    ...prevData,
    courseworks: prevData.courseworks?.map((coursework, i) =>
      i === index ? { ...coursework, [field]: value } : coursework,
    ),
  }));
};

export const handleNext =
  (setActiveStep: React.Dispatch<React.SetStateAction<number>>) => () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

export const handleBack =
  (setActiveStep: React.Dispatch<React.SetStateAction<number>>) => () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

export const addCoursework = (
  setModuleData: React.Dispatch<React.SetStateAction<Partial<Module>>>,
) => {
  setModuleData((prevData) => ({
    ...prevData,
    courseworks: [
      ...(prevData.courseworks ?? []),
      {
        cwTitle: '',
        weight: '',
        type: 'assignment',
        deadlineWeek: '',
        releasedWeekEarlier: '',
      },
    ],
  }));
};

export const removeCoursework = (
  index: number,
  setModuleData: React.Dispatch<React.SetStateAction<Partial<Module>>>,
) => {
  setModuleData((prevData) => ({
    ...prevData,
    courseworks: prevData.courseworks?.filter((_, i) => i !== index),
  }));
};
