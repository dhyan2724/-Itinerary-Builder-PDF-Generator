import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ItineraryData } from '../types';

// Helper function to convert image URL to base64
const imageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn('Image loading timeout for:', url);
      resolve(getPlaceholderImage());
    }, 10000); // 10 second timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        console.warn('Error processing image:', url, error);
        resolve(getPlaceholderImage());
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.warn('Failed to load image:', url);
      resolve(getPlaceholderImage());
    };
    
    img.src = url;
  });
};

// Helper function to get a placeholder image
const getPlaceholderImage = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
};

// Helper function to process all images in the content
const processImages = async (content: string): Promise<string> => {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let processedContent = content;
  let match;
  
  // Find all image URLs first
  const imageUrls: string[] = [];
  while ((match = imgRegex.exec(content)) !== null) {
    const originalSrc = match[1];
    if (originalSrc.startsWith('http') && !imageUrls.includes(originalSrc)) {
      imageUrls.push(originalSrc);
    }
  }
  
  // Process all images in parallel
  const imageResults = await Promise.allSettled(
    imageUrls.map(async (url) => {
      try {
        const base64Image = await imageToBase64(url);
        return { url, base64Image };
      } catch (error) {
        console.warn('Failed to process image:', url, error);
        return { url, base64Image: getPlaceholderImage() };
      }
    })
  );
  
  // Replace all image URLs with base64 data
  imageResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { url, base64Image } = result.value;
      processedContent = processedContent.replace(new RegExp(url, 'g'), base64Image);
    }
  });
  
  return processedContent;
};

