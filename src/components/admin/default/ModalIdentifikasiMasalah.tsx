"use client";
import React from "react";
import { useForm, useController } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { isWindowAvailable } from "utils/navigation";

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

const roleOptions = [
    { value: "Super Admin", label: "Super Admin" },
    { value: "Admin Regional", label: "Admin Regional" },
    { value: "Manager Kebun", label: "Manager Kebun" },
    { value: "Admin Kebun", label: "Admin Kebun" },
    { value: "Viewer", label: "Viewer" }
];

const ModalIdentifikasiMasalah = ({ item, onClose }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<Data>({
        defaultValues: {
            niksap: item?.niksap || "",
            password: "",
            passwordConfirm: "",
            nama: item?.nama || "",
            jabatan: item?.jabatan || "",
            role: item?.role || { value: "", label: "" },
        },
    });

    const handleCreateUser = async (data) => {
        try {
            // Example API call
            toast.success("User successfully updated!");
            onClose(); // Close the modal after successful operation
        } catch (error) {
            toast.error("Failed to update user.");
        }
    };

    const { field: roleField } = useController({
        name: "role",
        control,
        rules: { required: true },
    });

    const handleRoleSelectChange = (value) => {
        roleField.onChange(value);
    };

    let customStylesSelect = {
        control: (base) => ({
            ...base,
            borderRadius: 10,
            padding: "2px 5px",
            width: "100%",
            border: `1px solid #E5E7EB`,
            "&:hover": {
                borderColor: "#16A34A",
            },
        }),
        option: (provided, state) => ({
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
            color: "black",
        }),
    };

    if (typeof window !== 'undefined' && window.localStorage.getItem('darkmode') === 'true') {
        customStylesSelect = {
            ...customStylesSelect,
            control: (base) => ({
                ...base,
                backgroundColor: "#1F2937",
                color: "#fff",
            }),
            singleValue: (styles) => ({
                ...styles,
                color: "white",
            }),
        };
    }
    return (
        <div className="w-full p-5 mx-auto border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Pilih Keterangan
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Silahkan pilih keterangan yang sesuai dengan masalah yang dihadapi.
            </p>
            <hr className="my-5 border-gray-300 dark:border-gray-700" />
            <form onSubmit={handleSubmit(handleCreateUser)}>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                        W1
                    </label>
                    <input
                        {...register("niksap", { required: true })}
                        className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                        placeholder="Input NIK SAP"
                    />
                    {errors.niksap && (
                        <p className="mt-2 text-xs text-red-600">
                            Mohon isi <span className="font-medium">NIK SAP</span>
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                        Password
                    </label>
                    <input
                        {...register("password", { required: true })}
                        type="password"
                        className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                        placeholder="Input password"
                    />
                    {errors.password && (
                        <p className="mt-2 text-xs text-red-600">
                            Mohon isi <span className="font-medium">Password</span>
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                        Role
                    </label>
                    <Select
                        options={roleOptions}
                        styles={customStylesSelect}
                        placeholder="Pilih Role"
                        classNamePrefix="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                        className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                        {...register("role", { required: true })}
                        menuPortalTarget={document.body}
                        isSearchable={true}
                    />
                    {errors.role && (
                        <p className="mt-2 text-xs text-red-600">
                            Mohon pilih <span className="font-medium">Role</span>
                        </p>
                    )}
                </div>

                <div className="flex justify-end mt-10 space-x-4">
                    <button type="submit" className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-md font-bold text-white" disabled={isSubmitting}>
                        {isSubmitting ? "Loading..." : "Tambah Identifikasi"}
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                    </button>
                    <button className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-red-500 text-md font-bold text-white" type="button" onClick={onClose}>
                        Cancel
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                    </button>
                </div>
            </form>
        </div>
    );

};

export default ModalIdentifikasiMasalah;
