"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { use, useEffect, useState } from "react";
import { formatRupiah, formatDate } from "@/utils/date";
import { useRouter, useSearchParams } from "next/navigation";

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
  status?: string;
}

export default function DetailJob() {
  const id = useSearchParams().get("id");
  const supabase = createClientComponentClient();
  const [loker, setLoker] = useState<Loker>();

  useEffect(() => {
    async function fetchLoker() {
      if (id) {
        const { data: loker, error } = await supabase
          .from("loker")
          .select(
            `
            idloker,
            perusahaan: idperusahaan ( nama ),
            nama,
            pendidikan: pendidikan_min ( nama ),
            usia_min,
            usia_max,
            gaji_min,
            gaji_max,
            nama_cp,
            email_cp,
            no_telp_cp,
            tgl_aktif,
            tgl_tutup,
            status
        `
          )
          .eq("idloker", id);

        if (error) {
          console.log(error);
          return;
        }

        if (loker.length > 0) {
          setLoker(loker[0]);
        }
      }
    }

    fetchLoker();
  }, [id]);

  return (
    <div className="p-4 transition-transform transform bg-gray-800 border rounded-lg shadow-md">
      {loker ? (
        <div>
          <div className="mb-2 text-xl font-bold text-white">{loker.nama}</div>
          <div className="text-gray-400">{loker.perusahaan?.[0].nama}</div>
          <div className="text-gray-400">
            Pendidikan minimal: {loker.pendidikan?.[0].nama}
          </div>
          <div className="text-gray-400">
            Gaji: {formatRupiah(loker.gaji_min!)} -{" "}
            {formatRupiah(loker.gaji_max!)}
          </div>
          <div className="text-gray-400">
            Tanggal aktif: {formatDate(loker.tgl_aktif!)}
          </div>
        </div>
      ) : (
        <div className="text-white">Loker tidak ditemukan.</div>
      )}
    </div>
  );
}
