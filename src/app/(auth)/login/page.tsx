'use client';

import {useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {Mail, Lock, LogIn, Loader2} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const {error} = await supabase.auth.signInWithPassword({email, password});

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Signed in successfully.');
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="mt-4 text-xl font-bold text-gray-900">Sign in</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20}/>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Email address"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20}/>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <LogIn size={20}/>}Sign in
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          No account yet?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
