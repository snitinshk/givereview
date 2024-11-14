'use server'

import { SignInData } from '@/interfaces/user';
import { createClient } from '@/lib/supabase/supabase-server'

export async function loginAction(signInData: SignInData) {

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(signInData)
    return error ? true : false;

}