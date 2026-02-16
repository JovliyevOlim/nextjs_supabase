import Link from 'next/link';
import {redirect} from 'next/navigation';
import {LogOut} from 'lucide-react';
import {createClient} from '@/lib/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const logout = async () => {
    'use server';

    const serverClient = await createClient();
    await serverClient.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b border-gray-100 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          <nav className="flex gap-6 text-sm font-semibold">
            <Link href="/invoices" className="text-gray-700 hover:text-blue-600">
              Invoices
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-blue-600">
              Orders
            </Link>
          </nav>

          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold text-red-500 hover:bg-red-50"
            >
              <LogOut size={16}/>
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
