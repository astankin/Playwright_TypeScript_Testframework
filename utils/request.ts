import * as testData from '../test-data/api_testing_data.json';
import { expect } from "playwright/test";



export async function makeRequest(
  request: any,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  headers: Record<string, string>,
  data?: Record<string, any>
) {
  const baseUrl = testData.baseUrl;  
  const response = await request[method.toLowerCase()](`${baseUrl}${endpoint}`, { headers, data });
  expect(response.ok()).toBeTruthy();
  return await response.json();
}