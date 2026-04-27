# 🚀 Amatyaa STT Server

Real-time Speech-to-Text backend using Node.js, Express, Socket.IO, and Deepgram with Dubai-specific optimizations.

---

## ✨ Features

- Real-time audio streaming (Socket.IO)
- Live + final transcripts
- Dubai keyword boosting (Deepgram keyterms)
- Custom transcript corrections
- Error handling & session management

---

## 📂 Project Structure

```
.
├── server.js
├── socket/transcription.js
├── services/deepgram.js
├── utils/dubaiVocab.js
├── .env
├── package.json
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env`
```env
DEEPGRAM_API_KEY=your_deepgram_api_key
PORT=3000
```

### 3. Run server
```bash
npm start
```

---

## 🌐 API Endpoints

- `GET /` → Server running check  
- `GET /health` → Health status  

---

## 🔌 Socket.IO Events

### Client → Server
```js
socket.emit("start_transcription");
socket.emit("audio_chunk", chunk);
socket.emit("stop_transcription");
```

### Server → Client
```js
socket.on("transcription_ready");

socket.on("transcript", (data) => {
  // interim result
});

socket.on("transcript_final", (data) => {
  // final result
});

socket.on("speech_started");
socket.on("utterance_end");
socket.on("transcription_error");
socket.on("transcription_closed");
```

---

## 🧠 Deepgram Config

- Model: `nova-3`
- Enabled:
  - interim_results
  - smart_format
  - keyterms (Dubai-specific words)

---

## ✨ Post Processing

Corrects common mistakes like:
- DIFIC → DIFC
- burj kalifa → Burj Khalifa
- a.e.d → AED

---

## ⚠️ Common Issues

### CORS Error
Make sure frontend URL has no trailing slash:
```
https://your-frontend.vercel.app
```

### Audio Dropped
Wait for:
```
transcription_ready
```
before sending audio.

---

## 🚀 Future Improvements

- Multi-language support  
- Translation  
- AI summarization  

---

## 📜 License

MIT