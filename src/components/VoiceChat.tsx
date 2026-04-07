import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, Loader2 } from 'lucide-react';

export function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const startRecording = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setTranscript('');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true
      } });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsRecording(true);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Convert Float32Array to Int16Array
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
              }
              
              // Convert Int16Array to base64
              const buffer = new ArrayBuffer(pcm16.length * 2);
              const view = new DataView(buffer);
              for (let i = 0; i < pcm16.length; i++) {
                view.setInt16(i * 2, pcm16[i], true); // true for little-endian
              }
              
              const bytes = new Uint8Array(buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64Data = btoa(binary);

              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              playAudio(base64Audio);
            }
            
            if (message.serverContent?.interrupted) {
              playbackQueueRef.current = [];
              isPlayingRef.current = false;
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Connection error. Please try again.");
            stopRecording();
          },
          onclose: () => {
            stopRecording();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are the Shah Wilayat Public School AI Assistant. You are helpful, friendly, and knowledgeable about the school.",
        },
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Failed to start recording:", err);
      setError("Failed to access microphone or connect to AI.");
      setIsConnecting(false);
      stopRecording();
    }
  };

  const playAudio = (base64Audio: string) => {
    if (!audioContextRef.current) return;
    
    // Decode base64 to binary
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Convert PCM16 to Float32
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768.0;
    }
    
    playbackQueueRef.current.push(float32);
    
    if (!isPlayingRef.current) {
      scheduleNextBuffer();
    }
  };

  const scheduleNextBuffer = () => {
    if (!audioContextRef.current || playbackQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }
    
    isPlayingRef.current = true;
    const ctx = audioContextRef.current;
    const bufferData = playbackQueueRef.current.shift()!;
    
    const audioBuffer = ctx.createBuffer(1, bufferData.length, 24000); // Gemini returns 24kHz
    audioBuffer.getChannelData(0).set(bufferData);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    const currentTime = ctx.currentTime;
    const startTime = Math.max(currentTime, nextPlayTimeRef.current);
    
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;
    
    source.onended = () => {
      scheduleNextBuffer();
    };
  };

  const stopRecording = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
      sessionRef.current = null;
    }
    setIsRecording(false);
    setIsConnecting(false);
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
  };

  useEffect(() => {
    return () => stopRecording();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-6 text-center">
        <h4 className="text-xl font-bold text-gray-900 mb-2">Voice Conversation</h4>
        <p className="text-gray-500 text-sm">Talk directly with the AI Assistant</p>
      </div>
      
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isConnecting}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 animate-pulse' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
        } disabled:opacity-50 disabled:animate-none`}
      >
        {isConnecting ? (
          <Loader2 className="text-white animate-spin" size={32} />
        ) : isRecording ? (
          <MicOff className="text-white" size={32} />
        ) : (
          <Mic className="text-white" size={32} />
        )}
      </button>
      
      <div className="mt-6 h-8 flex items-center justify-center">
        {isConnecting && <p className="text-indigo-600 font-medium">Connecting...</p>}
        {isRecording && <p className="text-red-500 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Listening...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
