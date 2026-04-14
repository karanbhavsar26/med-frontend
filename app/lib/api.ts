const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const extractReport = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to extract report');
  }

  return res.json();
};