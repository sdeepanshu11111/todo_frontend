import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin } from "../store/authSlice";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(googleLogin(credentialResponse.credential));
      if (result.type === 'auth/googleLogin/fulfilled') {
        navigate("/todos");
      }
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-white/60">or</span>
        </div>
      </div>
      <div className="mt-4">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Google login error")}
          theme="filled_blue"
          size="large"
          width="100%"
        />
      </div>
    </div>
  );
}
