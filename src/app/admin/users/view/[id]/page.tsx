"use client";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import React, { use, useEffect, useId, useState, useRef } from "react";
import { set, useController, useForm } from "react-hook-form";
import NavLink from "components/link/NavLink";
import Select from "react-select";
import toast from "react-hot-toast";
import { isWindowAvailable } from "utils/navigation";
import { useRouter } from "next/navigation";

type Data = {
  niksap: string;
  password: string;
  passwordConfirm: string;
  nama: string;
  jabatan: string;
  role: {
    value: string;
    label: string;
  };
};

let customStylesSelect = {
  control: (base: {}) => ({
    ...base,
    borderRadius: 10,
    padding: "2px 5px",
    width: "100%",
    border: `1px solid #E5E7EB`,
    "&:hover": {
      borderColor: "#16A34A",
    },
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  }),
  option: (provided: {}, state: { isSelected: boolean }) => ({
    ...provided,
    color: state.isSelected ? '#000' : '#000',
    backgroundColor: state.isSelected ? '#fff' : 'transparent',
    "&:hover": {
      backgroundColor: '#16A34A',
      color: '#fff',
    },
  }),

  singleValue: (styles, { data }) => ({
    ...styles,
    color: "black",
  }),
};

if (typeof window !== 'undefined' && window.localStorage.getItem('darkmode') === 'true') {
  customStylesSelect = {
    ...customStylesSelect,
    control: (base: {}) => ({
      ...base,
      borderRadius: 10,
      padding: "2px 5px",
      width: "100%",
      border: `1px solid #E5E7EB`,
      "&:hover": {
        borderColor: "#16A34A",
      },
      "@media only screen and (max-width: 767px)": {
        width: "100%",
      },
      backgroundColor: "#1F2937",
      color: "#fff",
    }),
    option: (provided: {}, state: { isSelected: boolean }) => ({
      ...provided,
      color: state.isSelected ? '#000' : '#000',
      backgroundColor: state.isSelected ? '#fff' : 'transparent',
      "&:hover": {
        backgroundColor: '#16A34A',
        color: '#fff',
      },
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      color: "white",
      zIndex: 9999,
    }),
  };
} else {
  customStylesSelect = {
    ...customStylesSelect,
    control: (base: {}) => ({
      ...base,
      borderRadius: 10,
      padding: "2px 5px",
      width: "100%",
      border: `1px solid #E5E7EB`,
      "&:hover": {
        borderColor: "#16A34A",
      },
      "@media only screen and (max-width: 767px)": {
        width: "100%",
      },
    }),
    option: (provided: {}, state: { isSelected: boolean }) => ({
      ...provided,
      color: state.isSelected ? '#000' : '#000',
      backgroundColor: state.isSelected ? '#fff' : 'transparent',
      "&:hover": {
        backgroundColor: '#16A34A',
        color: '#fff',
      },
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      color: "black",
      zIndex: 9999,
    }),
  };
}
const DetailUser = async ({params}: {params:{id:string}} ) => {
  const routeer = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const getDataUser = async () => {
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");

    const res = await fetch(`${apiUrl}/users/${params.id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.payload.access_token}`,
      },
    });
    const data = await res.json();
    if (data.status_code === 200) {
      setUsername(data.payload[0].username);
      setRole(data.payload[0].role); 
    }
   
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <>
      <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Detail User
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tambahkan user baru dengan mengisi form di bawah ini.
        </p>
        <hr className="my-5 border-gray-300 dark:border-gray-700" />
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Username
          </label>
          <input
            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
            value={username}
            readOnly
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Role
          </label>
          <input
            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
            value={role}
            readOnly
          />
        </div>




        <div className="flex justify-end mt-10">

          <NavLink
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-l-lg"
            href="/admin/users"
            style={{ marginRight: "0px" }}
          >
            Kembali
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default DetailUser;
