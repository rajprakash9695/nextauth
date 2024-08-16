import { connectdb } from '@/dbConfig/dbConfig';
import User from '@/models/userModel.js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/helpers/mailer';

connectdb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token, email } = reqBody;
    console.log('🚀 ~ POST ~ token:', token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    console.log('🚀 ~ POST ~ user:', user);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid token',
        },
        { status: 400 }
      );
    }

    console.log('🚀 ~ POST ~ user:', user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    //send verificaction mail
    // await sendEmail({ email, emailType: 'VERIFIED', userId: user._id });

    return NextResponse.json(
      { message: 'Email verified successfully', success: true },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
