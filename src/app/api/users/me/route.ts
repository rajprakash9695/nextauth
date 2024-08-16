import { connectdb } from '@/dbConfig/dbConfig';
import User from '@/models/userModel.js';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connectdb();

export async function GET(req: NextRequest) {
  //extract data from token
  const userId = await getDataFromToken(req);
  const user = await User.findOne({ _id: userId }).select('-password');

  //check if there is no user
  return NextResponse.json({
    message: 'User found',
    data: user,
  });
}
