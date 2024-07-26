"use client";
import React, { useState, useEffect, useRef, useId } from "react";
import cookie from "js-cookie";
import Papa from "papaparse";
import { BsFillCheckCircleFill, BsTrash } from "react-icons/bs";
import readXlsxFile, { Row } from "read-excel-file";
import { FaFileExcel } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isWindowAvailable } from "utils/navigation";
import slugify from 'slugify';

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;

const UploadIplFile: React.FC = (): JSX.Element => {
    const router = useRouter();

    if (isWindowAvailable()) document.title = "Upload File Karyawan - Admin";

    const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
    const [isUploadingDone, setIsUploadingDone] = useState<boolean>(false);
    const [progressValue, setProgressValue] = useState(0);
    const [parsedData, setParsedData] = useState<Row[]>([]);
    const [tableRows, setTableRows] = useState<string[]>([]);
    const [mappedData, setMappedData] = useState<any[]>([]);
    const [values, setValues] = useState<string[][]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const instanceId = useId();

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm();

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

                    results.data.forEach((d: any) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                    });

                    setParsedData(results.data as Row[]);
                    setTableRows(rowsArray[0]);
                    setValues(valuesArray.slice(1));
                    setFileName(file.name);
                    setLoading(false);
                },
            });
        } else if (fileExtension === "xlsx") {
            try {
                const results: Row[] = await readXlsxFile(file);
                const rowsArray: string[][] = [];
                const valuesArray: string[][] = [];

                results.forEach((row: Row) => {
                    const rowValues = row.map((cell: any) => cell !== null ? cell.toString() : "");
                    rowsArray.push(rowValues);
                    valuesArray.push(rowValues);
                });

                setParsedData(results);
                setTableRows(rowsArray[0]);
                setValues(valuesArray.slice(1));
                setFileName(file.name);
                setLoading(false);
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
        if (values.length > 0) {
            const mapped = values.map((value) => ({
                w1: { label: value[1], value: slugify(value[1], { lower: true }) },
                w2: { label: value[2], value: slugify(value[2], { lower: true }) },
                w3: { label: value[3], value: slugify(value[3], { lower: true }) },
                w4: { label: value[4], value: slugify(value[4] ?? "", { lower: true }) },
                w5: { label: value[5], value: slugify(value[5] ?? "", { lower: true }) },
                measurement: value[6]
            }));

            setMappedData(mapped);
            console.log(mapped); // Log mappedData here
        }
    }, [values]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fileInputRef = useRef<HTMLInputElement>(null);


    
    const handleUpload = async (): Promise<void> => {
        setIsLoadingUpload(true);
 
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");


        const chunkSize = Math.ceil(mappedData.length / 10);
        const uploadPromises = [];
        
        for (let i = 0; i < 10; i++) {
            const chunk = mappedData.slice(i * chunkSize, (i + 1) * chunkSize);
            uploadPromises.push(
                fetch(`${apiUrl}/why/upload`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenData.payload.access_token}`,
                    },
                    body: JSON.stringify({
                        mappedData: chunk
                    }),
                }).then((res) => res.json())
            );
        }

        const results = await Promise.all(uploadPromises);

        const allSuccessful = results.every(result => result.status_code === 200);

        const totalBatches = 10;
        for (let i = 0; i < totalBatches; i++) {
            const progressPercent = ((i + 1) * 100) / totalBatches;
            setProgressValue(progressPercent);
            await new Promise((resolve) => setTimeout(resolve, 10));
        }

        if (allSuccessful) {
            setIsUploadingDone(true);
        } else {
            toast.error("Some chunks failed to upload!");
        }

        setIsLoadingUpload(false);
        setTimeout(() => {
            setIsUploadingDone(false);
            setProgressValue(0);
        }, 3000);

    };


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
                        id="fileInput"
                        name="file"
                        onChange={handleFileChange}
                        accept=".csv, .xlsx"
                        className="hidden"
                        disabled={isLoadingUpload}
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
                        onClick={() => handleUpload()}
                        disabled={!fileName || isLoadingUpload}
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
