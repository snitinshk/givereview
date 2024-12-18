'use server'

import { createClient } from "@/lib/supabase/supabase-server";
import { getURL } from "@/lib/utils";

export default async function forgotPasswordAction(email: string) {

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}auth/reset`
    })
    console.log(error);
    if (!error) {
        return { error: null }
    } else {
        return { error: 'Error in sending reset password email.' }
    }

}