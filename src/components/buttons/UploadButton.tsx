import Link from "next/link";
import React from "react";

type UploadButtonProps = {
  buttonName: string;
  pathUrl: string;
};

const UploadButton: React.FC<UploadButtonProps> = ({ pathUrl, buttonName }) => {
  return (
    <Link passHref href={pathUrl} legacyBehavior>
      <a className="px-5 py-[.675rem] text-sm font-semibold text-center text-white transition duration-700 ease-in-out bg-orange-400 rounded-full cursor-pointer hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-gradient-to-tl from-green-800 to-green-600 dark:hover:bg-orange-600 dark:focus:ring-orange-300 dark:hover:from-green-600 dark:hover:to-green-800  dark:transition dark:duration-700">
        {buttonName}
      </a>
    </Link>
  );
};

export default UploadButton;
