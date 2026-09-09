// Deploy via Supabase Dashboard -> Edge Functions -> Create a new function
// named "delete-user" -> paste this file's contents -> Deploy.
// Uses the same auto-provided secrets as invite-user, nothing extra to set.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")!
    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await callerClient.auth.getUser()
    if (!user) return json({ error: "Not authenticated" }, 401)

    const { data: callerProfile } = await callerClient.from("profiles").select("role").eq("id", user.id).single()
    if (callerProfile?.role !== "admin") return json({ error: "Only admins can remove users" }, 403)

    const { user_id } = await req.json()
    if (!user_id) return json({ error: "user_id is required" }, 400)
    if (user_id === user.id) return json({ error: "You can't delete your own account this way." }, 400)

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Deleting the auth user cascades to profiles, which cascades to
    // students/teachers/student_guardians/login_ids via their foreign keys.
    const { error } = await adminClient.auth.admin.deleteUser(user_id)
    if (error) return json({ error: error.message }, 500)

    return json({ success: true })
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
