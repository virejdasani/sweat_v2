import httpClient from './httpClient';
import { Programme } from '../types';
import { AxiosResponse } from 'axios';
import { ModuleDocument } from '../../types/admin/CreateModule';

export const getAllProgrammes = async (): Promise<Programme[]> => {
  try {
    const response: AxiosResponse<Programme[]> =
      await httpClient.get('/programmes');
    return response.data;
  } catch (error) {
    console.error('Error fetching programmes:', error);
    throw error;
  }
};

export const getAllProgrammeIds = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<string[]> =
      await httpClient.get('/programmes/ids');
    return response.data;
  } catch (error) {
    console.error('Error fetching programme IDs:', error);
    throw error;
  }
};

export const getProgrammeById = async (
  programmeId: string,
): Promise<Programme> => {
  try {
    const response: AxiosResponse<Programme> = await httpClient.get(
      `/programmes/${programmeId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching programme with ID ${programmeId}:`, error);
    throw error;
  }
};

export const getAllModules = async (): Promise<ModuleDocument[]> => {
  try {
    const response: AxiosResponse<ModuleDocument[]> =
      await httpClient.get('/modules');
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};

export const getAllModuleIds = async (): Promise<string[]> => {
  try {
    const response: AxiosResponse<string[]> =
      await httpClient.get('/modules/ids');
    return response.data;
  } catch (error) {
    console.error('Error fetching module IDs:', error);
    throw error;
  }
};

export const getModuleById = async (
  moduleId: string,
): Promise<ModuleDocument> => {
  try {
    const response: AxiosResponse<ModuleDocument> = await httpClient.get(
      `/modules/${moduleId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching module with ID ${moduleId}:`, error);
    throw error;
  }
};
