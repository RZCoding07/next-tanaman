'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useState, useEffect } from 'react';
import { isWindowAvailable } from 'utils/navigation';
import ButtonLoading from "components/buttons/ButtonLoading";
import { useAuth } from 'contexts/AuthContext';
import { AiOutlineWarning } from 'react-icons/ai';

function SignIn() {
  const { login, errorMessage, isLoading } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean | null>(false);

  if (isWindowAvailable())
    document.title = 'Sign In';

  useEffect(() => {
    if (errorMessage) {
      setIsError(true);
    }
  }, [errorMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <Default
      maincard={
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative bg-white dark:bg-navy-800 p-8 rounded-lg shadow-lg w-full max-w-lg before:content-[''] before:absolute before:inset-0 before:-z-10 before:border-2 before:border-green-500 before:rounded-lg before:-translate-x-2 before:-translate-y-2 after:content-[''] after:absolute after:inset-0 after:-z-20 after:border-2 after:border-orange-500 after:rounded-lg after:-translate-x-4 after:-translate-y-4">
            <div className="mb-2.5 flex justify-center">
              <img src="/img/picatanaman.png" alt="PICA TANAMAN" className="w-full" />
            </div>
            <form onSubmit={handleLogin}>
              <h1 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
                Welcome Back 🌱 
              </h1>
              
              <p className="mb-2 text-base text-center text-gray-600 dark:text-gray-400">
                Sign in to your account to continue

              </p>
              <InputField
                variant="auth"
                extra="mb-3"
                label="Username"
                placeholder='Enter your username'
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                id="email"
                type="text"
              />
              <InputField
                variant="auth"
                extra="mb-3"
                label="Password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                id="password"
                type="password"
              />
              {isError && (
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md">
                    <AiOutlineWarning className="w-5 h-5 mr-2 text-red-500" />
                    {errorMessage}
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={!username || !password}
                className="flex justify-center w-full text-white bg-green-600 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:shadow-lg transition duration-700">
                {isLoading ? <ButtonLoading /> : "Masuk"}
              </button>
            </form>
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ©2024 Made with ❤️ by {""}
                <a href="/auth/sign-in" className="text-green-600 hover:underline text-center">
                  PICA Tanaman
                </a>
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignIn;
