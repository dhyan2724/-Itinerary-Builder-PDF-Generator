import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { InstallmentData, ItineraryData } from '../types';

interface PaymentFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'installments'
  });
  const installments = watch('installments') || [];
  const totalAmount = watch('totalAmount') || 0;
  const currency = watch('currency') || 'INR';
  const tds = watch('tds') || 'Not Applicable';

  const addInstallment = () => {
    const newInstallment: InstallmentData = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      dueDate: '',
      status: 'Pending',
    };
    append(newInstallment);
  };

  const removeInstallment = (index: number) => {
    remove(index);
  };

  const updateInstallment = (index: number, field: keyof InstallmentData, value: string | number) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index] = { ...updatedInstallments[index], [field]: value };
    setValue('installments', updatedInstallments);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="form-label">Total Amount</label>
          <input
            type="number"
            className="form-input"
            {...control.register('totalAmount', { required: 'Total amount is required' })}
            placeholder="95000"
          />
        </div>

        <div>
          <label className="form-label">Currency</label>
          <select
            className="form-input"
            {...control.register('currency')}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="form-label">TDS</label>
          <input
            type="text"
            className="form-input"
            {...control.register('tds')}
            placeholder="Not Applicable"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Installments</h3>
          <button
            type="button"
            onClick={addInstallment}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Installment
          </button>
        </div>

        {installments.map((installment, index) => (
          <div key={installment.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Installment {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeInstallment(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Installment Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={installment.name}
                  onChange={(e) => updateInstallment(index, 'name', e.target.value)}
                  placeholder="e.g., Booking Amount"
                />
              </div>

              <div>
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={installment.amount}
                  onChange={(e) => updateInstallment(index, 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={installment.dueDate}
                  onChange={(e) => updateInstallment(index, 'dueDate', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={installment.status}
                  onChange={(e) => updateInstallment(index, 'status', e.target.value as 'Paid' | 'Pending')}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {installments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No installments added yet. Click "Add Installment" to add payment details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
