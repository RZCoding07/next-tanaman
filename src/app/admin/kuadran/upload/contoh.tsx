"use client";
import React, { useState, useEffect, useRef, useId } from "react";
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


    const [colorCounts, setColorCounts] = useState({
        HIJAU: 0,
        HITAM: 0,
        EMAS: 0,
        MERAH: 0,
        KUNING: 0,
    });

    const [statusUmurCounts, setStatusUmurCounts] = useState({
        Renta: 0,
        Tua: 0,
        Dewasa: 0,
        Remaja: 0,
        Muda: 0,
    });

    const [ageColorCounts, setAgeColorCounts] = useState({
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
    });

    useEffect(() => {
        const colorCounts = { HIJAU: 0, HITAM: 0, EMAS: 0, MERAH: 0, KUNING: 0 };
        const statusUmurCounts = { Renta: 0, Tua: 0, Dewasa: 0, Remaja: 0, Muda: 0 };
        const ageColorCounts = {
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
        };

        mappedData.forEach((item) => {
            const color = item.warna.toUpperCase();
            if (colorCounts[color] !== undefined) {
                colorCounts[color]++;
            }

            const status = item.status_umur.toUpperCase();
            if (statusUmurCounts[status] !== undefined) {
                statusUmurCounts[status]++;
            }

            const ageColorKey = `${item.status_umur.toLowerCase()}_${item.warna.toLowerCase()}`;
            if (ageColorCounts[ageColorKey] !== undefined) {
                ageColorCounts[ageColorKey]++;
            }
        });

        setColorCounts(colorCounts);
        setStatusUmurCounts(statusUmurCounts);
        setAgeColorCounts(ageColorCounts);
    }, [mappedData]);

    const handleUploadData = async () => {
        const token = cookie.get("token");

        if (!mappedData.length) {
            toast.error("Please upload a file first.");
            return;
        }

        setIsLoadingUpload(true);
        try {
            const response = await fetch(`${apiUrl}/upload-endpoint`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: mappedData, report_id: reportId }),
            });

            if (response.ok) {
                toast.success("Data uploaded successfully!");
                setIsUploadingDone(true);
                router.push("/admin/upload-success");
            } else {
                const errorData = await response.json();
                toast.error(`Upload failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during the upload.");
        } finally {
            setIsLoadingUpload(false);
        }
    };

    return (
        <div className="upload-ipl-file">
            <h1>Upload File Kuadran</h1>
            <form onSubmit={handleSubmit(handleUploadData)}>
                <div className="file-input">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <FaFileExcel /> {fileName ? fileName : "Choose a file"}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <div className="file-dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
                        Drag and drop a file here, or click to select a file
                    </div>
                    {fileName && (
                        <div className="file-actions">
                            <button type="button" onClick={handleRemoveFile}>
                                <BsTrash /> Remove
                            </button>
                        </div>
                    )}
                </div>

                <div className="select-month-year">
                    <Select
                        id={`${instanceId}-month`}
                        instanceId={`${instanceId}-month`}
                        options={months}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        placeholder="Select month"
                    />
                    <Select
                        id={`${instanceId}-year`}
                        instanceId={`${instanceId}-year`}
                        options={years}
                        value={selectedYear}
                        onChange={setSelectedYear}
                        placeholder="Select year"
                    />
                </div>

                <button
                    type="submit"
                    className={`upload-button ${isLoadingUpload ? "loading" : ""}`}
                    disabled={isLoadingUpload}
                >
                    {isLoadingUpload ? "Uploading..." : "Upload"}
                </button>
            </form>

            <div className="upload-summary">
                <h2>Upload Summary</h2>
                <div className="summary-item">
                    <span>HIJAU:</span> <span>{colorCounts.HIJAU}</span>
                </div>
                <div className="summary-item">
                    <span>HITAM:</span> <span>{colorCounts.HITAM}</span>
                </div>
                <div className="summary-item">
                    <span>EMAS:</span> <span>{colorCounts.EMAS}</span>
                </div>
                <div className="summary-item">
                    <span>MERAH:</span> <span>{colorCounts.MERAH}</span>
                </div>
                <div className="summary-item">
                    <span>KUNING:</span> <span>{colorCounts.KUNING}</span>
                </div>

                <h2>Status Umur Summary</h2>
                <div className="summary-item">
                    <span>Renta:</span> <span>{statusUmurCounts.Renta}</span>
                </div>
                <div className="summary-item">
                    <span>Tua:</span> <span>{statusUmurCounts.Tua}</span>
                </div>
                <div className="summary-item">
                    <span>Dewasa:</span> <span>{statusUmurCounts.Dewasa}</span>
                </div>
                <div className="summary-item">
                    <span>Remaja:</span> <span>{statusUmurCounts.Remaja}</span>
                </div>
                <div className="summary-item">
                    <span>Muda:</span> <span>{statusUmurCounts.Muda}</span>
                </div>

                <h2>Age and Color Combination Summary</h2>
                {Object.entries(ageColorCounts).map(([key, count]) => (
                    <div className="summary-item" key={key}>
                        <span>{key.replace("_", " ").toUpperCase()}:</span> <span>{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadIplFile;
