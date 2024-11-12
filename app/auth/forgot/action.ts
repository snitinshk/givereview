'use server'

import { createClient } from "@/lib/supabase/supabase-server";

export async function resetPasswordAction(email: string) {

    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.SITE_URL}/auth/reset`
    })
    if (!error) {
        return { error: null }
    } else {
        return { error: 'Error in sending reset password email.' }
    }

}