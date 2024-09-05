import http from "k6/http";
import { check, sleep, fail } from "k6";

// Define the base URL
const BASE_URL = "https://jsonplaceholder.typicode.com/users";

export const options = {
  stages: [
    { duration: "5s", target: 10 }, // ramp up
    { duration: "10s", target: 10 }, // stable
    { duration: "5s", target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should complete below 500ms
    http_req_failed: ["rate<0.01"], // Failure rate should be less than 1%
  },
};

export default function () {
  // GET request: Retrieve all users
  const getRes = http.get(BASE_URL);
  const getCheck = check(getRes, {
    "GET: status was 200": (r) => r.status === 200,
    "GET: response body is not empty": (r) => r.body.length > 0,
  });

    if (!getCheck) {
      console.error("GET request failed:", getRes.status_text);
    }

  const getInvalidUser = http.get(`${BASE_URL}/dda`);
  const getUser = check(getInvalidUser, {
    "GET: status was 200": (r) => r.status === 200,
    "GET: response body is not empty": (r) => r.body.length > 0,
  });

  if (!getUser) {
    console.error("GET request failed:", getInvalidUser.status_text);
  }

  // POST request: Create a new user
  const newUser = {
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
  };

  const postRes = http.post(BASE_URL, JSON.stringify(newUser), {
    headers: { "Content-Type": "application/json" },
  });

  const postCheck = check(postRes, {
    "POST: status was 201": (r) => r.status === 201,
    "POST: user is created": (r) => JSON.parse(r.body).id !== undefined,
  });

  if (!postCheck) {
    console.error("POST request failed:", postRes.status_text);
    fail("Stopping test due to POST failure");
  }

  // PUT request: Update the user with ID 1
  const updatedUser = {
    name: "John Doe Updated",
    username: "johndoeupdated",
    email: "john.doe.updated@example.com",
  };

  const putRes = http.put(`${BASE_URL}/1`, JSON.stringify(updatedUser), {
    headers: { "Content-Type": "application/json" },
  });

  const putCheck = check(putRes, {
    "PUT: status was 200": (r) => r.status === 200,
    "PUT: user is updated": (r) =>
      JSON.parse(r.body).name === "John Doe Updated",
  });

  if (!putCheck) {
    console.error("PUT request failed:", putRes.status_text);
  }

  // DELETE request: Delete the user with ID 1
  const deleteRes = http.del(`${BASE_URL}/1`);
  const deleteCheck = check(deleteRes, {
    "DELETE: status was 200": (r) => r.status == 200,
  });

  if (!deleteCheck) {
    console.error("DELETE request failed:", deleteRes.status_text);
  }

  // Wait for 1 second before the next iteration
  sleep(1);
}
