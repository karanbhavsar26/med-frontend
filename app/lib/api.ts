// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error("❌ NEXT_PUBLIC_AUTH_TOKEN is not set in .env.local");
}

export const extractReport = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  console.log("📤 Sending request to:", `${API_BASE}/extract`);
  console.log("🔑 Using token:", AUTH_TOKEN ? "Present" : "MISSING!");

  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Backend error response:", response.status, errorText);
    throw new Error(`Failed (${response.status}): ${errorText}`);
  }

  return response.json();
};