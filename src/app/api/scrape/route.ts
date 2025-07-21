import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest){
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL não informada" }, { status: 400 });
  }

  try {
    const resp = await fetch(url);
    const html = await resp.text();
    const $ = cheerio.load(html);

    let title = $("title").first().text();

    if (!title){
      const path = new URL(url).pathname;
      const slug = path.split("/").filter(Boolean)[0];
      title = decodeURIComponent(slug.replace(/-/g, " "));
    }

    let image = $("meta[property='og:image']").first().attr("content");

    return NextResponse.json({ title, image });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}