// --- Configuration Variables ---
const OWNER_PHONE_NUMBER = '+918975259275';
const OWNER_EMAIL = 'cgmahajan172005@gmail.com';
const SERVICE_NAME = 'Chaitali - Mehandi Artist'; 

// --- 1. CONFIGURATION & MOCK DATA ---
// MOCK DATA and TIME-SLOT related arrays removed

// --- 2. DOM Elements & Event Listeners ---
const datePicker = document.getElementById('date-picker');
// timeSlotsContainer and selectedTimeInput removed
const bookingForm = document.getElementById('booking-form');
const summaryDiv = document.getElementById('booking-summary');
const whatsappBtn = document.getElementById('send-whatsapp-btn');

// Set min date to today to prevent booking in the past
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
datePicker.setAttribute('min', `${yyyy}-${mm}-${dd}`);

// datePicker change listener removed
bookingForm.addEventListener('submit', handleFormSubmit);

// --- 3. Time Slot Rendering Functions Removed ---
// renderTimeSlots() removed
// selectTimeSlot(event) removed


// ------------------------------------------------------------------
// --- 4. Form Submission & Backend Simulation ---
// ------------------------------------------------------------------
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Client-side validation for mandatory contact/address fields
    const clientPhone = document.getElementById('client-phone').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientAddress1 = document.getElementById('client-address1').value;
    const clientCity = document.getElementById('client-city').value;
    const clientPostal = document.getElementById('client-postal').value;
    const selectedDate = datePicker.value;

    if (!selectedDate) {
        alert('Please select a preferred date.');
        return;
    }

    if (!clientPhone || !clientEmail || !clientAddress1 || !clientCity || !clientPostal) {
        alert('Please complete all required contact and address fields.');
        return;
    }

    const formData = {
        service: document.getElementById('service-type').value,
        date: selectedDate,
        // Time removed
        name: document.getElementById('client-name').value,
        email: clientEmail,
        phone: clientPhone,
        address1: clientAddress1,
        address2: document.getElementById('client-address2').value,
        city: clientCity,
        postal: clientPostal
    };
    
    // Show loading state
    document.getElementById('submit-btn').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Request...';
    document.getElementById('submit-btn').disabled = true;

    try {
        // Since there are no specific time slots, we assume the date request is valid.
        // The double-booking check logic is REMOVED.
        
        // Simulate backend process delay (e.g., sending request email)
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        const success = true; 
        
        if (success) {
            // 1. Display Success Summary
            displaySuccess(formData);
            
            // 2. Send Notifications (Simulated) 
            simulateEmailNotification(formData);
            
            // 3. Automatically trigger the WhatsApp message link
            sendWhatsAppToOwner(formData);
            
        } else {
            throw new Error('Request failed due to a server error.');
        }
    } catch (error) {
        console.error('Request Error:', error);
        alert('Request Failed: ' + error.message);
       
    } finally {
        // Re-enable button after process completion or failure
        document.getElementById('submit-btn').innerHTML = '<i class="fa-solid fa-check-circle"></i> Send Booking Request';
        document.getElementById('submit-btn').disabled = false;
    }
}

// --- 5. Success Display & WhatsApp Integration ---
function displaySuccess(data) {
    document.getElementById('summary-name').textContent = data.name;
    document.getElementById('summary-service').textContent = data.service;
    
    // Format date for better readability
    const friendlyDate = new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', {
        timeZone: 'UTC', 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    document.getElementById('summary-date').textContent = friendlyDate;
    
    // Summary time element is no longer used but for robustness, we hide it or ensure it's not referenced.
    const summaryTimeElement = document.getElementById('summary-time');
    if (summaryTimeElement) summaryTimeElement.parentElement.style.display = 'none';

    summaryDiv.style.display = 'block';
    summaryDiv.style.animation = 'fadeIn 0.5s ease-out';
    bookingForm.style.display = 'none';
    
    summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    bookingForm.reset();
    
    whatsappBtn.onclick = () => sendWhatsAppToOwner(data);
}

function sendWhatsAppToOwner(data) {
    
    const formattedDate = new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', {
        timeZone: 'UTC', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    });
    
    // Construct the address string
    const address = `${data.address1}${data.address2 ? ', ' + data.address2 : ''}, ${data.city} - ${data.postal}`;

    const message = encodeURIComponent(
        `Hi! I'm requesting an appointment.\n\n` +
        `*Name:* ${data.name}\n` +
        `*Service:* ${data.service}\n` +
        `*Requested Date:* ${formattedDate}\n\n` + // Time removed
        `*Location Details:*\n` +
        `Address: ${address}\n` +
        `Phone: ${data.phone}\n` +
        `Email: ${data.email}\n\n` +
        `Please contact me to confirm the exact time. Thank you!`
    );
    
    const cleanOwnerPhone = OWNER_PHONE_NUMBER.replace(/[^0-9]/g, ''); 
    const whatsappUrl = `https://wa.me/+918975259275?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
}

// --- 6. Email/Notification Mock Functions ---
function simulateEmailNotification(data) {
    console.log('--- EMAIL NOTIFICATION SIMULATION ---');
    console.log(`Sending request summary to Client: ${data.email}`);
    console.log(`Sending new request to Owner: ${OWNER_EMAIL}`);
    console.log('--- END OF SIMULATION ---');
}

// --- 7. Initial setup ---
document.addEventListener('DOMContentLoaded', () => {
     // Ensure the first service is selected by default
     document.getElementById('service-type').selectedIndex = 0; 
     
     // Update elements with SERVICE_NAME and OWNER_PHONE_NUMBER
     document.querySelector('.logo').textContent = `📅 ${SERVICE_NAME}`;
     document.querySelector('footer .container').textContent = `© ${new Date().getFullYear()} ${SERVICE_NAME}. All rights reserved.`;
     document.querySelector('.btn-call-owner').href = `tel:${OWNER_PHONE_NUMBER}`;
});