'use server'

import { createClient } from "@/lib/supabase/supabase-server";

export default async function resetPasswordAction(password: string, code: string) {
    try {

        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code)

        const response = await supabase.auth.updateUser({
            password
        })
        await supabase.auth.signOut() //canceling the session
        return JSON.stringify(response);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return JSON.stringify(
            { error: errorMessage }
        );
    }
}