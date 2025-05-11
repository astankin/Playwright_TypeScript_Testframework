import { test, expect } from '@playwright/test';
import * as testData from '../../test-data/api_testing_data.json';
import { makeRequest } from '../../utils/request';
import { generateRandomEmail, generateRandomName, generateRandomPassword } from '../../utils/dataGenerator';

const baseUrl = testData.baseUrl;
const headers = testData.headers;

let createdUser: any;

async function deleteUser(request: any, userId: string, headers: Record<string, string>) {
  const response = await request.delete(`${baseUrl}/users/delete/${userId}/`, { headers });
  expect(response.status()).toBe(200);
  console.log(`Deleted user with ID: ${userId}`);
}

test.describe('Tests User', () => {
  
  test.beforeAll(async ({ request }) => {
    console.log('Creating a user before all tests...');
    const password = generateRandomPassword(12);
    const body = {
      name: generateRandomName(),
      email: generateRandomEmail(),
      password: password,
    };
    createdUser = await makeRequest(request, 'POST', '/users/register/', headers, body);
  });

  test.afterAll(async ({ request }) => {
    console.log('Deleting the created user after all tests...');
    await deleteUser(request, createdUser._id, headers);
  });

  test('Test GET request get user', async ({ request }) => {
    const userData = await makeRequest(request, 'GET', `/users/${createdUser._id}`, headers);

    expect(userData).toHaveProperty('name', createdUser.name);
    expect(userData).toHaveProperty('email', createdUser.email);
  });

  test('Test PUT request update user', async ({ request }) => {
    const updatedBody = {
      name: 'Edited Name',
      email: 'edited@mainModule.com',
      isAdmin: false,
    };

    const updatedUser = await makeRequest(request, 'PUT', `/users/update/${createdUser._id}/`, headers, updatedBody);

    expect(updatedUser).toHaveProperty('name', updatedBody.name);
    expect(updatedUser).toHaveProperty('email', updatedBody.email);
    expect(updatedUser).toHaveProperty('_id');
    expect(updatedUser).toHaveProperty('isAdmin', updatedBody.isAdmin);

    // Optional: Update the createdUser object if you want to use updated values in the next tests
    createdUser = updatedUser;
  });

    test('Test POST request login user', async ({ request }) => {

    const headers = {
      'Content-Type': 'application/json',
    };

    const loginBody = {
        "username": testData.existingUser.email,
        "password": testData.existingUser.password,
    };
    const loginResponse = await makeRequest(request, 'POST', '/users/login/', headers, loginBody); 

    expect(loginResponse).toHaveProperty('name', testData.existingUser.name);
    expect(loginResponse).toHaveProperty('username', testData.existingUser.username);
    expect(loginResponse).toHaveProperty('email', testData.existingUser.email);
    expect(loginResponse).toHaveProperty('isAdmin', testData.existingUser.isAdmin);
    expect(loginResponse).toHaveProperty('_id', testData.existingUser._id);  

   });
});
