import { createDeepgramLiveSession } from "../services/deepgram.js";
import { applyDubaiCorrections } from "../utils/dubaiVocab.js";

export function registerTranscriptionHandlers(socket) {
  let dgConnection = null;
  let isConnected = false;

  socket.on("start_transcription", async () => {
    try {
      // Close existing session if any
      if (dgConnection) {
        dgConnection.finish?.();
        dgConnection = null;
      }

      console.log(`[Deepgram] Opening session for socket ${socket.id}`);

      // ✅ IMPORTANT: this is async now
      dgConnection = await createDeepgramLiveSession();

      // ✅ Wait for connection to open
      dgConnection.on("open", () => {
        isConnected = true;
        console.log(`[Deepgram] Session open for ${socket.id}`);
        socket.emit("transcription_ready");
      });

      // ✅ Main transcript handler (NEW SDK FORMAT)
      dgConnection.on("message", (data) => {
        if (data.type !== "Results") return;

        const alt = data?.channel?.alternatives?.[0];
        if (!alt || !alt.transcript) return;

        const isFinal = data.is_final;

        const text = isFinal
          ? applyDubaiCorrections(alt.transcript)
          : alt.transcript;

        const payload = {
          transcript: text,
          is_final: isFinal,
          confidence: alt.confidence ?? null,
          words: alt.words ?? [],
          speech_final: data.speech_final ?? false,
        };

        if (isFinal) {
          socket.emit("transcript_final", payload);
        } else {
          socket.emit("transcript", payload);
        }
      });

      // Optional: speech started
      dgConnection.on("speech_started", () => {
        socket.emit("speech_started");
      });

      // Optional: utterance end
      dgConnection.on("utterance_end", () => {
        socket.emit("utterance_end");
      });

      // Error handling
      dgConnection.on("error", (err) => {
        console.error(`[Deepgram] Error for ${socket.id}:`, err);
        socket.emit("transcription_error", {
          message: err?.message ?? "Deepgram error",
        });
      });

      // Close event
      dgConnection.on("close", () => {
        isConnected = false;
        console.log(`[Deepgram] Session closed for ${socket.id}`);
        socket.emit("transcription_closed");
      });

      // 🔥 REQUIRED for this SDK
      dgConnection.connect();

      // Wait until ready
      await dgConnection.waitForOpen();

    } catch (err) {
      console.error(`[Deepgram] Failed to start session:`, err);
      socket.emit("transcription_error", {
        message: "Failed to start transcription",
      });
    }
  });

  // 🎧 Receive audio
  socket.on("audio_chunk", (chunk) => {
    if (!dgConnection || !isConnected) return;

    try {
      // ✅ IMPORTANT CHANGE
      dgConnection.sendMedia(chunk);
    } catch (err) {
      console.error(`[Deepgram] Failed to send audio chunk:`, err.message);
    }
  });

  // 🛑 Stop
  socket.on("stop_transcription", () => {
    if (dgConnection) {
      console.log(`[Deepgram] Closing session for ${socket.id}`);
      dgConnection.finish?.();
      dgConnection = null;
      isConnected = false;
    }
  });

  // 🔌 Disconnect cleanup
  socket.on("disconnect", () => {
    if (dgConnection) {
      dgConnection.finish?.();
      dgConnection = null;
    }
  });
}