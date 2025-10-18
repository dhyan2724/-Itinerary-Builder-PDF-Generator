import { ArrowLeft, Download } from 'lucide-react';
import React from 'react';
import { ItineraryData } from '../types';

interface PDFPreviewProps {
  data: ItineraryData;
  onGeneratePDF: () => void;
  onBackToForm: () => void;
  isGeneratingPDF: boolean;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  data,
  onGeneratePDF,
  onBackToForm,
  isGeneratingPDF,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBackToForm}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Form
            </button>
            
            <button
              onClick={onGeneratePDF}
              disabled={isGeneratingPDF}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
            </button>
          </div>

          {/* Preview Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="gradient-bg text-white p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                  Hi, {data.travelerName}!
                </h1>
                <h2 className="text-2xl font-semibold mb-2">
                  {data.destination} Itinerary
                </h2>
                <p className="text-lg opacity-90">
                  {data.duration}
                </p>
              </div>
              
              {/* Travel Details Bar */}
              <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold">Departure From</div>
                    <div>{data.departureFrom}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Departure To</div>
                    <div>{data.departureTo}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Adult</div>
                    <div>{data.adults.toString().padStart(2, '0')}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Children</div>
                    <div>{data.children.toString().padStart(2, '0')}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Infant</div>
                    <div>{data.infants.toString().padStart(2, '0')}</div>
                  </div>
                  <div>
                    <div className="font-semibold">No. of Travellers</div>
                    <div>{data.totalTravelers.toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Days Section */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-vigovia-purple mb-6">Daily Itinerary</h3>
              
              {data.days.map((day, index) => (
                <div key={day.id} className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-vigovia-purple text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {day.dayNumber}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">Day {day.dayNumber}</h4>
                      <p className="text-gray-600">{day.date}</p>
                    </div>
                  </div>

                  {day.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={day.imageUrl}
                        alt={`Day ${day.dayNumber}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {(['morning', 'afternoon', 'evening'] as const).map((timeSlot) => (
                      <div key={timeSlot} className="flex items-start">
                        <div className="w-3 h-3 bg-vigovia-purple rounded-full mt-2 mr-4 flex-shrink-0"></div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 capitalize mb-1">
                            {timeSlot}
                          </h5>
                          <h6 className="font-medium text-gray-800 mb-1">
                            {day[timeSlot].title}
                          </h6>
                          <p className="text-gray-600 text-sm">
                            {day[timeSlot].description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Flight Summary */}
            {data.flights.length > 0 && (
              <div className="p-8 border-t">
                <h3 className="text-2xl font-bold text-vigovia-purple mb-4">Flight Summary</h3>
                <div className="space-y-2">
                  {data.flights.map((flight) => (
                    <div key={flight.id} className="text-sm text-gray-700">
                      <span className="font-medium">{flight.date}</span> - 
                      Fly {flight.airline} {flight.flightNumber} From {flight.from} To {flight.to} {flight.departureTime} - {flight.arrivalTime}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotel Bookings */}
            {data.hotels.length > 0 && (
              <div className="p-8 border-t">
                <h3 className="text-2xl font-bold text-vigovia-purple mb-4">Hotel Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">City</th>
                        <th className="text-left py-2">Check-In</th>
                        <th className="text-left py-2">Check-Out</th>
                        <th className="text-left py-2">Nights</th>
                        <th className="text-left py-2">Hotel Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.hotels.map((hotel) => (
                        <tr key={hotel.id} className="border-b">
                          <td className="py-2">{hotel.city}</td>
                          <td className="py-2">{hotel.checkIn}</td>
                          <td className="py-2">{hotel.checkOut}</td>
                          <td className="py-2">{hotel.nights}</td>
                          <td className="py-2">{hotel.hotelName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment Plan */}
            <div className="p-8 border-t">
              <h3 className="text-2xl font-bold text-vigovia-purple mb-4">Payment Plan</h3>
              <div className="mb-4">
                <p className="text-lg font-semibold">
                  Total Amount: ₹ {data.totalAmount.toLocaleString()} for {data.totalTravelers} Pax ({data.currency} {Math.round(data.totalAmount / data.totalTravelers).toLocaleString()}/Pax)
                </p>
                <p className="text-sm text-gray-600">TDS: {data.tds}</p>
              </div>
              
              {data.installments.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Installment Name</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Due Date</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.installments.map((installment) => (
                        <tr key={installment.id} className="border-b">
                          <td className="py-2">{installment.name}</td>
                          <td className="py-2">₹ {installment.amount.toLocaleString()}</td>
                          <td className="py-2">{installment.dueDate}</td>
                          <td className="py-2">{installment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Visa Details */}
            <div className="p-8 border-t">
              <h3 className="text-2xl font-bold text-vigovia-purple mb-4">Visa Details</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-semibold">Visa Type</div>
                    <div>{data.visaType}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Pax Adult</div>
                    <div>{data.adults} Pax</div>
                  </div>
                  <div>
                    <div className="font-semibold">Processing Days</div>
                    <div>{data.visaProcessingDays}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t bg-gray-50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-vigovia-purple mb-4">PLAN.PACK.GO!</h3>
                <button className="bg-vigovia-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-vigovia-light-purple transition-colors">
                  Book Now
                </button>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-600">
                <p className="font-semibold">Vigovia Tour Pvt. Ltd.</p>
                <p>Contact: +91-9876543210 | Email: info@vigovia.com</p>
                <p>Address: 123 Travel Street, Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
