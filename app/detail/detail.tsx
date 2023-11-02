"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { use, useEffect, useState } from "react";
import { formatRupiah, formatDate, calculateAge } from "@/utils/date";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Chip } from "@mui/material";
import Header from "@/components/Header";
import { el, is } from "date-fns/locale";

interface Loker {
  idloker?: number;
  perusahaan?: {
    nama?: string;
  };
  nama?: string;
  pendidikan_min: number;
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
  status?: string;
}

interface Perusahaan {
  nama?: string;
}

interface Pendidikan {
  nama?: string;
}

interface detailProps {
  isLoggedIn: boolean;
}

export default function DetailSection({ isLoggedIn }: detailProps) {
  const id = useSearchParams().get("id");
  const supabase = createClientComponentClient();
  const [loker, setLoker] = useState<Loker>();
  const [jumlahPelamar, setJumlahPelamar] = useState<number>(0);
  const [jumlahSuka, setJumlahSuka] = useState<number>(0);
  const [userData, setUserData] = useState<Record<string, any> | null>(null);

  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const router = useRouter();

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
            pendidikan_min,
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
          const perusahaan: Perusahaan = loker[0].perusahaan! as Perusahaan;
          const pendidikan: Pendidikan = loker[0].pendidikan! as Pendidikan;

          setLoker({
            idloker: loker[0].idloker,
            perusahaan: perusahaan,
            nama: loker[0].nama,
            pendidikan: pendidikan,
            usia_min: loker[0].usia_min,
            pendidikan_min: loker[0].pendidikan_min,
            usia_max: loker[0].usia_max,
            gaji_min: loker[0].gaji_min,
            gaji_max: loker[0].gaji_max,
            nama_cp: loker[0].nama_cp,
            email_cp: loker[0].email_cp,
            no_telp_cp: loker[0].no_telp_cp,
            tgl_aktif: loker[0].tgl_aktif,
            tgl_tutup: loker[0].tgl_tutup,
            status: loker[0].status,
          });
        }
      }
    }

    async function fetchUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Jika pengguna sudah login
        const { email } = user;

        // Cari data pengguna berdasarkan email dari tabel 'pencaker'
        const { data: penggunaData, error } = await supabase
          .from("pencaker")
          .select("*")
          .eq("email", email);

        if (penggunaData && penggunaData.length > 0) {
          setUserData(penggunaData[0]);
        }
      }
    }

    async function fetchJumlahPelamar() {
      if (id) {
        const { data, error } = await supabase
          .from("apply_loker")
          .select("idloker", { count: "exact" })
          .eq("idloker", id);

        if (error) {
          console.log(error);
          return;
        }

        setJumlahPelamar(data!.length || 0);
      }
    }

    async function fetchJumlahSuka() {
      if (id) {
        const { data, error } = await supabase
          .from("liked_pekerjaan")
          .select("idloker", { count: "exact" })
          .eq("idloker", id);

        if (error) {
          console.log(error);
          return;
        }

        setJumlahSuka(data!.length || 0);
      }
    }

    fetchUserData();
    fetchLoker();
    fetchJumlahPelamar();
    fetchJumlahSuka();
  }, [id]);

  async function fetchAppliedJobs() {
    if (userData) {
      const { data, error } = await supabase
        .from("apply_loker")
        .select("idloker")
        .eq("noktp", userData.noktp)
        .eq("idloker", id);

      if (data) {
        setIsApplied(data.length > 0);
      }
    }
  }

  async function fetchLikedJobs() {
    if (userData) {
      const { data, error } = await supabase
        .from("liked_pekerjaan")
        .select("idloker")
        .eq("idpencaker", userData.noktp)
        .eq("idloker", id);

      if (data) {
        setIsLiked(data.length > 0);
      }
    }
  }

  fetchAppliedJobs();
  fetchLikedJobs();

  const handleLike = async () => {
    if (userData) {
      const { error } = await supabase.from("liked_pekerjaan").upsert([
        {
          idloker: loker?.idloker,
          idpencaker: userData.noktp,
        },
      ]);

      if (!error) {
        setJumlahSuka(jumlahSuka + 1);
        alert("Anda berhasil menyukai pekerjaan ini.");
      }
    }
  };

  const handleApply = async () => {
    const eligable =
      userData.id_pendidikan >= loker?.pendidikan_min &&
      calculateAge(userData.tanggal_lahir) >= loker?.usia_min &&
      calculateAge(userData.tanggal_lahir) <= loker?.usia_max &&
      !isApplied;

    if (eligable) {
      try {
        const { error } = await supabase.from("apply_loker").upsert([
          {
            idloker: loker.idloker,
            noktp: userData.noktp,
          },
        ]);

        if (!error) {
          setJumlahPelamar(jumlahPelamar + 1);
          alert("Anda berhasil melamar pekerjaan ini.");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error applying for the job:", error);
      }
    } else {
      alert("Anda tidak memenuhi syarat untuk melamar pekerjaan ini.");
    }
  };

  return (
    <>
      <div className="w-3/4 p-4 mt-10 transition-transform transform bg-gray-800 border rounded-lg shadow-md">
        {loker ? (
          <div>
            <p className="text-xl font-bold">{loker.nama}</p>
            <p>Perusahaan: {loker.perusahaan?.nama}</p>
            <p>Pendidikan Minimal: {loker.pendidikan?.nama}</p>
            <p>Usia Minimal: {loker.usia_min} Tahun</p>
            <p>Usia Maksimal: {loker.usia_max} Tahun</p>
            <p>Gaji Minimal: {formatRupiah(loker.gaji_min!)}</p>
            <p>Gaji Maksimal: {formatRupiah(loker.gaji_max!)}</p>
            <p>Nama CP: {loker.nama_cp}</p>
            <p>Email CP: {loker.email_cp}</p>
            <p>No. Telp CP: {loker.no_telp_cp}</p>
            <p>Tanggal Aktif: {formatDate(loker.tgl_aktif!)}</p>
            <p>Tanggal Tutup: {formatDate(loker.tgl_tutup!)}</p>
            <p>Jumlah Pelamar: {jumlahPelamar}</p>
            <p>Jumlah Suka: {jumlahSuka}</p>
            <Chip
              className="mt-5"
              label={loker.status ? "Terbuka" : "Tutup"}
              style={{
                backgroundColor: loker.status ? "green" : "red",
                color: "white",
              }}
            />
            {isLoggedIn && (
              <div className="flex flex-row gap-4 mt-10">
                <Button
                  className="mt-5"
                  variant="contained"
                  color="primary"
                  disabled={isApplied}
                  onClick={() => {
                    handleApply();
                  }}
                >
                  {" "}
                  Apply{" "}
                </Button>
                <Button
                  disabled={isLiked}
                  onClick={() => {
                    handleLike();
                  }}
                  className="mt-5"
                  variant="contained"
                  color="primary"
                >
                  {" "}
                  Like{" "}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-white">Loker tidak ditemukan.</div>
        )}
      </div>
    </>
  );
}
