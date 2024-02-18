import Logo from "../assets/SocialEcho.png";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Upload, User, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_MESSAGE, signUpAction } from "../../state/auth/authSlice.ts";
import { AppDispatch, RootState } from "../../state/store.ts";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const signUpError = useSelector(
    (state: RootState) => state.auth?.signUpError,
  );

  const successMessage = useSelector(
    (state: RootState) => state.auth?.successMessage,
  );

  console.log(successMessage);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarError(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      setAvatar(null);
      setAvatarError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null);
      setAvatarError("Please upload an image file less than 10MB");
    } else {
      setAvatar(file);
      setAvatarError(null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar !== null) {
      formData.append("avatar", avatar);
    }
    formData.append("role", "general");
    await dispatch(signUpAction({ formData, navigate }));
  }

  function handleClearError() {
    dispatch(CLEAR_MESSAGE());
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        {/*IMG DIV*/}
        <div className="flex justify-center">
          <img className="h-7 w-auto sm:h-8" src={Logo} alt="logo" />
        </div>
        {signUpError.length > 0 &&
          signUpError.map((err, i) => (
            <div
              className="mt-6 flex items-center rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
              key={i}
            >
              <span className="ml-2 block sm:inline">{`${err}!!!! `} </span>
              <button
                className="ml-auto font-bold text-red-700"
                onClick={handleClearError}
              >
                <X className={"text-gray-500 h-3 w-3"} />
              </button>
            </div>
          ))}

        {/*SIGN IN SIGNUP DIV*/}
        <div className="flex justify-center mt-5">
          <Link
            to={"/signin"}
            className="text-center w-1/3 pb-4 text-gray-800 font-medium border-b-2"
          >
            SIGN IN{" "}
          </Link>
          <Link
            to={"/signup"}
            className="text-center w-1/3 pb-4 border-blue-500 text-gray-800 font-medium border-b-2"
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
              value={name}
              onChange={handleNameChange}
              className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Username"
              required
              autoComplete="off"
            />
          </div>
          <div className="relative flex items-center flex-wrap ">
            <div className=" block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
              <input
                id="avatar"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                autoComplete="off"
                className=""
              />
              <Upload className="absolute text-gray-300 left-2.5 top-3.5" />
            </div>
            {avatarError && (
              <div className="mt-2 flex items-center justify-center">
                <span className="text-red-600">{avatarError}</span>
              </div>
            )}
          </div>

          <div className="relative flex items-center ">
            <Mail className="absolute text-gray-300 mx-3" />
            <input
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              type="email"
              className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Email address"
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
          SIGN UP
        </button>
      </form>
    </div>
  );
};

export default SignUp;
