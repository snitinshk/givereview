'use server'

import { createClient } from "@/lib/supabase/supabase-server";

export async function resetPasswordAction(email: string) {

    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    console.log(error);
    if(!error){
        return 'Reset link sent to email'
    }
    console.log(error);
    // revalidatePath('/', 'layout')
    // redirect('/admin/clients')
    
}