'use server'

import { SignInData } from '@/interfaces/user';
import { createClient } from '@/lib/supabase/supabase-server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'


export async function loginAction(signInData: SignInData) {

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(signInData)

    if (error) {
        return error;
    }
    
    revalidatePath('/', 'layout')
    redirect('/admin/clients')
    
}

    // const cookieStore = cookies()
    // cookieStore.set('access_token', data?.session?.access_token as string, {
    //     httpOnly: true, // Recommended for security
    //     path: '/', // Cookie is available for all paths
    //     maxAge: 60 * 60 * 24, // 1 day
    // })