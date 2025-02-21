export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function uint8ArrayToJson(uint8Array) {
  return JSON.stringify(Array.from(uint8Array));
}
export function jsonToUint8Array(jsonString) {
  return new Uint8Array(JSON.parse(jsonString));
}
export function uint8ArrayToBase64(uint8Array) {
  return btoa(String.fromCharCode(...uint8Array));
}

export function base64ToUint8Array(base64String) {
  try {
    
    return new Uint8Array([...atob(base64String)].map(c => c.charCodeAt(0)));
  } catch (error) {
    console.log(error);
  }
}
