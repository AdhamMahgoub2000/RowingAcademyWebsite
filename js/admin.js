let SUPABASE_URL = "https://iuaxyqegkwdardvzvnaj.supabase.co";
let bookings_api_url = `${SUPABASE_URL}/rest/v1/Bookings`;

let booking_apikey = "sb_publishable_Z9rbaeVLnJQaHElivJa8MA_l_qJ7fh_";

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
    <td>${booking.full_name}</td>
    <td>${booking.Email}</td>
    <td>${booking.Phone_Number}</td>
    <td>${booking.Sport}</td>
    <td>${booking.date} ${booking.Time}</td>
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
    
    const uniqueMembers = new Set(bookings.map(b => b.Email));
    document.getElementById("activeMembers").textContent = uniqueMembers.size;

    const today = new Date();
    const upcoming = bookings.filter(b => new Date(b.date) >= today);
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