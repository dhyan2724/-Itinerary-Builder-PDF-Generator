import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ActivityData, DayData, ItineraryData } from '../types';

interface DaysFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const DaysForm: React.FC<DaysFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days'
  });
  const days = watch('days') || [];

  const addDay = () => {
    const newDay: DayData = {
      id: Date.now().toString(),
      dayNumber: days.length + 1,
      date: '',
      morning: {
        id: Date.now().toString() + '_morning',
        title: '',
        description: '',
      },
      afternoon: {
        id: Date.now().toString() + '_afternoon',
        title: '',
        description: '',
      },
      evening: {
        id: Date.now().toString() + '_evening',
        title: '',
        description: '',
      },
    };
    append(newDay);
  };

  const removeDay = (index: number) => {
    remove(index);
  };

  const updateDay = (index: number, field: keyof DayData, value: any) => {
    const updatedDays = [...days];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setValue('days', updatedDays);
  };

  const updateActivity = (dayIndex: number, timeSlot: 'morning' | 'afternoon' | 'evening', field: keyof ActivityData, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex][timeSlot] = { ...updatedDays[dayIndex][timeSlot], [field]: value };
    setValue('days', updatedDays);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Itinerary Days</h3>
        <button
          type="button"
          onClick={addDay}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Day
        </button>
      </div>

      {days.map((day, dayIndex) => (
        <div key={day.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              Day {day.dayNumber}
            </h4>
            <button
              type="button"
              onClick={() => removeDay(dayIndex)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={day.date}
                onChange={(e) => updateDay(dayIndex, 'date', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Image URL (optional)</label>
              <input
                type="url"
                className="form-input"
                value={day.imageUrl || ''}
                onChange={(e) => updateDay(dayIndex, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-4">
            {(['morning', 'afternoon', 'evening'] as const).map((timeSlot) => (
              <div key={timeSlot} className="border border-gray-100 rounded-lg p-4">
                <h5 className="text-md font-medium text-gray-800 mb-3 capitalize">
                  {timeSlot}
                </h5>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="form-label">Activity Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={day[timeSlot].title}
                      onChange={(e) => updateActivity(dayIndex, timeSlot, 'title', e.target.value)}
                      placeholder={`Enter ${timeSlot} activity`}
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={day[timeSlot].description}
                      onChange={(e) => updateActivity(dayIndex, timeSlot, 'description', e.target.value)}
                      placeholder={`Describe the ${timeSlot} activity`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {days.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No days added yet. Click "Add Day" to start building your itinerary.</p>
        </div>
      )}
    </div>
  );
};

export default DaysForm;
