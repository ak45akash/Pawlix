import { StoreFooter } from "@/components/store/footer";
import { StoreHeader } from "@/components/store/header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StoreHeader />
      <div className="flex-1">{children}</div>
      <StoreFooter />
    </div>
  );
}
