const API_URL = "https://blood-bank-management-pi.vercel.app//api/donors"; 
// 👆 Replace with your real deployed Vercel URL

// Search donors
document.getElementById("SearchButton").addEventListener("click", async () => {
  const bloodGroup = document.getElementById("BloodGroupSelection").value;
  const location = document.getElementById("LocationInput").value.toLowerCase();
  const resultsDiv = document.getElementById("searchResults");

  try {
    const res = await fetch(API_URL);
    const donors = await res.json();

    // Filter donors
    const filtered = donors.filter(d =>
      (!bloodGroup || d.bloodType === bloodGroup) &&
      (!location || d.place.toLowerCase().includes(location))
    );

    // Show results
    if (filtered.length === 0) {
      resultsDiv.innerHTML = "<p>No donors found.</p>";
    } else {
      resultsDiv.innerHTML = filtered.map(d =>
        `<p><strong>${d.name}</strong> (${d.bloodType}) - ${d.place}, Phone: ${d.phone}</p>`
      ).join("");
    }
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});

// Toggle form visibility
function toggleForm() {
  const formContainer = document.getElementById("donorFormContainer");
  formContainer.style.display = formContainer.style.display === "block" ? "none" : "block";
}

// Register new donor
async function submitDonorForm(event) {
  event.preventDefault();

  const donorData = {
    name: document.getElementById("name").value,
    bloodType: document.getElementById("bloodGroup").value,
    place: document.getElementById("location").value,
    phone: document.getElementById("phonenumber").value,
    availability: true
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donorData)
    });

    if (!res.ok) throw new Error("Failed to register donor");

    const savedDonor = await res.json();
    alert(`Donor ${savedDonor.name} registered successfully!`);
    document.getElementById("donorForm").reset();
    toggleForm();
  } catch (err) {
    alert("Error: " + err.message);
  }
}
