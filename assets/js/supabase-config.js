// assets/js/supabase-config.js - Supabase Credentials and Client Initialization
const SUPABASE_URL = "https://lseiravrbbwebsgphwif.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2e_OlNZsGA0nsgvn0xb9RQ_EZaK0Mcv";

// Dynamic loader for Supabase CDN, ensuring it's available globally before usage
let supabaseClient = null;

async function initSupabase() {
    if (supabaseClient) return supabaseClient;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("Supabase credentials not configured. Falling back to localStorage mode.");
        return null;
    }
    
    if (typeof supabase === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Client initialized successfully.");
        return supabaseClient;
    } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
        return null;
    }
}
