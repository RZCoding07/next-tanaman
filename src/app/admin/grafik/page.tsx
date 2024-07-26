'use client';
import axios from "axios";

import cookie from "js-cookie";
import { ReportType } from "types/report";
import React, { useEffect, useRef, useId, useState, useCallback } from "react";
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';
import { FaUserGroup } from "react-icons/fa6";
import { useController, useForm } from "react-hook-form";
import Select from 'react-select';
import * as echarts from 'echarts';

import NavLink from "components/link/NavLink";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { isWindowAvailable } from "utils/navigation";

const Dashboard = () => {
const Dashboard = () => {

    // Function to generate random number within a range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const chartRef = useRef<HTMLDivElement>(null);

    const [darkmode, setDarkmode] = React.useState(
        document.body.classList.contains('dark')
    );


    // Toggle dark mode
    const handleDarkmode = useCallback(() => {
        setDarkmode(prevDarkmode => {
            const newDarkmode = !prevDarkmode;
            document.body.classList.toggle('dark', newDarkmode);
            return newDarkmode;
        });
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark', darkmode);
    }, [darkmode]);


    useEffect(() => {

        if (chartRef.current) {
            const chartDom = chartRef.current;
            const myChart = echarts.init(chartDom);
            let option: echarts.EChartsOption;

            // Function to generate random number within a range
            function getRandomNumber(min: number, max: number): number {
                return Math.random() * (max - min) + min;
            }

            // Example data with random values
            const data = [
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS A', 'Manajer A'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS B', 'Manajer B'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS C', 'Manajer C'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS D', 'Manajer D'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS A', 'Manajer A'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS B', 'Manajer B'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS C', 'Manajer C'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS D', 'Manajer D'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS E', 'Manajer E'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS F', 'Manajer F'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS G', 'Manajer G'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS H', 'Manajer H'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS I', 'Manajer I'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS E', 'Manajer E'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS F', 'Manajer F'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS G', 'Manajer G'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS H', 'Manajer H'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS I', 'Manajer I'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS J', 'Manajer J'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS K', 'Manajer K'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS J', 'Manajer J'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS K', 'Manajer K'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS M', 'Manajer M'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS N', 'Manajer N'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS M', 'Manajer M'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS N', 'Manajer N'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS P', 'Manajer P'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS R', 'Manajer R'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS P', 'Manajer P'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS R', 'Manajer R'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS T', 'Manajer T'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS T', 'Manajer T'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS V', 'Manajer V'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS V', 'Manajer V'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS X', 'Manajer X'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS X', 'Manajer X'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS Z', 'Manajer Z'] }
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS Z', 'Manajer Z'] }
            ];

            // Function to find the maximum values for x and y axes
            function getMaxValues(data: any[]): { maxX: number, maxY: number } {
                let maxX = 0;
                let maxY = 0;
                data.forEach(item => {
                    const xValue = item.value[0];
                    const yValue = item.value[1];
                    if (xValue > maxX) {
                        maxX = xValue;
                    }
                    if (yValue > maxY) {
                        maxY = yValue;
                    }
                });
                return { maxX, maxY };
            }

            // Calculate the maximum values for x and y axes
            const { maxX, maxY } = getMaxValues(data);
            console.log('maxX:', maxX);
            console.log('maxY:', maxY);

            const centerCoord = [3, 2500];

            // Define markArea based on the calculated maximum values
            const markArea: any[] = [
                // First quadrant
                [{
                    coord: [centerCoord[0], centerCoord[1]], //x0, y0
                    itemStyle: { color: 'orange', opacity: 0.3 }
                }, {
                    coord: [maxX + 1, maxY + 1000], // Top-right corner
                }],
                // Second quadrant
                [{
                    coord: [0, maxY + 1000], // Top-right corner
                    itemStyle: { color: 'red', opacity: 0.3 }
                }, {
                    coord: [centerCoord[0], centerCoord[1]], //x0, y0
                }],
                // Third quadrant
                [{
                    coord: [centerCoord[0], centerCoord[1]], //x0, y0
                    itemStyle: { color: 'yellow', opacity: 0.3 }
                }, {
                    coord: [1, 0], // Top-right corner
                }],
                // Fourth quadrant
                [{
                    coord: [centerCoord[0], centerCoord[1]], //x0, y0
                    itemStyle: { color: 'green', opacity: 0.3 }
                }, {
                    coord: [maxX + 1, 0], // Top-right corner
                }]
            ];

            option = {
                title: [{
                    text: 'Empat Kuadran Korelasi PICA vs Cash Cost',
                    left: 'center',
                    top: '1%',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'gray'
                    },
                }],
                xAxis: {
                    name: 'PICA',
                    nameLocation: 'middle',
                    nameGap: 30,
                    nameTextStyle: {
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'gray'
                    },
                    splitLine: { show: true },
                    type: 'value',
                    scale: true
                },
                yAxis: {
                    name: 'CASH COST',
                    nameLocation: 'middle',
                    nameGap: 30,
                    nameTextStyle: {
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'gray'
                    },
                    splitLine: { show: true },
                    type: 'value',
                    scale: true
                },
                series: [{
                    symbolSize: 20,
                    data: data.map(item => ({
                        value: item.value,
                        label: { show: true, formatter: '{@[2]} - {@[3]}' }
                    })),
                    type: 'scatter',
                    markArea: {
                        data: markArea
                    }
                }],
                tooltip: {
                    formatter: function (params) {
                        if (params.value && params.value.length >= 2) {
                            return `PICA: ${params.value[0]}<br>CASH COST: ${params.value[1]}`;
                        }
                        return '';
                    }
                }
            };

            myChart.setOption(option);

        }
    }, []);


    if (isWindowAvailable()) {
        document.title = 'Dashboard';
        document.title = 'Dashboard';
    }


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#F9FAFB', // bg-gray-50
            borderColor: state.isFocused ? '#38A169' : '#38A169', // border-green-600
            color: '#1A202C', // text-gray-900
            borderRadius: '100px', // rounded-full
            paddingLeft: '2.5rem', // pl-10
            padding: '0.1rem', // p-2.5
            boxShadow: state.isFocused ? '0 0 0 2px rgba(56, 161, 105, 0.5)' : null, // focus:ring-2 focus:ring-opacity-50
            '&:hover': {
                borderColor: '#38A169',
            },
            '&:active': {
                outline: 'none',
            },
            '&:focus': {
                outline: 'none',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#A0AEC0', // text-gray-500
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#1A202C', // text-gray-900
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

    const [filters, setFilters] = useState({
        selectedBulan: "",
        selectedTahun: "",
        selectedRpc: "",
        selectedKebun: "",
        selectedAfd: "",
    });
    const [filters, setFilters] = useState({
        selectedBulan: "",
        selectedTahun: "",
        selectedRpc: "",
        selectedKebun: "",
        selectedAfd: "",
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [dataAllReport, setDataAllReport] = useState<ReportType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [cursor, setCursor] = useState<number | null>(null);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [limitPerPage, setLimitPerPage] = useState<number>(10);
    const [isEndOfData, setIsEndOfData] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [tahunOptions, setTahunOptions] = useState<{ value: string; label: string }[]>([]);
    const [bulanOptions, setBulanOptions] = useState<{ value: string; label: string }[]>([]);
    const [regionalOptions, setRpcOptions] = useState<{ value: string; label: string }[]>([]);
    const [kebunOptions, setKebunOptions] = useState<{ value: string; label: string }[]>([]);
    const [afdOptions, setAfdOptions] = useState<{ value: string; label: string }[]>([]);
    const fetchData = useCallback(async (newCursor) => {
        try {
            const loginData = cookie.get("token");
            const tokenData = JSON.parse(loginData || "{}");

            const response = await axios.get(`${apiUrl}/identifikasiMasalah`, {
                headers: {
                    Authorization: `Bearer ${tokenData.payload.access_token}`,
                },
                params: {
                    limit: limitPerPage,
                    cursor: newCursor || cursor,
                    search: searchInput,
                    sortBy: sortBy,
                    sortDirection: sortDirection,
                    tahun: filters.selectedTahun,
                    bulan: filters.selectedBulan,
                    rpc: filters.selectedRpc,
                    kebun: filters.selectedKebun,
                    afd: filters.selectedAfd,
                },
            });

            const { totalItems, nextCursor, kuadrans } = response.data;

            // Replace data when newCursor is provided or reset when fetching initial data
            setDataAllReport(newCursor ? kuadrans : kuadrans);
            setNextCursor(nextCursor);
            setIsEndOfData(kuadrans.length < limitPerPage);
            setTotalItems(totalItems);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, cursor, searchInput, sortBy, sortDirection, filters, limitPerPage]);

    const handleFilterChange = (selectedOption, filterKey) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: selectedOption ? selectedOption.value : "",
        }));
        setCursor(null);

        // Automatically fetch dependent options when a filter is selected
        if (filterKey === "selectedTahun") {
            fetchBulanOptions(selectedOption ? selectedOption.value : "");
        } else if (filterKey === "selectedBulan") {
            fetchRpcOptions(filters.selectedTahun, selectedOption ? selectedOption.value : "");
        } else if (filterKey === "selectedRpc") {
            fetchKebunOptions(filters.selectedTahun, filters.selectedBulan, selectedOption ? selectedOption.value : "");
        } else if (filterKey === "selectedKebun") {
            fetchAfdOptions(filters.selectedTahun, filters.selectedBulan, filters.selectedRpc, selectedOption ? selectedOption.value : "");
    const handleFilterChange = (selectedOption, filterKey) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: selectedOption ? selectedOption.value : "",
        }));
        setCursor(null);

        // Automatically fetch dependent options when a filter is selected
        if (filterKey === "selectedTahun") {
            fetchBulanOptions(selectedOption ? selectedOption.value : "");
        } else if (filterKey === "selectedBulan") {
            fetchRpcOptions(filters.selectedTahun, selectedOption ? selectedOption.value : "");
        } else if (filterKey === "selectedRpc") {
            fetchKebunOptions(filters.selectedTahun, filters.selectedBulan, selectedOption ? selectedOption.value : "");
        } else if (filterKey === "selectedKebun") {
            fetchAfdOptions(filters.selectedTahun, filters.selectedBulan, filters.selectedRpc, selectedOption ? selectedOption.value : "");
        }
    };

    const fetchTahunOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tahun`);
            const tahunData = response.data.map((item: { tahun: number }) => ({
                value: item.tahun.toString(),
                label: item.tahun.toString(),
            }));
            setTahunOptions(tahunData);
        } catch (error) {
            console.error("Error fetching tahun options:", error);
        }
    };

    const fetchBulanOptions = async (tahun) => {
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bulan/${tahun}`);
            const data = response.data;
            const bulanOptions = data.map((item) => ({
                value: item.bulan,
                label: monthNames[item.bulan - 1],  // Convert the integer to the month name
            }));
            setBulanOptions(bulanOptions);
        } catch (error) {
            console.error("Error fetching bulan options:", error);
        }
    };


    const fetchRpcOptions = async (tahun: string, bulan: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rpc/${tahun}/${bulan}`);
            const data = response.data;
            const regionalOptions = data.map((item: { rpc: string }) => ({
                value: item.rpc,
                label: item.rpc,
            }));
            setRpcOptions(regionalOptions);
        } catch (error) {
            console.error("Error fetching rpc options:", error);
    const fetchTahunOptions = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tahun`);
            const tahunData = response.data.map((item: { tahun: number }) => ({
                value: item.tahun.toString(),
                label: item.tahun.toString(),
            }));
            setTahunOptions(tahunData);
        } catch (error) {
            console.error("Error fetching tahun options:", error);
        }
    };

    const fetchBulanOptions = async (tahun) => {
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bulan/${tahun}`);
            const data = response.data;
            const bulanOptions = data.map((item) => ({
                value: item.bulan,
                label: monthNames[item.bulan - 1],  // Convert the integer to the month name
            }));
            setBulanOptions(bulanOptions);
        } catch (error) {
            console.error("Error fetching bulan options:", error);
        }
    };


    const fetchRpcOptions = async (tahun: string, bulan: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rpc/${tahun}/${bulan}`);
            const data = response.data;
            const regionalOptions = data.map((item: { rpc: string }) => ({
                value: item.rpc,
                label: item.rpc,
            }));
            setRpcOptions(regionalOptions);
        } catch (error) {
            console.error("Error fetching rpc options:", error);
        }
    };

    const fetchKebunOptions = async (tahun: string, bulan: string, rpc: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/kebun/${tahun}/${bulan}/${rpc}`);
            const data = response.data;
            const kebunOptions = data.map((item: { kebun: string }) => ({
                value: item.kebun,
                label: item.kebun,
            }));
            setKebunOptions(kebunOptions);
        } catch (error) {
            console.error("Error fetching kebun options:", error);
        }
    };

    const fetchAfdOptions = async (tahun: string, bulan: string, rpc: string, kebun: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/afd/${tahun}/${bulan}/${rpc}/${kebun}`);
            const data = response.data;
            const afdOptions = data.map((item: { afd: string }) => ({
                value: item.afd,
                label: item.afd,
            }));
            setAfdOptions(afdOptions);
        } catch (error) {
            console.error("Error fetching afd options:", error);
        }
    };


    useEffect(() => {
        fetchData(cursor);
    }, [cursor, searchInput, sortBy, sortDirection, filters, fetchData, limitPerPage]);

    useEffect(() => {
        fetchTahunOptions();
    }, []);



    return (
        <>
            {/* table */}
            <div className="container mx-auto">
                <div className="mt-10 mb-5">
                <div className="mt-10 mb-5">
                    <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white">
                        <div className="p-4 border-b border-gray-200 dark:border-navy-700 flex justify-center">
                            <h1 className="text-lg font-semibold text-navy-800 dark:text-white">GRAFIK MONITORING PICA</h1>
                        </div>
                        <div className="p-4">
                            {/* Content can go here if needed */}
                        <div className="p-4 border-b border-gray-200 dark:border-navy-700 flex justify-center">
                            <h1 className="text-lg font-semibold text-navy-800 dark:text-white">GRAFIK MONITORING PICA</h1>
                        </div>
                        <div className="p-4">
                            {/* Content can go here if needed */}
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 mt-4">
                        <div className="mr-4">
                            <Select
                                options={tahunOptions}
                                placeholder="Pilih Tahun"
                                value={tahunOptions.find(option => option.value === filters.selectedTahun)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedTahun")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={bulanOptions}
                                placeholder="Pilih Bulan"
                                value={bulanOptions.find(option => option.value === filters.selectedBulan)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedBulan")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={regionalOptions}
                                placeholder="Pilih RPC"
                                value={regionalOptions.find(option => option.value === filters.selectedRpc)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedRpc")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={kebunOptions}
                                placeholder="Pilih Kebun"
                                value={kebunOptions.find(option => option.value === filters.selectedKebun)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedKebun")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={afdOptions}
                                placeholder="Pilih AFD"
                                value={afdOptions.find(option => option.value === filters.selectedAfd)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedAfd")}
                                isClearable
                                styles={customStyles}
                            />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 mt-4">
                        <div className="mr-4">
                            <Select
                                options={tahunOptions}
                                placeholder="Pilih Tahun"
                                value={tahunOptions.find(option => option.value === filters.selectedTahun)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedTahun")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={bulanOptions}
                                placeholder="Pilih Bulan"
                                value={bulanOptions.find(option => option.value === filters.selectedBulan)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedBulan")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={regionalOptions}
                                placeholder="Pilih RPC"
                                value={regionalOptions.find(option => option.value === filters.selectedRpc)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedRpc")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={kebunOptions}
                                placeholder="Pilih Kebun"
                                value={kebunOptions.find(option => option.value === filters.selectedKebun)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedKebun")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                        <div className="mr-4">
                            <Select
                                options={afdOptions}
                                placeholder="Pilih AFD"
                                value={afdOptions.find(option => option.value === filters.selectedAfd)}
                                onChange={(selectedOption) => handleFilterChange(selectedOption, "selectedAfd")}
                                isClearable
                                styles={customStyles}
                            />
                        </div>
                    </div>
                </div>



                <div className="w-full h-screen overflow-hidden">
                    <div className="grid h-full">

                        <p className='pt-1'></p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="relative overflow-x-auto overflow-y-hidden border-green-500 rounded-lg shadow-lg border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-5 flex flex-col justify-center items-center">
                                <h3 className="text-center font-bold underline decoration-green-500">Hijau</h3>
                                <h1 className="text-6xl text-center font-bold">{getRandomNumber(10, 30)}</h1>
                            </div>
                            <div className="relative overflow-x-auto overflow-y-hidden border-yellow-500 rounded-lg shadow-lg dark:border-yellow-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-5 flex flex-col justify-center items-center">
                                <h3 className="text-center font-bold underline decoration-yellow-500">Kuning</h3>
                                <h1 className="text-6xl text-center font-bold">{getRandomNumber(10, 30)}</h1>
                            </div>

                            <div className="relative overflow-x-auto overflow-y-hidden border-orange-500 rounded-lg shadow-lg dark:border-orange-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-5 flex flex-col justify-center items-center">
                                <h3 className="text-center font-bold underline decoration-orange-500">Orange</h3>
                                <h1 className="text-6xl text-center font-bold">{getRandomNumber(10, 30)}</h1>
                            </div>

                            <div className="relative overflow-x-auto overflow-y-hidden border-red-500 rounded-lg shadow-lg dark:border-red-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-5 flex flex-col justify-center items-center">
                                <h3 className="text-center font-bold underline decoration-red-500">Merah</h3>
                                <h1 className="text-6xl text-center font-bold">{getRandomNumber(10, 30)}</h1>
                            </div>

                        </div>
                        <p className='pt-1'></p>

                        <div className="relative overflow-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-4">
                            <div
                                style={{
                                    top: '3%',
                                    left: '0%',
                                    border: '1px solid red',
                                    padding: '5px',
                                    borderRadius: '10px',
                                    position: 'absolute'
                                }}
                            >
                                <span
                                    style={{
                                        height: '15px',
                                        width: '15px',
                                        backgroundColor: 'red',
                                        opacity: 0.4
                                    }}
                                    className="rounded me-2 d-inline-block"
                                ></span>
                                <small>Cash Cost &gt;2500 Nilai PICA &lt;3</small>
                            </div>
                            <div
                                style={{
                                    top: '3%',
                                    right: '0%',
                                    border: '1px solid orange',
                                    padding: '5px',
                                    borderRadius: '10px',
                                    position: 'absolute'
                                }}
                            >
                                <span
                                    style={{
                                        height: '15px',
                                        width: '15px',
                                        backgroundColor: 'orange',
                                        opacity: 0.4
                                    }}
                                    className="rounded me-2 d-inline-block"
                                ></span>
                                <small>Cash Cost &gt;2500 Nilai PICA &gt;3</small>
                            </div>
                            <div
                                style={{
                                    bottom: '3%',
                                    bottom: '3%',
                                    right: '0%',
                                    border: '1px solid green',
                                    padding: '5px',
                                    borderRadius: '10px',
                                    position: 'absolute'
                                }}
                            >
                                <span
                                    style={{
                                        height: '15px',
                                        width: '15px',
                                        backgroundColor: 'green',
                                        opacity: 0.4
                                    }}
                                    className="rounded me-2 d-inline-block"
                                ></span>
                                <small>Cash Cost &lt;2500 Nilai PICA &gt;3</small>
                            </div>
                            <div
                                style={{
                                    bottom: '3%',
                                    bottom: '3%',
                                    left: '0%',
                                    border: '1px solid yellow',
                                    padding: '5px',
                                    borderRadius: '10px',
                                    position: 'absolute'
                                }}
                            >
                                <span
                                    style={{
                                        height: '15px',
                                        width: '15px',
                                        backgroundColor: 'yellow',
                                        opacity: 0.4
                                    }}
                                    className="rounded me-2 d-inline-block"
                                ></span>
                                <small>Cash Cost &lt;2500 Nilai PICA &lt;3 </small>
                            </div>
                            <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Dashboard;
export default Dashboard;
