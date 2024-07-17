"use client";
import React, { useState, useEffect, useId } from "react";
import cookie from "js-cookie";
import Papa from "papaparse";
import { BsFillCheckCircleFill, BsTrash } from "react-icons/bs";
import readXlsxFile, { Row } from "read-excel-file";
import Select from "react-select";
import { FaFileExcel } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
    r: string;
    warna: string;
    bulan: string;
    tahun: number;
    report_id?: number;
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
    const [reportId, setReportId] = useState<number | null>(null);
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
                    r: value[11],
                    warna: value[12],
                    report_id: reportId,
                    bulan: selectedMonth.value,
                    tahun: selectedYear.value
                }))
            );
        }
    }, [values, selectedMonth, selectedYear]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [kebunCounts, setKebunCounts] = useState<{ [kebun: string]: any }>({});

    useEffect(() => {
        const newKebunCounts: { [kebun: string]: any } = {};

        mappedData.forEach((item) => {
            if (!newKebunCounts[item.kebun]) {
                newKebunCounts[item.kebun] = {
                    colorCounts: { HIJAU: 0, HITAM: 0, EMAS: 0, MERAH: 0, KUNING: 0 },
                    statusUmurCounts: { Renta: 0, Tua: 0, Dewasa: 0, Remaja: 0, Muda: 0 },
                    ageColorCounts: {
                        renta_hitam: 0,
                        renta_merah: 0,
                        renta_kuning: 0,
                        renta_hijau: 0,
                        tua_hitam: 0,
                        tua_merah: 0,
                        tua_kuning: 0,
                        tua_hijau: 0,
                        dewasa_hitam: 0,
                        dewasa_merah: 0,
                        dewasa_kuning: 0,
                        dewasa_hijau: 0,
                        remaja_hitam: 0,
                        remaja_merah: 0,
                        remaja_kuning: 0,
                        remaja_hijau: 0,
                        muda_hitam: 0,
                        muda_merah: 0,
                        muda_kuning: 0,
                        muda_hijau: 0
                    }
                };
            }

            const kebunData = newKebunCounts[item.kebun];

            const color = item.warna.toUpperCase();
            if (kebunData.colorCounts[color] !== undefined) {
                kebunData.colorCounts[color]++;
            }

            const status = item.status_umur.toUpperCase();
            if (kebunData.statusUmurCounts[status] !== undefined) {
                kebunData.statusUmurCounts[status]++;
            }

            const ageColorKey = `${item.status_umur.toLowerCase()}_${item.warna.toLowerCase()}`;
            if (kebunData.ageColorCounts[ageColorKey] !== undefined) {
                kebunData.ageColorCounts[ageColorKey]++;
            }
        });

        setKebunCounts(newKebunCounts);
    }, [mappedData]);

    const handleUpload = async (): Promise<void> => {
        const token = cookie.get("token");
        if (!token) {
            router.push("/login");
            return;
        }

        if (!selectedMonth || !selectedYear) {
            toast.error("Please select a month and year before uploading.");
            return;
        }

        setIsLoadingUpload(true);
        setProgressValue(0);

        try {
            const response = await fetch(`${apiUrl}/api/ipl/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: mappedData,
                }),
            });

            if (response.ok) {
                setIsUploadingDone(true);
                toast.success("Upload successful!");
            } else {
                toast.error("Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during upload.");
        } finally {
            setIsLoadingUpload(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Upload File Kuadran</h1>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Select Month
                </label>
                <Select
                    instanceId={instanceId}
                    options={months}
                    value={selectedMonth}
                    onChange={(option) => setSelectedMonth(option)}
                    placeholder="Select month"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Select Year
                </label>
                <Select
                    instanceId={instanceId}
                    options={years}
                    value={selectedYear}
                    onChange={(option) => setSelectedYear(option)}
                    placeholder="Select year"
                />
            </div>

            <div
                className={`mb-4 border-2 border-dashed p-4 rounded ${
                    loading ? "border-gray-300" : "border-gray-600"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".csv, .xlsx"
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center h-32 cursor-pointer"
                >
                    {loading ? (
                        <div className="loader"></div>
                    ) : (
                        <div>
                            <FaFileExcel className="text-6xl mb-2 text-gray-500" />
                            <p className="text-gray-500">
                                {fileName || "Drag and drop a file here, or click to select a file"}
                            </p>
                        </div>
                    )}
                </label>
            </div>

            {fileName && (
                <div className="mb-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleRemoveFile}
                    >
                        Remove File
                    </button>
                </div>
            )}

            {isUploadingDone ? (
                <div className="mb-4 text-green-500">Upload completed!</div>
            ) : (
                <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${
                        isLoadingUpload ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleUpload}
                    disabled={isLoadingUpload}
                >
                    Upload
                </button>
            )}

            {isLoadingUpload && (
                <div className="my-4">
                    <p>Uploading... {progressValue}%</p>
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div
                                style={{ width: `${progressValue}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                {Object.keys(kebunCounts).length > 0 ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Ringkasan Data Per Kebun</h2>
                        {Object.keys(kebunCounts).map((kebun, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="text-lg font-bold mb-2">{kebun}</h3>
                                <div>
                                    <h4 className="font-bold">Kombinasi Warna:</h4>
                                    <ul>
                                        {Object.entries(kebunCounts[kebun].colorCounts).map(([color, count]) => (
                                            <li key={color}>{color}: {count}</li>
                                        ))}
                                    </ul>
                                    <h4 className="font-bold">Status Umur:</h4>
                                    <ul>
                                        {Object.entries(kebunCounts[kebun].statusUmurCounts).map(([status, count]) => (
                                            <li key={status}>{status}: {count}</li>
                                        ))}
                                    </ul>
                                    <h4 className="font-bold">Kombinasi Warna dan Status Umur:</h4>
                                    <ul>
                                        {Object.entries(kebunCounts[kebun].ageColorCounts).map(([combination, count]) => (
                                            <li key={combination}>{combination}: {count}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No data available.</p>
                )}
            </div>
        </div>
    );
};

export default UploadIplFile;
