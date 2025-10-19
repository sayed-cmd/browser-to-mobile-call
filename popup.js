document.getElementById("showQR").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "getUID" }, (response) => {
    const uid = response?.uid;
    if (!uid) {
      alert("UID not found!");
      return;
    }

    // UID প্রদর্শন করা
    document.getElementById("uid").innerText = uid;

    // QR কোড তৈরি করা
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: uid,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });
  });
});
