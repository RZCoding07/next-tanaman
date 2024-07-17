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
                    bulan: selectedMonth.value,
                    tahun: selectedYear.value
                }))
            );
        }
    }, [values, selectedMonth, selectedYear]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [colorCounts, setColorCounts] = useState<{
        [kebun: string]: {
            HIJAU: number;
            HITAM: number;
            EMAS: number;
            MERAH: number;
            KUNING: number;
        };
    }>({});

    const [statusUmurCounts, setStatusUmurCounts] = useState<{
        [kebun: string]: {
            Renta: number;
            Tua: number;
            Dewasa: number;
            Remaja: number;
            Muda: number;
        };
    }>({});

    useEffect(() => {
        const colorCounts: { [kebun: string]: { [color: string]: number } } = {};
        const statusUmurCounts: { [kebun: string]: { [status: string]: number } } = {};

        mappedData.forEach((data) => {
            const { kebun, warna, status_umur } = data;
            if (!colorCounts[kebun]) {
                colorCounts[kebun] = { HIJAU: 0, HITAM: 0, EMAS: 0, MERAH: 0, KUNING: 0 };
            }
            if (!statusUmurCounts[kebun]) {
                statusUmurCounts[kebun] = { Renta: 0, Tua: 0, Dewasa: 0, Remaja: 0, Muda: 0 };
            }
            colorCounts[kebun][warna] = (colorCounts[kebun][warna] || 0) + 1;
            statusUmurCounts[kebun][status_umur] = (statusUmurCounts[kebun][status_umur] || 0) + 1;
        });

        setColorCounts(colorCounts);
        setStatusUmurCounts(statusUmurCounts);
    }, [mappedData]);

    const handleUploadKuadran = async (
        mappedData,
        apiUrl,
        setIsLoadingUpload,
        setProgressValue,
        setIsUploadingDone,
        selectedMonth,
        selectedYear
      ) => {
        setIsLoadingUpload(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");
        const chunkSize = Math.ceil(mappedData.length / 10);
        const uploadPromises = [];

        for (let i = 0; i < mappedData.length; i += chunkSize) {
          const chunk = mappedData.slice(i, i + chunkSize);
          uploadPromises.push(
            fetch(`${apiUrl}/api/kuadran`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokenData.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(chunk),
            }).then(response => {
              if (!response.ok) {
                throw new Error("Upload failed");
              }
            })
          );
        }

        let completedUploads = 0;
        for (const uploadPromise of uploadPromises) {
          try {
            await uploadPromise;
            completedUploads++;
            setProgressValue((completedUploads / uploadPromises.length) * 100);
          } catch (error) {
            toast.error("Upload failed. Please try again.");
            setIsLoadingUpload(false);
            return;
          }
        }

        setIsLoadingUpload(false);
        setIsUploadingDone(true);
        toast.success("Upload successful!");
      };

    const onSubmit = () => {
        handleUploadKuadran(
            mappedData,
            apiUrl,
            setIsLoadingUpload,
            setProgressValue,
            setIsUploadingDone,
            selectedMonth,
            selectedYear
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">Upload File Kuadran</div>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    onClick={() => router.push("/admin/reports")}
                >
                    <BsTrash />
                    Delete All Reports
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fileInput" className="block font-medium mb-1">
                            Upload File:
                        </label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border border-dashed border-gray-400 p-4 rounded-md text-center cursor-pointer"
                        >
                            {fileName ? (
                                <div>
                                    <FaFileExcel className="text-4xl mx-auto mb-2" />
                                    <p>{fileName}</p>
                                </div>
                            ) : (
                                <div>
                                    <FaFileExcel className="text-4xl mx-auto mb-2" />
                                    <p>Drag and drop a file here, or click to select a file</p>
                                </div>
                            )}
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".csv,.xlsx"
                            />
                        </div>
                        {fileName && (
                            <button
                                type="button"
                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                                onClick={handleRemoveFile}
                            >
                                <BsTrash />
                                Remove File
                            </button>
                        )}
                    </div>
                    <div>
                        <label htmlFor="monthSelect" className="block font-medium mb-1">
                            Select Month:
                        </label>
                        <Select
                            id="monthSelect"
                            options={months}
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                            placeholder="Select Month"
                        />
                        <label htmlFor="yearSelect" className="block font-medium mb-1 mt-4">
                            Select Year:
                        </label>
                        <Select
                            id="yearSelect"
                            options={years}
                            value={selectedYear}
                            onChange={setSelectedYear}
                            placeholder="Select Year"
                        />
                    </div>
                </div>
                {loading && (
                    <div className="mt-4">
                        <div className="flex items-center">
                            <div className="mr-2">Loading file...</div>
                            <div className="loader"></div>
                        </div>
                    </div>
                )}
                <div className="mt-4">
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isSubmitting}
                    >
                        Upload
                    </button>
                </div>
                {isLoadingUpload && (
                    <div className="mt-4">
                        <div className="flex items-center">
                            <div className="mr-2">Uploading...</div>
                            <div className="loader"></div>
                        </div>
                        <progress value={progressValue} max="100" className="w-full"></progress>
                    </div>
                )}
                {isUploadingDone && (
                    <div className="mt-4 text-green-500">Upload complete!</div>
                )}
            </form>
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <div>
                    <h3 className="text-lg font-semibold">Color Counts per Kebun</h3>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th>Kebun</th>
                                <th>HIJAU</th>
                                <th>HITAM</th>
                                <th>EMAS</th>
                                <th>MERAH</th>
                                <th>KUNING</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(colorCounts).map((kebun) => (
                                <tr key={kebun}>
                                    <td>{kebun}</td>
                                    <td>{colorCounts[kebun].HIJAU}</td>
                                    <td>{colorCounts[kebun].HITAM}</td>
                                    <td>{colorCounts[kebun].EMAS}</td>
                                    <td>{colorCounts[kebun].MERAH}</td>
                                    <td>{colorCounts[kebun].KUNING}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Status Umur Counts per Kebun</h3>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th>Kebun</th>
                                <th>Renta</th>
                                <th>Tua</th>
                                <th>Dewasa</th>
                                <th>Remaja</th>
                                <th>Muda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(statusUmurCounts).map((kebun) => (
                                <tr key={kebun}>
                                    <td>{kebun}</td>
                                    <td>{statusUmurCounts[kebun].Renta}</td>
                                    <td>{statusUmurCounts[kebun].Tua}</td>
                                    <td>{statusUmurCounts[kebun].Dewasa}</td>
                                    <td>{statusUmurCounts[kebun].Remaja}</td>
                                    <td>{statusUmurCounts[kebun].Muda}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UploadIplFile;