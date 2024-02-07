const { ipcRenderer } = require('electron');

ipcRenderer.on('qr-code', (event, qr) => {
    console.log("QR Code: " + qr);

    var qrcodeElement = document.getElementById('qrcode');
    qrcodeElement.innerHTML = ''; // Clear previous QR code

    // Update loading text to indicate authentication with WhatsApp
    var loadingText = document.getElementById('loadingText');
    if (loadingText) {
      loadingText.innerText = 'Authenticate with WhatsApp';
    }

    // Generate new QR code
    new QRCode(qrcodeElement, {
      text: qr,
      width: 250,
      height: 250,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    // Make the QR code visible
    qrcodeElement.style.display = 'block';
});

ipcRenderer.on('whatsapp-ready', () => {
    // Hide QR code element
    var qrCodeElement = document.getElementById('qrcode');
    if (qrCodeElement) {
      qrCodeElement.style.display = 'none';
    }

    // Update display for authenticated state
    var authenticatedElement = document.getElementById('authenticated');
    var loadingElement = document.getElementById('loading');
    var getChatsButtonElement = document.getElementById('getChatsButton');

    if (authenticatedElement) authenticatedElement.style.display = 'block';
    if (loadingElement) loadingElement.style.display = 'none';
    if (getChatsButtonElement) getChatsButtonElement.style.display = 'block';
});


