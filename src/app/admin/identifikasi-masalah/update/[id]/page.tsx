"use client";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import React, { useEffect, useState } from "react";
import NavLink from "components/link/NavLink";
import Select from "react-select";
import { useRouter } from "next/navigation";
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

    const getDataUser = async () => {
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

    };

    // testing delete later
    const [selectedAfd, setSelectedAfd] = useState(null);
    const afdOptions = [
        { value: 'afd1', label: 'AFD 1' },
        { value: 'afd2', label: 'AFD 2' },
        { value: 'afd3', label: 'AFD 3' },
    ];
    const handleFilterChange = (selectedOption, filterName) => {
        if (filterName === 'selectedAfd') {
            setSelectedAfd(selectedOption ? selectedOption.value : null);
        }
    };

    useEffect(() => {
        getDataUser();
    }, []);

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
                    <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Detail Kuadran</label>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Regional</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={regional}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Kebun</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={kebun}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Afdeling</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={afdeling}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Block</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={blok}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Luas</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={luas + " hectar"} readOnly
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-1 flex-1">
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Why1</label>
                        {/* <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={regional}
                            readOnly
                        /> */}

                        <Select
                            options={afdOptions}
                            placeholder="Pilih Why1"
                            value={afdOptions.find(option => option.value === selectedAfd)}
                            onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedAfd")}
                            isClearable
                        />

                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Why2</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={kebun}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Why3</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={afdeling}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Keterangan</label>
                        <input
                            className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                            value={blok}
                            readOnly
                        />
                    </div>
                    <div className="mb-5">
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
            </div>
        </div>
    );
};

export default IdentifikasiMasalahForm;
