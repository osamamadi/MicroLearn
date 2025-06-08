import dbConnect from "@/app/api/dbconnection";

export async function GET() {
  try {
    await dbConnect();
    return new Response(JSON.stringify({ status: "connected" }), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "failed to connect" }), {
      status: 500,
    });
  }
}
