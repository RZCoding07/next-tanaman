"use client";
import React, { useState, useEffect, useRef, useId } from "react";
import cookie from "js-cookie";
import Papa from "papaparse";
import { BsFillCheckCircleFill, BsTrash } from "react-icons/bs";
import readXlsxFile, { Row } from "read-excel-file";
import Select from "react-select";
import { FaFileExcel } from "react-icons/fa";
import { useController, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Tokens } from "types/token";
import { useRouter } from "next/navigation";
import { isWindowAvailable } from "utils/navigation";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

type KuadranType = {
    kondisi: string;
    status_umur: string;
    kebun: string;
    kkl_kebun: string;
    afd: string;
    tahun_tanam: string;
    no_blok: string;
    luas: string;
    jlh_pokok: string;
    pkk_ha: string;
    rpc: string;
    kebun_: string;
    r: string;
    warna: string;
    bulan: string;
    tahun: number;
};

const UploadIplFile: React.FC = (): JSX.Element => {
    const router = useRouter();

    if (isWindowAvailable()) document.title = "Upload File Kuadran - Admin";

    const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
    const [isUploadingDone, setIsUploadingDone] = useState<boolean>(false);
    const [progressValue, setProgressValue] = useState(0);
    const [parsedData, setParsedData] = useState<Row[]>([]);
    const [tableRows, setTableRows] = useState<string[]>([]);
    const [mappedData, setMappedData] = useState<KuadranType[]>([]);
    const [values, setValues] = useState<string[][]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<{ label: string; value: string } | null>(null);
    const [selectedYear, setSelectedYear] = useState<{ label: string; value: number } | null>(null);

    const instanceId = useId();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const years = Array.from({ length: 50 }, (_, i) => currentYear - i).map(year => ({
        value: year,
        label: year.toString()
    }));

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            await parseFile(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (file) {
            await parseFile(file);
        }
    };

    const parseFile = async (file: File): Promise<void> => {
        setLoading(true);
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (fileExtension === "csv") {
            Papa.parse(file, {
                skipEmptyLines: true,
                complete: (results) => {
                    const rowsArray: string[][] = [];
                    const valuesArray: string[][] = [];

                    results.data.map((d: any) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                    });

                    setParsedData(results.data as Row[]);
                    setTableRows(rowsArray[0]);
                    setValues(valuesArray.slice(1));
                    setFileName(file.name);
                    if (fileName) {
                        setLoading(false);
                    }
                },
            });
        } else if (fileExtension === "xlsx") {
            try {
                const results: Row[] = await readXlsxFile(file);
                const rowsArray: string[][] = [];
                const valuesArray: string[][] = [];

                results.forEach((row: Row) => {
                    const rowValues = row.map((cell: any) =>
                        cell !== null ? cell.toString() : ""
                    );
                    rowsArray.push(rowValues);
                    valuesArray.push(rowValues);
                });

                setParsedData(results);
                setTableRows(rowsArray[0]);
                setValues(valuesArray.slice(1));
                setFileName(file.name);
                if (fileName) {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const handleRemoveFile = (): void => {
        setParsedData([]);
        setTableRows([]);
        setValues([]);
        setFileName(null);
        setLoading(false);
    };

    useEffect(() => {
        if (values.length > 0 && selectedMonth && selectedYear) {
            setMappedData(
                values.map((value) => ({
                    kondisi: value[0],
                    status_umur: value[1],
                    kebun: value[2],
                    kkl_kebun: value[3],
                    afd: value[4],
                    tahun_tanam: value[5],
                    no_blok: value[6],
                    luas: value[7],
                    jlh_pokok: value[8],
                    pkk_ha: value[9],
                    rpc: value[10],
                    kebun_: value[11], 
                    r: value[12],
                    warna: value[13],
                    bulan: selectedMonth.value,
                    tahun: selectedYear.value
                }))
            );
        }
    }, [values, selectedMonth, selectedYear]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleUploadKuadran = async (mappedData, apiUrl, setIsLoadingUpload, setProgressValue, setIsUploadingDone) => {
        setIsLoadingUpload(true);

        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        try {
            const chunkSize = 1500;
            for (let i = 0; i < Math.ceil(mappedData.length / chunkSize); i++) {
                const res = await fetch(`${apiUrl}/kuadran/upload`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenData.payload.access_token}`,
                    },
                    body: JSON.stringify({
                        mappedData: mappedData.slice(i * chunkSize, (i + 1) * chunkSize),
                    }),
                });

                const data = await res.json();

                if (data.status_code === 200) {
                    toast.success(data.message);

                    const progressPercent = ((i + 1) * 100) / Math.ceil(mappedData.length / chunkSize);
                    setProgressValue(progressPercent);

                    if (i === Math.ceil(mappedData.length / chunkSize) - 1) {
                        setIsUploadingDone(true);
                        if (isUploadingDone) {
                            toast.success("Upload data berhasil! batch " + (i + 1));
                            setTimeout(() => {
                                router.push("/admin/kebun");
                            }, 2000);
                        }
                    }
                } else {
                    toast.error("Oops gagal, periksa kembali data!");
                    setIsLoadingUpload(false);
                    return;
                }
            }

            setIsLoadingUpload(false);
            setProgressValue(100);
            setTimeout(() => {
                setIsUploadingDone(false);
                setProgressValue(2);
            }, 3000);
        } catch (error) {
            console.error(error);
            setIsLoadingUpload(false);
            toast.error("Oops terjadi kesalahan, periksa koneksi dan coba lagi!");
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <div className="flex items-end justify-end gap-3 mb-5 mt-5">
                <a
                    href="/assets/uploads/Template GL perbulan.xlsx"
                    className="disabled:cursor-not-allowed px-5 py-[.675rem] text-sm font-semibold text-center text-white transition duration-300 ease-in-out bg-green-600 rounded-full cursor-pointer hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 flex justify-center space-x-4">
                    Download Template
                    <FaFileExcel className="ml-2 w-5 h-5" />
                </a>
            </div>

            <div className="flex items-center justify-center gap-3 mb-5 mt-5">
                <Select
                    options={months}
                    value={selectedMonth}
                    onChange={(option) => setSelectedMonth(option)}
                    placeholder="Pilih Bulan"
                />
                <Select
                    options={years}
                    value={selectedYear}
                    onChange={(option) => setSelectedYear(option)}
                    placeholder="Pilih Tahun"
                />
            </div>

            <div
                className="flex items-center justify-center w-full"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer" htmlFor="fileInput" onClick={handleButtonClick}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        {fileName ? (
                            <div className="flex items-center mb-2">
                                <p className="text-sm text-gray-500 ">{fileName}</p>
                                <BsTrash
                                    className="ml-2 text-red-500 cursor-pointer"
                                    onClick={handleRemoveFile}
                                />
                            </div>
                        ) : !fileName && loading ? (
                            "Loading..."
                        ) : (
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                    Klik untuk upload file .csv atau .xlsx
                                </span>{" "}
                                atau drag and drop
                            </p>
                        )}
                    </div>

                    <input
                        type="file"
                        id="fileInput" // Add id attribute to match the htmlFor attribute of the label
                        name="file"
                        onChange={handleFileChange}
                        accept=".csv, .xlsx"
                        className="hidden"
                        disabled={
                            isLoadingUpload
                        }
                    />
                </label>
            </div>
            <div className="flex items-center justify-end gap-3 mt-5">
                {isLoadingUpload ? (
                    <div className="w-1/6 bg-gray-200 rounded-full h-2.5 ">
                        <div
                            className="bg-green-600 transition ease-in-out h-2.5 rounded-full animate-blink"
                            style={{ width: `${progressValue}%` }}
                        ></div>
                    </div>
                ) : null}

                {isUploadingDone ? (
                    <BsFillCheckCircleFill className="text-green-600 w-7 h-7" />
                ) : null}

                {!isLoadingUpload ? (
                    <button
                        onClick={() => handleUploadKuadran(mappedData, apiUrl, setIsLoadingUpload, setProgressValue, setIsUploadingDone)}
                        disabled={
                            !fileName ||
                            isLoadingUpload ||
                            !selectedMonth ||
                            !selectedYear
                        }
                        className="disabled:cursor-not-allowed px-5 py-[.675rem] text-sm font-semibold text-center text-white transition duration-300 ease-in-out bg-green-600 rounded-full cursor-pointer hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                        Upload File
                    </button>
                ) : null}
            </div>
            <br />
            <br />
        </div>
    );
};

export default UploadIplFile;
