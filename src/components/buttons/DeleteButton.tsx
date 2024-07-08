import React, { useEffect, useState } from "react";

import { AiOutlineWarning } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";

import toast from "react-hot-toast";
import { Tokens } from "types/token";
import cookie from "js-cookie";

type DeleteButtonProps = {
  endPointUrl: string;
  cardDelete?: boolean;
  getDataAgain: () => void;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({
  endPointUrl,
  cardDelete,
  getDataAgain,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleDelete = async () => {
    setIsLoading(true);
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");
    console.log(`${apiUrl}` + endPointUrl);
    const res = await fetch(`${apiUrl}` + endPointUrl, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.payload.access_token}`,
      },
    });

    const deleteData = await res.json();

    console.log(deleteData);

    if (deleteData.status_code === 200) {
      toast.success("Data Berhasil Dihapus!");
      setTimeout(() => {
        setShowModal(false);
        setIsLoading(false);
        if (getDataAgain) {
          getDataAgain();
        }
      }, 1000);
    } else {
      setIsLoading(false);
      toast.error("Data Gagal Dihapus!");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`p-2 ${
          cardDelete ? "bg-white" : "bg-red-600"
        } rounded-lg cursor-pointer`}>
        <BiTrash
          className={`text-lg ${cardDelete ? "text-red-600" : "text-white"}`}
        />
      </button>
      {showModal && (
        <>
          <div
            tabIndex={-1}
            className={`fixed flex justify-center items-center z-50 md:min-h-screen min-w-screen w-full inset-0 h-full bg-black/50`}>
            <div className="relative flex flex-col max-w-md gap-5 px-3 py-5 mx-2 text-center bg-white rounded-lg md:w-full md:h-auto md:p-6 dark:bg-navy-800">
              <span className="flex justify-center">
                <AiOutlineWarning className="md:w-24 md:h-24 w-[4.5rem] h-[4.5rem] px-4 md:px-5 text-red-600 bg-[#FEE2E2] rounded-full" />
              </span>

              <h3 className="my-5 font-semibold text-gray-900 text-md md:text-lg dark:text-gray-200">
                Kamu yakin ingin menghapus?
              </h3>

              <div className="flex justify-center gap-3 text-center">
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="md:w-32 w-24 text-gray-900  bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-6 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-navy-800 dark:text-gray-200"
                  onClick={() => {
                    setShowModal(false);
                  }}>
                  Batalkan
                </button>

                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="md:w-32 w-24 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm px-6 py-2.5 flex justify-center dark:bg-red-800"
                  onClick={() => handleDelete()}>
                  {isLoading ? "Loading..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DeleteButton;
