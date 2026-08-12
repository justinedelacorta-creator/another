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

  // ⚠️ PALITAN NG IYONG MESSENGER USERNAME O PAGE HANDLE
  const messengerUsername = "justine.delacorta"; 

  const receiptElement = document.querySelector(".receipt-container");
  if (!receiptElement) return;

  // Visual feedback habang nag-ge-generate
  const submitBtn = event.target.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Ginagawa ang Resibo...`;
  submitBtn.disabled = true;

  html2canvas(receiptElement, {
    scale: 2, // High resolution
    backgroundColor: "#0f172a",
    useCORS: true
  }).then(canvas => {
    // I-convert sa Blob/Image File
    canvas.toBlob(function(blob) {
      const imageUrl = URL.createObjectURL(blob);
      
      // Detection kung Mobile User
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // SA CELLPHONE: I-open ang Image sa bagong Window/Tab para pwedeng i-Save/Long-press o I-download
        const imageWindow = window.open(imageUrl, '_blank');
        
        // I-prompt ang user
        alert("Nagawa na ang iyong Resibo!\n\n1. I-press at i-hold (Long Press) ang larawan para mai-Save sa Gallery.\n2. Pagkatapos, pindutin ang OK para magpatuloy sa Messenger.");

        // I-restore ang button at lumipat sa Messenger
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        window.location.href = `https://m.me/${messengerUsername}`;
      } else {
        // SA PC: Standard Direct Download
        const downloadLink = document.createElement("a");
        downloadLink.href = imageUrl;
        downloadLink.download = `Receipt_${currentRefNo}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        alert("Na-download na ang Image Receipt!\n\nI-attach lamang ito sa Messenger chat na magbubukas.");

        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        window.location.href = `https://m.me/${messengerUsername}`;
      }
    }, 'image/png');
  }).catch(err => {
    console.error("Error generating receipt image:", err);
    alert("Nagkaroon ng problema. Direkta ka na naming ililipat sa Messenger.");
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
    window.location.href = `https://m.me/${messengerUsername}`;
  });
}