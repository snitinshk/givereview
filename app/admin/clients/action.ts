'use server'

import { ClientDB } from "@/interfaces/clients"
import { createClient } from "@/lib/supabase/supabase-server"


export async function addClient(clientData: ClientDB) {

    const supabase = await createClient()
    const response =  await supabase
        .from('clients')
        .insert([
            clientData,
        ])
        .select()

    return JSON.stringify(response)
}

export async function deleteClient(clientId: number) {
    const supabase = await createClient()
    const response = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        
    return JSON.stringify(response)

}

export const updateClient = async (update: any, condition: any) => {

    const supabase = await createClient()
    const response = await supabase
      .from('clients')
      .update(update)
      .eq(condition?.col, condition?.val)
  
    return JSON.stringify(response);
  }