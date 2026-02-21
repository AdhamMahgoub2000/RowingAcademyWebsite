const bookings_api_url = api_url + "Bookings";
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
      bookings_api_url + "?email_address=eq." + my_user.email_address;

    let sessions = await fetch(user_sessions_url, { headers });
    let mySessions = await sessions.json();

    const today = new Date();

    let myUpcoming = mySessions.filter(
      b => new Date(b.session_date) >= today
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
    <td>${booking.session_type}</td>
    <td>${booking.session_date} </td>
    <td>${booking.session_time} </td>
  `;
  return tr;
}