import Link from "next/link";
import React from "react";

type CreateButtonProps = {
  buttonName: string;
  pathUrl: string;
};

const CreateButton: React.FC<CreateButtonProps> = ({ pathUrl, buttonName }) => {
  return (
    <Link passHref href={pathUrl} legacyBehavior>
      <a className="px-5 py-[.675rem] text-sm font-semibold text-center text-white transition duration-700 ease-in-out bg-green-600 rounded-full cursor-pointer hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-gradient-to-tl from-orange-400 to-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-300 dark:hover:from-orange-500 dark:hover:to-orange-600  dark:transition dark:duration-700">
        {buttonName}
      </a>
    </Link>
  );
};

export default CreateButton;
 