const API_URL = "http://localhost:5001";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const userResponse = await fetch(`${API_URL}/users?email=${data.email}`);
  const existingUsers = await userResponse.json();

  console.log("Existing users with email:", existingUsers);
  if (existingUsers.length > 0) {
    throw new Error("User already exists, Please try with new mail id");
  }

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Register response:", response);

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response.json();
};

export const loginUser = async (data: LoginPayload) => {
  const response = await fetch(`${API_URL}/users?email=${data.email}`);

  const users = await response.json();

  if (users.length === 0) {
    throw new Error("User not registered");
  }

  const user = users[0];

  if (user.password !== data.password) {
    throw new Error("Incorrect password");
  }

  return user;
};
