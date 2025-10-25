import ControlSidebar from "./components/ControlSidebar";
import ControlHeader from "./components/ControlHeader";
import ControlToastProvider from "@/components/control/ControlToastProvider";

export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0c14] text-white min-h-screen">
      <ControlToastProvider />
      <ControlSidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <ControlHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
