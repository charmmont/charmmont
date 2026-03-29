import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PortalIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'practitioner') {
    redirect('/portal/dashboard')
  } else {
    redirect('/portal/my-space')
  }
}
