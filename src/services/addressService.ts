import axios from 'axios';

// Create axios instance for address service
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressData {
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  isDefault?: boolean;
}

export class AddressService {
  private static readonly BASE_URL = '/api/addresses';

  /**
   * Get all addresses for the authenticated user
   */
  static async getAddresses(): Promise<Address[]> {
    try {
      const response = await api.get<Address[]>(this.BASE_URL);
      return response.data;
    } catch {
      throw new Error('Failed to fetch addresses');
    }
  }

  /**
   * Get a specific address by ID
   */
  static async getAddress(id: string): Promise<Address> {
    try {
      const response = await api.get<Address>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch {
      throw new Error('Failed to fetch address');
    }
  }

  /**
   * Create a new address
   */
  static async addAddress(addressData: CreateAddressData): Promise<Address> {
    try {
      const response = await api.post<Address>(this.BASE_URL, addressData);
      return response.data;
    } catch {
      throw new Error('Failed to create address');
    }
  }

  /**
   * Update an existing address
   */
  static async updateAddress(id: string, addressData: UpdateAddressData): Promise<Address> {
    try {
      const response = await api.put<Address>(`${this.BASE_URL}/${id}`, addressData);
      return response.data;
    } catch {
      throw new Error('Failed to update address');
    }
  }

  /**
   * Delete an address
   */
  static async deleteAddress(id: string): Promise<void> {
    try {
      await api.delete(`${this.BASE_URL}/${id}`);
    } catch {
      throw new Error('Failed to delete address');
    }
  }

  /**
   * Set an address as default
   */
  static async setDefaultAddress(id: string): Promise<Address> {
    try {
      const response = await api.patch<Address>(`${this.BASE_URL}/${id}/default`);
      return response.data;
    } catch {
      throw new Error('Failed to set default address');
    }
  }

  /**
   * Validate address data
   */
  static validateAddressData(data: CreateAddressData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push('Name is required');
    }

    if (!data.street?.trim()) {
      errors.push('Street address is required');
    }

    if (!data.city?.trim()) {
      errors.push('City is required');
    }

    if (!data.postalCode?.trim()) {
      errors.push('Postal code is required');
    }

    if (!data.country?.trim()) {
      errors.push('Country is required');
    }

    if (!['home', 'work', 'other'].includes(data.type)) {
      errors.push('Invalid address type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format address for display
   */
  static formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
  }
}

export default AddressService;