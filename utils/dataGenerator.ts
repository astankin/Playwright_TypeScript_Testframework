// utils/dataGenerator.ts

import { Client } from 'pg';

export function generateRandomEmail(domain: string = 'test.com'): string {
    const timestamp = Date.now();
    return `user${timestamp}@${domain}`;
  }
  
  export function generateRandomPassword(length: number = 12): string {
    // Define characters for each type of requirement
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = Date.now().toString();
    const specialChars = '!@#$%^&*?';
  
    // Ensure the password contains at least one character from each required category
    let password = '';
    password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    password += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
    // Add random characters to reach the desired length
    const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  
    // Shuffle the password to mix the characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
  }

  export function generateRandomName(): string {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'David', 'Emily', 'Frank', 'Grace', 'Hannah'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  
    // Get random first and last name from the lists
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    return `${firstName} ${lastName}`;
  }

  // utils/testUtils.ts

// utils/testUtils.ts

export async function deleteUserFromDb(email: string): Promise<void> {
  const client = new Client({
    host: 'localhost',       
    user: 'postgres',        
    password: 'root',        
    database: 'stankinshop', 
    port: 5433,             
  });

  await client.connect();

  try {
    // Adjust the query to your database schema if necessary (make sure 'users' table exists)
    await client.query('DELETE FROM auth_user WHERE email = $1', [email]);
    console.log(`Deleted user with email: ${email}`);
  } catch (err) {
    console.error('Error deleting user:', err);
  } finally {
    await client.end();
  }
}


  
  
  
  