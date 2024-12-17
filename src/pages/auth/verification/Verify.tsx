import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BanIcon, ChevronLeftIcon, Loader2Icon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { toast } from 'sonner';
import Loading from '@/components/ui/loading';

const Verify = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token') ?? '';
    const email = queryParams.get('email') ?? '';

    useEffect(() => {
        const verifyRequest = async () => {
            setIsLoading(true);
            try {
                const res = await useFetch(
                    `/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
                    'get'
                );

                if (res.status !== 200) {
                    setError(res.data.message);
                }
            } catch (error: any) {
                setError(error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        }

        verifyRequest();
        return () => {
            setIsLoading(false);
        };
    }, []);

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const res = await useFetch('/auth/verify-email', 'post', { token, email });

            if (res.status === 200) {
                toast.success('Account verified successfully.');
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center w-full bg-gradient-to-br from-[#2A3D43] via-[#40575C] to-[#61878A] text-white">
            <div className="w-full inline-flex items-center justify-between absolute top-0 p-5">
                <p className="text-md text-gray-200 gap-1.5 flex items-end">
                    <Link to="/" className="hover:underline hover:font-semibold transition-all duration-300">
                        <ChevronLeftIcon className="w-5 h-5 inline-block" />
                        Back to Home
                    </Link>
                </p>
            </div>
            {isLoading ? (
                <Loading />
            ) : error ? (
                <div className='text-white flex flex-col items-center justify-center gap-5'>
                    <BanIcon className='w-24 h-24 text-red-500 mx-auto' />
                    <h1 className='text-xl md:text-3xl'>{error}</h1>
                    <Button asChild size='lg' variant='link' className="text-white hover:underline hover:font-semibold transition-all duration-300">
                        <Link to="/register">
                            Register a new account
                        </Link>
                    </Button>
                </div>
            ) : (
                <Card className="w-[400px] md:w-[500px] sm:mx-5 mx-5 border-0 shadow-none">
                    <CardHeader>
                        <img src="/error.svg" alt="logo" className="w-40 h-40 mx-auto" />
                        <CardTitle className="text-2xl text-center text-ellipsis overflow-hidden text-wrap pb-5">
                            Verify your email<br />
                            {queryParams.get('email') && queryParams.get('email')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            type="submit"
                            className="w-full py-6 border border-white transition-all duration-300 text-white hover:bg-white/85 hover:text-black hover:border-transparent"
                            disabled={isLoading}
                            onClick={handleVerify}
                        >
                            {isLoading ? <Loader2Icon className="animate-spin" /> : "Verify Me"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default Verify