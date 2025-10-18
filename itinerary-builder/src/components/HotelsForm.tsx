import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Control, UseFormGetValues, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { HotelData, ItineraryData } from '../types';

interface HotelsFormProps {
  control: Control<ItineraryData>;
  setValue: UseFormSetValue<ItineraryData>;
  getValues: UseFormGetValues<ItineraryData>;
  watch: UseFormWatch<ItineraryData>;
}

const HotelsForm: React.FC<HotelsFormProps> = ({ control, setValue, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hotels'
  });
  const hotels = watch('hotels') || [];

  const addHotel = () => {
    const newHotel: HotelData = {
      id: Date.now().toString(),
      city: '',
      checkIn: '',
      checkOut: '',
      nights: 0,
      hotelName: '',
    };
    append(newHotel);
  };

  const removeHotel = (index: number) => {
    remove(index);
  };

  const updateHotel = (index: number, field: keyof HotelData, value: string | number) => {
    const updatedHotels = [...hotels];
    updatedHotels[index] = { ...updatedHotels[index], [field]: value };
    setValue('hotels', updatedHotels);
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Hotel Bookings</h3>
        <button
          type="button"
          onClick={addHotel}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>

      {hotels.map((hotel, index) => (
        <div key={hotel.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              Hotel {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeHotel(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={hotel.city}
                onChange={(e) => updateHotel(index, 'city', e.target.value)}
                placeholder="e.g., Singapore"
              />
            </div>

            <div>
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                className="form-input"
                value={hotel.checkIn}
                onChange={(e) => {
                  updateHotel(index, 'checkIn', e.target.value);
                  const nights = calculateNights(e.target.value, hotel.checkOut);
                  updateHotel(index, 'nights', nights);
                }}
              />
            </div>

            <div>
              <label className="form-label">Check-out Date</label>
              <input
                type="date"
                className="form-input"
                value={hotel.checkOut}
                onChange={(e) => {
                  updateHotel(index, 'checkOut', e.target.value);
                  const nights = calculateNights(hotel.checkIn, e.target.value);
                  updateHotel(index, 'nights', nights);
                }}
              />
            </div>

            <div>
              <label className="form-label">Nights</label>
              <input
                type="number"
                className="form-input"
                value={hotel.nights}
                readOnly
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Hotel Name</label>
              <input
                type="text"
                className="form-input"
                value={hotel.hotelName}
                onChange={(e) => updateHotel(index, 'hotelName', e.target.value)}
                placeholder="e.g., Grand Hyatt Singapore"
              />
            </div>
          </div>
        </div>
      ))}

      {hotels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hotels added yet. Click "Add Hotel" to add hotel details.</p>
        </div>
      )}
    </div>
  );
};

export default HotelsForm;
