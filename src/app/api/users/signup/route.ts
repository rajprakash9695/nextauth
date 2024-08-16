import { connectdb } from '@/dbConfig/dbConfig';
import User from '@/models/userModel.js';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

connectdb();

export async function POST(req: NextRequest, res: NextResponse) {
  //cgl
  try {
    const reqBody = await req.json();

    console.log('🚀 ~ POST ~ reqBody:', reqBody);

    const { username, email, password } = reqBody;

    //validation

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(8);
    //@ts-ignore
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    console.log('🚀 ~ POST ~ savedUser:', savedUser);

    //send verificaction mail
    await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id });

    return NextResponse.json({
      message: 'User registered successfully',
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
