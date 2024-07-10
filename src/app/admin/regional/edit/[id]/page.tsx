"use client";
import axios from "axios";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import NavLink from "components/link/NavLink";
import toast from "react-hot-toast";
import { isWindowAvailable } from "utils/navigation";
import { useRouter } from "next/navigation";

type Data = {
  tipe_regional: string;
  nama_regional: string;
};

const EditRegional = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<Data>();

  useEffect(() => {
    if (isWindowAvailable()) document.title = "Edit Regional";
    getDataRegional();
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getDataRegional = async () => {
    try {
      const token = cookie.get("token");
      const tokenData: Tokens = JSON.parse(token || "{}");

      const response = await axios.get(`${apiUrl}/regional/${params.id}`, {
        headers: {
          Authorization: `Bearer ${tokenData.payload.access_token}`,
        },
      });

      if (response.data.status_code === 200) {
        const regionalData = response.data.payload;
        setValue("tipe_regional", regionalData[0].tipe_regional);
        setValue("nama_regional", regionalData[0].nama_regional);
      }
    } catch (error) {
      console.error("Error fetching regional data", error);
    }
  };

  const putDataRegional = async (data: Data) => {
    try {
      const token = cookie.get("token");
      const tokenData: Tokens = JSON.parse(token || "{}");

      const response = await axios.put(`${apiUrl}/regional/${params.id}`, {
        tipe_regional: data.tipe_regional,
        nama_regional: data.nama_regional,
      }, {
        headers: {
          Authorization: `Bearer ${tokenData.payload.access_token}`,
        },
      });

      if (response.data.status_code === 200) {
        toast.success("Regional berhasil diubah!");
        router.push("/admin/regional");
      } else {
        toast.error("Oops gagal, periksa kembali data!");
      }
    } catch (error) {
      console.error("Error updating regional data", error);
      toast.error("Oops gagal, periksa kembali data!");
    }
  };

  return (
    <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Regional</h1>
      <form onSubmit={handleSubmit(putDataRegional)}>
        <div className="mb-5 mt-5 pt-3">
          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Kode Regional</label>
          <input
            {...register("tipe_regional", { required: true })}
            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
          />
          {errors.tipe_regional && (
            <p className="mt-2 text-xs text-red-600">
              Mohon isi <span className="font-medium">Kode Regional</span>
            </p>
          )}
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Nama Regional</label>
          <input
            {...register("nama_regional", { required: true })}
            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
          />
          {errors.nama_regional && (
            <p className="mt-2 text-xs text-red-600">
              Mohon isi <span className="font-medium">Nama Regional</span>
            </p>
          )}
        </div>
        <div className="flex justify-end mt-10">
          <NavLink
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-l-lg"
            href="/admin/regional"
          >
            Batal
          </NavLink>
          <button
            type="submit"
            className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out w-1/2 lg:w-[15%] flex justify-center rounded-r-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Edit Regional"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRegional;
