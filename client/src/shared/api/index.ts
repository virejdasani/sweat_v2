import httpClient from './httpClient';
import { Programme, Module } from '../types';
import { AxiosResponse } from 'axios';

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

export const getAllModules = async (): Promise<Module[]> => {
  try {
    const response: AxiosResponse<Module[]> = await httpClient.get('/modules');
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};
