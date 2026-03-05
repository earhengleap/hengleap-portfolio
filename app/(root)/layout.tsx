import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#1e1e1e]/60 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
