'use server'

import { createClient } from '@/lib/supabase/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function logoutAction() {

    const supabase = await createClient()
    let { error } = await supabase.auth.signOut()

    if (error) {
        return error;
    }

    revalidatePath('/', 'layout')
    redirect('/auth/login')
    
}