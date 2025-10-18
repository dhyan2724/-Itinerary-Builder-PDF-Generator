import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { FlightData, ItineraryData } from '../types';

interface FlightsFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const FlightsForm: React.FC<FlightsFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'flights'
  });
  const flights = watch('flights') || [];

  const addFlight = () => {
    const newFlight: FlightData = {
      id: Date.now().toString(),
      date: '',
      airline: '',
      flightNumber: '',
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
    };
    append(newFlight);
  };

  const removeFlight = (index: number) => {
    remove(index);
  };

  const updateFlight = (index: number, field: keyof FlightData, value: string) => {
    const updatedFlights = [...flights];
    updatedFlights[index] = { ...updatedFlights[index], [field]: value };
    setValue('flights', updatedFlights);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Flight Details</h3>
        <button
          type="button"
          onClick={addFlight}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Flight
        </button>
      </div>

      {flights.map((flight, index) => (
        <div key={flight.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              Flight {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeFlight(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={flight.date}
                onChange={(e) => updateFlight(index, 'date', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Airline</label>
              <input
                type="text"
                className="form-input"
                value={flight.airline}
                onChange={(e) => updateFlight(index, 'airline', e.target.value)}
                placeholder="e.g., Air India"
              />
            </div>

            <div>
              <label className="form-label">Flight Number</label>
              <input
                type="text"
                className="form-input"
                value={flight.flightNumber}
                onChange={(e) => updateFlight(index, 'flightNumber', e.target.value)}
                placeholder="e.g., AI 827"
              />
            </div>

            <div>
              <label className="form-label">From (Airport Code)</label>
              <input
                type="text"
                className="form-input"
                value={flight.from}
                onChange={(e) => updateFlight(index, 'from', e.target.value)}
                placeholder="e.g., DEL"
              />
            </div>

            <div>
              <label className="form-label">To (Airport Code)</label>
              <input
                type="text"
                className="form-input"
                value={flight.to}
                onChange={(e) => updateFlight(index, 'to', e.target.value)}
                placeholder="e.g., SIN"
              />
            </div>

            <div>
              <label className="form-label">Departure Time</label>
              <input
                type="time"
                className="form-input"
                value={flight.departureTime}
                onChange={(e) => updateFlight(index, 'departureTime', e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Arrival Time</label>
              <input
                type="time"
                className="form-input"
                value={flight.arrivalTime}
                onChange={(e) => updateFlight(index, 'arrivalTime', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      {flights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No flights added yet. Click "Add Flight" to add flight details.</p>
        </div>
      )}
    </div>
  );
};

export default FlightsForm;
