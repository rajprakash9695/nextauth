import { connectdb } from '@/dbConfig/dbConfig';
import User from '@/models/userModel.js';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
connectdb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User doesnot exist',
        },
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Check your credentials' },
        {
          status: 400,
        }
      );
    }

    const tokenData = {
      id: user._id,
    };
    //@ts-ignore
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY!, {
      expiresIn: '1d',
    });

    const response = NextResponse.json({
      message: 'Logged in Success',
      success: true,
    });

    response.cookies.set('token ', token, { httpOnly: true });
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
