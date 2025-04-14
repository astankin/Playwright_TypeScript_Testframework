import { test, expect } from '@playwright/test';
import { assert } from 'console';

const baseUrl = 'http://127.0.0.1:8000/api';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjQ5OTk5LCJpYXQiOjE3NDQ2NTc5OTksImp0aSI6IjI5MzE0MDA1OWY0MTQ5NTg4NGFiMmMzNWUyNjg4MmVkIiwidXNlcl9pZCI6MX0.qgMsyCmdhsl-YQ0vI5XEM0u8uJvwplhxaMBLEugydqQ';
const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
const body = {
    name: 'Test Product',
    image: '/images/test_product.jpg',
    brand: 'Test Brand',
    category: 'Test Category',
    description: 'This is a test product description.',
    price: "123.45", 
    countInStock: 10,
  };

test.describe('Tests Products', () => {
    test('Test GET request get product', async ({ request }) => {
        const response = await request.get(`${baseUrl}/products/1`);
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        const data = await response.json();

        expect(data.name).toBe('Airpods Wireless Bluetooth Headphones');
        expect(data.brand).toBe('Apple');
        expect(data.price).toBe('1998.99'); // or toBeCloseTo if it's numeric
        expect(data.countInStock).toBe(18);
        expect(data.rating).toBe('3.00');
        expect(data.category).toBe('Electronics');
        expect(data.numReviews).toBe(2);
        expect(data.image).toBe('/images/airpods_rueLkRx.jpg');
        expect(Array.isArray(data.reviews)).toBe(true);
        expect(data.reviews.length).toBeGreaterThanOrEqual(0);
        expect(data.reviews.length).toBe(2);

        if (data.reviews.length > 0) {
            expect(data.reviews[0]).toHaveProperty('name');
            expect(data.reviews[0]).toHaveProperty('comment');
            expect(data.reviews[0]).toHaveProperty('rating');
            expect(data.reviews[0].name).toBe('Nasko');
            expect(data.reviews[0].comment).toBe('Good Product');
            expect(data.reviews[0].rating).toBe(3);
            expect(data.reviews[1].name).toBe('Atanas');
            expect(data.reviews[1].comment).toBe('Fast Delivery. Many Thanks !');
            expect(data.reviews[1].rating).toBe(3);
        }
        
        expect(data.description).toBe(
            'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working'
        );
    });


    test('Test POST request create product', async ({ request }) => {
        const response = await request.post(`${baseUrl}/products/create/`, {
          headers: headers,
          data: body,
        });
      
        const resJson = await response.json();
      
        expect(response.status()).toBe(200); // or 201 depending on your view
        expect(resJson).toHaveProperty('name', 'Test Product');
        expect(resJson).toHaveProperty('image', '/images/images/test_product.jpg');
        expect(resJson).toHaveProperty('brand', 'Test Brand');
        expect(resJson).toHaveProperty('category', 'Test Category');
        expect(resJson).toHaveProperty('description', 'This is a test product description.');
        expect(resJson).toHaveProperty('price', '123.45');
        expect(resJson).toHaveProperty('countInStock', 10);
        expect(resJson).toHaveProperty('rating', null); // assuming default rating is 0.00
        expect(resJson).toHaveProperty('numReviews', 0); // assuming default numReviews is 0

        if (resJson._id) {
            const deleteResponse = await request.delete(`${baseUrl}/products/delete/${resJson._id}/`, {
                headers: headers,
            });

            console.log(`Deleted product with ID: ${resJson._id}`);
        expect(deleteResponse.status()).toBe(200); 
        }
    });




    
});
