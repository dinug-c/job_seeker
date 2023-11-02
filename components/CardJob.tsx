"use client";

import { formatDate, formatRupiah } from "@/utils/date";
import Chip from "@mui/material/Chip";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Loker {
  idloker?: number;
  perusahaan?: {
    nama?: string;
  }[];
  nama?: string;
  pendidikan?: {
    nama?: string;
  }[];
  usia_min?: number;
  usia_max?: number;
  gaji_min?: number;
  gaji_max?: number;
  nama_cp?: string;
  email_cp?: string;
  no_telp_cp?: string;
  tgl_update?: string;
  tgl_aktif?: string;
  tgl_tutup?: string;
  status?: boolean;
}

interface Perusahaan {
  nama?: string;
}

interface Pendidikan {
  nama?: string;
}

export default function CardJob() {
  const supabase = createClientComponentClient();
  const [loker, setLoker] = useState<Loker[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("nama");

  useEffect(() => {
    async function fetchLoker() {
      const { data: loker, error } = await supabase.from("loker").select(`
                        idloker,
                        perusahaan: idperusahaan ( nama ),
                        nama,
                        pendidikan: pendidikan_min ( nama ),
                        usia_min,
                        usia_max,
                        gaji_min,
                        gaji_max,
                        tgl_aktif,
                        status
                `);

      if (error) {
        console.log(error);
        return;
      }

      setLoker(loker);
    }

    fetchLoker();
  }, []);

  const handleSearch = (category: string) => {
    setSearchCategory(category);
  };

  const filteredLoker = loker.filter((loker) => {
    const searchValue = searchTerm.toLowerCase();
    switch (searchCategory) {
      case "nama":
        return loker.nama?.toLowerCase().includes(searchValue);
      case "usia_min":
        return (
          loker.usia_min <= parseInt(searchValue, 10) &&
          loker.usia_max >= parseInt(searchValue, 10)
        );
      case "usia_max":
        return (
          loker.usia_max >= parseInt(searchValue, 10) &&
          loker.usia_min <= parseInt(searchValue, 10)
        );
      case "gaji_min":
        return loker.gaji_min <= parseInt(searchValue, 10) && loker.gaji_max;
      case "gaji_max":
        return loker.gaji_max >= parseInt(searchValue, 10) && loker.gaji_min;
      case "pendidikan":
        return (loker.pendidikan as Pendidikan).nama
          ?.toLowerCase()
          .includes(searchValue);
      default:
        return false;
    }
  });

  return (
    <div>
      <div className="flex justify-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search job"
          className="w-1/2 px-4 py-2 text-white bg-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 text-white bg-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          onChange={(e) => handleSearch(e.target.value)}
        >
          <option value="nama">Nama</option>
          <option value="usia_min">Usia Minimal</option>
          <option value="usia_max">Usia Maksimal</option>
          <option value="gaji_min">Gaji Minimal</option>
          <option value="gaji_max">Gaji Maksimal</option>
          <option value="pendidikan">Tingkat Pendidikan</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredLoker.map((loker) => (
          <div
            key={loker.idloker}
            className="p-4 transition-transform transform bg-gray-800 border rounded-lg shadow-md hover:scale-105"
          >
            <div className="mb-2 text-xl font-bold text-white">
              {loker.nama}
            </div>
            <div className="text-gray-400">
              {(loker.perusahaan as Perusahaan).nama}
            </div>
            <div className="text-gray-400">
              Pendidikan minimal: {(loker.pendidikan as Pendidikan).nama}
            </div>
            <div className="text-gray-400">
              Gaji: {formatRupiah(loker.gaji_min!)} -{" "}
              {formatRupiah(loker.gaji_max!)}
            </div>
            <div className="text-gray-400">
              Tanggal aktif: {formatDate(loker.tgl_aktif!)}
            </div>
            <div className="text-gray-400">
              Status:{" "}
              <Chip
                label={loker.status ? "Terbuka" : "Tutup"}
                style={{
                  backgroundColor: loker.status ? "green" : "red",
                  color: "white",
                }}
              />
            </div>
            <Link href={`/detail?id=${loker.idloker}`}>
              <button className="block px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                Detail
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
