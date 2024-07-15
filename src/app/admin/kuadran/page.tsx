"use client";
import React, { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import Link from "next/link";
import cookie from "js-cookie";
import PageLoading from "components/loading/LoadingSkeleton";
import DeleteButton from "components/buttons/DeleteButton";
import UploadButton from "components/buttons/UploadButton";
import { isWindowAvailable } from "utils/navigation";
import { Tokens } from "types/token";
import { KuadranType } from "types/kuadran";
import { ReportType } from "types/report";
import axios from "axios";

const KuadranList = (props: any) => {
  if (isWindowAvailable()) document.title = "Kuadran List";

  const [dataAllReport, setDataAllReport] = useState<ReportType[]>([]);
  // const [dataAllKuadran, setDataAllKuadran] = useState<KuadranType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [cursor, setCursor] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [isFetching, setIsFetching] = useState(false);
  const [isEndOfData, setIsEndOfData] = useState(false);

  useEffect(() => {
    fetchData();
  }, [cursor, searchInput]);


  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const loginData = cookie.get("token");
      const tokenData = JSON.parse(loginData || "{}");
      const response = await axios.get(`${apiUrl}/report`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenData.payload.access_token}`,
        },
        params: {
          limit: limitPerPage,
          cursor: cursor,
          search: searchInput,
        }
      });
      const { payload, nextCursor, hasNextPage } = response.data;

      setDataAllReport(cursor ? [...dataAllReport, ...payload] : payload);
      setNextCursor(hasNextPage ? nextCursor : null);
      setIsEndOfData(!hasNextPage);
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
    setCursor(nextCursor);
  };

  const handlePreviousPage = () => {
    // Logic to handle previous page
    // For keyset pagination, you might need to keep a stack of previous cursors
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

          <UploadButton buttonName="Upload Kuadran" pathUrl="/admin/kuadran/upload" />
        </div>

        {/* Table */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5"> Data Report </h2>
          <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px]">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-gray-700 bg-gray-50 dark:bg-navy-800">
                <tr>
                  <th scope="col" className="px-6 py-8">
                    No
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Bulan
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Tahun
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Diupload Tanggal
                  </th>
                  <th scope="col" className="px-6 py-8 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-navy-700 text-navy-900 dark:text-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <PageLoading />
                    </td>
                  </tr>
                ) : (
                  dataAllReport.map((item, index) => (
                    <tr key={item.id} className="bg-white border-b dark:bg-navy-700 dark:border-navy-600">
                      <td className="px-6 py-8">{index + 1}</td>
                      <td className="px-6 py-8">{item.bulan}</td>
                      <td className="px-6 py-8">{item.tahun}</td>
                      <td className="px-6 py-8">{item.createdAt}</td>
                      <td className="px-6 py-8 text-center flex justify-center gap-4">
                        <div className="flex items-center justify-between gap-1">
                          <DeleteButton
                            endPointUrl={`/report/${item.id}`}
                            getDataAgain={fetchData}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
              onClick={handlePreviousPage}
              disabled={!cursor || isFetching}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50"
              onClick={handleNextPage}
              disabled={isEndOfData || isFetching}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default KuadranList;
