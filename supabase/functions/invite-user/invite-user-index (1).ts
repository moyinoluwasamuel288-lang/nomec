// Deploy this via Supabase Dashboard -> Edge Functions -> Create a new function
// named "invite-user" -> paste this file's contents -> Deploy.
// Needs two secrets set (Edge Functions -> invite-user -> Secrets):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (SUPABASE_ANON_KEY is auto-provided)

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
    // Step 1: verify the CALLER is a logged-in admin, using their own token.
    // Never trust a "role" field sent in the request body -- always re-check server-side.
    const authHeader = req.headers.get("Authorization")!
    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await callerClient.auth.getUser()
    if (!user) {
      return json({ error: "Not authenticated" }, 401)
    }

    const { data: callerProfile } = await callerClient.from("profiles").select("role").eq("id", user.id).single()
    if (callerProfile?.role !== "admin") {
      return json({ error: "Only admins can invite users" }, 403)
    }

    const body = await req.json()
    const { email, full_name, role, admission_number, class_id, staff_id, link_student_id, relationship, redirect_to } = body

    if (!email || !full_name || !role) {
      return json({ error: "email, full_name, and role are required" }, 400)
    }
    if (!["student", "parent", "teacher", "admin"].includes(role)) {
      return json({ error: "Invalid role" }, 400)
    }

    // Step 2: admin client using the SERVICE ROLE key. This key lives only in this
    // function's server-side secrets -- it is never sent to or reachable from the browser.
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Creates the auth user AND emails them a secure link to set their own password.
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name, role },
      redirectTo: redirect_to || undefined,
    })
    if (inviteError) {
      return json({ error: inviteError.message }, 400)
    }

    const newUserId = inviteData.user.id

    // The on-signup trigger already created a profiles row from the metadata above,
    // but set it explicitly here too in case that trigger is ever changed.
    await adminClient.from("profiles").update({ role, full_name }).eq("id", newUserId)

    // Generate a short login ID like NOMEC202502 (NOMEC + 2-digit year + sequence),
    // so people can sign in with this instead of typing their email.
    const yearSuffix = new Date().getFullYear().toString().slice(-2)
    const { count } = await adminClient.from("login_ids").select("*", { count: "exact", head: true }).like("login_id", `NOMEC${yearSuffix}%`)
    const sequence = String((count || 0) + 1).padStart(2, "0")
    const loginId = `NOMEC${yearSuffix}${sequence}`
    await adminClient.from("login_ids").insert({ login_id: loginId, profile_id: newUserId, email })

    if (role === "student") {
      // If a row with this admission number already exists but has no login
      // attached (orphaned by a previous account deletion), re-link it instead
      // of trying to insert a duplicate. If it's still attached to a live
      // account, refuse and roll back the login we just created for this invite.
      const { data: existing } = await adminClient
        .from("students")
        .select("id, profile_id")
        .eq("admission_number", admission_number)
        .maybeSingle()

      if (existing) {
        if (existing.profile_id) {
          await adminClient.auth.admin.deleteUser(newUserId)
          return json({ error: `Admission number ${admission_number} is already assigned to an active account.` }, 400)
        }
        const { error } = await adminClient.from("students")
          .update({ profile_id: newUserId, full_name, class_id: class_id || null })
          .eq("id", existing.id)
        if (error) return json({ error: `User created, but re-linking the student record failed: ${error.message}` }, 500)
      } else {
        const { error } = await adminClient.from("students").insert({
          profile_id: newUserId,
          admission_number,
          full_name,
          class_id: class_id || null,
        })
        if (error) return json({ error: `User created, but student record failed: ${error.message}` }, 500)
      }
    } else if (role === "teacher") {
      // Same re-link logic, keyed on staff_id instead of admission_number.
      const { data: existing } = await adminClient
        .from("teachers")
        .select("id, profile_id")
        .eq("staff_id", staff_id)
        .maybeSingle()

      if (existing) {
        if (existing.profile_id) {
          await adminClient.auth.admin.deleteUser(newUserId)
          return json({ error: `Staff ID ${staff_id} is already assigned to an active account.` }, 400)
        }
        const { error } = await adminClient.from("teachers")
          .update({ profile_id: newUserId })
          .eq("id", existing.id)
        if (error) return json({ error: `User created, but re-linking the teacher record failed: ${error.message}` }, 500)
      } else {
        const { error } = await adminClient.from("teachers").insert({
          profile_id: newUserId,
          staff_id,
        })
        if (error) return json({ error: `User created, but teacher record failed: ${error.message}` }, 500)
      }
    } else if (role === "parent" && link_student_id) {
      const { error } = await adminClient.from("student_guardians").insert({
        student_id: link_student_id,
        guardian_profile_id: newUserId,
        relationship: relationship || null,
      })
      if (error) return json({ error: `User created, but guardian link failed: ${error.message}` }, 500)
    }

    return json({ success: true, user_id: newUserId, login_id: loginId })
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
