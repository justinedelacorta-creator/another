let currentRefNo = "TF-" + Math.floor(1000 + Math.random() * 9000);

// Function para kwentahin at i-update ang Live Resibo sa Screen
function calculatePCTotal() {
  const pcServiceSelect = document.getElementById("pcServiceSelect");
  const unitQuantity = document.getElementById("unitQuantity");
  const locationFeeSelect = document.getElementById("locationFeeSelect");
  
  const clientNameInput = document.getElementById("clientName");
  const clientAddressInput = document.getElementById("clientAddress");

  if (!pcServiceSelect || !unitQuantity || !locationFeeSelect) return;

  const serviceBasePrice = parseFloat(pcServiceSelect.value) || 0;
  const quantity = parseInt(unitQuantity.value) || 1;
  const fareFee = parseFloat(locationFeeSelect.value) || 0;

  const subtotalService = serviceBasePrice * quantity;
  const grandTotal = subtotalService + fareFee;

  const selectedService = pcServiceSelect.options[pcServiceSelect.selectedIndex].getAttribute("data-name") || "Service";
  const selectedLocation = locationFeeSelect.options[locationFeeSelect.selectedIndex].getAttribute("data-name") || "Location";

  if (document.getElementById("receiptRefNo")) {
    document.getElementById("receiptRefNo").textContent = "REF: #" + currentRefNo;
    document.getElementById("receiptClientName").textContent = clientNameInput.value.trim() !== "" ? clientNameInput.value : "---";
    document.getElementById("receiptAddress").textContent = clientAddressInput.value.trim() !== "" ? clientAddressInput.value : "---";

    document.getElementById("receiptServiceName").textContent = `${selectedService} (x${quantity}):`;
    document.getElementById("receiptServiceCost").textContent = "₱" + subtotalService.toLocaleString('en-PH', { minimumFractionDigits: 2 });

    document.getElementById("receiptLocationName").textContent = `Transport (${selectedLocation}):`;
    document.getElementById("receiptFareCost").textContent = "₱" + fareFee.toLocaleString('en-PH', { minimumFractionDigits: 2 });

    document.getElementById("pcTotalPrice").textContent = "₱" + grandTotal.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

// Function para sa Mobile & PC compatible Image Receipt
function sendPCBooking(event) {
  event.preventDefault();

  // ⚠️ PALITAN ITO NG IYONG FACEBOOK PAGE / PROFILE USERNAME
  const messengerUsername = "justine.delacorta"; 

  // Kunin ang Element ng Resibo sa screen
  const receiptElement = document.querySelector(".receipt-container");

  if (!receiptElement) return;

  // 1. Kumuha ng Image Snapshot ("Screenshot") ng Receipt Card
  html2canvas(receiptElement, {
    scale: 2, // Para HD at malinaw ang picture
    backgroundColor: "#0f172a"
  }).then(canvas => {
    // 2. I-convert ang snapshot bilang image file (.png)
    const image = canvas.toDataURL("image/png");
    
    // 3. Awtomatikong i-download ang Image sa Phone / PC ng customer
    const downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = `Receipt_${currentRefNo}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 4. Magpakita ng Notice/Alert sa Kliyente
    alert("Na-save/Na-download na ang Image Receipt sa iyong gallery/files!\n\nI-attach lang ang larawan sa Messenger chat na magbubukas.");

    // 5. Direktang ilipat ang customer sa Messenger Chat Mo
    const targetUrl = `https://m.me/${messengerUsername}`;
    window.location.href = targetUrl;
  });
}

// Automatic Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  calculatePCTotal();

  const inputs = ["pcServiceSelect", "unitQuantity", "locationFeeSelect", "clientName", "clientAddress"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calculatePCTotal);
      el.addEventListener("change", calculatePCTotal);
      el.addEventListener("keyup", calculatePCTotal);
    }
  });
});