"use client";
import React, { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import Link from "next/link";
import cookie from "js-cookie";
import PageLoading from "components/loading/LoadingSkeleton";
import DeleteButton from "components/buttons/DeleteButton";
import UploadButton from "components/buttons/UploadButton";
import { isWindowAvailable } from "utils/navigation";
import { Tokens } from "types/token";
import { KuadranType } from "types/kuadran";

const KuadranList = (props: any) => {
  if (isWindowAvailable()) document.title = "Kuadran List";

  const [dataAllKuadran, setDataAllKuadran] = useState<KuadranType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [cursor, setCursor] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const [isFetching, setIsFetching] = useState(false);
  const [isEndOfData, setIsEndOfData] = useState(false);

  useEffect(() => {
    getAllDataKuadran();
  }, [cursor, limitPerPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching || isEndOfData) return;

    const fetchData = async () => {
      setIsFetching(true);
      const loginData = cookie.get("token");
      const tokenData: Tokens = JSON.parse(loginData || "{}");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kuadran?limit=${limitPerPage}&cursor=${nextCursor}`,
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
        if (res.ok) {
          setDataAllKuadran([...dataAllKuadran, ...data.kuadrans]);
          setNextCursor(data.nextCursor);
          setIsEndOfData(data.kuadrans.length === 0);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isFetching]);

  const getAllDataKuadran = async () => {
    setIsLoading(true);
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kuadran?limit=${limitPerPage}&cursor=${cursor}`,
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
      if (res.ok) {
        setDataAllKuadran(data.kuadrans);
        setNextCursor(data.nextCursor);
      } else {
        console.error("Failed to fetch data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const filteredData = dataAllKuadran.filter(
    (kuadran) =>
      kuadran.kebun.toLowerCase().includes(searchInput.toLowerCase()) ||
      kuadran.afd.toLowerCase().includes(searchInput.toLowerCase())
  );

  const loadMore = () => {
    setCursor(nextCursor);
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
          <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px]">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-gray-700 bg-gray-50 dark:bg-navy-800">
                <tr>
                  <th scope="col" className="px-6 py-8">
                    No
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Kondisi
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Status Umur
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Kebun
                  </th>
                  <th scope="col" className="px-6 py-8">
                    KKL Kebun
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Afd
                  </th>
                  <th scope="col" className="px-6 py-8">
                    Tahun Tanam
                  </th>
                  <th scope="col" className="px-6 py-8 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="border-b border-[#9FA284] border-opacity-20 hover:bg-gray-50">
                    <td colSpan={8} className="px-5 p-7">
                      <PageLoading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredData.length === 0 ? (
                      <tr className="border-b border-[#9FA284] border-opacity-20 font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-navy-900">
                        <td colSpan={8} className="text-center py-7">
                          Tidak ada data
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((kuadran, index) => (
                        <tr
                          key={index}
                          className="border-b py-7 bg-white dark:bg-navy-900 border-opacity-20 hover:bg-gray-50 dark:border-navy-700"
                        >
                          <td className="px-6 py-7">{kuadran.id}</td>
                          <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">
                            {kuadran.kondisi}
                          </td>
                          <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">
                            {kuadran.status_umur}
                          </td>
                          <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">
                            {kuadran.kebun}
                          </td>
                          <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">
                            {kuadran.kkl_kebun}
                          </td>
                          <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">
                            {kuadran.afd}
                          </td>
                          <td className="px-6 py-7 text-gray-900 font-medium dark:text-white">
                            {kuadran.tahun_tanam}
                          </td>
                          <td className="px-6 py-7 text-gray-900 font-medium">
                            <div className="flex items-center justify-between gap-1">
                              <Link
                                href={`/admin/kuadran/view/${kuadran.id}`}
                                legacyBehavior
                              >
                                <a className="p-2 bg-green-600 rounded-lg cursor-pointer">
                                  <TbReportSearch className="text-lg text-white cursor-pointer" />
                                </a>
                              </Link>
                              <Link
                                href={`/admin/kuadran/edit/${kuadran.id}`}
                                legacyBehavior
                              >
                                <a className="p-2 bg-yellow-400 rounded-lg cursor-pointer">
                                  <BiEdit className="text-lg text-white cursor-pointer" />
                                </a>
                              </Link>
                              <DeleteButton
                                endPointUrl={`/kuadran/${kuadran.id}`}
                                getDataAgain={getAllDataKuadran}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </>
                )}
                {isFetching && (
                  <tr className="border-b border-[#9FA284] border-opacity-20 hover:bg-gray-50">
                    <td colSpan={8} className="px-5 p-7">
                      <PageLoading />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-3 mt-8">
          <button
            onClick={() => setCursor(null)}
            disabled={cursor === null}
            className={`${
              cursor === null
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            } relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-gray-200 dark:bg-navy-700 dark:border-navy-700 border border-gray-200 dark:border-navy-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            First
          </button>
          <button
            onClick={loadMore}
            disabled={nextCursor === null || isFetching}
            className={`${
              nextCursor === null || isFetching
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            } relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-gray-200 dark:bg-navy-700 dark:border-navy-700 border border-gray-200 dark:border-navy-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </>
  );
};

export default KuadranList;
