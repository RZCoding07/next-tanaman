"use client";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import { RegionalType } from "types/regional";  // Update the import for the new type
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import PageLoading from "components/loading/LoadingSkeleton";
import DeleteButton from "components/buttons/DeleteButton";
import CreateButton from "components/buttons/CreateButton";
import UploadButton from "components/buttons/UploadButton";
import { isWindowAvailable } from "utils/navigation";

const KebunList = () => {
  if (isWindowAvailable()) document.title = "Regional List";

  const [dataAllKebun, setDataAllKebun] = useState<RegionalType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mengambil data kebun dari API
  const getAllDataKebun = async () => {
    setIsLoading(true);
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/regional`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.payload.access_token}`,
      },
    });
    const data = await res.json();
    if (data.status_code === 200) {
      setDataAllKebun(data.payload);
      setIsLoading(false);
    }
    console.log(cookie.get("token"));
  };

  useEffect(() => {
    getAllDataKebun();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataAllKebun.filter((kebun) => {
    if (searchInput === "") {
      return kebun;
    } else if (
      kebun.tipe_regional.toLowerCase().includes(searchInput.toLowerCase()) ||
      kebun.nama_regional.toLowerCase().includes(searchInput.toLowerCase())
    ) {
      return kebun;
    }
  });

  // Mengubah halaman saat ini
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="w-full min-h-screen">
        <div className="flex items-center justify-end gap-2 mt-10">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="bg-gray-50 border border-green-600 text-gray-900 text-sm rounded-full focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5 active:outline-none focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:border-navy-700 dark:text-white dark:placeholder-white dark:focus:ring-green-500 dark:focus:border-green-500 dark:bg-navy-800 dark:focus:ring-opacity-50 dark:focus:ring-2"
              placeholder="Search"
            />
          </div>

          <CreateButton buttonName="Create Regional +" pathUrl="/admin/regional/create" />
        </div>

        {/* table */}
        <div className="mt-10">
          <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px]">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-gray-700 bg-gray-50 dark:bg-navy-800">
                <tr>
                  <th scope="col" className="px-6 py-8">
                    No
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Tipe Regional
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Nama Regional
                  </th>
                  <th scope="col" className="px-6 py-8 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="border-b border-[#9FA284] border-opacity-20 hover:bg-gray-50">
                    <td colSpan={4} className="px-5 p-7">
                      <PageLoading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {dataAllKebun?.length === 0 ? (
                      <tr className="border-b border-[#9FA284] border-opacity-20 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-navy-900">
                        <td colSpan={4} className="text-center py-7">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      <>
                        {currentItems?.map((kebun, index) => (
                          <tr key={index} className="border-b py-7 bg-white dark:bg-navy-900 border-opacity-20 hover:bg-gray-50 dark:border-navy-700">
                            <td className="px-6 py-7">
                              {indexOfFirstItem + 1 + index}
                            </td>
                            <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">{kebun.tipe_regional}</td>
                            <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">{kebun.nama_regional}</td>
                            <td className="px-6 py-7 text-gray-900 font-medium">
                              <div className="flex items-center justify-between gap-1">
                                <Link
                                  href={`/admin/regional/view/${kebun.id}`}
                                  legacyBehavior>
                                  <a className="p-2 bg-green-600 rounded-lg cursor-pointer">
                                    <TbReportSearch className="text-lg text-white cursor-pointer" />
                                  </a>
                                </Link>
                                <Link
                                  href={`/admin/regional/edit/${kebun.id}`}
                                  legacyBehavior>
                                  <a className="p-2 bg-yellow-400 rounded-lg cursor-pointer">
                                    <BiEdit className="text-lg text-white cursor-pointer" />
                                  </a>
                                </Link>

                                <DeleteButton
                                  endPointUrl={`/regional/${kebun.id}`}
                                  getDataAgain={getAllDataKebun}
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
            <nav
              className="flex items-center justify-between p-8 dark:bg-navy-800 bg-gray-50"
              aria-label="Table navigation">
              <span className="text-sm font-normal text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {indexOfFirstItem + 1}-
                  {dataAllKebun?.length >= 10
                    ? indexOfLastItem
                    : dataAllKebun?.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dataAllKebun?.length}
                </span>
              </span>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <button
                    className="block px-3 py-2 ml-0 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}>
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </button>
                </li>
                {Array.from(
                  { length: Math.ceil(dataAllKebun?.length / itemsPerPage) },
                  (_, i) => (
                    <li key={i}>
                      <button
                        className={`px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 ${
                          currentPage === i + 1
                            ? "text-green-600 bg-green-50"
                            : "hover:bg-gray-100 hover:text-gray-700"
                        }`}
                        onClick={() => paginate(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  )
                )}
                <li>
                  <button
                    className="block px-3 py-2 leading-tight text-gray-500 border shadow-lg dark:border-navy-900 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(dataAllKebun?.length / itemsPerPage)
                    }>
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
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

export default KebunList;
