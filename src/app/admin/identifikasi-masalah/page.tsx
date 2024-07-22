'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "js-cookie";
import PageLoading from "components/loading/LoadingSkeleton";
import { isWindowAvailable } from "utils/navigation";
import { ReportType } from "types/report";
import Select from 'react-select';
import ModalIdentifikasiMasalah from "components/admin/default/ModalIdentifikasiMasalah";

import Head from 'next/head';
import Link from "next/link";
import { TbReportSearch } from "react-icons/tb";
const IdentifikasiMasalahList = () => {

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

    if (isWindowAvailable()) document.title = "Identifikasi Masalah List";

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
    const [filters, setFilters] = useState({
        selectedBulan: "",
        selectedTahun: "",
        selectedRpc: "",
        selectedKebun: "",
        selectedAfd: "",
    });


    const [tahunOptions, setTahunOptions] = useState<{ value: string; label: string }[]>([]);
    const [bulanOptions, setBulanOptions] = useState<{ value: string; label: string }[]>([]);
    const [regionalOptions, setRpcOptions] = useState<{ value: string; label: string }[]>([]);
    const [kebunOptions, setKebunOptions] = useState<{ value: string; label: string }[]>([]);
    const [afdOptions, setAfdOptions] = useState<{ value: string; label: string }[]>([]);

    const fetchData = async (newCursor) => {
        setIsLoading(true);
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
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
        setCursor(null);
    };

    const handleNextPage = () => {
        setCursor(nextCursor); // Move to the next page
    };

    const handlePreviousPage = () => {
        if (cursor !== null && cursor > 0) {
            const prevCursor = Math.max(cursor - limitPerPage, 0);
            setCursor(prevCursor);
        }
    };

    const handleSort = (column: string) => {
        if (column === sortBy) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
        setCursor(null);
    };

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

    // modal 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };




    const fetchTahunOptions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tahun");
            const tahunData = response.data.map((item: { tahun: number }) => ({
                value: item.tahun.toString(),
                label: item.tahun.toString(),
            }));
            setTahunOptions(tahunData);
        } catch (error) {
            console.error("Error fetching tahun options:", error);
        }
    };

    const fetchBulanOptions = async (tahun: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/bulan/${tahun}`);
            const data = response.data;
            const bulanOptions = data.map((item: { bulan: string }) => ({
                value: item.bulan,
                label: item.bulan,
            }));
            setBulanOptions(bulanOptions);
        } catch (error) {
            console.error("Error fetching bulan options:", error);
        }
    };

    const fetchRpcOptions = async (tahun: string, bulan: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/rpc/${tahun}/${bulan}`);
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
            const response = await axios.get(`http://localhost:5000/kebun/${tahun}/${bulan}/${rpc}`);
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
            const response = await axios.get(`http://localhost:5000/afd/${tahun}/${bulan}/${rpc}/${kebun}`);
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


    const renderOptions = (options: { value: string, label: string }[]) => {
        return options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
        ));
    };
    useEffect(() => {
        fetchData(cursor);
    }, [cursor, searchInput, sortBy, sortDirection, filters]);

    useEffect(() => {
        fetchTahunOptions();
    }, []);

    return (
        <>
            <Head>
                <title>Identifikasi Masalah List</title>
            </Head>
            <div className="w-full min-h-screen">
                {/* Search Input */}
                <div className="flex items-center justify-end gap-2 mt-10">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <input
                            value={searchInput}
                            onChange={handleSearch}
                            className="bg-gray-50 border border-green-600 text-gray-900 text-sm rounded-full focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 active:outline-none focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:border-navy-700 dark:text-white dark:placeholder-white dark:focus:ring-green-500 dark:focus:border-green-500 dark:bg-navy-800 dark:focus:ring-opacity-50 dark:focus:ring-2"
                            placeholder="Search"
                        />
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
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

                {/* Table Structure */}
                <div className="mt-4 overflow-x-auto">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white dark:bg-navy-700 sm:rounded-lg border-b border-gray-200 dark:border-navy-600">
                        <table className="min-w-full ">
                            <thead>
                                <tr className="dark:text-white text-navy-900 hover:bg-gray-100">
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("id")}>
                                        ID {sortBy === "id" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("kondisi")}>
                                        Kondisi {sortBy === "kondisi" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("status_umur")}>
                                        Status Umur {sortBy === "status_umur" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("kebun")}>
                                        Kebun {sortBy === "kebun" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("kkl_kebun")}>
                                        KKL Kebun {sortBy === "kkl_kebun" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("afd")}>
                                        AFD {sortBy === "afd" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("tahun_tanam")}>
                                        Tahun Tanam {sortBy === "tahun_tanam" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("no_blok")}>
                                        No Blok {sortBy === "no_blok" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("luas")}>
                                        Luas {sortBy === "luas" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("jlh_pokok")}>
                                        Jumlah Pokok {sortBy === "jlh_pokok" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("pkk_ha")}>
                                        PKK / Ha {sortBy === "pkk_ha" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("r")}>
                                        R {sortBy === "r" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer" onClick={() => handleSort("warna")}>
                                        Warna {sortBy === "warna" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                                    </th>
                                    <th scope="col" className="px-6 py-8 cursor-pointer">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-navy-700 text-navy-900 dark:text-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={14} className="text-center py-8">
                                            <PageLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    dataAllReport.map((item) => (
                                        <tr key={item.id} className="bg-white border-b dark:bg-navy-700 dark:border-navy-600 hover:bg-gray-100">
                                            <td className="px-6 py-8">{item.id}</td>
                                            <td className="px-6 py-8">{item.kondisi || "No Data"}</td>
                                            <td className="px-6 py-8">{item.status_umur}</td>
                                            <td className="px-6 py-8">{item.kebun}</td>
                                            <td className="px-6 py-8">{item.kkl_kebun}</td>
                                            <td className="px-6 py-8">{item.afd}</td>
                                            <td className="px-6 py-8">{item.tahun_tanam}</td>
                                            <td className="px-6 py-8">{item.no_blok}</td>
                                            <td className="px-6 py-8">{item.luas}</td>
                                            <td className="px-6 py-8">{item.jlh_pokok}</td>
                                            <td className="px-6 py-8">{item.pkk_ha}</td>
                                            <td className="px-6 py-8">{item.r}</td>
                                            <td className="px-6 py-8">{item.warna}</td>
                                            <td className="px-6 py-8">
                                                <Link
                                                    href={`/admin/identifikasi-masalah/update/${item.id}`}
                                                    legacyBehavior>
                                                    <a className="p-2 bg-green-600 rounded-lg cursor-pointer">
                                                        <TbReportSearch className="text-lg text-white cursor-pointer" />
                                                    </a>
                                                </Link>
                                                {/* <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                                >
                                                    Isi Masalah
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Render modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg dark:bg-navy-800">
                            <ModalIdentifikasiMasalah
                                item={selectedItem}
                                onClose={handleCloseModal}
                            />
                        </div>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={!cursor}
                        className={`${!cursor
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                            } px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={isEndOfData}
                        className={`${isEndOfData
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                            } px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        Next
                    </button>
                </div>
                <span className="text-sm text-gray-600 justify-center">
                    Showing {dataAllReport.length} of {totalItems} entries
                </span>
            </div>
        </>
    );
};

export default IdentifikasiMasalahList;


