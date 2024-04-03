import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function QuoteButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, } = await supabase.auth.getUser();

  return (
    <Link 
      href={user ? '/create-job' : '/signup'} 
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Post  
    </Link>
  )
} 