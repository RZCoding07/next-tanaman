"use client";
import axios from "axios";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import React, { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import NavLink from "components/link/NavLink";
import Select from "react-select";
import toast from "react-hot-toast";
import { isWindowAvailable } from "utils/navigation";
import { useRouter } from "next/navigation";

type Data = {
  username: string;
  role: {
    value: string;
    label: string;
  };
};

const customStylesSelect = {
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
    backgroundColor: typeof window !== 'undefined' && window.localStorage.getItem('darkmode') === 'true' ? "#1F2937" : "#fff",
    color: typeof window !== 'undefined' && window.localStorage.getItem('darkmode') === 'true' ? "#fff" : "#000",
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
  singleValue: (styles) => ({
    ...styles,
    color: typeof window !== 'undefined' && window.localStorage.getItem('darkmode') === 'true' ? "white" : "black",
    zIndex: 9999,
  }),
};


const roleOptions = [
  { value: "Super Admin", label: "Super Admin" }, 
  { value: "Admin Regional", label: "Admin Regional" },
  { value: "Manager Kebun", label: "Manager Kebun" }, 
  { value: "Admin Kebun", label: "Admin Kebun" },
  { value: "Viewer", label: "Viewer" }
];

const EditUser = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue } = useForm<Data>();

  useEffect(() => {
    if (isWindowAvailable()) document.title = "Edit User";
    getDataUser();
  }, []);

  const { field: roleField } = useController({
    name: "role",
    control,
    rules: { required: true },
  });

  const handleRoleSelectChange = (value: { value: string; label: string } | null) => {
    roleField.onChange(value);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getDataUser = async () => {
    try {
      const token = cookie.get("token");
      const tokenData: Tokens = JSON.parse(token || "{}");

      const response = await axios.get(`${apiUrl}/users/${params.id}`, {
        headers: {
          Authorization: `Bearer ${tokenData.payload.access_token}`,
        },
      });

      if (response.data.status_code === 200) {
        const userData = response.data.payload;
        setValue("username", userData[0].username);
        setValue("role", roleOptions.find(role => role.value === userData[0].role.value) || null);
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const putDataUser = async (data: Data) => {
    try {
      const token = cookie.get("token");
      const tokenData: Tokens = JSON.parse(token || "{}");

      const response = await axios.put(`${apiUrl}/users/${params.id}`, {
        username: data.username,
        role: data.role.value,
      }, {
        headers: {
          Authorization: `Bearer ${tokenData.payload.access_token}`,
        },
      });

      if (response.data.status_code === 200) {
        toast.success("User berhasil diubah!");
        router.push("/admin/users");
      } else {
        toast.error("Oops gagal, periksa kembali data!");
      }
    } catch (error) {
      console.error("Error updating user data", error);
      toast.error("Oops gagal, periksa kembali data!");
    }
  };

  return (
    <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit User</h1>
      <form onSubmit={handleSubmit(putDataUser)}>
        <div className="mb-5 mt-5 pt-3">
          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Username</label>
          <input
            {...register("username", { required: true })}
            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
          />
          {errors.username && (
            <p className="mt-2 text-xs text-red-600">
              Mohon isi <span className="font-medium">Username</span>
            </p>
          )}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Role</label>
          <Select
            options={roleOptions}
            onChange={handleRoleSelectChange}
            styles={customStylesSelect}
            placeholder="Pilih Role"
            value={roleField.value}
          />
          {errors.role && (
            <p className="mt-2 text-xs text-red-600">
              Mohon pilih <span className="font-medium">Role</span>
            </p>
          )}
        </div>
        <div className="flex justify-end mt-10">
          <NavLink
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-l-lg"
            href="/admin/users"
          >
            Batal
          </NavLink>
          <button
            type="submit"
            className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out w-1/2 lg:w-[15%] flex justify-center rounded-r-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Edit User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
