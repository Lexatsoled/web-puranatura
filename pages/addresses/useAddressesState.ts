import { useCallback, useRef, useState } from 'react';

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

export type FormData = Omit<Address, 'id' | 'isDefault'>;

export const DEFAULT_FORM: FormData = {
  type: 'home',
  name: '',
  street: '',
  city: '',
  postalCode: '',
  country: 'Espana',
};

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'Casa',
    street: 'Calle de la Naturaleza, 123',
    city: 'Madrid',
    postalCode: '28001',
    country: 'Espana',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'Oficina',
    street: 'Avenida de los Remedios, 45, 2o',
    city: 'Madrid',
    postalCode: '28003',
    country: 'Espana',
    isDefault: false,
  },
];

export const useAddressesState = (initialAddresses: Address[]) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM);
    setEditingAddress(null);
  }, []);

  const startAdd = useCallback(() => {
    setIsAddingAddress(true);
    resetForm();
    scrollToForm();
  }, [resetForm, scrollToForm]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (editingAddress) {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id ? { ...addr, ...formData } : addr
          )
        );
      } else {
        const newAddress: Address = {
          id: Date.now().toString(),
          ...formData,
          isDefault: addresses.length === 0,
        };
        setAddresses((prev) => [...prev, newAddress]);
      }

      setIsAddingAddress(false);
      resetForm();
    },
    [addresses.length, editingAddress, formData, resetForm]
  );

  const handleEdit = useCallback(
    (address: Address) => {
      setEditingAddress(address);
      setFormData({
        type: address.type,
        name: address.name,
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
      });
      setIsAddingAddress(true);
      scrollToForm();
    },
    [scrollToForm]
  );

  const handleDelete = useCallback((addressId: string) => {
    if (
      window.confirm('Estas seguro de que quieres eliminar esta direccion?')
    ) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    }
  }, []);

  const handleSetDefault = useCallback((addressId: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  }, []);

  const cancelForm = useCallback(() => {
    setIsAddingAddress(false);
    resetForm();
  }, [resetForm]);

  return {
    addresses,
    isAddingAddress,
    editingAddress,
    formData,
    formRef,
    startAdd,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSetDefault,
    cancelForm,
  };
};
