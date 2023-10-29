import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const noktp = String(formData.get("noktp"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const nama = String(formData.get("nama"));
  const jenisKelamin = String(formData.get("jenisKelamin"));
  const tanggalLahir = String(formData.get("tanggalLahir"));
  const alamat = String(formData.get("alamat"));
  const tempatLahir = String(formData.get("tempatLahir"));
  const kota = String(formData.get("kota"));
  const noTelp = String(formData.get("noTelp"));
  const foto = String(formData.get("foto"));
  const ktp = String(formData.get("ktp"));
  const idPendidikan = Number(formData.get("pendidikan"));
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Insert data into pencaker table
  const { data: insertData, error: insertError } = await supabase
    .from("pencaker")
    .insert([
      {
        noktp,
        email,
        nama,
        jenis_kelamin: jenisKelamin,
        tanggal_lahir: tanggalLahir,
        alamat,
        tempat_lahir: tempatLahir,
        kota,
        no_telp: noTelp,

        foto: "/foto/" + foto,
        file_ktp: "/ktp/" + ktp,
        id_pendidikan: idPendidikan,
      },
    ]);

  if (insertError) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${insertError.message}}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  // Sign up user
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  });

  if (signUpError) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  );
}
