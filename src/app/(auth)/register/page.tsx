'use client';

import {useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {UserPlus, Mail, Lock, Loader2} from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const {error} = await supabase.auth.signUp({email, password});

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success('Ro\'yxatdan o\'tdingiz! Emailingizni tasdiqlang.');
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-4 text-xl font-bold text-gray-900">Yangi hisob yaratish</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20}/>
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Email manzil"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20}/>
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Parol (min. 6 belgi)"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20}/> : <UserPlus size={20}/>}
                        Ro'yxatdan o'tish
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500">
                    Akkauntingiz bormi? <Link href="/login"
                                              className="text-blue-600 font-bold hover:underline">Kirish</Link>
                </p>
            </div>
        </div>
    );
}