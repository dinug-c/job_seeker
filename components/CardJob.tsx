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
  };
  nama?: string;
  pendidikan?: {
    nama?: string;
  };
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

export default function CardJob() {
  const supabase = createClientComponentClient();
  const [loker, setLoker] = useState<Loker[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      console.log(loker);
      setLoker(loker);
    }

    fetchLoker();
  }, []);

  const filteredLoker = loker.filter(
    (loker) => loker.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search job by name"
          className="w-1/2 px-4 py-2 text-white bg-gray-800 border rounded-lg focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            <div className="text-gray-400">{loker.perusahaan?.nama}</div>
            <div className="text-gray-400">
              Pendidikan minimal: {loker.pendidikan?.nama}
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
