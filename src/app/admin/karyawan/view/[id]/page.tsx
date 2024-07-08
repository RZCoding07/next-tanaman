"use client";
import React, { useId, useEffect, useState } from "react";
import cookie from "js-cookie";
import { Tokens } from "types/token";
import { useForm, useController, set } from "react-hook-form";
import NavLink from "components/link/NavLink";
import Select from "react-select";
import toast from "react-hot-toast";
import { isWindowAvailable } from "utils/navigation";
import { useRouter } from "next/navigation";

type Data = {
    nkb: string;
    nik: string;
    nik_sap: string;
    nama: string;
    tgl_lahir: string;
    tgl_bekerja: string;
    tgl_mbt: string | null;
    tgl_pensiun: string;
    jenis_kelamin: string;
    bagian: {
        value: string;
        label: string;
    };
    pendidikan: {
        value: string;
        label: string;
    };

    agama: {
        value: string;
        label: string;
    };

    suku: {
        value: string;
        label: string;
    };

    jabatan: {
        value: string;
        label: string;
    };

    job_grade: {
        value: string;
        label: string;
    };

    person_grade: {
        value: string;
        label: string;
    };

    golongan_phdp: {
        value: string;
        label: string;
    };

    golongan_max: {
        value: string;
        label: string;
    };

    suskel: {
        value: string;
        label: string;
    };

    nama_unit: {
        value: string;
        label: string;
    };

    status: {
        value: string;
        label: string;
    };

    keterangan: {
        value: string;
        label: string;
    };

    strata: {
        value: string;
        label: string;
    };


    brm: {
        value: string;
        label: string;
    };
    tgl_diangkat: string;
}

let customStylesSelect = {
    control: (base: {}) => ({
        ...base,
        borderRadius: 10,
        padding: "2px 5px",
        width: "100%",
        border: `1px solid #E5E7EB`,
        "&:hover": {
            borderColor: "#16A34A",
        },
        "@media only screen and (max-width: 767px)": {
            width: "100%",
        },
        // Menambahkan gaya untuk tema gelap
    }),
    // Menyesuaikan gaya untuk opsi yang terpilih
    option: (provided: {}, state: { isSelected: boolean }) => ({
        ...provided,
        color: state.isSelected ? '#000' : '#000', // Mengatur warna teks opsi yang terpilih menjadi hitam dan yang tidak terpilih menjadi putih
        backgroundColor: state.isSelected ? '#fff' : 'transparent', // Mengatur latar belakang opsi yang terpilih menjadi putih dan yang tidak terpilih menjadi transparan
        "&:hover": {
            backgroundColor: '#16A34A', // Mengubah warna latar belakang saat opsi dihover
            color: '#fff', // Mengubah warna teks saat opsi dihover
        },
    }),

    singleValue: (styles, { data }) => ({
        ...styles,
        color: "black",
    }),
};

if (typeof window !== 'undefined' && window.localStorage.getItem('darkmode') === 'true') {
    customStylesSelect = {
        ...customStylesSelect,
        control: (base: {}) => ({
            ...base,
            borderRadius: 10,
            padding: "2px 5px",
            width: "100%",
            border: `1px solid #E5E7EB`,
            "&:hover": {
                borderColor: "#16A34A",
            },
            "@media only screen and (max-width: 767px)": {
                width: "100%",
            },
            backgroundColor: "#1F2937",
            color: "#fff",
        }),
        option: (provided: {}, state: { isSelected: boolean }) => ({
            ...provided,
            color: state.isSelected ? '#000' : '#000',
            backgroundColor: state.isSelected ? '#fff' : 'transparent',
            "&:hover": {
                backgroundColor: '#16A34A',
                color: '#fff',
            },
        }),
        singleValue: (styles, { data }) => ({
            ...styles,
            color: "white",
            zIndex: 9999,
        }),
    };
} else {
    customStylesSelect = {
        ...customStylesSelect,
        control: (base: {}) => ({
            ...base,
            borderRadius: 10,
            padding: "2px 5px",
            width: "100%",
            border: `1px solid #E5E7EB`,
            "&:hover": {
                borderColor: "#16A34A",
            },
            "@media only screen and (max-width: 767px)": {
                width: "100%",
            },
        }),
        option: (provided: {}, state: { isSelected: boolean }) => ({
            ...provided,
            color: state.isSelected ? '#000' : '#000',
            backgroundColor: state.isSelected ? '#fff' : 'transparent',
            "&:hover": {
                backgroundColor: '#16A34A',
                color: '#fff',
            },
        }),
        singleValue: (styles, { data }) => ({
            ...styles,
            color: "black",
            zIndex: 9999,
        }),
    };
}





