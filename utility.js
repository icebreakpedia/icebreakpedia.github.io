/*
let currentRoomNumber = '';
const backendUrl = 'https://backend-miiu.onrender.com'; // Replace with Render URL after deployment

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.error('Fullscreen request failed:', err);
            document.getElementById('fullScreenButton').style.display = 'inline-block';
        });
    } else {
        document.getElementById('fullScreenButton').style.display = 'inline-block';
    }
    document.body.classList.add('fullscreen');
    document.getElementById('inputForm').classList.add('fullscreen');
    document.getElementById('qrVideo').classList.add('fullscreen');
    document.getElementById('controllerButtons').classList.add('fullscreen');
    document.getElementById('stopCamera').classList.add('fullscreen');
}

async function scanQRCode() {
    const video = document.getElementById('qrVideo');
    video.style.display = 'block';
    document.getElementById('stopCamera').style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const scan = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    const roomNumber = code.data;
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';
                    document.getElementById('stopCamera').style.display = 'none';
                    document.getElementById('inputRoomNumber').value = roomNumber;
                    showInput();
                    setupButtonHandlers(roomNumber);
                } else {
                    requestAnimationFrame(scan);
                }
            } else {
                requestAnimationFrame(scan);
            }
        };
        scan();
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Error accessing camera');
        showInput();
    }
}

function stopCamera() {
    const video = document.getElementById('qrVideo');
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    document.getElementById('stopCamera').style.display = 'none';
    showInput();
}

async function generateRoomNumber() {
    try {
        const response = await fetch(`${backendUrl}/generate-and-store`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Empty body as expected by server.js
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json(); // Expect JSON response
        currentRoomNumber = data.roomID;

        // Generate QR code
        const qrCodeContainer = document.getElementById('qrCode');
        qrCodeContainer.innerHTML = ''; // Clear any previous QR code
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded');
            alert('Error: QR code library failed to load');
            return;
        }
        new QRCode(qrCodeContainer, data.roomID); // Replace data.roomID with your actual text variable

        pollText(); // Start polling for text updates
    } catch (err) {
        console.error('Error:', err);
        alert('Error generating room number');
    }
}

function showInput() {
    document.getElementById('inputForm').style.display = 'block';
}
     
async function pollText() {
    if (!currentRoomNumber) return;
    try {
        const response = await fetch(`${backendUrl}/get-text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomNumber: currentRoomNumber })
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        if (text) {
            document.getElementById('display').innerHTML = `<p>${text}</p>`;
        }
        setTimeout(pollText, 100);
    } catch (err) {
        console.error('Error polling text:', err);
    }
}

window.addEventListener('beforeunload', async () => {
    if (currentRoomNumber) {
        try {
            await fetch(`${backendUrl}/delete-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomNumber: currentRoomNumber })
            });
        } catch (err) {
            console.error('Error deleting room:', err);
        }
    }
});
if (isMobileDevice()) {
    scanQRCode();
} else {
    generateRoomNumber();
}
*/










let currentRoomNumber = '';
const backendUrl = 'https://backend-miiu.onrender.com';
const wsUrl = 'wss://backend-miiu.onrender.com';
let ws = null;

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.error('Fullscreen request failed:', err);
            document.getElementById('fullScreenButton').style.display = 'inline-block';
        });
    } else {
        document.getElementById('fullScreenButton').style.display = 'inline-block';
    }
    document.body.classList.add('fullscreen');
}

async function scanQRCode() {
    const video = document.getElementById('qrVideo');
    video.style.display = 'block';
    document.getElementById('stopCamera').style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const scan = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    const roomNumber = code.data;
                    currentRoomNumber = roomNumber;
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';
                    document.getElementById('stopCamera').style.display = 'none';
                    window.location.href = `/game.html?roomNumber=${encodeURIComponent(roomNumber)}`;
                } else {
                    requestAnimationFrame(scan);
                }
            } else {
                requestAnimationFrame(scan);
            }
        };
        scan();
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Error accessing camera');
        video.style.display = 'none';
        document.getElementById('stopCamera').style.display = 'none';
    }
}

function stopCamera() {
    const video = document.getElementById('qrVideo');
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    document.getElementById('stopCamera').style.display = 'none';
}

