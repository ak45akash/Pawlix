import { StoreFooter } from "@/components/store/footer";
import { StoreHeader } from "@/components/store/header";
import { StoreMaintenanceGate } from "@/components/store/maintenance-gate";
import { SiteAnnouncementBar } from "@/components/store/site-announcement-bar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreMaintenanceGate>
      <div className="flex min-h-dvh flex-col">
        <SiteAnnouncementBar />
        <StoreHeader />
        <div className="flex-1">{children}</div>
        <StoreFooter />
      </div>
    </StoreMaintenanceGate>
  );
}
