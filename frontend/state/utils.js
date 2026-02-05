export const BACKEND_BASE_URL = "https://yanb.pythonanywhere.com/"

export const [,user] = /user=([^&]+)/.exec(decodeURI(location.search)) ?? []

export async function fetchJSON(url = "", options = {}) {
  const res = await globalThis.fetch(BACKEND_BASE_URL + url, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.details)
  if (["POST", "PUT", "DELETE"].includes(options.method)) return data.details
  else return data
}

export function createState(initialState) {

  const listeners = {};

  function createProxy(target) {
    return new Proxy(target, {

      set(target, prop, value) {
        target[prop] = value;
        listeners[prop]?.forEach(callback => callback(prop, value));
        return true;
      },

      get(target, prop) {
        // from Chris Ferdinandi : https://gomakethings.com/guides/proxies/nesting/ 
        if (prop === '_isProxy') return true;
        if (target[prop]?._isProxy) return target[prop];
        if (target[prop] && typeof target[prop] === 'object') return createProxy(target[prop]);
        return target[prop];
      },
    });
  }
  
  return {
    state: createProxy(initialState),
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