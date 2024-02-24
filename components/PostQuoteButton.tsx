import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function QuoteButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, } = await supabase.auth.getUser();

  return (
    <Link 
      href={user ? '/post' : '/login'} 
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Post  
    </Link>
  )
} 