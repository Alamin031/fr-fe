import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/UserModels';
import { hashToken } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connect();

    // Hash the token to compare with stored hash
    const hashedToken = hashToken(token);

    // Find user with matching verification token
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user - mark email as verified
    user.emailVerified = new Date();
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // Redirect to success page
    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
