export const BACKEND_BASE_URL = "http://127.0.0.1:5000/"

export const [,user] = /user=([^&]+)/.exec(decodeURI(location.search)) ?? []