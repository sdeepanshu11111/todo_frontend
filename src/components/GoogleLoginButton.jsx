// src/components/GoogleLoginButton.jsx
import { GoogleLogin } from "@react-oauth/google";

import api from "../api/axios";

export default function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      // Send ID token to backend for verification
      const res = await api.post("/auth/google", { idToken });

      // Save backend JWT
      localStorage.setItem("token", res.data.token);

      window.location.href = "/todos"; // redirect
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Google login error");
      }}
    />
  );
}