async function generateRoomNumber() {
    try {
        const response = await fetch(`${backendUrl}/generate-and-store`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        currentRoomNumber = data.roomID;

        const qrCodeContainer = document.getElementById('qrCode');
        qrCodeContainer.innerHTML = '';

        // Check if QRCode library is loaded
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded');
            qrCodeContainer.innerHTML = `
                <p>QR code generation failed. Please use this Room ID:</p>
                <p style="font-size: 18px; font-weight: bold;">${data.roomID}</p>
            `;
            return;
        }

        // Generate QR code
        try {
            new QRCode(qrCodeContainer, {
                text: data.roomID,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            // Display roomID below QR code
            const roomIdText = document.createElement('p');
            roomIdText.textContent = `Room ID: ${data.roomID}`;
            roomIdText.style.cssText = 'font-size: 18px; margin-top: 10px;';
            qrCodeContainer.appendChild(roomIdText);
            // Show Enter Game Mode button
            const enterGameButton = document.getElementById('enterGameButton');
            enterGameButton.style.display = 'block';
            enterGameButton.onclick = () => {
                window.location.href = `/game.html?roomNumber=${encodeURIComponent(data.roomID)}`;
            };
            // Connect WebSocket for non-mobile to receive messages
            connectWebSocket(data.roomID);
        } catch (err) {
            console.error('Error generating QR code:', err);
            qrCodeContainer.innerHTML = `
                <p>QR code generation failed. Please use this Room ID:</p>
                <p style="font-size: 18px; font-weight: bold;">${data.roomID}</p>
            `;
            // Show Enter Game Mode button even in fallback
            const enterGameButton = document.getElementById('enterGameButton');
            enterGameButton.style.display = 'block';
            enterGameButton.onclick = () => {
                window.location.href = `/game.html?roomNumber=${encodeURIComponent(data.roomID)}`;
            };
            // Connect WebSocket for non-mobile
            connectWebSocket(data.roomID);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error generating room number');
        document.getElementById('qrCode').innerHTML = '<p>Error generating room number. Please try again.</p>';
    }
}

function connectWebSocket(roomNumber) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    ws = new WebSocket(`${wsUrl}?roomNumber=${roomNumber}`);
    ws.onopen = () => {
        console.log(`WebSocket connected for room: ${roomNumber}`);
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        const display = document.getElementById('display');
        if (display) {
            display.innerText = `Message: ${data.message}`;
        }
    };
    ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(() => connectWebSocket(roomNumber), 1000);
    };
    ws.onerror = (err) => {
        console.error('WebSocket error:', err);
    };
}

window.addEventListener('beforeunload', async () => {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    if (currentRoomNumber) {
        try {
            await fetch(`${backendUrl}/delete-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomNumber: currentRoomNumber })
            });
        } catch (err) {
            console.error('Error deleting room:', err);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '/index.html') {
        // Ensure QRCode script is loaded before proceeding
        const qrScript = document.querySelector('script[src*="qrcode.min.js"]');
        if (qrScript && !window.QRCode) {
            qrScript.addEventListener('load', () => {
                if (isMobileDevice()) {
                    requestFullScreen();
                    scanQRCode();
                } else {
                    generateRoomNumber();
                }
            });
        } else {
            if (isMobileDevice()) {
                requestFullScreen();
                scanQRCode();
            } else {
                generateRoomNumber();
            }
        }
    }
});
















/*
let currentRoomNumber = '';
const backendUrl = 'https://backend-miiu.onrender.com'; // Replace with Render URL after deployment
const wsUrl = 'wss://backend-miiu.onrender.com';
let ws = null;

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.error('Fullscreen request failed:', err);
            document.getElementById('fullScreenButton').style.display = 'inline-block';
        });
    } else {
        document.getElementById('fullScreenButton').style.display = 'inline-block';
    }
    document.body.classList.add('fullscreen');
    document.getElementById('inputForm').classList.add('fullscreen');
    document.getElementById('qrVideo').classList.add('fullscreen');
    document.getElementById('controllerButtons').classList.add('fullscreen');
    document.getElementById('stopCamera').classList.add('fullscreen');
}

async function scanQRCode() {
    const video = document.getElementById('qrVideo');
    video.style.display = 'block';
    document.getElementById('stopCamera').style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const scan = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    const roomNumber = code.data;
                    stream.getTracks().forEach(track => track.stop());
                    video.style.display = 'none';
                    document.getElementById('stopCamera').style.display = 'none';
                    document.getElementById('inputRoomNumber').value = roomNumber;
                    showInput();
                    setupButtonHandlers(roomNumber);
                } else {
                    requestAnimationFrame(scan);
                }
            } else {
                requestAnimationFrame(scan);
            }
        };
        scan();
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Error accessing camera');
        showInput();
    }
}

function stopCamera() {
    const video = document.getElementById('qrVideo');
    const stream = video.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';
    document.getElementById('stopCamera').style.display = 'none';
    showInput();
}

function connectWebSocket(roomNumber) {
    if (typeof ws !== 'undefined' && ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    ws = new WebSocket(`${wsUrl}?roomNumber=${roomNumber}`);
    ws.onopen = () => {
        console.log(`WebSocket connected for room: ${roomNumber}`);
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        document.getElementById('display').innerText = `Message: ${data.message}`;
    };
    ws.onclose = () => {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(() => connectWebSocket(roomNumber), 1000);
    };
    ws.onerror = (err) => {
        console.error('WebSocket error:', err);
    };
}

async function generateRoomNumber() {
    try {
        const response = await fetch(`${backendUrl}/generate-and-store`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Empty body as expected by server.js
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json(); // Expect JSON response
        currentRoomNumber = data.roomID;

        // Generate QR code
        const qrCodeContainer = document.getElementById('qrCode');
        qrCodeContainer.innerHTML = ''; // Clear any previous QR code
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library not loaded');
            alert('Error: QR code library failed to load');
            return;
        }
        new QRCode(qrCodeContainer, data.roomID); // Replace data.roomID with your actual text variable

        connectWebSocket(data.roomID);
    } catch (err) {
        console.error('Error:', err);
        alert('Error generating room number');
    }
}

function showInput() {
    document.getElementById('inputForm').style.display = 'block';
}

function TurnPage(filename,where){
    var req=new XMLHttpRequest();
    req.open("get","https://icebreakpedia.github.io/"+filename);
    req.onload=function(){
        var content=document.getElementById(where);
        content.innerHTML=this.responseText;
    };
    req.send();
}

window.addEventListener('beforeunload', async () => {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    if (currentRoomNumber) {
        try {
            await fetch(`${backendUrl}/delete-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomNumber: currentRoomNumber })
            });
        } catch (err) {
            console.error('Error deleting room:', err);
        }
    }
});
if (isMobileDevice()) {
    requestFullScreen();
    scanQRCode();
} else {
    generateRoomNumber();
}
*/