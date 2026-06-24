// src/api/client.ts
export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export async function fetchUsers(): Promise<ApiUser[]> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}
