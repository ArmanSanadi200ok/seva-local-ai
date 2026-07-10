const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function createTask(taskData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}