export const generatePDF = async (data: ItineraryData): Promise<void> => {
  // Create a temporary element to render the PDF content
  const pdfElement = document.createElement('div');
  pdfElement.style.width = '210mm'; // A4 width
  pdfElement.style.minHeight = 'auto'; // Let it grow as needed
  pdfElement.style.padding = '20mm';
  pdfElement.style.fontFamily = 'Inter, sans-serif';
  pdfElement.style.backgroundColor = 'white';
  pdfElement.style.position = 'absolute';
  pdfElement.style.left = '-9999px';
  pdfElement.style.top = '0';
  pdfElement.style.overflow = 'visible';

  // Generate the PDF content HTML and process images
  const rawContent = generatePDFContent(data);
  const processedContent = await processImages(rawContent);
  pdfElement.innerHTML = processedContent;
  document.body.appendChild(pdfElement);

  try {
    // Wait a bit for images to load and render
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Convert to canvas
    const canvas = await html2canvas(pdfElement, {
      scale: 1.5, // Reduced scale for better performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: pdfElement.offsetWidth,
      height: pdfElement.offsetHeight,
      logging: false,
      imageTimeout: 20000, // 20 second timeout for images
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Calculate total number of pages
    let totalPages = 1;
    let tempHeightLeft = imgHeight - pageHeight;
    while (tempHeightLeft >= 0) {
      totalPages++;
      tempHeightLeft -= pageHeight;
    }

    let position = 0;
    let pageNumber = 1;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    // Only add footer if this is the last page
    if (pageNumber === totalPages) {
      addCompanyFooter(pdf, pageNumber);
    }
    heightLeft -= pageHeight;
    pageNumber++;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      // Only add footer if this is the last page
      if (pageNumber === totalPages) {
        addCompanyFooter(pdf, pageNumber);
      }
      heightLeft -= pageHeight;
      pageNumber++;
    }

    // Save the PDF
    pdf.save(`${data.destination || 'Itinerary'}-Itinerary-${data.travelerName || 'Traveler'}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(pdfElement);
  }
};

const addCompanyFooter = (pdf: jsPDF, pageNumber: number) => {
  const pageHeight = 297;
  const footerY = pageHeight - 15;
  
  // Set font for footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  
  // Left section - Logo and Company Details
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(139, 69, 19); // Dark purple for "vi"
  pdf.text('vi', 10, footerY - 12);
  pdf.setTextColor(128, 0, 128); // Light purple for "govia"
  pdf.text('govia', 13, footerY - 12);
  
  // Company details to the right of logo
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('vigovia.com', 25, footerY - 12);
  pdf.text('Registered Office: 123, Green Park, New Delhi, India', 25, footerY - 9);
  pdf.text('Phone: +91-9876543210', 25, footerY - 6);
  pdf.text('Email: info@vigovia.com', 25, footerY - 3);
  pdf.text('CIN: U74999DL2017PTC311111', 25, footerY);
};

const generatePDFContent = (data: ItineraryData): string => {
  const totalDays = data.days.length;
  const totalNights = totalDays - 1;
  const totalTravelers = data.totalTravelers || 2;
  
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
        line-height: 1.4;
        color: #333;
        background: white;
        font-size: 14px;
        width: 210mm;
        min-height: 297mm;
      }
      
      .container {
        width: 100%;
        background: white;
        padding: 0;
      }
      
      /* Header Banner */
      .header-banner {
        background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        color: white;
        margin-bottom: 20px;
        position: relative;
      }
      
      .header-banner h1 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .header-banner h2 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      
      .header-banner h3 {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 20px;
      }
      
      .header-icons {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 15px;
      }
      
      .header-icon {
        width: 12px;
        height: 12px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }
      
      /* Travel Details Table */
      .travel-details {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .travel-details table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .travel-details th {
        background: #8B5CF6;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
      }
      
      .travel-details td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 14px;
        color: #374151;
      }
      
      /* Section Titles */
      .section-title {
        font-size: 20px;
        font-weight: bold;
        color: #8B5CF6;
        margin: 30px 0 15px 0;
        padding-bottom: 5px;
        border-bottom: 3px solid #8B5CF6;
        display: inline-block;
      }
      
      /* Daily Itinerary */
      .daily-itinerary {
        margin-bottom: 30px;
      }
      
      .day-item {
        display: flex;
        margin-bottom: 25px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .day-sidebar {
        background: #8B5CF6;
        color: white;
        padding: 20px 15px;
        min-width: 80px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .day-number {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .day-date {
        font-size: 12px;
        opacity: 0.9;
      }
      
      .day-content {
        flex: 1;
        padding: 20px;
        display: flex;
        align-items: flex-start;
      }
      
      .day-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 20px;
        flex-shrink: 0;
      }
      
      .day-activities {
        flex: 1;
      }
      
      .timeline {
        position: relative;
        padding-left: 20px;
      }
      
      .timeline::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #d1d5db;
        border-style: dotted;
      }
      
      .timeline-item {
        position: relative;
        margin-bottom: 15px;
      }
      
      .timeline-item::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 6px;
        width: 8px;
        height: 8px;
        background: #8B5CF6;
        border-radius: 50%;
      }
      
      .timeline-time {
        font-weight: 600;
        color: #374151;
        font-size: 14px;
        margin-bottom: 4px;
      }
      
      .timeline-activity {
        color: #6b7280;
        font-size: 13px;
        line-height: 1.4;
      }
      
      /* Tables */
      .info-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .info-table th {
        background: #8B5CF6;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
      }
      
      .info-table td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 13px;
        color: #374151;
        background: #f8fafc;
      }
      
      .info-table tr:last-child td {
        border-bottom: none;
      }
      
      /* Flight Summary */
      .flight-summary {
        margin-bottom: 30px;
      }
      
      .flight-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px;
        background: #f8fafc;
        border-radius: 6px;
      }
      
      .flight-date {
        font-weight: bold;
        color: #374151;
        margin-right: 15px;
        min-width: 100px;
      }
      
      .flight-arrow {
        margin: 0 10px;
        color: #6b7280;
      }
      
      .flight-details {
        color: #374151;
        flex: 1;
      }
      
      .flight-note {
        font-size: 12px;
        color: #6b7280;
        font-style: italic;
        margin-top: 10px;
      }
      
      /* Payment Plan */
      .payment-summary {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
      }
      
      .total-amount {
        font-size: 18px;
        font-weight: bold;
        color: #8B5CF6;
        margin-bottom: 5px;
      }
      
      .per-person {
        font-size: 14px;
        color: #6b7280;
      }
      
      /* Call to Action */
      .cta-section {
        text-align: center;
        margin: 30px 0;
      }
      
      .cta-title {
        font-size: 28px;
        font-weight: bold;
        color: #8B5CF6;
        margin-bottom: 20px;
      }
      
      .book-now-btn {
        background: #8B5CF6;
        color: white;
        padding: 15px 40px;
        border: none;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
      }
      
      /* Footer */
      .footer {
        margin-top: 40px;
        padding: 20px 0;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .footer-left {
        display: flex;
        align-items: center;
      }
      
      .footer-logo {
        font-size: 18px;
        font-weight: bold;
        color: #8B5CF6;
        margin-right: 20px;
      }
      
      .footer-info {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.4;
      }
      
      .footer-info div {
        margin-bottom: 2px;
      }
      
      /* Terms Link */
      .terms-link {
        color: #3B82F6;
        text-decoration: underline;
        font-size: 12px;
        margin: 20px 0;
        text-align: center;
      }
    </style>
    
    <div class="container">
      <!-- Header Banner -->
      <div class="header-banner">
        <h1>Hi, ${data.travelerName || 'Rahul'}!</h1>
        <h2>${data.destination || 'Singapore'} Itinerary</h2>
        <h3>${totalDays} Days ${totalNights} Nights</h3>
        <div class="header-icons">
          <div class="header-icon"></div>
          <div class="header-icon"></div>
          <div class="header-icon"></div>
          <div class="header-icon"></div>
        </div>
      </div>
      
      <!-- Travel Details Table -->
      <div class="travel-details">
        <table>
          <thead>
            <tr>
              <th>Departure From</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Destination</th>
              <th>No. of Travelers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.departureFrom || 'Mumbai'}</td>
              <td>${data.departureTo || '19-Nov-2024'}</td>
              <td>${data.departureTo || '22-Nov-2024'}</td>
              <td>${data.destination || 'Singapore'}</td>
              <td>${totalTravelers}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Daily Itinerary -->
      <div class="daily-itinerary">
        ${data.days.map((day, index) => `
          <div class="day-item">
            <div class="day-sidebar">
              <div class="day-number">Day ${day.dayNumber}</div>
              <div class="day-date">${day.date}</div>
            </div>
            <div class="day-content">
              ${day.imageUrl ? `<img src="${day.imageUrl}" alt="Day ${day.dayNumber}" class="day-image" />` : '<div class="day-image" style="background: #e5e7eb;"></div>'}
              <div class="day-activities">
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-time">Morning</div>
                    <div class="timeline-activity">${day.morning.title} - ${day.morning.description}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-time">Afternoon</div>
                    <div class="timeline-activity">${day.afternoon.title} - ${day.afternoon.description}</div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-time">Evening</div>
                    <div class="timeline-activity">${day.evening.title} - ${day.evening.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Flight Summary -->
      <div class="flight-summary">
        <div class="section-title">Flight Summary</div>
        ${data.flights.length > 0 ? data.flights.map(flight => `
          <div class="flight-item">
            <div class="flight-date">${flight.date}</div>
            <div class="flight-arrow">→</div>
            <div class="flight-details">Fly ${flight.airline} (${flight.flightNumber}) from ${flight.from} to ${flight.to}</div>
          </div>
        `).join('') : `
          <div class="flight-item">
            <div class="flight-date">Thu 19 Jun 24</div>
            <div class="flight-arrow">→</div>
            <div class="flight-details">Fly Air India (AI 120) from Delhi (DEL) to Singapore (SIN)</div>
          </div>
          <div class="flight-item">
            <div class="flight-date">Thu 19 Jun 24</div>
            <div class="flight-arrow">→</div>
            <div class="flight-details">Fly Air India (AI 120) from Delhi (DEL) to Singapore (SIN)</div>
          </div>
          <div class="flight-item">
            <div class="flight-date">Thu 19 Jun 24</div>
            <div class="flight-arrow">→</div>
            <div class="flight-details">Fly Air India (AI 120) from Delhi (DEL) to Singapore (SIN)</div>
          </div>
          <div class="flight-item">
            <div class="flight-date">Thu 19 Jun 24</div>
            <div class="flight-arrow">→</div>
            <div class="flight-details">Fly Air India (AI 120) from Delhi (DEL) to Singapore (SIN)</div>
          </div>
        `}
        <div class="flight-note">Each passenger is allowed 20kg check-in baggage and 7kg hand baggage.</div>
      </div>
      
      <!-- Hotel Bookings -->
      <div class="section-title">Hotel Bookings</div>
      <table class="info-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Nights</th>
            <th>Hotel Name</th>
          </tr>
        </thead>
        <tbody>
          ${data.hotels.length > 0 ? data.hotels.map(hotel => `
            <tr>
              <td>${hotel.city}</td>
              <td>${hotel.checkIn}</td>
              <td>${hotel.checkOut}</td>
              <td>${hotel.nights}</td>
              <td>${hotel.hotelName}</td>
            </tr>
          `).join('') : `
            <tr>
              <td>Singapore</td>
              <td>19/11/2024</td>
              <td>20/11/2024</td>
              <td>1</td>
              <td>Hotel Grand Central</td>
            </tr>
            <tr>
              <td>Singapore</td>
              <td>20/11/2024</td>
              <td>21/11/2024</td>
              <td>1</td>
              <td>Hotel Grand Central</td>
            </tr>
            <tr>
              <td>Singapore</td>
              <td>21/11/2024</td>
              <td>22/11/2024</td>
              <td>1</td>
              <td>Parkroyal Collection Pickering</td>
            </tr>
            <tr>
              <td>Singapore</td>
              <td>22/11/2024</td>
              <td>23/11/2024</td>
              <td>1</td>
              <td>Parkroyal Collection Pickering</td>
            </tr>
            <tr>
              <td>Singapore</td>
              <td>23/11/2024</td>
              <td>24/11/2024</td>
              <td>1</td>
              <td>Parkroyal Collection Pickering</td>
            </tr>
          `}
        </tbody>
      </table>
      <div class="flight-note">Hotel details are subject to change based on availability. Similar category hotels will be provided if the mentioned hotels are unavailable.</div>
      
      <!-- Important Notes -->
      <div class="section-title">Important Notes</div>
      <table class="info-table">
        <thead>
          <tr>
            <th>Point</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Visa Processing Time</td>
            <td>7-10 working days for Singapore visa.</td>
          </tr>
          <tr>
            <td>Cancellation Conditions</td>
            <td>Cancellation charges apply as per airline and hotel policies.</td>
          </tr>
          <tr>
            <td>Baggage</td>
            <td>20kg check-in baggage and 7kg hand baggage.</td>
          </tr>
          <tr>
            <td>Meals</td>
            <td>Breakfast included at hotels.</td>
          </tr>
          <tr>
            <td>Travel Insurance</td>
            <td>Not included in the package.</td>
          </tr>
          <tr>
            <td>Payment</td>
            <td>Full payment required 30 days prior to departure.</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Scope of Service -->
      <div class="section-title">Scope Of Service</div>
      <table class="info-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Flight Ticket Confirmation</td>
            <td>Round trip economy class airfare.</td>
          </tr>
          <tr>
            <td>Hotel Booking</td>
            <td>3-star hotels on twin sharing basis.</td>
          </tr>
          <tr>
            <td>Visa</td>
            <td>Singapore visa assistance.</td>
          </tr>
          <tr>
            <td>Activities</td>
            <td>As per itinerary.</td>
          </tr>
          <tr>
            <td>Transfers</td>
            <td>Airport transfers and inter-city transfers.</td>
          </tr>
          <tr>
            <td>Meals</td>
            <td>Breakfast at hotels.</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Inclusion Summary -->
      <div class="section-title">Inclusion Summary</div>
      <table class="info-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Details</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Flights</td>
            <td>1</td>
            <td>Round trip economy class airfare</td>
            <td>Confirmed</td>
          </tr>
          <tr>
            <td>Hotels</td>
            <td>3</td>
            <td>3-star hotels on twin sharing basis</td>
            <td>Confirmed</td>
          </tr>
          <tr>
            <td>Activities</td>
            <td>5</td>
            <td>Universal Studios, Gardens by the Bay, Sentosa Island, Singapore Zoo, River Safari</td>
            <td>Confirmed</td>
          </tr>
          <tr>
            <td>Transfers</td>
            <td>2</td>
            <td>Airport transfers</td>
            <td>Confirmed</td>
          </tr>
          <tr>
            <td>Meals</td>
            <td>3</td>
            <td>Breakfast at hotels</td>
            <td>Confirmed</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Activity Table -->
      <div class="section-title">Activity Table</div>
      <table class="info-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Activity</th>
            <th>Type</th>
            <th>Time Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Singapore</td>
            <td>Gardens by the Bay</td>
            <td>Sightseeing</td>
            <td>3-4 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Universal Studios Singapore</td>
            <td>Theme Park</td>
            <td>Full Day</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Sentosa Island</td>
            <td>Leisure</td>
            <td>4-5 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>S.E.A. Aquarium</td>
            <td>Aquarium</td>
            <td>2-3 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Wings of Time</td>
            <td>Show</td>
            <td>1 hour</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Singapore Zoo</td>
            <td>Zoo</td>
            <td>4-5 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>River Safari</td>
            <td>Wildlife</td>
            <td>3-4 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Night Safari</td>
            <td>Wildlife</td>
            <td>3-4 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Merlion Park</td>
            <td>Sightseeing</td>
            <td>1 hour</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Marina Bay Sands SkyPark</td>
            <td>Sightseeing</td>
            <td>2-3 hours</td>
          </tr>
          <tr>
            <td>Singapore</td>
            <td>Orchard Road</td>
            <td>Shopping</td>
            <td>3-4 hours</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Terms and Conditions -->
      <div class="terms-link">Click here to read terms and conditions</div>
      
      <!-- Payment Plan -->
      <div class="section-title">Payment Plan</div>
      <div class="payment-summary">
        <div class="total-amount">₹50,000 (For ${totalTravelers} Pax, i.e., ₹25,000/Pax)</div>
        <div class="per-person">Paid: Not Collected</div>
      </div>
      <table class="info-table">
        <thead>
          <tr>
            <th>Installment</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Booking Amount</td>
            <td>₹10,000</td>
            <td>10-Nov-2024</td>
          </tr>
          <tr>
            <td>2nd Installment</td>
            <td>₹20,000</td>
            <td>15-Nov-2024</td>
          </tr>
          <tr>
            <td>Final Payment</td>
            <td>₹20,000</td>
            <td>20-Nov-2024</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Visa Details -->
      <div class="section-title">Visa Details</div>
      <table class="info-table">
        <thead>
          <tr>
            <th>Visa Type</th>
            <th>Validity</th>
            <th>Processing Days</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tourist Visa</td>
            <td>30 Days</td>
            <td>7-10 Days</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Call to Action -->
      <div class="cta-section">
        <div class="cta-title">PLAN.PACK.GO!</div>
        <button class="book-now-btn">Book Now</button>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-left">
          <div class="footer-logo">vigovia</div>
          <div class="footer-info">
            <div>vigovia.com</div>
            <div>Registered Office: 123, Green Park, New Delhi, India</div>
            <div>Phone: +91-9876543210</div>
            <div>Email: info@vigovia.com</div>
            <div>CIN: U74999DL2017PTC311111</div>
          </div>
        </div>
      </div>
    </div>
  `;
};
