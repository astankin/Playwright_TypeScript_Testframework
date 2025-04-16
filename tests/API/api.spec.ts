import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:8000/api';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjQ5OTk5LCJpYXQiOjE3NDQ2NTc5OTksImp0aSI6IjI5MzE0MDA1OWY0MTQ5NTg4NGFiMmMzNWUyNjg4MmVkIiwidXNlcl9pZCI6MX0.qgMsyCmdhsl-YQ0vI5XEM0u8uJvwplhxaMBLEugydqQ';
const headers = {
  'Content-Type': 'application/json',
  Authorization: token,
};
const productBody = {
  name: 'Test Product',
  image: '/images/test_product.jpg',
  brand: 'Test Brand',
  category: 'Test Category',
  description: 'This is a test product description.',
  price: "123.45",
  countInStock: 10,
};

async function makeRequest(
  request: any,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  headers: Record<string, string>,
  data?: Record<string, any>
) {
  const response = await request[method.toLowerCase()](`${baseUrl}${endpoint}`, { headers, data });
  expect(response.ok()).toBeTruthy();
  return await response.json();
}

async function deleteProduct(request: any, productId: string, headers: Record<string, string>) {
  const response = await request.delete(`${baseUrl}/products/delete/${productId}/`, { headers });
  expect(response.status()).toBe(200);
  console.log(`Deleted product with ID: ${productId}`);
}

test.describe('Tests Products', () => {
  test('Test GET request get product', async ({ request }) => {
    const productData = await makeRequest(request, 'GET', '/products/1', headers);
    
    expect(productData.name).toBe('Airpods Wireless Bluetooth Headphones');
    expect(productData.brand).toBe('Apple');
    expect(productData.price).toBe('1998.99');
    expect(productData.category).toBe('Electronics');
    expect(productData.description).toBe('Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working');
    expect(productData.countInStock).toBe(18);
    expect(productData.image).toBe('/images/airpods_rueLkRx.jpg');
    expect(productData._id).toBe(1);
    expect(productData.createdAt).toBe('2024-08-13T19:30:16.537131Z');

  });

  test('Test POST request create product', async ({ request }) => {
    const newProduct = await makeRequest(request, 'POST', '/products/create/', headers, productBody);
    
    expect(newProduct).toHaveProperty('name', 'Test Product');
    expect(newProduct).toHaveProperty('price', '123.45');
    expect(newProduct).toHaveProperty('brand', 'Test Brand');
    expect(newProduct).toHaveProperty('category', 'Test Category');
    expect(newProduct).toHaveProperty('description', 'This is a test product description.');
    expect(newProduct).toHaveProperty('countInStock', 10);
    expect(newProduct).toHaveProperty('image', '/images/images/test_product.jpg');
    expect(newProduct).toHaveProperty('_id');
    expect(newProduct).toHaveProperty('createdAt');

    await deleteProduct(request, newProduct._id, headers);
  });

  test('Test PUT request update product', async ({ request }) => {
    const createdProduct = await makeRequest(request, 'POST', '/products/create/', headers, productBody);

    const updatedBody = { ...productBody, name: 'Updated Test Product', price: '150.00' };
    const updatedProduct = await makeRequest(request, 'PUT', `/products/update/${createdProduct._id}/`, headers, updatedBody);

    expect(updatedProduct).toHaveProperty('name', 'Updated Test Product');
    expect(updatedProduct).toHaveProperty('price', '150.00');
    expect(updatedProduct).toHaveProperty('brand', 'Test Brand');
    expect(updatedProduct).toHaveProperty('category', 'Test Category');
    expect(updatedProduct).toHaveProperty('description', 'This is a test product description.');
    expect(updatedProduct).toHaveProperty('countInStock', 10);

    await deleteProduct(request, updatedProduct._id, headers);
  });




});
