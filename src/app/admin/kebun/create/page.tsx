"use client";
import React, { useId } from "react";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import { useForm, useController, set } from "react-hook-form";
import NavLink from "components/link/NavLink";
import Select from "react-select";
import toast from "react-hot-toast";
import { isWindowAvailable } from "utils/navigation";
import { useRouter } from "next/navigation";

type Data = {
  kode_kebun: string;
  nama_kebun: string;
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

const CreateKebun = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Data>();

  if (isWindowAvailable()) document.title = "Create Kebun";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleCreateKebun = async () => {
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");
    const res = await fetch(`${apiUrl}/kebun`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenData.payload.access_token}`,
      },
      body: JSON.stringify({
        kode_kebun: watch("kode_kebun"),
        nama_kebun: watch("nama_kebun"),
      }),
    });

    const data = await res.json();
    if (data.status_code === 201) {
      toast.success("Kebun berhasil ditambahkan!");
      router.push("/admin/kebun");
    } else {
      toast.error("Oops gagal, periksa kembali data!");
    }
  };


  return (
    <>
      <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tambah Kebun
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tambahkan kebun baru dengan mengisi form di bawah ini.
        </p>
        <hr className="my-5 border-gray-300 dark:border-gray-700" />
        <form onSubmit={handleSubmit(handleCreateKebun)}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Kode Kebun
            </label>
            <input
              {...register("kode_kebun", { required: true })}
              className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
              placeholder="Input Kode Kebun"
            />
            {errors.kode_kebun && (
              <p className="mt-2 text-xs text-red-600 ">
                Mohon isi <span className="font-medium">Kode Kebun</span>
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Nama Kebun
            </label>
            <input
              {...register("nama_kebun", { required: true })}
              className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
              placeholder="Input Nama Kebun"
            />
            {errors.nama_kebun && (
              <p className="mt-2 text-xs text-red-600 ">
                Mohon isi <span className="font-medium">Nama Kebun</span>
              </p>
            )}
          </div>

          <div className="flex justify-end mt-10">
            <NavLink
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-l-lg"
              href="/admin/kebun"
              style={{ marginRight: "0px" }}
            >
              Batal
            </NavLink>
            <button
              type="submit"
              className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out w-1/2 lg:w-[15%] flex justify-center rounded-r-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "loading..." : "Tambah Kebun"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateKebun;
