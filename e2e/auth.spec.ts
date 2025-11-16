import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar redirección y estado
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/bienvenido/i)).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');

    // Enviar formulario vacío
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Verificar errores
    await expect(page.getByText(/email es obligatorio/i)).toBeVisible();
    await expect(page.getByText(/contraseña es obligatoria/i)).toBeVisible();
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/nombre/i).fill('New User');
    await page.getByLabel(/email/i).fill(`test${Date.now()}@example.com`);
    await page.getByLabel(/^contraseña$/i).fill('SecurePass123');
    await page.getByLabel(/confirmar contraseña/i).fill('SecurePass123');
    
    await page.getByRole('button', { name: /registrarse/i }).click();

    // Verificar registro exitoso
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/cuenta creada/i)).toBeVisible();
  });
});
