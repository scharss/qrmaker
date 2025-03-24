document.addEventListener('DOMContentLoaded', function() {
    const qrInput = document.getElementById('qr-input');
    const qrType = document.getElementById('qr-type');
    const qrColor = document.getElementById('qr-color');
    const bgColor = document.getElementById('bg-color');
    const downloadBtn = document.getElementById('download-btn');
    const qrContainer = document.getElementById('qr-code');
    const qrOverlay = document.querySelector('.qr-overlay');
    
    let qrCode = null;

    // Function to generate QR code
    function generateQR() {
        const content = qrInput.value.trim();
        
        if (content === '') {
            qrContainer.innerHTML = '';
            qrOverlay.style.display = 'flex';
            return;
        }

        qrOverlay.style.display = 'none';
        qrContainer.innerHTML = '';
        
        // Create new QR code with more ergonomic preview size
        qrCode = new QRCode(qrContainer, {
            text: content,
            width: 256,  // More ergonomic preview size
            height: 256, // More ergonomic preview size
            colorDark: qrColor.value,
            colorLight: bgColor.value,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Function to update QR code colors
    function updateColors() {
        if (qrInput.value.trim() !== '') {
            generateQR();
        }
    }

    // Function to download QR code at 1080x1080
    function downloadQR() {
        if (!qrCode) return;

        const qrImage = qrContainer.querySelector('img');
        if (!qrImage) return;

        // Create a temporary canvas to handle the download
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 40; // Padding for the high-res version
        
        // Set canvas size to 1080x1080 with padding
        canvas.width = 1080;
        canvas.height = 1080;

        // Fill background
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate size for QR code to fit in 1080x1080 with padding
        const qrSize = 1080 - (padding * 2);
        
        // Draw QR code image scaled up to the larger size
        ctx.imageSmoothingEnabled = false; // Disable smoothing to keep QR code sharp
        ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);

        // Create download link
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // Event listeners
    qrInput.addEventListener('input', generateQR);
    qrType.addEventListener('change', () => {
        qrInput.placeholder = qrType.value === 'url' ? 'URL o página web' : 'Texto para generar QR';
    });
    qrColor.addEventListener('input', updateColors);
    bgColor.addEventListener('input', updateColors);
    downloadBtn.addEventListener('click', downloadQR);

    // Add input validation for URLs
    qrInput.addEventListener('input', function() {
        if (qrType.value === 'url') {
            try {
                new URL(this.value);
                this.style.borderColor = '#e1e5ee';
            } catch {
                if (this.value !== '') {
                    this.style.borderColor = '#ff6b6b';
                } else {
                    this.style.borderColor = '#e1e5ee';
                }
            }
        } else {
            this.style.borderColor = '#e1e5ee';
        }
    });

    // Add animations when generating QR code
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const img = mutation.addedNodes[0];
                if (img.tagName === 'IMG') {
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transition = 'opacity 0.3s ease-in-out';
                    }, 50);
                }
            }
        });
    });

    observer.observe(qrContainer, { childList: true });
}); 