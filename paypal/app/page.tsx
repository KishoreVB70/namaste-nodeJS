import GenerateAISound from "@/components/AI/GenerateAISound";

// import Dashboard from "@/components/dashboard/Dashboard";
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex justify-center items-center">
        {/* <Dashboard /> */}
        <GenerateAISound />
      </main>
    </div>
  );
}
