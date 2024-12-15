'use server'

import { createClient } from "@/lib/supabase/supabase-server";

export const updateIndividualAttributes = async (table: string, update: any, condition: any) => {

    const supabase = await createClient()
    const response = await supabase
      .from(table)
      .update(update)
      .eq(condition?.col, condition?.val)
  
    return JSON.stringify(response);
  }