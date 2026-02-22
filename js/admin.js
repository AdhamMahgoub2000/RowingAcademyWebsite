let SUPABASE_URL = "https://mkxzgvwvftzimaugwzvn.supabase.co";
let bookings_api_url = `${SUPABASE_URL}/rest/v1/Bookings`;

let booking_apikey = "sb_publishable_EY8_jS3efnS8mEt2aFGoHA_gDkN6K8v";

let headers_booking = {
  apikey: booking_apikey,
  Authorization: `Bearer ${booking_apikey}`,
  "Content-Type": "application/json",
};
document.addEventListener("DOMContentLoaded", function () {
    let isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");
    let userData = localStorage.getItem("user") || sessionStorage.getItem("user");
    let user = userData ? JSON.parse(userData) : null;

    
    if (!isLoggedIn || !user) {
        window.location.href = "login.html";
        return; 
    }

    if (user.email_address !== "admin@rowin.com") {
        alert("Access Denied: Admin privileges required.");
        window.location.href = "01-home.html";
        return; 
    }

    console.log("Admin verified. Loading dashboard...");
    loadBookings(); 
});

function createBookingRow(index, booking) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${booking.name || 'N/A'}</td>
    <td>${booking.email_address}</td>
    <td>${booking.mobile_number}</td>
    <td>${booking.session_type}</td>
    <td>${booking.session_date} ${booking.session_time}</td>
  `;
  return tr;
}

async function loadBookings() {
  try {
      const res = await fetch(bookings_api_url, {
      method: "GET",
      headers: headers_booking
      });
    const bookings = await res.json();
    document.getElementById("totalBookings").textContent = bookings.length;
    
    const uniqueMembers = new Set(bookings.map(b => b.email_address));
    document.getElementById("activeMembers").textContent = uniqueMembers.size;

    const today = new Date();
    const upcoming = bookings.filter(b => new Date(b.session_date) >= today);
    document.getElementById("upcomingSessions").textContent = upcoming.length;

    const tbody = document.querySelector("#bookingTable tbody");
    if(tbody){
        tbody.innerHTML = "";
        bookings.forEach((booking, index) => {
          tbody.appendChild(createBookingRow(index, booking));
        });
    }
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}