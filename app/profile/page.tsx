import { SiteShell } from '@/components/site-shell'
import { ProfileView } from '@/components/profile-view'

export const metadata = {
  title: 'Профиль — UPG',
}

export default function ProfilePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 pb-10">
        <ProfileView />
      </div>
    </SiteShell>
  )
}
