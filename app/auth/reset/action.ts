'use server'

import { createClient } from "@/lib/supabase/supabase-server";

export default async function resetPasswordAction(password: string, code: string) {
    try {

        if (code && password != null) {
            const supabase = await createClient();
            await supabase.auth.exchangeCodeForSession(code)

            const { error } = await supabase.auth.updateUser({
                password
            })

            return error ? true : false;
        } else {
            return true
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return JSON.stringify(
            { error: errorMessage }
        );
    }
}