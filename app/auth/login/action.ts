'use server'

import { SignInData } from '@/interfaces/user';
import { createClient } from '@/lib/supabase/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function loginAction(signInData: SignInData) {

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(signInData)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/admin/clients')
}