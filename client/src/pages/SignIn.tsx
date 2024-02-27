import Logo from "../assets/SocialEcho.png";
import { LockKeyhole, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store.ts";
import { clearMessages, signInAction } from "../../state/auth/authSlice.ts";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth?.userData);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const dispatch = useDispatch<AppDispatch>();
  const successMessage = useSelector(
    (state: RootState) => state.auth?.successMessage,
  );

  const signInError = useSelector(
    (state: RootState) => state.auth?.signInError,
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    dispatch(signInAction({ formData, navigate }));
  }

  function handleClearMessages() {
    dispatch(clearMessages());
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        {/*IMG DIV*/}
        <div className="flex justify-center">
          <img className="h-7 w-auto sm:h-8" src={Logo} alt="logo" />
        </div>

        {signInError && (
          <div
            className="mt-6 flex items-center justify-between rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <div>
              <span className="block sm:inline">{signInError}</span>
            </div>
            <button
              className="font-bold text-red-700"
              onClick={handleClearMessages}
            >
              <X className={"text-gray-500 h-3 w-3"} />
            </button>
          </div>
        )}
        {successMessage && (
          <div
            className="mt-6 flex items-center justify-between rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
            role="alert"
          >
            <div>
              <span className="block sm:inline">{signInError}</span>
            </div>
            <button
              className="font-bold text-green-700"
              onClick={handleClearMessages}
            >
              <X className={"text-gray-500 h-3 w-3"} />
            </button>
          </div>
        )}

        {/*SIGN IN SIGNUP DIV*/}
        <div className="flex justify-center mt-5">
          <Link
            to={"/signin"}
            className="text-center border-blue-500  w-1/3 pb-4 text-gray-800 font-medium border-b-2"
          >
            SIGN IN{" "}
          </Link>
          <Link
            to={"/signup"}
            className="text-center w-1/3 pb-4  text-gray-800 font-medium border-b-2"
          >
            SIGN UP{" "}
          </Link>
        </div>
        {/*SIGNUP FORM*/}
        <div className="mt-8 space-y-3">
          <div className="relative flex items-center">
            <User className="absolute text-gray-300 mx-3" />
            <input
              id="name"
              name="name"
              type="text"
              value={email}
              onChange={handleEmailChange}
              className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Email"
              required
              autoComplete="off"
            />
          </div>

          <div className="relative flex items-center ">
            <LockKeyhole className="absolute text-gray-300 mx-3" />
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Password"
              required
              autoComplete="off"
            />
          </div>
        </div>
        {/*BUTTON*/}
        <button
          type="submit"
          className={`w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4`}
        >
          SIGN IN
        </button>
      </form>
    </div>
  );
};

export default SignIn;
