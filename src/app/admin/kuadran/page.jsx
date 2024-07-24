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

const KuadranList = (props) => {
  if (isWindowAvailable()) document.title = "Kuadran List";

  const [dataAllReport, setDataAllReport] = useState([]);
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

  const handleSearch = (event) => {
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
            <Input
              placeholder="Search"
              value={searchInput}
              onChange={handleSearch}
              contentLeft={<svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>}
            />
          </div>
          <UploadButton buttonName="Upload Kuadran" pathUrl="/admin/kuadran/upload" />
        </div>

        {/* Table */}

      </div>
    </>
  );
};

export default KuadranList;
