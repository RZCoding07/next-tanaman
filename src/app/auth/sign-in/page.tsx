'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import Checkbox from 'components/checkbox';
import NavLink from 'components/link/NavLink';
import { useState, useEffect } from 'react';
import { isWindowAvailable } from 'utils/navigation';
import ButtonLoading from "components/buttons/ButtonLoading";
import { useAuth } from 'contexts/AuthContext';
import { AiOutlineWarning } from 'react-icons/ai';

function SignIn() {
  const { login, errorMessage, isLoading } = useAuth()
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean | null>(false);


  if (isWindowAvailable())
    document.title = 'Sign In'
      ;


  useEffect(() => {
    if (errorMessage) {
      setIsError(true);
    }
  }, [errorMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("to handle login");
    login(username, password);
  };
  return (
    <>
      <Default
        maincard={
          <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            {/* Sign in section */}
            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
              <h3 className="mb-2.5 text-4xl font-bold text-green-600 dark:text-white">
                <span className='text-navy-800 dark:text-white'>Selamat Datang di </span> 
                <p className='mb-2'></p>
                <span className='dark:text-orange-400'>PICA </span> <span className="text-orange-400 dark:text-green-600"> TANAMAN</span>
              </h3>
              <form onSubmit={handleLogin}>
                <p className="mb-9 ml-1 text-base text-gray-600">
                  Enter your username and password to sign in!
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

                {/* Password */}
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
                {/* Checkbox */}
                {/* <div className="mb-4 flex items-center justify-between px-2">
                  <div className="mt-2 flex items-center">
                    <Checkbox />
                    <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                      Keep me logged In
                    </p>
                  </div>
                  <NavLink href="/auth/forgot-password" className="mt-0 w-max">
                    <p className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
                      Forgot Password?
                    </p>
                  </NavLink>
                </div> */}

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
                  className="flex justify-center led:cursor-not-allowed w-full text-white bg-green-600 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:shadow-lg transition duration-700">
                  {isLoading ? <ButtonLoading /> : "Masuk"}
                </button>
              </form>
            </div>
          </div>
        }
      />
    </>

  );
}

export default SignIn;