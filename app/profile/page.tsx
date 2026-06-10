import { SiteShell } from '@/components/site-shell'
import { ProfileView } from '@/components/profile-view'
import { SectionHeading } from '@/components/ui-bits'

export default function ProfilePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading>Profil</SectionHeading>
        <ProfileView />
      </div>
    </SiteShell>
  )
}
