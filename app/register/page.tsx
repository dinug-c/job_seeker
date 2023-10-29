"use client";

import Link from "next/link";
import Messages from "../login/messages";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface Pendidikan {
  id: string;
  nama: string;
}

export default function Register() {
  const supabase = createClientComponentClient();
  const [pendidikanOptions, setPendidikanOptions] = useState<Pendidikan[]>([]);

  useEffect(() => {
    async function fetchPendidikan() {
      const { data: pendidikan, error } = await supabase
        .from("pendidikan")
        .select("id, nama");

      if (error) {
        console.log(error);
        return;
      }
      setPendidikanOptions(pendidikan);
    }

    fetchPendidikan();
  }, []);
  return (
    <div className="flex flex-col justify-center w-full gap-2 px-8 sm:max-w-md">
      <Link
        href="/"
        className="absolute flex items-center px-4 py-2 text-sm no-underline rounded-md left-8 top-8 text-foreground bg-btn-background hover:bg-btn-background-hover group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form
        className="flex flex-col justify-center w-full gap-2 my-20 text-foreground"
        action="/auth/sign-up"
        method="post"
      >
        <label className="text-md" htmlFor="nama">
          Nama
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="nama"
          placeholder="Nama Lengkap"
          required
        />
        <label className="text-md" htmlFor="noktp">
          NIK
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="noktp"
          placeholder="NIK"
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="email"
          placeholder="you@example.com"
          required
        />

        <label className="text-md" htmlFor="pendidikan">
          Pendidikan
        </label>
        <select
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="pendidikan"
          placeholder="Pendidikan"
          required
        >
          {pendidikanOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nama}
            </option>
          ))}
        </select>

        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <label className="text-md" htmlFor="jenisKelamin">
          Jenis Kelamin
        </label>
        <select
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="jenisKelamin"
          placeholder="Jenis Kelamin"
          required
        >
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>

        <label className="text-md" htmlFor="tempatLahir">
          Tempat Lahir
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="tempatLahir"
          placeholder="Tempat Lahir"
          required
        />

        <label className="text-md" htmlFor="tanggalLahir">
          Tanggal Lahir
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          type="date"
          name="tanggalLahir"
          placeholder="Tanggal Lahir"
          required
        />

        <label className="text-md" htmlFor="alamat">
          Alamat
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="alamat"
          placeholder="Alamat"
          required
        />

        <label className="text-md" htmlFor="kota">
          Kota
        </label>
        <select
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="kota"
          placeholder="Kota"
          required
        >
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Surabaya">Surabaya</option>
          <option value="Semarang">Semarang</option>
          <option value="Yogyakarta">Yogyakarta</option>
          <option value="Malang">Malang</option>
          <option value="Bali">Bali</option>
          <option value="Makassar">Makassar</option>
          <option value="Medan">Medan</option>
          <option value="Palembang">Palembang</option>
          <option value="Padang">Padang</option>
        </select>

        <label className="text-md" htmlFor="noTelp">
          No. Telp
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="noTelp"
          type="tel"
          placeholder="No. Telp"
          required
        />
        <label className="text-md" htmlFor="foto">
          Foto
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          type="file"
          name="foto"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const { data, error } = await supabase.storage
                .from("src")
                .upload(`foto/${file.name}`, file);
              if (error) {
                alert(error.message);
              }
            }
          }}
          required
        />

        <label className="text-md" htmlFor="ktp">
          File KTP
        </label>

        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          type="file"
          name="ktp"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const { data, error } = await supabase.storage
                .from("src")
                .upload(`ktp/${file.name}`, file);
              if (error) {
                alert(error.message);
              }
            }
          }}
          required
        />

        <button className="px-4 py-2 mb-2 bg-green-700 rounded-md text-foreground">
          Sign Up
        </button>

        <Messages />
      </form>
    </div>
  );
}
