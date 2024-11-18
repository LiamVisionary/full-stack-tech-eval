import { createClient } from "@/app/utils/supabase/server";

async function GET() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("items").select();

  if (error) {
    return new Response(
      JSON.stringify({
        error: true,
        items: null,
        message: "Could not retrieve items. Please refresh and try again.",
      }),
      { status: 500 }
    );
  }

  console.log(items);
  return new Response(
    JSON.stringify({ error: false, items: items, message: "Successfully retrieved items." }),
    { status: 200 }
  );
}

async function POST(request: Request) {
  const supabase = await createClient();
  const reqBody = await request.json();

  const { error } = await supabase
    .from("items")
    .insert({ name: reqBody.name.toLowerCase() });

  if (error) {
    if (error.code == "23505") {
      return new Response(
        JSON.stringify({
          message: "This city has already been added, please try another.",
        }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Unknown error during submission" }),
      { status: 500 }
    );
  } else
    return new Response(
      JSON.stringify({ message: `Successfully added ${reqBody.name}` }),
      { status: 200 }
    );
}

export { GET, POST };
