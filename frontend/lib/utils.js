import { BACKEND_BASE_URL } from "../config.js"
export * from "../config.js"

export const [,user] = /user=([^&]+)/.exec(decodeURI(location.search)) ?? []

export async function fetchJSON(url = "", options = {}) {
  const res = await fetch(BACKEND_BASE_URL + url, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.details)
  if (["POST", "PUT", "DELETE"].includes(options.method)) return data.details
  else return data
}

export function createState(initialState) {

  const listeners = {};
  
  return {
    state: new Proxy(initialState, {
      set(target, prop, value) {
        target[prop] = value;
        listeners[prop]?.forEach(callback => callback(prop, value));
        return true;
      }
    }),
    onStateChange(prop, callback) {
      if (!(prop in listeners)) listeners[prop] = [];
      listeners[prop].push(callback);
    },
    offStateChange(prop, callback) {
      const index = listeners[prop]?.indexOf(callback);
      if (index != null && index !== -1) listeners[prop].splice(index, 1);
    }
  };
}