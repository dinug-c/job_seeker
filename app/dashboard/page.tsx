import AuthButton from "@/components/AuthButton";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) window.location.href = "/login";
  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };
  const isSupabaseConnected = canInitSupabaseClient();
  return (
    <div className="flex flex-col items-center flex-1 w-full gap-20">
      <nav className="flex justify-center w-full h-16 border-b border-b-foreground/10">
        <div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex flex-col flex-1 max-w-4xl gap-20 px-3 opacity-0 animate-in">
        <Header />
      </div>
      <div className="flex flex-row gap-10">
        <div className="w-40 h-20 p-4 transition-transform transform bg-gray-800 border rounded-lg shadow-md hover:scale-105">
          <Link href="/dashboard/liked"> Liked Pekerjaan </Link>
        </div>
        <div className="w-40 h-20 p-4 transition-transform transform bg-gray-800 border rounded-lg shadow-md hover:scale-105">
          <Link href="/dashboard/history"> History Apply Pekerjaan </Link>
        </div>
      </div>
      <footer className="flex justify-center w-full p-8 text-xs text-center border-t border-t-foreground/10">
        <p>Built For Web Project PBP</p>
      </footer>
    </div>
  );
}
