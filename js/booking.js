// Booking System Configuration
const SUPABASE_URL = "https://mkxzgvwvftzimaugwzvn.supabase.co";
const BOOKING_API_KEY = "sb_publishable_EY8_jS3efnS8mEt2aFGoHA_gDkN6K8v";

// Booking data
let bookingData = {
  sport: "",
  level: "",
  quantity: 1,
  date: "",
  time: "",
  paymentMethod: "",
  screenshot: null,
};

let currentStage = 1;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Check login
  const isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html?redirect=" + window.location.pathname.split("/").pop();
    return;
  }

  // Set minimum date to today
  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    dateInput.setAttribute("min", new Date().toISOString().split("T")[0]);
  }

  // Quantity buttons
  const decreaseBtn = document.getElementById("decrease-qty");
  const increaseBtn = document.getElementById("increase-qty");
  const quantityInput = document.getElementById("quantity");

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value) || 1;
      quantityInput.value = currentValue + 1;
    });
  }

  // Sport selection
  document.querySelectorAll(".sport-option").forEach((option) => {
    option.addEventListener("click", function (e) {
      if (e.target.type === "radio") return;
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        document.querySelectorAll(".sport-option").forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");
        
        // Show rowing levels if rowing selected
        const levelOptions = document.getElementById("rowing-levels");
        if (radio.value === "rowing") {
          levelOptions.classList.add("show");
          document.querySelectorAll('input[name="rowing-level"]').forEach((level) => {
            level.required = true;
          });
        } else {
          levelOptions.classList.remove("show");
          document.querySelectorAll('input[name="rowing-level"]').forEach((level) => {
            level.required = false;
            level.checked = false;
            // Remove selected state from labels
            const label = document.querySelector(`label[for="${level.id}"]`);
            if (label) {
              label.style.background = "";
              label.style.borderColor = "";
              label.style.color = "";
              label.style.boxShadow = "";
            }
          });
        }
      }
    });
  });

  // Level selection styling
  document.querySelectorAll('input[name="rowing-level"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      // Remove selected styling from all labels
      document.querySelectorAll('input[name="rowing-level"]').forEach((r) => {
        const lbl = document.querySelector(`label[for="${r.id}"]`);
        if (lbl) {
          lbl.style.background = "";
          lbl.style.borderColor = "";
          lbl.style.color = "";
          lbl.style.boxShadow = "";
        }
      });
      // Add selected styling to checked label
      if (this.checked) {
        const label = document.querySelector(`label[for="${this.id}"]`);
        if (label) {
          label.style.background = "#2563eb";
          label.style.borderColor = "#2563eb";
          label.style.color = "white";
          label.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)"; 
        }
      }
    });
  });

  // Initial check for pre-selected levels
  document.querySelectorAll('input[name="rowing-level"]').forEach((radio) => {
    if (radio.checked) {
      const label = document.querySelector(`label[for="${radio.id}"]`);
      if (label) {
        label.style.background = "#2563eb";
        label.style.borderColor = "#2563eb";
        label.style.color = "white";
        label.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
      }
    }
  });

  // Time slot selection
  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.addEventListener("click", function () {
      if (this.classList.contains("disabled")) return;
      document.querySelectorAll(".time-slot").forEach((s) => s.classList.remove("selected"));
      this.classList.add("selected");
      document.getElementById("selected-time").value = this.dataset.time;
    });
  });

  // Payment method selection
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.addEventListener("click", function (e) {
      if (e.target.type === "radio") return;
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        document.querySelectorAll(".payment-method").forEach((m) => m.classList.remove("selected"));
        this.classList.add("selected");
        
        const screenshotUpload = document.getElementById("screenshot-upload");
        if (radio.value === "instapay") {
          screenshotUpload.style.display = "block";
          document.getElementById("payment-screenshot").required = true;
        } else {
          screenshotUpload.style.display = "none";
          document.getElementById("payment-screenshot").required = false;
        }
      }
    });
  });

  // File upload
  const fileUploadArea = document.getElementById("file-upload-area");
  const fileInput = document.getElementById("payment-screenshot");
  const fileName = document.getElementById("file-name");

  if (fileUploadArea && fileInput) {
    fileUploadArea.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        bookingData.screenshot = file;
        fileName.textContent = file.name;
        fileName.style.display = "block";
        fileUploadArea.classList.add("has-file");
      }
    });

    // Drag and drop
    fileUploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      fileUploadArea.style.borderColor = "#2563eb";
    });

    fileUploadArea.addEventListener("dragleave", () => {
      fileUploadArea.style.borderColor = "#d1d5db";
    });

    fileUploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      fileUploadArea.style.borderColor = "#d1d5db";
      const file = e.dataTransfer.files[0];
      if (file) {
        fileInput.files = e.dataTransfer.files;
        bookingData.screenshot = file;
        fileName.textContent = file.name;
        fileName.style.display = "block";
        fileUploadArea.classList.add("has-file");
      }
    });
  }

  // Navigation buttons
  document.getElementById("nextToStage2").addEventListener("click", function () {
    const sportSelected = document.querySelector('input[name="sport"]:checked');
    if (!sportSelected) {
      alert("Please select a sport");
      return;
    }

    bookingData.sport = sportSelected.value;
    if (sportSelected.value === "rowing") {
      const levelSelected = document.querySelector('input[name="rowing-level"]:checked');
      if (!levelSelected) {
        alert("Please select a rowing level");
        return;
      }
      bookingData.level = levelSelected.value;
    }

    bookingData.quantity = parseInt(document.getElementById("quantity").value) || 1;
    goToStage(2);
  });

  document.getElementById("backToStage1").addEventListener("click", () => goToStage(1));
  document.getElementById("backToStage2").addEventListener("click", () => goToStage(2));

  document.getElementById("nextToStage3").addEventListener("click", function () {
    const date = document.getElementById("booking-date").value;
    const time = document.getElementById("selected-time").value;

    if (!date) {
      alert("Please select a date");
      return;
    }
    if (!time) {
      alert("Please select a time slot");
      return;
    }

    bookingData.date = date;
    bookingData.time = time;
    updateSummary();
    goToStage(3);
  });

  // Form submission
  document.getElementById("bookingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    bookingData.paymentMethod = paymentMethod.value;

    const userData = sessionStorage.getItem("user") || localStorage.getItem("user");
    const user = JSON.parse(userData);

    // Format sport name
    let sportName = bookingData.sport;
    if (bookingData.sport === "rowing" && bookingData.level) {
      sportName = `Rowing - ${bookingData.level}`;
    } else if (bookingData.sport === "fitness-conditioning") {
      sportName = "Fitness & Conditioning";
    } else if (bookingData.sport === "private-rowing") {
      sportName = "Private Rowing";
    } else {
      sportName = sportName.charAt(0).toUpperCase() + sportName.slice(1);
    }

    // Prepare booking
    let fullName;
    if (user.fname && user.lname) {
      fullName = `${user.fname} ${user.lname}`;
    } else if (user.fname) {
      fullName = user.fname;
    } else {
      fullName = "";
    }

    const booking = {
      name: fullName,
      email_address: user.email_address,
      mobile_number: user.mobile_number,
      session_type: sportName,
      session_date: bookingData.date,
      session_time: bookingData.time,
      payment_method: bookingData.paymentMethod,
    };

    if (bookingData.paymentMethod === "instapay" && bookingData.screenshot) {
      booking.payment_screenshot = bookingData.screenshot.name || "Uploaded";
    }

    // Submit booking
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/Bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: BOOKING_API_KEY,
          Authorization: `Bearer ${BOOKING_API_KEY}`,
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        alert("❌ Error submitting booking. Please try again.");
        return;
      }

      alert("✅ Booking submitted successfully!");
      
      // Reset form
      document.getElementById("bookingForm").reset();
      document.getElementById("quantity").value = 1;
      document.querySelectorAll(".sport-option").forEach((opt) => opt.classList.remove("selected"));
      document.querySelectorAll('input[type="radio"]').forEach((radio) => (radio.checked = false));
      document.getElementById("rowing-levels").classList.remove("show");
      
      bookingData = {
        sport: "",
        level: "",
        quantity: 1,
        date: "",
        time: "",
        paymentMethod: "",
        screenshot: null,
      };

      goToStage(1);
    } catch (error) {
      console.error(error);
      alert("❌ Network error. Please check your connection.");
    }
  });
});

