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
import { Tokens } from "types/token";
import { useRouter } from "next/navigation";
import { isWindowAvailable } from "utils/navigation";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const UploadIplFile = () => {
    const router = useRouter();

    if (isWindowAvailable()) document.title = "Upload File Kuadran - Admin";

    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const [isUploadingDone, setIsUploadingDone] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [parsedData, setParsedData] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [values, setValues] = useState([]);
    const [fileName, setFileName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportId, setReportId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState()
    const [selectedYear, setSelectedYear] = useState()

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
    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            await parseFile(file);
        }
    };
    

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            await parseFile(file);
        }
    };

    const handleDragOver = () => {
        event.preventDefault();
    };

    const parseFile = async (file) => {
        setLoading(true);
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
        try {
            if (fileExtension === "csv") {
                Papa.parse(file, {
                    skipEmptyLines: true,
                    complete: (results) => {
                        const rowsArray = [];
                        const valuesArray = [];
    
                        results.data.map((d) => {
                            rowsArray.push(Object.keys(d));
                            valuesArray.push(Object.values(d));
                        });
    
                        setParsedData(results.data);
                        setTableRows(rowsArray[0]);
                        setValues(valuesArray.slice(1));
                        setFileName(file.name);
                    },
                });
            } else if (fileExtension === "xlsx") {
                const results = await readXlsxFile(file);
                const rowsArray = [];
                const valuesArray = [];
    
                results.forEach((row) => {
                    const rowValues = row.map((cell) =>
                        cell !== null ? cell.toString() : ""
                    );
                    rowsArray.push(rowValues);
                    valuesArray.push(rowValues);
                });
    
                setParsedData(results);
                setTableRows(rowsArray[0]);
                setValues(valuesArray.slice(1));
                setFileName(file.name);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = () => {
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
                    status_umur: value[1].charAt(0).toUpperCase() + value[1].slice(1).toLowerCase(),
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
                    warna: value[12].toUpperCase(),
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

    const [statusColorCounts, setStatusColorCounts] = useState({
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
        muda_hijau: 0,
    });

    useEffect(() => {
        const colorCounts = { HIJAU: 0, HITAM: 0, EMAS: 0, MERAH: 0, KUNING: 0 };
        const statusUmurCounts = { Renta: 0, Tua: 0, Dewasa: 0, Remaja: 0, Muda: 0 };
        const statusColorCounts = {
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
            muda_hijau: 0,
        };

        mappedData.forEach((item) => {
            const { warna, status_umur } = item;

            if (warna) {
                colorCounts[warna]++;
            }

            if (status_umur) {
                statusUmurCounts[status_umur]++;
            }

            if (status_umur && warna) {
                const key = `${status_umur.toLowerCase()}_${warna.toLowerCase()}`;
                if (statusColorCounts[key] !== undefined) {
                    statusColorCounts[key]++;
                }
            }
        });

        setColorCounts(colorCounts);
        setStatusUmurCounts(statusUmurCounts);
        setStatusColorCounts(statusColorCounts);
    }, [mappedData]);

    const [colorCountsKebun, setColorCountsKebun] = useState({});
    const [statusUmurCountsKebun, setStatusUmurCountsKebun] = useState({});

    useEffect(() => {
        const colorCountsKebun = {};
        const statusUmurCountsKebun = {};

        mappedData.forEach((item) => {
            const { warna, status_umur, kebun } = item;

            if (!colorCountsKebun[kebun]) {
                colorCountsKebun[kebun] = { HIJAU: 0, HITAM: 0, EMAS: 0, MERAH: 0, KUNING: 0 };
            }

            if (!statusUmurCountsKebun[kebun]) {
                statusUmurCountsKebun[kebun] = { Renta: 0, Tua: 0, Dewasa: 0, Remaja: 0, Muda: 0 };
            }

            if (warna) {
                colorCountsKebun[kebun][warna]++;
            }

            if (status_umur) {
                statusUmurCountsKebun[kebun][status_umur]++;
            }
        });

        setColorCountsKebun(colorCountsKebun);
        setStatusUmurCountsKebun(statusUmurCountsKebun);


    }
        , [mappedData]);


    const handleUploadKuadran = async () => {
        setIsLoadingUpload(true);

        try {
            const loginData = cookie.get("token");
            const tokenData = JSON.parse(loginData || "{}");

            const reportRes = await fetch(`${apiUrl}/report`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenData.payload.access_token}`,
                },
                body: JSON.stringify({
                    bulan: selectedMonth.value,
                    tahun: selectedYear.value,
                    renta: statusUmurCounts.Renta,
                    tua: statusUmurCounts.Tua,
                    dewasa: statusUmurCounts.Dewasa,
                    remaja: statusUmurCounts.Remaja,
                    muda: statusUmurCounts.Muda,
                    hitam: colorCounts.HITAM,
                    merah: colorCounts.MERAH,
                    kuning: colorCounts.KUNING,
                    hijau: colorCounts.HIJAU,
                    emas: colorCounts.EMAS,
                    renta_hitam: statusColorCounts.renta_hitam,
                    renta_merah: statusColorCounts.renta_merah,
                    renta_kuning: statusColorCounts.renta_kuning,
                    renta_hijau: statusColorCounts.renta_hijau,
                    tua_hitam: statusColorCounts.tua_hitam,
                    tua_merah: statusColorCounts.tua_merah,
                    tua_kuning: statusColorCounts.tua_kuning,
                    tua_hijau: statusColorCounts.tua_hijau,
                    dewasa_hitam: statusColorCounts.dewasa_hitam,
                    dewasa_merah: statusColorCounts.dewasa_merah,
                    dewasa_kuning: statusColorCounts.dewasa_kuning,
                    dewasa_hijau: statusColorCounts.dewasa_hijau,
                    remaja_hitam: statusColorCounts.remaja_hitam,
                    remaja_merah: statusColorCounts.remaja_merah,
                    remaja_kuning: statusColorCounts.remaja_kuning,
                    remaja_hijau: statusColorCounts.remaja_hijau,
                    muda_hitam: statusColorCounts.muda_hitam,
                    muda_merah: statusColorCounts.muda_merah,
                    muda_kuning: statusColorCounts.muda_kuning,
                    muda_hijau: statusColorCounts.muda_hijau,
                }),
            });

            const reportData = await reportRes.json();
            if (reportData.status_code === 200) {
                toast.success(`Laporan bulan ${selectedMonth.label} tahun ${selectedYear.value} berhasil dibuat!`);

                setReportId(reportData.payload.id);

                const mappedData = values.map((value) => ({
                    kondisi: value[0],
                    status_umur: value[1].charAt(0).toUpperCase() + value[1].slice(1).toLowerCase(),
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
                    warna: value[12].toUpperCase(),
                    bulan: selectedMonth.value,
                    tahun: selectedYear.value,
                    report_id: reportId || reportData.payload.id
                }));
                

                const chunkSize = Math.ceil(mappedData.length / 10);
                const uploadPromises = [];

                for (let i = 0; i < 10; i++) {
                    const chunk = mappedData.slice(i * chunkSize, (i + 1) * chunkSize);
                    uploadPromises.push(
                        fetch(`${apiUrl}/kuadran/upload`, {
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
                    await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async update for progress bar
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


                let mappedDataWarnaKebun = Object.keys(colorCountsKebun).map((key) => ({
                    kebun: key,
                    hijau: colorCountsKebun[key].HIJAU,
                    hitam: colorCountsKebun[key].HITAM,
                    emas: colorCountsKebun[key].EMAS,
                    merah: colorCountsKebun[key].MERAH,
                    kuning: colorCountsKebun[key].KUNING,
                    report_id: reportId || reportData.payload.id
                }))

                let mappedDataStatusUmurKebun = Object.keys(statusUmurCountsKebun).map((key) => ({
                    kebun: key,
                    renta: statusUmurCountsKebun[key].Renta,
                    tua: statusUmurCountsKebun[key].Tua,
                    dewasa: statusUmurCountsKebun[key].Dewasa,
                    remaja: statusUmurCountsKebun[key].Remaja,
                    muda: statusUmurCountsKebun[key].Muda,
                    report_id: reportId || reportData.payload.id
                })

                )

                const chunkWarnaKebun = Math.ceil(mappedDataWarnaKebun.length / 10);
                const chunkStatusUmurKebun = Math.ceil(mappedDataStatusUmurKebun.length / 10);

                const uploadPromisesWarnaKebun = [];
                const uploadPromisesStatusUmurKebun = [];

                for (let i = 0; i < 10; i++) {
                    const chunk = mappedDataWarnaKebun.slice(i * chunkWarnaKebun, (i + 1) * chunkWarnaKebun);
                    uploadPromisesWarnaKebun.push(
                        fetch(`${apiUrl}/warnakebun/upload`, {
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

                for (let i = 0; i < 10; i++) {
                    const chunk = mappedDataStatusUmurKebun.slice(i * chunkStatusUmurKebun, (i + 1) * chunkStatusUmurKebun);
                    uploadPromisesStatusUmurKebun.push(
                        fetch(`${apiUrl}/umurkebun/upload`, {
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

                const resultsWarnaKebun = await Promise.all(uploadPromisesWarnaKebun);
                const resultsStatusUmurKebun = await Promise.all(uploadPromisesStatusUmurKebun);

                const allSuccessfulWarnaKebun = resultsWarnaKebun.every(result => result.status_code === 200);
                const allSuccessfulStatusUmurKebun = resultsStatusUmurKebun.every(result => result.status_code === 200);

                const totalBatchesWarnaKebun = 10;
                const totalBatchesStatusUmurKebun = 10;

                for (let i = 0; i < totalBatchesWarnaKebun; i++) {
                    const progressPercent = ((i + 1) * 100) / totalBatchesWarnaKebun;
                    setProgressValue(progressPercent);
                    await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async update for progress bar
                }

                for (let i = 0; i < totalBatchesStatusUmurKebun; i++) {
                    const progressPercent = ((i + 1) * 100) / totalBatchesStatusUmurKebun;
                    setProgressValue(progressPercent);
                    await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async update for progress bar
                }

                if (allSuccessfulStatusUmurKebun) {
                    toast.success("All data uploaded successfully!");
                } else {
                    toast.error("Some chunks failed to upload!");
                }




            } else {
                toast.error("Gagal membuat laporan!");
            }


        } catch (error) {
            console.error('Error in handleUploadKuadran:', error); // Log detailed error
            setIsLoadingUpload(false);
            toast.error("Oops terjadi kesalahan, periksa koneksi dan coba lagi!");
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
                <label
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
                    htmlFor="fileInput"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            aria-hidden="true"
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
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
                        onClick={() => handleUploadKuadran()}
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
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Summary</h2>
                <div>
                    <h3 className="text-lg font-semibold">Color Counts per Kebun</h3>
                    <table className="table-auto w-full border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Kebun</th>
                                <th className="border border-gray-300 px-4 py-2">HIJAU</th>
                                <th className="border border-gray-300 px-4 py-2">HITAM</th>
                                <th className="border border-gray-300 px-4 py-2">EMAS</th>
                                <th className="border border-gray-300 px-4 py-2">MERAH</th>
                                <th className="border border-gray-300 px-4 py-2">KUNING</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(colorCountsKebun).map((kebun) => (
                                <tr key={kebun}>
                                    <td className="border border-gray-300 px-4 py-2">{kebun}</td>
                                    <td className="border border-gray-300 px-4 py-2">{colorCountsKebun[kebun].HIJAU}</td>
                                    <td className="border border-gray-300 px-4 py-2">{colorCountsKebun[kebun].HITAM}</td>
                                    <td className="border border-gray-300 px-4 py-2">{colorCountsKebun[kebun].EMAS}</td>
                                    <td className="border border-gray-300 px-4 py-2">{colorCountsKebun[kebun].MERAH}</td>
                                    <td className="border border-gray-300 px-4 py-2">{colorCountsKebun[kebun].KUNING}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Status Umur Counts per Kebun</h3>
                    <table className="table-auto w-full border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Kebun</th>
                                <th className="border border-gray-300 px-4 py-2">Renta</th>
                                <th className="border border-gray-300 px-4 py-2">Tua</th>
                                <th className="border border-gray-300 px-4 py-2">Dewasa</th>
                                <th className="border border-gray-300 px-4 py-2">Remaja</th>
                                <th className="border border-gray-300 px-4 py-2">Muda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(statusUmurCountsKebun).map((kebun) => (
                                <tr key={kebun}>
                                    <td className="border border-gray-300 px-4 py-2">{kebun}</td>
                                    <td className="border border-gray-300 px-4 py-2">{statusUmurCountsKebun[kebun].Renta}</td>
                                    <td className="border border-gray-300 px-4 py-2">{statusUmurCountsKebun[kebun].Tua}</td>
                                    <td className="border border-gray-300 px-4 py-2">{statusUmurCountsKebun[kebun].Dewasa}</td>
                                    <td className="border border-gray-300 px-4 py-2">{statusUmurCountsKebun[kebun].Remaja}</td>
                                    <td className="border border-gray-300 px-4 py-2">{statusUmurCountsKebun[kebun].Muda}</td>
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
