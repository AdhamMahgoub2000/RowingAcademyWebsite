let SUPABASE_URL = "https://iuaxyqegkwdardvzvnaj.supabase.co";
let bookings_api_url = `${SUPABASE_URL}/rest/v1/Bookings`;

let booking_apikey = "sb_publishable_Z9rbaeVLnJQaHElivJa8MA_l_qJ7fh_";

let headers_booking = {
  apikey: booking_apikey,
  Authorization: `Bearer ${booking_apikey}`,
  "Content-Type": "application/json",
};
document.addEventListener("DOMContentLoaded", async function(){
    let isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn){
       let currentPage = window.location.pathname.split("/").pop();
        window.location.href = "login.html?redirect=" + currentPage;
    }else{
document.getElementById("profile-name").textContent=my_user.name
document.getElementById("profile-email").textContent=my_user.email_address
document.getElementById("profile-number").textContent=my_user.mobile_number
let [myUpcoming, mySessions] = await getSessions();
loadBookingstable(myUpcoming,"upcoming")
loadBookingstable(mySessions,"allBookings")
    }
    });

    let my_user = localStorage.getItem("user") || sessionStorage.getItem("user");
    my_user = my_user ? JSON.parse(my_user) : null;

let getSessions = async function () {
  try {
    const user_sessions_url =
      bookings_api_url + "?Email=eq." + my_user.email_address;

    let sessions = await fetch(user_sessions_url, {
      method: "GET",
      headers: headers_booking
      });
    let mySessions = await sessions.json();

    const today = new Date();

    let myUpcoming = mySessions.filter(
      b => new Date(b.date) >= today
    );

    return [myUpcoming, mySessions];

  } catch (error) {
    console.error(error);
    return [[], []];
  }
};
function loadBookingstable(data,table_id){
    let body = document.querySelector(`#${table_id} tbody`);
    body.innerHTML = "";
    data.forEach((booking, index) => {
      body.appendChild(createBookingRow(index, booking));
    });
}
function createBookingRow(index, booking) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${booking.Sport}</td>
    <td>${booking.date} </td>
    <td>${booking.Time} </td>
  `;
  return tr;
}