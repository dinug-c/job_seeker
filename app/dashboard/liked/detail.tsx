"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DetailLiked() {
  const id = "";
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [likedLoker, setLikedLoker] = useState<Record<string, any>[]>([]);
  const supabase = createClientComponentClient();

  const [isLikedLokerFetched, setIsLikedLokerFetched] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { email } = user;

        const { data: penggunaData, error } = await supabase
          .from("pencaker")
          .select("*")
          .eq("email", email);

        if (penggunaData && penggunaData.length > 0) {
          if (penggunaData[0]) {
            const { data, error } = await supabase
              .from("liked_pekerjaan")
              .select(
                `
                        loker: idloker( idloker, nama )
                        `
              )
              .eq("idpencaker", penggunaData[0].noktp);

            if (error) {
              console.log(error);
              return;
            }

            setLikedLoker(data || []);
          }
        }
      }
    }
    fetchUserData();
  }, []);
  return (
    <>
      <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
        Pekerjaan yang anda sukai
      </h2>
      <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg dark:bg-gray-800">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {likedLoker.map((loker, index) => (
              <tr key={loker.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {loker.loker.nama}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/detail?id=${loker.loker.idloker}`}
                    className="inline-block px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-500 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
