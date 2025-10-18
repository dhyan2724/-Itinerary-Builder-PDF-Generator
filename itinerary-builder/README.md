# Itinerary Builder

A React-based application that allows users to create multi-day tour itineraries and generate professional PDF outputs matching the provided Figma design.

## Features

- **Dynamic Form System**: Multi-step form with 10 sections covering all itinerary details
- **PDF Generation**: Creates professional PDFs matching the exact Figma design
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and follows the purple/blue gradient theme

## Form Sections

1. **Basic Information**: Traveler name, destination, duration, departure details
2. **Itinerary Days**: Add/remove days with morning, afternoon, evening activities
3. **Flights**: Flight details including airline, times, and routes
4. **Hotels**: Hotel bookings with check-in/out dates and details
5. **Payment Plan**: Total amount, installments, and payment status
6. **Visa Details**: Visa type and processing information
7. **Important Notes**: Cancellation policies, terms, and conditions
8. **Scope of Service**: Services included in the package
9. **Inclusions**: Detailed breakdown of what's included
10. **Activities**: Comprehensive activity list with types and durations

## Installation

1. Navigate to the project directory:
   ```bash
   cd itinerary-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. **Fill out the form**: Complete all 10 sections of the itinerary form
2. **Preview**: Review your itinerary in the preview mode
3. **Generate PDF**: Click "Generate PDF" to download your professional itinerary

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **jsPDF** and **html2canvas** for PDF generation
- **Lucide React** for icons

## Project Structure

```
src/
├── components/
│   ├── ItineraryForm.tsx      # Main form container
│   ├── BasicInfoForm.tsx      # Basic information form
│   ├── DaysForm.tsx           # Daily itinerary form
│   ├── FlightsForm.tsx        # Flight details form
│   ├── HotelsForm.tsx         # Hotel bookings form
│   ├── PaymentForm.tsx        # Payment plan form
│   ├── VisaForm.tsx           # Visa details form
│   ├── NotesForm.tsx          # Important notes form
│   ├── ServicesForm.tsx       # Scope of service form
│   ├── InclusionsForm.tsx     # Inclusions form
│   ├── ActivitiesForm.tsx     # Activities form
│   └── PDFPreview.tsx         # PDF preview component
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   └── pdfGenerator.ts        # PDF generation utility
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
└── index.css                  # Global styles
```

## PDF Output Features

The generated PDF includes:
- **Header**: Gradient background with traveler greeting and trip details
- **Daily Itinerary**: Timeline-style layout with day-by-day activities
- **Flight Summary**: Complete flight information table
- **Hotel Bookings**: Hotel details with check-in/out information
- **Payment Plan**: Total costs and installment breakdown
- **Visa Details**: Visa type and processing information
- **Important Notes**: Terms, conditions, and policies
- **Scope of Service**: Services included in the package
- **Inclusion Summary**: Detailed breakdown of inclusions
- **Activity Table**: Comprehensive activity listing
- **Footer**: Company information and call-to-action

## Customization

The application is designed to match the provided Figma design exactly. Key design elements:
- Purple/blue gradient theme (#6B46C1, #3B82F6)
- Inter font family
- Professional layout with proper spacing
- Responsive design for all screen sizes

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is created for the Vigovia itinerary builder task.
