import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import { issueSchema } from "@/app/validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/AuthOptions";


export async function POST(request: NextRequest) {

  const session =await getServerSession(authOptions)

  if(!session)
    return NextResponse.json({},{status:401});
  const body = await request.json();

  // Log incoming data
  console.log("Incoming data:", body);

  const validation = issueSchema.safeParse(body);

  if (!validation.success) {
    // Log validation errors
    console.error("Validation errors:", validation.error.errors);
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newIssue = await prisma.issue.create({
    data: { title: body.title, description: body.description },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
