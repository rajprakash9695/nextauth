import { connectdb } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';

connectdb();

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logout Successfully',
      success: true,
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
