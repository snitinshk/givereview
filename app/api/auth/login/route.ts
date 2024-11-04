// // Import any necessary libraries (e.g., for database access)
// import { NextResponse } from 'next/server';

// import { cookies } from 'next/headers'
// import supabase from '@/lib/supabase-server';

// export async function POST(request: Request) {

//   try {
//     const cookieStore = cookies()
//     const requestData = await request.json();
//     const { email, password } = requestData
//     let { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     })

//     if (error) {
//       return NextResponse.json(
//         { ...error },
//         { status: error?.status }
//       );
//     } else {
//       cookieStore.set('access_token', data?.session?.access_token as string, {
//         httpOnly: true, // Recommended for security
//         path: '/', // Cookie is available for all paths
//         maxAge: 60 * 60 * 24, // 1 day
//       })
//       return NextResponse.json('Ok',{ status: 200 });
//     }

//   } catch (error) {
//     return NextResponse.json(
//       { status: 500 }
//     );
//   }
// }

// // You can also handle POST, PUT, DELETE, etc.
