// utils/dataGenerator.ts

export function generateRandomEmail(domain: string = 'test.com'): string {
    const timestamp = Date.now();
    return `user${timestamp}@${domain}`;
  }
  
  export function generateRandomPassword(length: number = 12): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  