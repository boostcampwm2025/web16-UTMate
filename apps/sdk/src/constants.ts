export const EVENT_SEND_INTERVAL = 5 * 1000;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080/api';

export const RECORDER_SCRIPT_URL =
  import.meta.env.MODE === 'production'
    ? 'https://utmate.me/sdk/utmate-recorder.iife.js'
    : 'http://localhost:80/sdk/utmate-recorder.iife.js';
