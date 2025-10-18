import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ItineraryData, ServiceData } from '../types';

interface ServicesFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const ServicesForm: React.FC<ServicesFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'scopeOfService'
  });
  const services = watch('scopeOfService') || [];

  const addService = () => {
    const newService: ServiceData = {
      id: Date.now().toString(),
      service: '',
      details: '',
    };
    append(newService);
  };

  const removeService = (index: number) => {
    remove(index);
  };

  const updateService = (index: number, field: keyof ServiceData, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setValue('scopeOfService', updatedServices);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Scope of Service</h3>
        <button
          type="button"
          onClick={addService}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {services.map((service, index) => (
        <div key={service.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Service {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Service</label>
              <input
                type="text"
                className="form-input"
                value={service.service}
                onChange={(e) => updateService(index, 'service', e.target.value)}
                placeholder="e.g., Flight Booking"
              />
            </div>

            <div>
              <label className="form-label">Details</label>
              <textarea
                className="form-input"
                rows={3}
                value={service.details}
                onChange={(e) => updateService(index, 'details', e.target.value)}
                placeholder="Enter service details"
              />
            </div>
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No services added yet. Click "Add Service" to add scope of service details.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesForm;
