'use client';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';
import { FaUserGroup } from "react-icons/fa6";
import React, { useEffect, useRef, useId } from "react";
import { useController, useForm } from "react-hook-form";
import Select from 'react-select';
import * as echarts from 'echarts';

import NavLink from "components/link/NavLink";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { isWindowAvailable } from "utils/navigation";

const IdentifikasiMasalah = () => {

    // Function to generate random number within a range
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const chartRef = useRef<HTMLDivElement>(null);

    const [darkmode, setDarkmode] = React.useState(
        document.body.classList.contains('dark')
    );

    // Toggle dark mode
    const handleDarkmode = () => {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            setDarkmode(false);
        } else {
            document.body.classList.add('dark');
            setDarkmode(true);
        }
    };

    useEffect(() => {
        handleDarkmode();

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
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS E', 'Manajer E'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS F', 'Manajer F'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS G', 'Manajer G'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS H', 'Manajer H'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS I', 'Manajer I'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS J', 'Manajer J'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS K', 'Manajer K'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS M', 'Manajer M'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS N', 'Manajer N'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS P', 'Manajer P'] },
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS R', 'Manajer R'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS T', 'Manajer T'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS V', 'Manajer V'] },
                // Continue for other data points
                { value: [getRandomNumber(1, 4), getRandomNumber(2000, 3000), 'PKS X', 'Manajer X'] },
                // Continue for other data points
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
        document.title = 'IdentifikasiMasalah';
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

    type Data = {
        keterangan: {
            value: string;
            label: string;
        },
        regional: {
            value: string;
            label: string;
        },
        kebun: {
            value: string;
            label: string;
        },
        tahun: {
            value: string;
            label: string;
        },
        bulan: {
            value: string;
            label: string;
        };
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    let keteranganOptions = [
        { value: 'master-data', label: 'Master Data' },
        { value: 'lm', label: 'LM' },
    ];

    // Dummy data for dropdown options (replace with actual data)
    let regionalOptions = [
        { value: 'region1', label: 'Region 1' },
        { value: 'region2', label: 'Region 2' },
        // Add more regional options as needed
    ];

    let kebunOptions = [
        { value: 'kebun1', label: 'Kebun 1' },
        { value: 'kebun2', label: 'Kebun 2' },
        // Add more kebun options as needed
    ];

    let tahunOptions = [
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
        // Add more tahun options as needed
    ];

    let bulanOptions = [
        { value: 'january', label: 'January' },
        { value: 'february', label: 'February' },
        // Add more bulan options as needed
    ];

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Data>({
        defaultValues: {
            keterangan: keteranganOptions[0],
            regional: regionalOptions[0],
            kebun: kebunOptions[0],
            tahun: tahunOptions[0],
            bulan: bulanOptions[0],

        },
    });

    const instanceId = useId();

    const { field: keteranganField } = useController({
        name: "keterangan",
        control,
    });

    const handleIsKeteranganSelectChange = (
        value: { value: string; label: string; } | null
    ) => {
        if (value) {
            keteranganField.onChange(value);
            // setValue("keterangan", value); // Set nilai kebun ke yang dipilih oleh pengguna
            console.log(value);
        }
    };

    const handleIsRegionalSelectChange = (
        value: { value: string; label: string; } | null
    ) => {
        if (value) {
            setValue("regional", value); // Set nilai kebun ke yang dipilih oleh pengguna
            console.log(value);
        }
    };

    const handleIsKebunSelectChange = (
        value: { value: string; label: string; } | null
    ) => {
        if (value) {
            setValue("kebun", value); // Set nilai kebun ke yang dipilih oleh pengguna
            console.log(value);
        }
    };

    const handleIsTahunSelectChange = (
        value: { value: string; label: string; } | null
    ) => {
        if (value) {
            setValue("tahun", value); // Set nilai kebun ke yang dipilih oleh pengguna
            console.log(value);
        }
    };

    return (
        <>
            {/* table */}
            <div className="container mx-auto">
                <div className="mt-10">
                    <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white">
                        <div className="p-4 border-b border-gray-200 dark:border-navy-700 flex justify-end items-center">
                            <h1 className="text-lg font-semibold text-navy-800 dark:text-white w-full">GRAFIK KUADRAN PICA</h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                            <div className="mr-4">
                                <Select
                                    options={regionalOptions}
                                    onChange={handleIsRegionalSelectChange}
                                    className=""
                                    instanceId={instanceId}
                                    placeholder="Pilih Regional"
                                    isSearchable={true}
                                    styles={customStyles}
                                    value={watch("regional")}
                                    defaultValue={regionalOptions.find((option) => option.value === "regional1")}
                                    menuPortalTarget={document.body}
                                    menuPlacement="auto"
                                    {...register("regional", { required: true })}
                                />
                            </div>
                            <div className="mr-4">
                                <Select
                                    options={kebunOptions}
                                    onChange={handleIsKebunSelectChange}
                                    className=""
                                    instanceId={instanceId}
                                    placeholder="Pilih Kebun"
                                    isSearchable={true}
                                    styles={customStyles}
                                    value={watch("kebun")}
                                    defaultValue={kebunOptions.find((option) => option.value === "kebun1")}
                                    menuPortalTarget={document.body}
                                    menuPlacement="auto"
                                    {...register("kebun", { required: true })}
                                />
                            </div>
                            <div className="mr-4">
                                <Select
                                    options={tahunOptions}
                                    onChange={handleIsTahunSelectChange}
                                    className=""
                                    instanceId={instanceId}
                                    placeholder="Pilih Tahun"
                                    isSearchable={true}
                                    styles={customStyles}
                                    value={watch("tahun")}
                                    defaultValue={tahunOptions.find((option) => option.value === "2022")}
                                    menuPortalTarget={document.body}
                                    menuPlacement="auto"
                                    {...register("tahun", { required: true })}
                                />
                            </div>
                            <div className="mr-4">
                                <Select
                                    options={bulanOptions}
                                    onChange={handleIsKebunSelectChange}
                                    className=""
                                    instanceId={instanceId}
                                    placeholder="Pilih Bulan"
                                    isSearchable={true}
                                    styles={customStyles}
                                    value={watch("bulan")}
                                    defaultValue={bulanOptions.find((option) => option.value === "january")}
                                    menuPortalTarget={document.body}
                                    menuPlacement="auto"
                                    {...register("bulan", { required: true })}
                                />
                            </div>
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
                                    bottom: '0%',
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
                                    bottom: '0%',
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

export default IdentifikasiMasalah;
