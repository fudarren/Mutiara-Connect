import { NextResponse } from "next/server";
import { constructionNews } from "@/lib/news";

export function GET() { return NextResponse.json({ data: constructionNews }); }
