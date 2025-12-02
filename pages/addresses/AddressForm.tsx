import { motion } from 'framer-motion';
import { Address, FormData } from './useAddressesState';
import { InputField, SelectField, FormActions } from './AddressFormFields';

type Props = {
  formRef: React.RefObject<HTMLDivElement>;
  formData: FormData;
  editingAddress: Address | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export const AddressForm = ({
  formRef,
  formData,
  editingAddress,
  onChange,
  onSubmit,
  onCancel,
}: Props) => (
  <motion.div
    ref={formRef}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
  >
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      {editingAddress ? 'Editar Direccion' : 'Agregar Nueva Direccion'}
    </h3>

    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="type"
          name="type"
          label="Tipo de direccion"
          value={formData.type}
          options={[
            { value: 'home', label: 'Casa' },
            { value: 'work', label: 'Trabajo' },
            { value: 'other', label: 'Otra' },
          ]}
          onChange={onChange}
        />
        <InputField
          id="name"
          name="name"
          label="Nombre de la direccion"
          placeholder="Ej: Casa principal"
          value={formData.name}
          onChange={onChange}
        />
      </div>

      <InputField
        id="street"
        name="street"
        label="Direccion"
        placeholder="Calle, numero, piso, puerta..."
        value={formData.street}
        onChange={onChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          id="city"
          name="city"
          label="Ciudad"
          placeholder="Madrid"
          value={formData.city}
          onChange={onChange}
        />
        <InputField
          id="postalCode"
          name="postalCode"
          label="Codigo Postal"
          placeholder="28001"
          value={formData.postalCode}
          onChange={onChange}
        />
        <SelectField
          id="country"
          name="country"
          label="Pais"
          value={formData.country}
          options={[
            { value: 'Espana', label: 'Espana' },
            { value: 'Francia', label: 'Francia' },
            { value: 'Portugal', label: 'Portugal' },
            { value: 'Italia', label: 'Italia' },
          ]}
          onChange={onChange}
        />
      </div>

      <FormActions isEditing={Boolean(editingAddress)} onCancel={onCancel} />
    </form>
  </motion.div>
);
