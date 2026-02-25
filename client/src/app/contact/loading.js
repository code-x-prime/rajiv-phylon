import { ResponsiveContainer } from "@/components/ui";

export default function Loading() {
  return (
    <div className="bg-[#ffffff]">
      <div className="py-12 md:py-16 border-b border-[#e5e7eb] bg-[#f8fafc]">
        <ResponsiveContainer>
          <div className="h-10 bg-[#e5e7eb] w-40 animate-pulse" />
          <div className="h-4 bg-[#e5e7eb] w-56 mt-4 animate-pulse" />
        </ResponsiveContainer>
      </div>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-8 bg-[#e5e7eb] w-48 animate-pulse" />
            <div className="h-4 bg-[#e5e7eb] w-full animate-pulse" />
          </div>
          <div className="h-80 bg-[#e5e7eb] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
