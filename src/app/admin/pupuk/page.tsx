"use client";
import React from "react";
import NavLink from "components/link/NavLink";

const ComingSoon = () => {
    return (
        <>
            <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Coming Soon
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    This feature is under development and will be available soon. Stay tuned!
                </p>
                <hr className="my-5 border-gray-300 dark:border-gray-700" />
                <div className="flex justify-end mt-10">
                    <NavLink
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-l-lg"
                        href="/admin/default"
                        style={{ marginRight: "0px" }}
                    >
                        Kembali
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default ComingSoon;