// Navigate between stages
function goToStage(stage) {
  if (stage < 1 || stage > 3) return;

  const currentStageEl = document.getElementById(`stage${currentStage}`);
  const nextStageEl = document.getElementById(`stage${stage}`);

  // Update stage dots
  document.querySelectorAll(".stage-dot").forEach((dot, index) => {
    dot.classList.remove("active");
    if (index + 1 < stage) {
      dot.classList.add("completed");
    } else if (index + 1 === stage) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("completed");
    }
  });

  // Slide animation
  if (stage > currentStage) {
    currentStageEl.classList.add("slide-out-left");
    currentStageEl.classList.remove("active");
    setTimeout(() => {
      nextStageEl.classList.add("active");
      currentStageEl.classList.remove("slide-out-left");
    }, 250);
  } else {
    currentStageEl.classList.remove("active");
    nextStageEl.style.transform = "translateX(-100%)";
    nextStageEl.classList.add("active");
    setTimeout(() => {
      nextStageEl.style.transform = "translateX(0)";
    }, 50);
  }

  currentStage = stage;
}

// Update booking summary
function updateSummary() {
  document.getElementById("summary-sport").textContent =
    bookingData.sport.charAt(0).toUpperCase() + bookingData.sport.slice(1).replace("-", " ");

  if (bookingData.sport === "rowing" && bookingData.level) {
    document.getElementById("summary-level-row").style.display = "flex";
    document.getElementById("summary-level").textContent =
      bookingData.level.charAt(0).toUpperCase() + bookingData.level.slice(1);
  } else {
    document.getElementById("summary-level-row").style.display = "none";
  }

  document.getElementById("summary-quantity").textContent = bookingData.quantity;
  document.getElementById("summary-date").textContent = formatDate(bookingData.date);
  document.getElementById("summary-time").textContent = bookingData.time;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
