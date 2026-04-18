import { ApiErrorResponse } from "@/types/auth";

export const API_BASE_URL = "https://unreleasing-thatcher-nonmethodic.ngrok-free.dev";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;
  const url = `${API_BASE_URL}${path}`;

  console.log("ABOUT TO FETCH:", method, url, body);

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    console.log("FETCH ERROR:", error);
    throw {
      status: 0,
      message: "Network request failed",
      originalError:error,
    };
  }

  const data = await response.json().catch(() => ({}));

  console.log("API RESPONSE:", response.status, data);

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw {
      status: response.status,
      message: errorData.error || errorData.message || "Something went wrong",
      requiresVerification: errorData.requiresVerification,
      email: errorData.email,
      details: errorData.details,
    };
  }

  return data as T;
}
