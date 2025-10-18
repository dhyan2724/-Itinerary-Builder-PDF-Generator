import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ItineraryData } from '../types';

export const generatePDF = async (data: ItineraryData): Promise<void> => {
  // Create a temporary element to render the PDF content
  const pdfElement = document.createElement('div');
  pdfElement.style.width = '210mm'; // A4 width
  pdfElement.style.minHeight = '297mm'; // A4 height
  pdfElement.style.padding = '20mm';
  pdfElement.style.fontFamily = 'Inter, sans-serif';
  pdfElement.style.backgroundColor = 'white';
  pdfElement.style.position = 'absolute';
  pdfElement.style.left = '-9999px';
  pdfElement.style.top = '0';

  // Generate the PDF content HTML
  pdfElement.innerHTML = generatePDFContent(data);
  document.body.appendChild(pdfElement);

  try {
    // Convert to canvas
    const canvas = await html2canvas(pdfElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${data.destination}-Itinerary-${data.travelerName}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(pdfElement);
  }
};

const generatePDFContent = (data: ItineraryData): string => {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .gradient-bg {
        background: linear-gradient(135deg, #3B82F6 0%, #6B46C1 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 10px;
        margin-bottom: 30px;
      }
      
      .section-title {
        color: #6B46C1;
        font-size: 24px;
        font-weight: bold;
        margin: 30px 0 20px 0;
        border-bottom: 2px solid #6B46C1;
        padding-bottom: 10px;
      }
      
      .travel-details {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
      }
      
      .travel-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 20px;
        text-align: center;
        font-size: 14px;
      }
      
      .day-container {
        margin-bottom: 40px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 20px;
      }
      
      .day-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .day-number {
        width: 50px;
        height: 50px;
        background: #6B46C1;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        margin-right: 20px;
      }
      
      .day-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      
      .activity {
        display: flex;
        align-items: flex-start;
        margin-bottom: 15px;
      }
      
      .activity-dot {
        width: 12px;
        height: 12px;
        background: #6B46C1;
        border-radius: 50%;
        margin-top: 8px;
        margin-right: 15px;
        flex-shrink: 0;
      }
      
      .activity-content h5 {
        font-weight: 600;
        color: #374151;
        margin-bottom: 5px;
        text-transform: capitalize;
      }
      
      .activity-content h6 {
        font-weight: 500;
        color: #1f2937;
        margin-bottom: 5px;
      }
      
      .activity-content p {
        color: #6b7280;
        font-size: 14px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      
      th, td {
        border: 1px solid #d1d5db;
        padding: 12px;
        text-align: left;
        font-size: 14px;
      }
      
      th {
        background-color: #f9fafb;
        font-weight: 600;
        color: #374151;
      }
      
      .visa-details {
        background: #f3f4f6;
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .visa-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        text-align: center;
      }
      
      .footer {
        text-align: center;
        margin-top: 40px;
        padding: 30px;
        background: #f9fafb;
        border-radius: 10px;
      }
      
      .cta-button {
        background: #6B46C1;
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        font-weight: 600;
        display: inline-block;
        margin: 20px 0;
        text-decoration: none;
      }
      
      .company-info {
        margin-top: 20px;
        font-size: 14px;
        color: #6b7280;
      }
    </style>
    
    <div class="gradient-bg">
      <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">
        Hi, ${data.travelerName}!
      </h1>
      <h2 style="font-size: 28px; font-weight: 600; margin-bottom: 10px;">
        ${data.destination} Itinerary
      </h2>
      <p style="font-size: 18px; opacity: 0.9;">
        ${data.duration}
      </p>
      
      <div class="travel-details">
        <div class="travel-grid">
          <div>
            <div style="font-weight: 600;">Departure From</div>
            <div>${data.departureFrom}</div>
          </div>
          <div>
            <div style="font-weight: 600;">Departure To</div>
            <div>${data.departureTo}</div>
          </div>
          <div>
            <div style="font-weight: 600;">Adult</div>
            <div>${data.adults.toString().padStart(2, '0')}</div>
          </div>
          <div>
            <div style="font-weight: 600;">Children</div>
            <div>${data.children.toString().padStart(2, '0')}</div>
          </div>
          <div>
            <div style="font-weight: 600;">Infant</div>
            <div>${data.infants.toString().padStart(2, '0')}</div>
          </div>
          <div>
            <div style="font-weight: 600;">No. of Travellers</div>
            <div>${data.totalTravelers.toString().padStart(2, '0')}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section-title">Daily Itinerary</div>
    
    ${data.days.map(day => `
      <div class="day-container">
        <div class="day-header">
          <div class="day-number">${day.dayNumber}</div>
          <div>
            <h4 style="font-size: 20px; font-weight: 600; color: #1f2937;">Day ${day.dayNumber}</h4>
            <p style="color: #6b7280;">${day.date}</p>
          </div>
        </div>
        
        ${day.imageUrl ? `<img src="${day.imageUrl}" alt="Day ${day.dayNumber}" class="day-image" />` : ''}
        
        <div class="activity">
          <div class="activity-dot"></div>
          <div class="activity-content">
            <h5>Morning</h5>
            <h6>${day.morning.title}</h6>
            <p>${day.morning.description}</p>
          </div>
        </div>
        
        <div class="activity">
          <div class="activity-dot"></div>
          <div class="activity-content">
            <h5>Afternoon</h5>
            <h6>${day.afternoon.title}</h6>
            <p>${day.afternoon.description}</p>
          </div>
        </div>
        
        <div class="activity">
          <div class="activity-dot"></div>
          <div class="activity-content">
            <h5>Evening</h5>
            <h6>${day.evening.title}</h6>
            <p>${day.evening.description}</p>
          </div>
        </div>
      </div>
    `).join('')}
    
    ${data.flights.length > 0 ? `
      <div class="section-title">Flight Summary</div>
      <div style="margin: 20px 0;">
        ${data.flights.map(flight => `
          <div style="margin-bottom: 10px; font-size: 14px;">
            <strong>${flight.date}</strong> - 
            Fly ${flight.airline} ${flight.flightNumber} From ${flight.from} To ${flight.to} ${flight.departureTime} - ${flight.arrivalTime}
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${data.hotels.length > 0 ? `
      <div class="section-title">Hotel Bookings</div>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Nights</th>
            <th>Hotel Name</th>
          </tr>
        </thead>
        <tbody>
          ${data.hotels.map(hotel => `
            <tr>
              <td>${hotel.city}</td>
              <td>${hotel.checkIn}</td>
              <td>${hotel.checkOut}</td>
              <td>${hotel.nights}</td>
              <td>${hotel.hotelName}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
    
    <div class="section-title">Payment Plan</div>
    <div style="margin: 20px 0;">
      <p style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">
        Total Amount: ₹ ${data.totalAmount.toLocaleString()} for ${data.totalTravelers} Pax (${data.currency} ${Math.round(data.totalAmount / data.totalTravelers).toLocaleString()}/Pax)
      </p>
      <p style="color: #6b7280; margin-bottom: 20px;">TDS: ${data.tds}</p>
      
      ${data.installments.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Installment Name</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.installments.map(installment => `
              <tr>
                <td>${installment.name}</td>
                <td>₹ ${installment.amount.toLocaleString()}</td>
                <td>${installment.dueDate}</td>
                <td>${installment.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>
    
    <div class="section-title">Visa Details</div>
    <div class="visa-details">
      <div class="visa-grid">
        <div>
          <div style="font-weight: 600;">Visa Type</div>
          <div>${data.visaType}</div>
        </div>
        <div>
          <div style="font-weight: 600;">Pax Adult</div>
          <div>${data.adults} Pax</div>
        </div>
        <div>
          <div style="font-weight: 600;">Processing Days</div>
          <div>${data.visaProcessingDays}</div>
        </div>
      </div>
    </div>
    
    ${data.importantNotes.length > 0 ? `
      <div class="section-title">Important Notes</div>
      <table>
        <thead>
          <tr>
            <th>Point</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${data.importantNotes.map(note => `
            <tr>
              <td>${note.point}</td>
              <td>${note.details}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
    
    ${data.scopeOfService.length > 0 ? `
      <div class="section-title">Scope of Service</div>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${data.scopeOfService.map(service => `
            <tr>
              <td>${service.service}</td>
              <td>${service.details}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
    
    ${data.inclusions.length > 0 ? `
      <div class="section-title">Inclusion Summary</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Details</th>
            <th>Status/Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${data.inclusions.map(inclusion => `
            <tr>
              <td>${inclusion.category}</td>
              <td>${inclusion.count}</td>
              <td>${inclusion.details}</td>
              <td>${inclusion.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
    
    ${data.activities.length > 0 ? `
      <div class="section-title">Activity Table</div>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Activity</th>
            <th>Type</th>
            <th>Time Required</th>
          </tr>
        </thead>
        <tbody>
          ${data.activities.map(activity => `
            <tr>
              <td>${activity.city || ''}</td>
              <td>${activity.title}</td>
              <td>${activity.type || ''}</td>
              <td>${activity.timeRequired || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
    
    <div class="footer">
      <h3 style="font-size: 24px; font-weight: bold; color: #6B46C1; margin-bottom: 20px;">
        PLAN.PACK.GO!
      </h3>
      <div class="cta-button">Book Now</div>
      
      <div class="company-info">
        <p style="font-weight: 600; margin-bottom: 10px;">Vigovia Tour Pvt. Ltd.</p>
        <p>Contact: +91-9876543210 | Email: info@vigovia.com</p>
        <p>Address: 123 Travel Street, Mumbai, India</p>
      </div>
    </div>
  `;
};
