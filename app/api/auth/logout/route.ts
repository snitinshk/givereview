// // Import any necessary libraries (e.g., for database access)
// import { NextResponse } from 'next/server';

// import { cookies } from 'next/headers'
// import supabase from '@/lib/supabase-server';

// export async function POST() {

//   try {
//     const cookieStore = cookies()

//     let { error } = await supabase.auth.signOut()

//     if (error) {
//       return NextResponse.json(
//         { ...error },
//         { status: error?.status }
//       );
//     } else {
//       cookieStore.delete('access_token')
//       return NextResponse.json('Ok',{ status: 200 });
//     }

//   } catch (error) {
//     return NextResponse.json(
//       { status: 500 }
//     );
//   }
// }