const EditKaryawan = () => {
    const routeer = useRouter();
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<Data>();

    if (isWindowAvailable()) document.title = "Create User";

    const { field: pendidikanField } = useController({
        name: "pendidikan",
        control,
        rules: { required: true },
    });

    const handlePendidikanSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        pendidikanField.onChange(value);
    };


    const { field: agamaField } = useController({
        name: "agama",
        control,
        rules: { required: true },
    });

    const handleAgamaSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        agamaField.onChange(value);
    };

    const { field: sukuField } = useController({
        name: "suku",
        control,
        rules: { required: true },
    });

    const handleSukuSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        sukuField.onChange(value);
    };

    const { field: bagianField } = useController({
        name: "bagian",
        control,
        rules: { required: true },
    });

    const handleBagianSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        bagianField.onChange(value);
    };

    const { field: jabatanField } = useController({
        name: "jabatan",
        control,
        rules: { required: true },
    });

    const handleJabatanSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        jabatanField.onChange(value);
    };

    const { field: jobGradeField } = useController({
        name: "job_grade",
        control,
        rules: { required: true },
    });

    const handleJobGradeSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        jobGradeField.onChange(value);
    };

    const { field: personGradeField } = useController({
        name: "person_grade",
        control,
        rules: { required: true },
    });

    const handlePersonGradeSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        personGradeField.onChange(value);
    };

    const { field: golonganPhdpField } = useController({
        name: "golongan_phdp",
        control,
        rules: { required: true },
    });

    const handleGolonganPhdpSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        golonganPhdpField.onChange(value);
    };

    const { field: strataField } = useController({
        name: "strata",
        control,
        rules: { required: true },
    });

    const handleStrataSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        strataField.onChange(value);
    };

    const { field: golonganMaxField } = useController({
        name: "golongan_max",
        control,
        rules: { required: true },
    });

    const handleGolonganMaxSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        golonganMaxField.onChange(value);
    };

    const { field: suskelField } = useController({
        name: "suskel",
        control,
        rules: { required: true },
    });

    const handleSuskelSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        suskelField.onChange(value);
    };

    const { field: namaUnitField } = useController({
        name: "nama_unit",
        control,
        rules: { required: true },
    });

    const handleNamaUnitSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        namaUnitField.onChange(value);
    };

    const { field: statusField } = useController({
        name: "status",
        control,
        rules: { required: true },
    });

    const handleStatusSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        statusField.onChange(value);
    };

    const { field: keteranganField } = useController({
        name: "keterangan",
        control,
        rules: { required: true },
    });

    const handleKeteranganSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        keteranganField.onChange(value);
    };

    const { field: brmField } = useController({
        name: "brm",
        control,
        rules: { required: true },
    });

    const handleBrmSelectChange = (
        value: { value: string; label: string } | null
    ) => {
        brmField.onChange(value);
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    const [dataPendidikan, setDataPendidikan] = useState([]);
    const [dataAgama, setDataAgama] = useState([]);
    const [dataSuku, setDataSuku] = useState([]);
    const [dataBagian, setDataBagian] = useState([]);
    const [dataJabatan, setDataJabatan] = useState([]);
    const [dataJobGrade, setDataJobGrade] = useState([]);
    const [dataPersonGrade, setDataPersonGrade] = useState([]);
    const [dataGolonganPhdp, setDataGolonganPhdp] = useState([]);
    const [dataStrata, setDataStrata] = useState([]);
    const [dataGolonganMax, setDataGolonganMax] = useState([]);
    const [dataSuskel, setDataSuskel] = useState([]);
    const [dataNamaUnit, setDataNamaUnit] = useState([]);
    const [dataStatus, setDataStatus] = useState([]);
    const [dataKeterangan, setDataKeterangan] = useState([]);
    const [dataBrm, setDataBrm] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    const getSelectPendidikan = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectpendidikan`,
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
            let pendidikanObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataPendidikan(pendidikanObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectagama

    const getSelectAgama = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectagama`,
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
            let agamaObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataAgama(agamaObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectsuku
    const getSelectSuku = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectsuku`,
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
        console.log(data);

        if (data.status_code === 200) {
            let sukuObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataSuku(sukuObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }
    //selectbagian

    const getSelectBagian = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectbagian`,
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
            let bagianObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataBagian(bagianObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }
    //selectjabatan

    const getSelectJabatan = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectjabatan`,
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
            let jabatanObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataJabatan(jabatanObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }
    //selectjobgrade

    const getSelectJobGrade = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectjobgrade`,
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
            let jobGradeObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label
            }));
            setDataJobGrade(jobGradeObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectpersongrade

    const getSelectPersonGrade = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectpersongrade`,
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
            let personGradeObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataPersonGrade(personGradeObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectgolonganphdp

    const getSelectGolonganPhdp = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectgolonganphdp`,
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
            let golonganPhdpObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataGolonganPhdp(golonganPhdpObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectstrata

    const getSelectStrata = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectstrata`,
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
            let strataObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataStrata(strataObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectgolonganmax

    const getSelectGolonganMax = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectgolonganmax`,
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
            let golonganMaxObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataGolonganMax(golonganMaxObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectsuskel

    const getSelectSuskel = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectsuskel`,
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
            let suskelObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label
            }));
            setDataSuskel(suskelObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectnamaunit

    const getSelectNamaUnit = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectnamaunit`,
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
            let namaUnitObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataNamaUnit(namaUnitObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectstatus

    const getSelectStatus = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectstatus`,
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
            let statusObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataStatus(statusObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectketerangan

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
            let keteranganObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataKeterangan(keteranganObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    //selectbrm

    const getSelectBrm = async () => {
        setIsLoading(true);
        const loginData = cookie.get("token");
        const tokenData = JSON.parse(loginData || "{}");

        const res = await fetch(
            `${apiUrl}/selectbrm`,
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
            let brmObject = data.payload.map((item: any) => ({
                value: item.value,
                label: item.label,
            }));
            setDataBrm(brmObject);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }



    const handleEditKaryawan = async () => {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");
        const res = await fetch(`${apiUrl}/master-data`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${tokenData.payload.access_token}`,
            },
            body: JSON.stringify({
                nkb: watch("nkb"),
                nik: watch("nik"),
                nik_sap: watch("nik_sap"),
                nama: watch("nama"),
                jenis_kelamin: watch("jenis_kelamin"),
                bagian: watch("bagian").value,
                jabatan: watch("jabatan").value,
                job_grade: watch("job_grade").value,
                person_grade: watch("person_grade").value,
                golongan_phdp: watch("golongan_phdp").value,
                strata: watch("strata").value,
                golongan_max: watch("golongan_max").value,
                suskel: watch("suskel").value,
                tgl_lahir: watch("tgl_lahir"),
                tgl_bekerja: watch("tgl_bekerja"),
                tgl_mbt: watch("tgl_mbt"),
                tgl_pensiun: watch("tgl_pensiun"),
                tgl_diangkat: watch("tgl_diangkat"),
                nama_unit: watch("nama_unit").value,
                status: watch("status").value,
                keterangan: watch("keterangan").value,
                brm: watch("brm").value,
            }),
        });

        const data = await res.json();
        if (data.status_code === 201) {
            toast.success("karyawan berhasil ditambahkan!");
            routeer.push("/admin/users");
        } else {
            toast.error("Oops gagal, periksa kembali data!");
        }
    };

    useEffect(() => {
        getSelectPendidikan();
        getSelectAgama();
        getSelectSuku();
        getSelectBagian();
        getSelectJabatan();
        getSelectJobGrade();
        getSelectPersonGrade();
        getSelectGolonganPhdp();
        getSelectStrata();
        getSelectGolonganMax();
        getSelectSuskel();
        getSelectNamaUnit();
        getSelectStatus();
        getSelectKeterangan();
        getSelectBrm();
    }, []);

    return (
        <>
            <div className="w-full p-5 mx-auto mt-10 mb-10 border shadow-xl lg:w-3/4 rounded-2xl dark:bg-navy-800 dark:border-navy-800">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Tambah User
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tambahkan user baru dengan mengisi form di bawah ini.
                </p>
                <hr className="my-5 border-gray-300 dark:border-gray-700" />
                <form onSubmit={handleSubmit(handleEditKaryawan)}>
                    {/*  buat 2 kolom */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                NKB
                            </label>
                            <input
                                {...register("nkb", { required: true })}
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 "
                                placeholder="Input NKB"
                            />
                            {errors.nkb && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">NKB</span>
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                NIK
                            </label>
                            <input
                                {...register("nik", { required: true })}
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                                placeholder="Input NIK"
                            />
                            {errors.nik_sap && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">NIK</span>
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                NIK SAP
                            </label>
                            <input
                                {...register("nik_sap", { required: true })}
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 rounded-lg"
                                placeholder="Input NIK SAP"
                            />
                            {errors.nik_sap && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">NIK SAP</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Nama
                            </label>
                            <input
                                {...register("nama", { required: true })}
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800 "
                                placeholder="Input Nama"
                            />
                            {errors.nama && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Nama</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Jenis Kelamin
                            </label>
                            <select
                                {...register("jenis_kelamin", { required: true })}
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                            {errors.jenis_kelamin && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Jenis Kelamin</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Tanggal Lahir
                            </label>
                            <input
                                {...register("tgl_lahir", { required: true })}
                                type="date"
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                placeholder="Input Tanggal Lahir"
                            />
                            {errors.tgl_lahir && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Tanggal Lahir</span>
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Tanggal Bekerja
                            </label>
                            <input
                                {...register("tgl_bekerja", { required: true })}
                                type="date"
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                placeholder="Input Tanggal Bekerja"
                            />
                            {errors.tgl_bekerja && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Tanggal Bekerja</span>
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Tanggal Diangkat
                            </label>
                            <input
                                {...register("tgl_diangkat", { required: true })}
                                type="date"
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                placeholder="Input Tanggal Diangkat"
                            />
                            {errors.tgl_diangkat && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Tanggal Diangkat</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Tanggal MBT
                            </label>
                            <input
                                {...register("tgl_mbt")}
                                type="date"
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                placeholder="Input Tanggal MBT"
                            />
                            {errors.tgl_mbt && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Tanggal MBT</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Tanggal Pensiun

                            </label>

                            <input
                                {...register("tgl_pensiun", { required: true })}
                                type="date"
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block  w-full p-2.5 dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                placeholder="Input Tanggal Pensiun"

                            />

                            {errors.tgl_pensiun && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Tanggal Pensiun</span>
                                </p>
                            )}


                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Bagian
                            </label>
                            <Select
                                {...bagianField}
                                options={dataBagian}
                                onChange={handleBagianSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Bagian"
                            />

                            {errors.bagian && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Bagian</span>
                                </p>
                            )}

                        </div>


                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Pendidikan

                            </label>

                            <Select
                                {...pendidikanField}
                                options={dataPendidikan}
                                onChange={handlePendidikanSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Pendidikan"

                            />

                            {errors.pendidikan && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Pendidikan</span>
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Agama
                            </label>

                            <Select
                                {...agamaField}
                                options={dataAgama}
                                onChange={handleAgamaSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Agama"

                            />

                            {errors.agama && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Agama</span>
                                </p>
                            )}


                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Suku
                            </label>

                            <Select
                                {...sukuField}
                                options={dataSuku}
                                onChange={handleSukuSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Suku"
                            />

                            {errors.suku && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Suku</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Jabatan
                            </label>

                            <Select
                                {...jabatanField}
                                options={dataJabatan}
                                onChange={handleJabatanSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Jabatan"
                            />

                            {errors.jabatan && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Jabatan</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Job Grade
                            </label>

                            <Select
                                {...jobGradeField}
                                options={dataJobGrade}
                                onChange={handleJobGradeSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Job Grade"

                            />


                            {errors.job_grade && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Job Grade</span>
                                </p>
                            )}
                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Person Grade

                            </label>

                            <Select
                                {...personGradeField}
                                options={dataPersonGrade}
                                onChange={handlePersonGradeSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Person Grade"

                            />

                            {errors.person_grade && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Person Grade</span>
                                </p>
                            )}


                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Golongan PHDP

                            </label>

                            <Select
                                {...golonganPhdpField}
                                options={dataGolonganPhdp}
                                onChange={handleGolonganPhdpSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Golongan PHDP"

                            />

                            {errors.golongan_phdp && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Golongan PHDP</span>
                                </p>
                            )}
                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Strata

                            </label>

                            <Select
                                {...strataField}
                                options={dataStrata}
                                onChange={handleStrataSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Strata"

                            />

                            {errors.strata && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Strata</span>
                                </p>
                            )}


                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Golongan Max

                            </label>

                            <Select
                                {...golonganMaxField}
                                options={dataGolonganMax}
                                onChange={handleGolonganMaxSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Golongan Max"
                            />

                            {errors.golongan_max && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Golongan Max</span>
                                </p>
                            )}


                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Suskel

                            </label>


                            <Select
                                {...suskelField}
                                options={dataSuskel}
                                onChange={handleSuskelSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Suskel"
                            />

                            {errors.suskel && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Suskel</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Nama Unit

                            </label>

                            <Select
                                {...namaUnitField}
                                options={dataNamaUnit}
                                onChange={handleNamaUnitSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Nama Unit"

                            />

                            {errors.nama_unit && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Nama Unit</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Status

                            </label>

                            <Select
                                {...statusField}
                                options={dataStatus}
                                onChange={handleStatusSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Status"

                            />

                            {errors.status && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Status</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Keterangan
                            </label>

                            <Select
                                {...keteranganField}
                                options={dataKeterangan}
                                onChange={handleKeteranganSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih Keterangan"
                            />

                            {errors.keterangan && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">Keterangan</span>
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                BRM

                            </label>

                            <Select
                                {...brmField}
                                options={dataBrm}
                                onChange={handleBrmSelectChange}
                                styles={customStylesSelect}
                                classNamePrefix="dark:bg-navy-900 dark:text-white  dark:border-navy-800dark:text-white dark:border-navy-800"
                                className="dark:bg-navy-900 dark:text-white dark:border-navy-800"
                                menuPortalTarget={document.body}
                                isSearchable={true}
                                placeholder="Pilih BRM"

                            />

                            {errors.brm && (
                                <p className="mt-2 text-xs text-red-600 ">
                                    Mohon isi <span className="font-medium">BRM</span>
                                </p>
                            )}

                        </div>

                    </div>
                </form>
            </div>
        </>
    );
};

export default EditKaryawan;
