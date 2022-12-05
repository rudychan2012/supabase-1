const url = process.env.NODE_ENV === 'development' ? process.env.SUPABASE_URL : process.env.SUPABASE_PUBLIC_URL
const PUBLIC_URL = new URL(url || 'https://localhost:8443')

export const PROJECT_REST_URL = `${PUBLIC_URL.origin}/rest/v1/`
export const PROJECT_ENDPOINT = PUBLIC_URL.host
