import { SERVER_ENDPOINT } from '../constants';
import { ServerLogPayload } from '../types';

export const sendToLocalhost = async (payload: ServerLogPayload): Promise<boolean> => {
  try {
    // We wrap this in a try-catch to ensure that if the localhost server isn't running,
    // the application doesn't crash or error out visibly to the user.
    // This is common in demo environments where the backend might be optional.
    
    // Check if we are in a secure context trying to access localhost http
    if (window.location.protocol === 'https:' && SERVER_ENDPOINT.startsWith('http:')) {
      console.debug('Skipping localhost upload due to mixed content restrictions in demo environment.');
      return false;
    }

    const response = await fetch(SERVER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Just log warning, don't throw
      console.warn(`Server ${SERVER_ENDPOINT} returned ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    // Log softly - it's expected if no server is running
    console.debug('Could not reach localhost server (expected in client-only demo mode)');
    return false;
  }
};