"use client";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import Head from "next/head";
import Select from "react-select";
import Link from "next/link";
import React, { use, useEffect, useId, useState, useRef } from "react";
import { set, useController, useForm } from "react-hook-form";
import { BiEdit, BiTrash } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import PageLoading from "components/loading/LoadingSkeleton";
import DeleteButton from "components/buttons/DeleteButton";
import CreateButton from "components/buttons/CreateButton";
import UploadButton from "components/buttons/UploadButton";
import { isWindowAvailable } from "utils/navigation";




const KaryawanList = () => {

    type karyawanType = {
        id: string;
        nkb: string;
        nik_sap: number;
        nama: string;
        bagian: string;
        jabatan: string;
        job_grade: string;
        person_grade: string;
        golongan_phdp: string;
        strata: string;
        golongan_max: string;
        suskel: string;
        tgl_lahir: string;
        tgl_bekerja: string;
        tgl_mbt: string | null;
        tgl_pensiun: string;
        nama_unit: string;
        status: string;
        keterangan: string;
        brm: string; // tambahkan jika diperlukan
    };
    type Data = {
        keterangan: {
            value: string;
            label: string;
        };
    }

    if (isWindowAvailable()) document.title = "Karyawan List";

    const [dataAllkaryawan, setDataAllkaryawan] = useState<karyawanType[]>([]);
    const [dataKeterangan, setDataKeterangan] = useState<any>([]);

    const [keterangan, setKeterangan] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const getSelectKeterangan = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectketerangan`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenData.payload.access_token}`,
                },
            }
        );
        const data = await res.json();
        if (data.status_code === 200) {
            console.log(data.payload);
            setDataKeterangan(data.payload);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }
    // Mengambil data karyawan dari API
    const getAllDatakaryawan = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");
        let res: Response;
        if (watch("keterangan") === undefined) {
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master-data`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenData.payload.access_token}`,
                },
            });
        } else {
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master-data?tipe_karyawan=${watch("keterangan").value}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenData.payload.access_token}`,
                },
            });
        }
        const data = await res.json();
        if (data.status_code === 200) {
            setDataAllkaryawan(data.payload);
            setIsLoading(false);
        }
        console.log(cookie.get("token"));
    };

    useEffect(() => {
        getAllDatakaryawan();
        getSelectKeterangan();
    }, []);

    const columns = [
        { id: 'no', label: 'No' },
        { id: 'nkb', label: 'NKB' },
        { id: 'nik_sap', label: 'NIK SAP' },
        { id: 'nama', label: 'Nama' },
        { id: 'bagian', label: 'Bagian' },
        { id: 'jabatan', label: 'Jabatan' },
        { id: 'job_grade', label: 'Job Grade' },
        { id: 'person_grade', label: 'Person Grade' },
        { id: 'golongan_phdp', label: 'Golongan PHDP' },
        { id: 'strata', label: 'Strata' },
        { id: 'golongan_max', label: 'Golongan Max' },
        { id: 'suskel', label: 'Suskel' },
        { id: 'tgl_lahir', label: 'Tgl Lahir' },
        { id: 'tgl_bekerja', label: 'Tgl Bekerja' },
        { id: 'tgl_mbt', label: 'Tgl MBT' },
        { id: 'tgl_pensiun', label: 'Tgl Pensiun' },
        { id: 'nama_unit', label: 'Unit' },
        { id: 'status', label: 'Status' },
        { id: 'keterangan', label: 'Keterangan' },
        { id: 'brm', label: 'BRM' },
        { id: 'action', label: 'Action' },

    ];

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Data>({
    });

    const instanceId = useId();

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
    };


    const { field: keteranganField } = useController({
        name: "keterangan",
        control,
    });

    const handleIsKeteranganSelectChange = (
        value: { value: string; label: string; } | null
    ) => {
        if (value) {
            keteranganField.onChange(value);
            setValue("keterangan", value); // Set nilai kebun ke yang dipilih oleh pengguna
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataAllkaryawan
        ?.filter((karyawan) => {
            if (searchInput === "") {
                return true; // Return true for all items if search input is empty
            } else if (
                karyawan.nkb?.toString().includes(searchInput) ||
                karyawan.nik_sap?.toString().includes(searchInput) ||
                karyawan.nama?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.bagian?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.jabatan?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.job_grade?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.person_grade?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.golongan_phdp?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.strata?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.golongan_max?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.suskel?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.nama_unit?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.status?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.keterangan?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.brm?.toLowerCase().includes(searchInput.toLowerCase())
            ) {
                return true;
            }
            return false;
        })
        ?.slice(indexOfFirstItem, indexOfLastItem);


    const filteredItemsLength = dataAllkaryawan
        ?.filter((karyawan) => {
            if (searchInput === "") {
                return true; // Return true for all items if search input is empty
            } else if (
                karyawan.nkb?.toString().includes(searchInput) ||
                karyawan.nik_sap?.toString().includes(searchInput) ||
                karyawan.nama?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.bagian?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.jabatan?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.job_grade?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.person_grade?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.golongan_phdp?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.strata?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.golongan_max?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.suskel?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.nama_unit?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.status?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.keterangan?.toLowerCase().includes(searchInput.toLowerCase()) ||
                karyawan.brm?.toLowerCase().includes(searchInput.toLowerCase())
            ) {
                return true;
            }
            return false;
        })
        ?.length;



    // Fungsi untuk mengurutkan data

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    function sortData<T>(
        data: { payload: T[] },
        sortBy: keyof T,
        sortOrder: "asc" | "desc"
    ): T[] {
        return data.payload.sort((a, b) => {
            if (sortOrder === "asc") {
                if (a[sortBy] < b[sortBy]) {
                    return -1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return 1;
                }
                return 0;
            } else {
                if (a[sortBy] < b[sortBy]) {
                    return 1;
                }
                if (a[sortBy] > b[sortBy]) {
                    return -1;
                }
                return 0;
            }
        });
    }

    // Mengubah halaman saat ini
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (watch("keterangan")) {
            getAllDatakaryawan();
        }
    }, [watch("keterangan")]);



    return (
        <>
            <div className="w-full min-h-screen">
                <div className="flex items-center justify-end gap-2 mt-10 w-full">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-gray-500 "
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <input
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            className="bg-gray-50 border border-green-600 text-gray-900 text-sm rounded-full focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 active:outline-none focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:border-navy-700 dark:text-white dark:placeholder-white dark:focus:ring-green-500 dark:focus:border-green-500 dark:bg-navy-800 dark:focus:ring-opacity-50 dark:focus:ring-2"
                            placeholder="Search"
                        />
                    </div>

                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M6.293 9.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L7 10.414l-1.293 1.293a1 1 0 01-1.414-1.414l2-2a1 1 0 010-1.414zM10 4a6 6 0 100 12 6 6 0 000-12z" clip-rule="evenodd"></path>
                            </svg>

                        </div>
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L7 10.414l-1.293 1.293a1 1 0 01-1.414-1.414l2-2a1 1 0 010-1.414zM10 4a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <Select
                                options={dataKeterangan.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                }))}
                                onChange={handleIsKeteranganSelectChange}
                                className=''
                                instanceId={instanceId}
                                placeholder="Pilih Keterangan"
                                isSearchable={true}
                                styles={customStyles}
                                value={watch("keterangan")}
                                defaultValue={watch("keterangan")}
                                {...(register("keterangan"), { required: true })}
                            />
                        </div>
                    </div>

                    {/* select keterangan */}

                    <CreateButton buttonName="Create karyawan+" pathUrl="/admin/karyawan/create" />
                    <UploadButton buttonName="Upload karyawan+" pathUrl="/admin/karyawan/upload" />
                </div>

                {/* table */}
                <div className="mt-10">
                    <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px]">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-gray-700 bg-gray-50 dark:bg-navy-800">
                                <tr>
                                    {columns.map(column => (
                                        <th
                                            key={column.id}
                                            scope="col"
                                            className="px-6 py-5 text-xs font-medium text-navy-800 uppercase tracking-wider dark:text-white"
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr className="border-b border-[#9FA284] border-opacity-20 hover:bg-gray-50">
                                        <td colSpan={7} className="px-5 p-7">
                                            <PageLoading />
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {dataAllkaryawan?.length === 0 ? (
                                            <tr className=" border-b border-[#9FA284] border-opacity-20 font-medium text-gray-900">
                                                <td colSpan={20} className="text-center">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {currentItems?.map((karyawan, index) => (
                                                    <tr key={index} className=" border-b py-7 bg-white dark:bg-navy-900 border-opacity-20 hover:bg-gray-50 dark:border-navy-700 text-black dark:text-white">
                                                        <td className="px-6 py-7">
                                                            {indexOfFirstItem + 1 + index}
                                                        </td>
                                                        <td
                                                            scope="row"
                                                            className="px-6 font-medium text-gray-900 py-7 whitespace-nowrap dark:text-white">
                                                            {karyawan.nkb}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.nik_sap}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.nama}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.bagian}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.jabatan}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.job_grade}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.person_grade}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.golongan_phdp}

                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.strata}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.golongan_max}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.suskel}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.tgl_lahir}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.tgl_bekerja}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.tgl_mbt}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.tgl_pensiun}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.nama_unit}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.status}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.keterangan}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            {karyawan.brm}
                                                        </td>
                                                        <td className="px-6 py-7 whitespace-nowrap text-gray-900 dark:text-white">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <Link
                                                                    href={`/admin/karyawan/view/${karyawan.id}`}
                                                                    legacyBehavior>
                                                                    <a className="p-2 bg-green-600 rounded-lg cursor-pointer">
                                                                        <TbReportSearch className="text-lg text-white cursor-pointer" />
                                                                    </a>
                                                                </Link>
                                                                <Link
                                                                    href={`/admin/karyawan/edit/${karyawan.id}`}
                                                                    legacyBehavior>
                                                                    <a className="p-2 bg-yellow-400 rounded-lg cursor-pointer">
                                                                        <BiEdit className="text-lg text-white cursor-pointer" />
                                                                    </a>
                                                                </Link>

                                                                <DeleteButton
                                                                    endPointUrl={`/master-data/${karyawan.id}`}
                                                                    getDataAgain={getAllDatakaryawan}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                        <nav className="flex items-center justify-between p-8 dark:bg-navy-800 bg-gray-50" aria-label="Table navigation">
                            <span className="text-sm font-normal text-gray-500">
                                Showing{" "}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItemsLength)}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {filteredItemsLength}
                                </span>
                            </span>
                            <ul className="flex items-center">
                                <li>
                                    <button
                                        className="px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-lg"
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {Array.from({ length: Math.min(5, Math.ceil(filteredItemsLength / itemsPerPage)) }, (_, i) => {
                                    const pageNumber = currentPage - 2 + i; // Halaman tengah di tengah (misalnya, jika currentPage=4, pageNumber akan berjalan dari 2 ke 6)
                                    const isActive = currentPage === pageNumber;
                                    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredItemsLength / itemsPerPage)) {
                                        return (
                                            <li key={i}>
                                                <button
                                                    className={`px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-lg ${isActive ? "text-green-600 bg-green-50" : "hover:bg-gray-100 hover:text-gray-700"
                                                        }`}
                                                    onClick={() => paginate(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                                <li>
                                    <button
                                        className="px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-lg"
                                        onClick={() => paginate(Math.min(currentPage + 1, Math.ceil(filteredItemsLength / itemsPerPage)))}
                                        disabled={currentPage === Math.ceil(filteredItemsLength / itemsPerPage)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>



                    </div>
                </div>
            </div>
        </>
    );
};

export default KaryawanList;
