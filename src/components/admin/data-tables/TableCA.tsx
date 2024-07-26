"use client";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import { piType } from "types/pi";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import PageLoading from "components/loading/LoadingSkeleton";
import DeleteButton from "components/buttons/DeleteButton";
import CreateButton from "components/buttons/CreateButton";
import { isWindowAvailable } from "utils/navigation";

const TableListCA = () => {

    // const [dataAllUser, setDataAllUser] = useState<piType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // temp data for table 
    const dataAllTemp = {
        "status_code": 200,
        "message": "table data displayed successfully",
        "payload": [
            {
                "id": 1,
                "no_blok": "001",
                "w1": "RBT Dibawah Potensi",
                "w2": "Kondisi Kebun",
                "w3": "Anak Kayu Berat",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA1",
                "color": "Color1",
                "month": "January",
                "year": 2024,
                "createdAt": "2024-01-01T00:00:00Z",
                "updatedAt": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "no_blok": "002",
                "w1": "RBT Dibawah Potensi",
                "w2": "Kondisi Kebun",
                "w3": "Semak Lalang",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA2",
                "color": "Color2",
                "month": "February",
                "year": 2024,
                "createdAt": "2024-02-01T00:00:00Z",
                "updatedAt": "2024-02-01T00:00:00Z"
            },
            {
                "id": 3,
                "no_blok": "003",
                "w1": "RBT Dibawah Potensi",
                "w2": "Kondisi Kebun",
                "w3": "Pasar Pikul dan Gawangan Semak Gulma (Lunak)",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA3",
                "color": "Color3",
                "month": "March",
                "year": 2024,
                "createdAt": "2024-03-01T00:00:00Z",
                "updatedAt": "2024-03-01T00:00:00Z"
            },
            {
                "id": 4,
                "no_blok": "004",
                "w1": "RBT Dibawah Potensi",
                "w2": "Infrastruktur",
                "w3": "Main Road Kondisi Berat",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA4",
                "color": "Color4",
                "month": "April",
                "year": 2024,
                "createdAt": "2024-04-01T00:00:00Z",
                "updatedAt": "2024-04-01T00:00:00Z"
            },
            {
                "id": 5,
                "no_blok": "005",
                "w1": "RBT Dibawah Potensi",
                "w2": "Infrastruktur",
                "w3": "Collection Road Kondisi Berat",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA5",
                "color": "Color5",
                "month": "May",
                "year": 2024,
                "createdAt": "2024-05-01T00:00:00Z",
                "updatedAt": "2024-05-01T00:00:00Z"
            },
            {
                "id": 6,
                "no_blok": "006",
                "w1": "RBT Dibawah Potensi",
                "w2": "Infrastruktur",
                "w3": "Titi Panen tidak tersedia",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA6",
                "color": "Color6",
                "month": "June",
                "year": 2024,
                "createdAt": "2024-06-01T00:00:00Z",
                "updatedAt": "2024-06-01T00:00:00Z"
            },
            {
                "id": 7,
                "no_blok": "007",
                "w1": "RBT Dibawah Potensi",
                "w2": "Infrastruktur",
                "w3": "Akses Sulit pada areal terasan",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA7",
                "color": "Color7",
                "month": "July",
                "year": 2024,
                "createdAt": "2024-07-01T00:00:00Z",
                "updatedAt": "2024-07-01T00:00:00Z"
            },
            {
                "id": 8,
                "no_blok": "008",
                "w1": "RBT Dibawah Potensi",
                "w2": "Tanaman",
                "w3": "Defisiensi Unsur Hara",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA8",
                "color": "Color8",
                "month": "August",
                "year": 2024,
                "createdAt": "2024-08-01T00:00:00Z",
                "updatedAt": "2024-08-01T00:00:00Z"
            },
            {
                "id": 9,
                "no_blok": "009",
                "w1": "RBT Dibawah Potensi",
                "w2": "Tanaman",
                "w3": "Serangan Hama UPDKS",
                "w4": "Value 4",
                "w5": "Value 5",
                "ca": "CA9",
                "color": "Color9",
                "month": "September",
                "year": 2024,
                "createdAt": "2024-09-01T00:00:00Z",
                "updatedAt": "2024-09-01T00:00:00Z"
            }
        ]
    };

    // Mengambil data user dari API
    // const getAllDataUser = async () => {
    //     setIsLoading(true);
    //     const loginData = cookie.get("token");
    //     const tokenData: Tokens = JSON.parse(loginData || "{}");

    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    //         method: "GET",
    //         headers: {
    //             accept: "application/json",
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${tokenData.payload.access_token}`,
    //         },
    //     });
    //     const data = await res.json();
    //     if (data.status_code === 200) {
    //         setDataAllUser(data.payload);
    //         setIsLoading(false);
    //     }
    //     console.log(cookie.get("token"));
    // };

    // useEffect(() => {
    //     getAllDataUser();
    // }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataAllTemp.payload
        .filter((tempData) => {
            if (searchInput === "") {
                return tempData;
            } else if (
                tempData.no_blok.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.w1.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.w2.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.w3.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.w4.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.w5.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.ca.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.color.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.month.toLowerCase().includes(searchInput.toLowerCase()) ||
                tempData.year.toString().toLowerCase().includes(searchInput.toLowerCase())
            ) {
                return tempData;
            }
        })
        .slice(indexOfFirstItem, indexOfLastItem); // Slice to show only the items for the current page


    // Mengubah halaman saat ini
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="w-full">
                {/* table */}
                <div className="relative overflow-x-auto border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px]">
                    {/* create header text */}
                    <div className="flex items-center justify-between pl-8 pt-8 bg-gray-50 dark:bg-navy-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Corrective Action
                        </h2>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-gray-700 bg-gray-50 dark:bg-navy-800">
                            <tr>
                                <th scope="col" className="px-3 py-3">Id</th>
                                <th scope="col" className="px-3 py-3">No Blok</th>
                                <th scope="col" className="px-3 py-3">W1</th>
                                <th scope="col" className="px-3 py-3">W2</th>
                                <th scope="col" className="px-3 py-3">W3</th>
                                <th scope="col" className="px-3 py-3">W4</th>
                                <th scope="col" className="px-3 py-3">W5</th>
                                <th scope="col" className="px-3 py-3">CA</th>
                                <th scope="col" className="px-3 py-3">Color</th>
                                <th scope="col" className="px-3 py-3">Month</th>
                                <th scope="col" className="px-3 py-3">Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="border-b border-[#9FA284] border-opacity-20 hover:bg-gray-50">
                                    <td colSpan={11} className="px-5 py-7">
                                        <PageLoading />
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {dataAllTemp?.payload.length === 0 ? (
                                        <tr className="border-b border-[#9FA284] border-opacity-20 font-medium text-gray-900">
                                            <td colSpan={11} className="text-center py-7">
                                                Tidak ada data
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {currentItems?.map((tempData) => (
                                                <tr key={tempData.id} className="border-b py-7 bg-white dark:bg-navy-900 border-opacity-20 hover:bg-gray-50 dark:border-navy-700">
                                                    <td className="px-3 py-3">{tempData.id}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.no_blok}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.w1}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.w2}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.w3}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.w4}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.w5}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.ca}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.color}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.month}</td>
                                                    <td className="px-3 py-3 text-gray-900 font-medium dark:text-white">{tempData.year}</td>
                                                    {/* Uncomment if needed */}
                                                    {/* <td className="px-6 py-7 text-gray-900 font-medium">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <Link href={`/admin/users/view/${tempData.id}`} legacyBehavior>
                                                                <a className="p-2 bg-green-600 rounded-lg cursor-pointer">
                                                                    <TbReportSearch className="text-lg text-white cursor-pointer" />
                                                                </a>
                                                            </Link>
                                                            <Link href={`/admin/users/edit/${tempData.id}`} legacyBehavior>
                                                                <a className="p-2 bg-yellow-400 rounded-lg cursor-pointer">
                                                                    <BiEdit className="text-lg text-white cursor-pointer" />
                                                                </a>
                                                            </Link>
                                                            <DeleteButton endPointUrl={`/users/${tempData.id}`} getDataAgain={getAllDataUser} />
                                                        </div>
                                                    </td> */}
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                    <nav className="flex items-center justify-between p-2 dark:bg-navy-800 bg-gray-50" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {indexOfFirstItem + 1}-
                                {dataAllTemp?.payload.length >= 3 ? indexOfLastItem : dataAllTemp?.payload.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {dataAllTemp?.payload.length}
                            </span>
                        </span>
                        <ul className="inline-flex items-center -space-x-px">
                            <li>
                                <button
                                    className="block px-3 py-2 ml-0 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            </li>
                            {Array.from({ length: Math.ceil(dataAllTemp?.payload.length / itemsPerPage) }, (_, i) => (
                                <li key={i}>
                                    <button
                                        className={`px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 ${currentPage === i + 1 ? "text-green-600 bg-green-50" : "hover:bg-gray-100 hover:text-gray-700"}`}
                                        onClick={() => paginate(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    className="block px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(dataAllTemp?.payload.length / itemsPerPage)}
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );

};

export default TableListCA;
