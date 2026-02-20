const bookings_api_url = api_url + "Bookings";

function createBookingRow(index, booking) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${booking.name}</td>
    <td>${booking.email_address}</td>
    <td>${booking.mobile_number}</td>
    <td>${booking.session_type}</td>
    <td>${booking.session_date} ${booking.session_time}</td>
  `;
  return tr;
}

async function loadBookings() {
  try {
    const res = await fetch(bookings_api_url, { headers });
    const bookings = await res.json();
    document.getElementById("totalBookings").textContent = bookings.length;
    
    const uniqueMembers = new Set(bookings.map(b => b.email_address));
    document.getElementById("activeMembers").textContent = uniqueMembers.size;

    const today = new Date();
    const upcoming = bookings.filter(b => new Date(b.session_date) >= today);
    document.getElementById("upcomingSessions").textContent = upcoming.length;

    const tbody = document.querySelector("#bookingTable tbody");
    tbody.innerHTML = "";
    bookings.forEach((booking, index) => {
      tbody.appendChild(createBookingRow(index, booking));
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadBookings);