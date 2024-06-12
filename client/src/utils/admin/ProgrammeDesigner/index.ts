/* eslint-disable @typescript-eslint/no-explicit-any */
import { DropResult } from 'react-beautiful-dnd';
import { Programme } from '../../../shared/types';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

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
import { ModuleSetupFormData } from '../../../types/admin/CreateModule/ModuleSetup';
import { ModuleDocument } from '../../../types/admin/CreateModule';
import { TeachingScheduleSaveData } from '../../../types/admin/CreateModule/TeachingSchedule';
import { transformTemplateDataToSaveData } from '../../../utils/admin/CreateModule/TeachingSchedule';
import { Coursework } from '../../../types/admin/CreateModule/CourseworkSetup';

export function handleOnDragEnd(
  result: DropResult,
  moduleInstances: ModuleInstance[],
  setModuleInstances: (moduleInstances: ModuleInstance[]) => void,
  searchResults: ModuleDocument[],
  setSearchResults: (searchResults: ModuleDocument[]) => void,
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
      .map((mi) => mi.module.moduleSetup.moduleCode),
  }));

  setProgrammeState(updatedProgrammeState);

  setSearchResults(
    searchResults.map((module) => {
      const foundInstance = newModuleInstances.find(
        (mi) =>
          mi.module.moduleSetup.moduleCode === module.moduleSetup.moduleCode,
      );
      return foundInstance ? foundInstance.module : module;
    }) as ModuleDocument[], // Ensuring the type is ModuleDocument[]
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
  onSearch: (results: ModuleDocument[]) => void,
  modules: ModuleDocument[],
  selectedYear: number | null,
  selectedModuleType: string | null,
) => {
  const query = event.target.value;
  setSearchQuery(query);

  // Filter modules based on the search query
  let filteredModules = modules.filter((module) => {
    const lowercaseQuery = query.toLowerCase();
    return (
      module.moduleSetup.moduleCode.toLowerCase().includes(lowercaseQuery) ||
      module.moduleSetup.moduleTitle.toLowerCase().includes(lowercaseQuery)
    );
  });

  // Apply year filter if a specific year is selected
  if (selectedYear) {
    filteredModules = filteredModules.filter(
      (module) => module.moduleSetup.studyYear === selectedYear,
    );
  }

  // Apply module type filter if a specific type is selected
  if (selectedModuleType) {
    filteredModules = filteredModules.filter(
      (module) => module.moduleSetup.type === selectedModuleType,
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
  results: ModuleDocument[],
  setSearchResults: React.Dispatch<React.SetStateAction<ModuleDocument[]>>,
) => {
  setSearchResults(results);
};

export const useModuleActions = (
  moduleInstances: ModuleInstance[],
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>,
  programmeState: Programme[],
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>,
) => {
  const navigate = useNavigate();

  const handleEditModule = useCallback(
    (moduleInstance: ModuleInstance) => {
      navigate('/admin/create-module', {
        state: { module: moduleInstance.module },
      });
    },
    [navigate],
  );

  const handleRemoveFromProgramme = useCallback(
    async (moduleId: string, programmeId: string) => {
      try {
        const updatedProgramme = await removeModuleFromProgramme(
          programmeId,
          moduleId,
        );

        setProgrammeState(
          programmeState.map((programme) =>
            programme.id === programmeId ? updatedProgramme : programme,
          ),
        );

        const updatedModuleInstances = moduleInstances.filter(
          (mi) =>
            !(
              mi.module.moduleSetup.moduleCode === moduleId &&
              mi.programmeId === programmeId
            ),
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
        await deleteModuleById(moduleId);

        const updatedModuleInstances = moduleInstances.filter(
          (mi) => mi.module.moduleSetup.moduleCode !== moduleId,
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
    async (
      moduleSetup: ModuleSetupFormData,
      templateData: number[][][],
      courseworkList: Coursework[],
      onCloseCallback?: () => void,
    ) => {
      const teachingSchedule: TeachingScheduleSaveData =
        transformTemplateDataToSaveData(templateData);

      if (
        !validateModuleData(
          moduleSetup,
          teachingSchedule,
          courseworkList,
          toast,
        )
      ) {
        return;
      }

      const moduleDocument: ModuleDocument = {
        moduleSetup,
        teachingSchedule,
        courseworkList,
      };

      try {
        await createModule(moduleDocument);

        toast.success(
          moduleSetup.moduleCode
            ? 'Module updated successfully!'
            : 'Module created successfully!',
          {
            autoClose: 3000,
          },
        );

        toast.info('The page will refresh to reflect the changes.', {
          autoClose: 3000,
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
  moduleSetup: ModuleSetupFormData,
  teachingSchedule: TeachingScheduleSaveData,
  courseworkList: Coursework[],
  toast: any,
): boolean => {
  // Validate ModuleSetupFormData
  if (
    !moduleSetup.moduleCode ||
    !moduleSetup.moduleTitle ||
    !moduleSetup.studyYear ||
    !moduleSetup.type ||
    !moduleSetup.programme.length ||
    !moduleSetup.semester ||
    !moduleSetup.moduleCredit ||
    moduleSetup.moduleCredit <= 0
  ) {
    toast.error('Please fill in all required fields.');
    return false;
  }

  // Calculate the sum of teaching hours
  const teachingHoursSum =
    teachingSchedule.lectures.hours +
    teachingSchedule.seminars.hours +
    teachingSchedule.tutorials.hours +
    teachingSchedule.labs.hours +
    teachingSchedule.fieldworkPlacement.hours +
    teachingSchedule.other.hours;

  // Check if timetabled hours match the sum of teaching hours
  const timetabledHours =
    teachingSchedule.lectures.hours +
    teachingSchedule.seminars.hours +
    teachingSchedule.tutorials.hours +
    teachingSchedule.labs.hours +
    teachingSchedule.fieldworkPlacement.hours +
    teachingSchedule.other.hours;

  if (timetabledHours !== teachingHoursSum) {
    toast.error('Timetabled hours must match the sum of teaching hours.');
    return false;
  }

  // Check if timetabled hours are not greater than 10 times the module credit
  if (timetabledHours > moduleSetup.moduleCredit * 10) {
    toast.error(
      'Timetabled hours cannot be greater than 10 times the module credit.',
    );
    return false;
  }

  // Check if the sum of coursework weights is equal to 100
  const courseworkWeightSum = courseworkList.reduce((sum, coursework) => {
    const weight =
      typeof coursework.weight === 'string'
        ? parseFloat(coursework.weight)
        : coursework.weight || 0;
    return sum + weight;
  }, 0);

  if (courseworkWeightSum !== 100) {
    toast.error('The sum of coursework weights must be equal to 100.');
    return false;
  }

  // Check if any number is negative
  if (
    moduleSetup.moduleCredit < 0 ||
    timetabledHours < 0 ||
    teachingSchedule.lectures.hours < 0 ||
    teachingSchedule.seminars.hours < 0 ||
    teachingSchedule.tutorials.hours < 0 ||
    teachingSchedule.labs.hours < 0 ||
    teachingSchedule.fieldworkPlacement.hours < 0 ||
    teachingSchedule.other.hours < 0 ||
    courseworkList.some((coursework) => {
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
  setSelectedModule: React.Dispatch<
    React.SetStateAction<ModuleDocument | undefined>
  >,
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setModalMode('add');
  setSelectedModule(undefined);
  setIsModuleModalOpen(true);
};

export const openEditModuleModal = (
  module: ModuleDocument,
  setModalMode: React.Dispatch<React.SetStateAction<'add' | 'edit'>>,
  setSelectedModule: React.Dispatch<
    React.SetStateAction<ModuleDocument | undefined>
  >,
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

// export const handleAddModule = async (
//   module: Module,
//   searchResults: Module[],
//   setSearchResults: React.Dispatch<React.SetStateAction<Module[]>>,
// ) => {
//   try {
//     // Create a new module using the API
//     const newModule = await createModule(module);

//     // Add the new module to the searchResults array
//     setSearchResults([...searchResults, newModule]);
//   } catch (error) {
//     console.error('Error adding module:', error);
//   }
// };

export const handleUpdateModule = async (
  module: ModuleDocument,
  searchResults: ModuleDocument[],
  setSearchResults: React.Dispatch<React.SetStateAction<ModuleDocument[]>>,
) => {
  try {
    // Update the existing module using the API
    const updatedModule = await updateModuleById(
      module.moduleSetup.moduleCode,
      module,
    );

    // Update the existing module in the searchResults array
    setSearchResults(
      searchResults.map((m) =>
        m.moduleSetup.moduleCode === updatedModule.moduleSetup.moduleCode
          ? updatedModule
          : m,
      ),
    );
  } catch (error) {
    console.error('Error updating module:', error);
  }
};

export const fetchData = async (
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>,
  setSearchResults: React.Dispatch<React.SetStateAction<ModuleDocument[]>>,
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
          const foundModule = modules.find(
            (m) => m.moduleSetup.moduleCode === moduleId,
          );
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
export const isValidModuleKey = (key: string): key is keyof ModuleDocument => {
  const validKeys: Array<keyof ModuleDocument> = [
    'moduleSetup',
    'teachingSchedule',
    'courseworkList',
  ];

  return validKeys.includes(key as keyof ModuleDocument);
};
// export const updateTeachingScheduleProperty = (
//   prevData: Partial<ModuleDocument>,
//   propertyName: keyof ModuleDocument['teachingSchedule'],
//   value: number,
// ): Partial<ModuleDocument> => {
//   if (
//     propertyName === 'lectures' ||
//     propertyName === 'seminars' ||
//     propertyName === 'tutorials' ||
//     propertyName === 'labs' ||
//     propertyName === 'fieldworkPlacement' ||
//     propertyName === 'other'
//   ) {
//     const updatedProperty = {
//       ...prevData.teachingSchedule?.[propertyName],
//       hours: value,
//     };

//     return {
//       ...prevData,
//       teachingSchedule: {
//         ...prevData.teachingSchedule,
//         [propertyName]: updatedProperty,
//       },
//     };
//   }

//   return prevData;
// };

// export const handleChangeStep1 = (
//   event: React.ChangeEvent<
//     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//   >,
//   setModuleData: React.Dispatch<React.SetStateAction<Partial<ModuleDocument>>>,
// ) => {
//   const { name, value } = event.target;

//   if (name === 'timetabledHours') {
//     setModuleData((prevData: Partial<ModuleDocument>) => ({
//       ...prevData,
//       moduleSetup: {
//         ...prevData.moduleSetup,
//         timetabledHours: value === '' ? 0 : parseInt(value, 10),
//       },
//     }));
//   } else {
//     setModuleData((prevData: Partial<ModuleDocument>) => ({
//       ...prevData,
//       moduleSetup: {
//         ...prevData.moduleSetup,
//         [name]: value,
//       },
//     }));
//   }
// };

// import { ModuleDocument } from '../../../types/admin/CreateModule';

// export const handleChangeStep2 = (
//   event: React.ChangeEvent<{ value: unknown; name?: string }>,
//   setModuleData: React.Dispatch<React.SetStateAction<Partial<ModuleDocument>>>,
// ) => {
//   const { name, value } = event.target;
//   if (typeof name === 'string') {
//     const hours = value === '' ? 0 : parseInt(value as string, 10);
//     setModuleData((prevData: Partial<ModuleDocument>) => ({
//       ...prevData,
//       teachingSchedule: {
//         ...prevData.teachingSchedule,
//         [name]: {
//           hours,
//         },
//       },
//     }));
//   }
// };

// export const handleChangeStep3 = (
//   index: number,
//   field: keyof Coursework,
//   value: string | number,
//   setModuleData: React.Dispatch<React.SetStateAction<Partial<ModuleDocument>>>,
// ) => {
//   setModuleData((prevData) => ({
//     ...prevData,
//     courseworkList: prevData.courseworkList?.map((coursework, i) =>
//       i === index ? { ...coursework, [field]: value } : coursework,
//     ),
//   }));
// };

export const handleNext =
  (setActiveStep: React.Dispatch<React.SetStateAction<number>>) => () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

export const handleBack =
  (setActiveStep: React.Dispatch<React.SetStateAction<number>>) => () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

// export const addCoursework = (
//   setModuleData: React.Dispatch<React.SetStateAction<Partial<ModuleDocument>>>,
// ) => {
//   setModuleData((prevData) => ({
//     ...prevData,
//     courseworkList: [
//       ...(prevData.courseworkList ?? []),
//       {
//         cwTitle: '',
//         weight: 0,
//         type: 'assignment',
//         deadlineWeek: 0,
//         releasedWeekEarlier: 0,
//       },
//     ],
//   }));
// };

export const removeCoursework = (
  index: number,
  setModuleData: React.Dispatch<React.SetStateAction<Partial<ModuleDocument>>>,
) => {
  setModuleData((prevData) => ({
    ...prevData,
    courseworkList: prevData.courseworkList?.filter((_, i) => i !== index),
  }));
};

export const handleNumberChange = (
  index: number,
  field: keyof Coursework,
  value: string,
  handleChange: (index: number, field: keyof Coursework, value: number) => void,
) => {
  const parsedValue = Math.max(0, parseInt(value, 10));
  handleChange(index, field, parsedValue);
};
