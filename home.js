const pressedKeys = new Set();

function updateMessage(roomNumber) {
    const message = Array.from(pressedKeys).sort().join('');
    fetch('https://backend-miiu.onrender.com/input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber, text: message })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        //console.log(data.message || 'Text submitted');
    })
    .catch(err => {
        console.error('Error:', err);
        //alert('Error submitting input');
    });
}

function setupButtonHandlers(roomNumber) {
    const buttons = [
        { id: 'upButton', key: 'w' },
        { id: 'downButton', key: 's' },
        { id: 'leftButton', key: 'a' },
        { id: 'rightButton', key: 'd' }
    ];

    buttons.forEach(({ id, key }) => {
        const button = document.getElementById(id);
        if (!button) {
            console.error(`Button ${id} not found`);
            alert('Botton disappear');
            return;
        }
        button.addEventListener('mousedown', () => {
            pressedKeys.add(key);
            updateMessage(roomNumber);
            alert('ok');
        });
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pressedKeys.add(key);
            updateMessage(roomNumber);
            alert('ok');
        });
        button.addEventListener('mouseup', () => {
            pressedKeys.delete(key);
            updateMessage(roomNumber);
            alert('ok');
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            pressedKeys.delete(key);
            updateMessage(roomNumber);
            alert('ok');
        });
    });
}