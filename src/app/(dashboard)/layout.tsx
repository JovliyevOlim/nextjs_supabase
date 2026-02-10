'use client';

import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useRouter, usePathname} from 'next/navigation';
import Link from 'next/link';
import {LogOut} from 'lucide-react';

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;

    return (
        <div className="min-h-screen bg-white">
            <header className="h-16 border-b border-gray-100 flex items-center bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <nav className="flex gap-6 text-sm font-semibold">
                            <Link href="/invoices"
                                  className={pathname === '/invoices' ? 'text-blue-600' : 'text-gray-400'}>Invoices</Link>
                            <Link href="/orders"
                                  className={pathname === '/orders' ? 'text-blue-600' : 'text-gray-400'}>Orders</Link>
                        </nav>
                    </div>
                    <button onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 text-sm font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg">
                        <LogOut size={16}/> Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {children}
            </main>
        </div>
    );
}