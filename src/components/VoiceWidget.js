import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import './VoiceWidget.css';

const VoiceWidget = ({ onTaskUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [connectionTime, setConnectionTime] = useState(0);
  const vapiRef = useRef(null);
  const connectionTimerRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize Vapi
    const publicKey = process.env.REACT_APP_VAPI_PUBLIC_KEY || 'your_vapi_public_key';
    vapiRef.current = new Vapi(publicKey);

    // Set up event listeners
    vapiRef.current.on('call-start', handleCallStart);
    vapiRef.current.on('call-end', handleCallEnd);
    vapiRef.current.on('speech-start', handleSpeechStart);
    vapiRef.current.on('speech-end', handleSpeechEnd);
    vapiRef.current.on('error', handleError);
    vapiRef.current.on('message', handleMessage);

    return () => {
      // Cleanup
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      if (connectionTimerRef.current) {
        clearInterval(connectionTimerRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const handleCallStart = () => {
    console.log('Call started');
    setIsConnected(true);
    setIsLoading(false);
    setError(null);

    // Start connection timer
    connectionTimerRef.current = setInterval(() => {
      setConnectionTime(prev => prev + 1);
    }, 1000);
  };

  const handleCallEnd = () => {
    console.log('Call ended');
    setIsConnected(false);
    setIsSpeaking(false);

    // Clear connection timer
    if (connectionTimerRef.current) {
      clearInterval(connectionTimerRef.current);
      connectionTimerRef.current = null;
    }
    setConnectionTime(0);

    // Auto-reconnect after 2 seconds if it was an unexpected disconnect
    if (!error) {
      console.log('Scheduling auto-reconnect...');
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Auto-reconnecting...');
        handleConnect();
      }, 2000);
    }
  };

  const handleSpeechStart = () => {
    console.log('AI started speaking');
    setIsSpeaking(true);
  };

  const handleSpeechEnd = () => {
    console.log('AI stopped speaking');
    setIsSpeaking(false);
  };

  const handleError = (error) => {
    console.error('Vapi error:', error);
    setError(error.message || 'An error occurred');
    setIsLoading(false);
  };

  const handleMessage = (message) => {
    console.log('Vapi message:', message);

    // Handle function calls from the assistant
    if (message.type === 'function-call') {
      handleFunctionCall(message);
    }

    // Handle task updates
    if (message.functionCall?.name === 'update_task_status') {
      onTaskUpdate();
    }
  };

  const handleFunctionCall = (message) => {
    console.log('Function call:', message.functionCall);
    // Function calls are handled by the backend
    // But we can use this to trigger UI updates
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const assistantId = process.env.REACT_APP_VAPI_ASSISTANT_ID || 'your_assistant_id';

      // Start the call with enhanced configuration
      await vapiRef.current.start(assistantId, {
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
          smartFormat: true,
          endpointing: 300, // Wait 300ms before considering speech ended
          keywords: ['Zion', 'mental math', 'piano', 'reading']
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer', // Warm, encouraging female voice
          speed: 0.95, // Slightly slower for clarity
          stability: 0.8,
          similarity: 0.8
        },
        model: {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 500,
          messages: [
            {
              role: 'system',
              content: `You are Zion's personal tutor. Zion is a 5-year-old working at a third-grade level. He is smart, capable, and ready for real challenges. Your job is to conduct structured daily lessons that push him to grow—not to ask what he wants to do, but to lead him through a lesson plan.

YOUR ROLE: TUTOR, NOT ASSISTANT
You are conducting a lesson, not offering help.
NEVER say:
❌ "What do you want to work on?"
❌ "Would you like to try another problem?"
❌ "Can I help you with something?"

INSTEAD say:
✅ "Alright Zion, let's start today's lesson."
✅ "Great job. Here's your next one."
✅ "We've got 5 more to go. Ready? Here it is..."
✅ "Okay, we're done with math. Now let's do some reading."

You set the pace. You lead. You encourage. You challenge.

PATIENCE AND LISTENING:
- Give Zion time to think out loud (up to 10 seconds)
- Listen carefully as he works through problems verbally
- Don't interrupt when he's thinking through steps
- Document his thought process
- After 10 seconds of silence, gently check in: "Take your time. Do you need help?"

DAILY LESSON STRUCTURE:
1. MENTAL MATH (20 Questions) - Use the mental_math_tool
2. READING & COMPREHENSION (10 Questions)
3. SCIENCE & CURIOSITY (10 Facts/Questions)

Always:
- One question at a time
- Wait for full response before moving on
- Be encouraging and positive
- Challenge him appropriately
- Document progress

You have access to tools:
- mental_math_tool: Generate and track math problems
- update_task_status: Mark tasks as complete
- search_tool: Answer questions and find information`
            }
          ]
        },
        silenceTimeout: 10000, // 10 seconds of silence before checking in
        backgroundSound: 'off',
        backgroundDenoisingEnabled: true
      });
    } catch (err) {
      console.error('Failed to start call:', err);
      setError('Failed to connect. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-widget">
      <div className={`orb-container ${isConnected ? 'connected' : ''} ${isSpeaking ? 'speaking' : ''}`}>
        <button
          className="orb-button"
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isLoading}
        >
          <div className="orb">
            <div className="orb-inner">
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : isConnected ? (
                <svg viewBox="0 0 24 24" width="64" height="64" fill="white">
                  <path d="M6 6h12v12H6z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="64" height="64" fill="white">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </div>
          </div>
        </button>

        <div className="orb-label">
          {isLoading ? (
            'Connecting...'
          ) : isConnected ? (
            <>
              <div className="status-text">
                {isSpeaking ? '🗣️ AI Speaking...' : '👂 Listening...'}
              </div>
              <div className="connection-time">{formatTime(connectionTime)}</div>
            </>
          ) : (
            'Click to Talk with Your Tutor'
          )}
        </div>
      </div>

      {error && (
        <div className="voice-error">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default VoiceWidget;
