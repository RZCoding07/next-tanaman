"use client";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import React, { useEffect, useState, useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import NavLink from "components/link/NavLink";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { json } from "stream/consumers";
// import { useRouter } from 'next/router'  // Usage: Page router


const getCustomStylesSelect = (isDarkMode: boolean) => ({
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
        ...(isDarkMode && {
            backgroundColor: "#1F2937",
            color: "#fff",
        }),
    }),
    option: (provided: {}, state: { isSelected: boolean }) => ({
        ...provided,
        color: state.isSelected ? "#000" : "#000",
        backgroundColor: state.isSelected ? "#fff" : "transparent",
        "&:hover": {
            backgroundColor: "#16A34A",
            color: "#fff",
        },
    }),
    singleValue: (styles: {}) => ({
        ...styles,
        color: isDarkMode ? "white" : "black",
        zIndex: 9999,
    }),

});


const IdentifikasiMasalahForm = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [regional, setRegional] = useState("");
    const [kebun, setKebun] = useState("");
    const [afdeling, setAfdeling] = useState("");
    const [blok, setBlok] = useState("");
    const [id, setId] = useState("");
    const [luas, setLuas] = useState("");

    const [w1, setW1] = useState([]);
    const [w2, setW2] = useState([]);
    const [w3, setW3] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();


    const getW1 = useCallback(async () => {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");

        const res = await fetch(`${apiUrl}/why1`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.payload.access_token}`,
            },
        });
        const data = await res.json();
        if (data.status_code === 200) {
            let why1Options = [];
            Object.keys(data.payload).map((key) => {
                why1Options.push(data.payload[key].w1);
            });

            why1Options = why1Options.map((item) => {
                return { value: item, label: JSON.parse(item).label };
            }
            );
            setW1(why1Options);
        }
    }, [apiUrl, cookie.get("token")]);

    const getW2 = useCallback(async () => {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");
    
        const res = await fetch(`${apiUrl}/why2`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.payload.access_token}`,
            },
            body: JSON.stringify({ w1: watch("w1").value }),
        });
    
        const data = await res.json();
        if (data.status_code === 200) {
            const parsedData = data.payload.map(item => JSON.parse(item));
            setW2(parsedData);
        }
    }, [apiUrl, cookie.get("token")]);
    
    const getW3 = useCallback(async () => {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");

        const res = await fetch(`${apiUrl}/why3`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.payload.access_token}`,
            },
            body: JSON.stringify({ w2: JSON.stringify(watch("w2")) }),
        });

        const data = await res.json();
        if (data.status_code === 200) {
            const parsedData = data.payload.map(item => JSON.parse(item));
            setW3(parsedData);
        }
    }, [apiUrl, cookie.get("token")]);

    const getDataUser = useCallback(async () => {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");

        const res = await fetch(`${apiUrl}/kuadran/${params.id}`, {
            method: "GET",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.payload.access_token}`,
            },
        });
        const data = await res.json();
        if (data.status_code === 200) {
            const kuadran = data.kuadran;  // Access the kuadran object directly
            setId(kuadran.id);
            setRegional(kuadran.rpc);
            setKebun(kuadran.kebun);
            setAfdeling(kuadran.afd);
            setBlok(kuadran.no_blok);  // Updated to match the correct property name
            setLuas(kuadran.luas);
        }
    }, [
        apiUrl,
        params.id,
        cookie.get("token"),
    ]);

    const handleW1Change = (selectedOption: any) => {
        setValue("w1", selectedOption);
        getW2();
        // set placeholder for w2
        setValue("w2", null);
        setValue("w3", null);
    };

    const handleW2Change = (selectedOption: any) => {
        setValue("w2", selectedOption);
        getW3();

        // set placeholder for w3
        setValue("w3", null);


    }

    const handleW3Change = (selectedOption: any) => {
        setValue("w3", selectedOption);
    }   

    const onSubmit = async (data: any) => {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");

        const res = await fetch(`${apiUrl}/problem/${id}`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.payload.access_token}`,
            },
            body: JSON.stringify(data),
        });
        const response = await res.json();
        if (response.status_code === 200) {
            router.push("/admin/identifikasi-masalah");
        }
    }


    useEffect(() => {
        getDataUser();
        getW1();
    }, [getDataUser, getW1]);

    const isDarkMode = typeof window !== "undefined" && window.localStorage.getItem("darkmode") === "true";
    const customStylesSelect = getCustomStylesSelect(isDarkMode);

    return (
        <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Problem Identifcation</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Please fill in the form below to identify the problem.
            </p>
            <hr className="my-5 border-gray-300 dark:border-gray-700" />


            <div className="flex gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-1 flex-1">

                    {/* text header for this form */}
                    <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Detail Identifikasi</label>

                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Regional</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={regional}
                            readOnly
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Kebun</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={kebun}
                            readOnly
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Afdeling</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={afdeling}
                            readOnly
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Block</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={blok}
                            readOnly
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Luas</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={luas + " hectar"} readOnly
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Why 1</label>

                        <Select
                            options={w1}
                            onChange={handleW1Change}
                            className=''
                            instanceId={useId()}
                            placeholder="Pilih Why 1"
                            isSearchable={true}
                            styles={customStylesSelect}
                            value={watch("w1")}
                            {...(register("w1"), { required: true })}
                        />

                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Why 1</label>

                        <Select
                            options={w2}
                            onChange={handleW2Change}
                            className=''
                            instanceId={useId()}
                            placeholder="Pilih Why 2"
                            isSearchable={true}
                            styles={customStylesSelect}
                            value={watch("w2")}
                            {...(register("w2"), { required: true })}
                        />

                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Why 3</label>

                        <Select
                            options={w3}
                            onChange={handleW3Change}
                            className=''
                            instanceId={useId()}
                            placeholder="Pilih Why 3"
                            isSearchable={true}
                            styles={customStylesSelect}
                            value={watch("w3")}
                            {...(register("w3"), { required: true })}
                        />

                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Keterangan</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={blok}
                            readOnly
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Measurement</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={luas + " hectar"}
                            readOnly
                        />
                    </div>
                </div>
            </div>


            <div className="flex justify-end mt-10">
                <button
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-l-lg"
                    onClick={() => router.back()}
                >
                    Kembali
                </button>
                <button
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out lg:w-[15%] flex justify-center rounded-r-lg"
                    onClick={handleSubmit(onSubmit)}
                >
                    Simpan
                </button>
            </div>
        </div>
    );
};

export default IdentifikasiMasalahForm;
