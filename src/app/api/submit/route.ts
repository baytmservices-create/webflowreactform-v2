import { NextRequest, NextResponse } from "next/server";
import { TrackClient, RegionUS } from "customerio-node";

const cio = new TrackClient(
  process.env.CUSTOMERIO_SITE_ID!,
  process.env.CUSTOMERIO_API_KEY!,
  { region: RegionUS }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, userType, insuranceType, goal, city, state, industry, employeeCount, phone, comments, referral } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    // Identify (create or update) the person in Customer.io
    await cio.identify(email, {
      email,
      full_name: fullName,
      first_name: fullName.split(" ")[0],
      user_type: userType,
      insurance_type: insuranceType,
      goal,
      city,
      state,
      industry: industry || undefined,
      employee_count: employeeCount || undefined,
      phone,
      comments: comments || undefined,
      referral,
      created_at: Math.floor(Date.now() / 1000),
    });

    // Track the form submission event
    await cio.track(email, {
      name: "form_submitted",
      data: {
        insurance_type: insuranceType,
        user_type: userType,
        referral,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer.io error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
