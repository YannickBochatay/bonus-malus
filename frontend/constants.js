// export const BACKEND_BASE_URL = "https://yanb.pythonanywhere.com/"
export const BACKEND_BASE_URL = "http://127.0.0.1:5000/"

export const ROOT_URL = ""

export const PAGE_LENGTH = 20

export const [,user] = /user=([^&]+)/.exec(decodeURI(location.search)) ?? []