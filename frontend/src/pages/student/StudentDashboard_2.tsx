import { Avatar, Button, Card, Chip, Input, ProgressBar } from "@heroui/react";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Trophy,
  Settings,
  LogOut,
  MessageSquare,
  Briefcase,
  Search,
  MapPin,
  Target,
  BellDot,
  Zap,
} from "lucide-react";

const cardShadowClass = "shadow-[0_20px_50px_rgba(93,69,253,0.08)] border-none";

export default function StudentDashboard() {
  return (
    <div className="flex h-screen bg-[#5D45FD] p-3 gap-2 overflow-hidden font-sans">

      {/* --- SIDEBAR --- */}
      <aside className="w-20 flex flex-col items-center py-8 gap-10 text-white/50">
        <div className="bg-white/20 p-3 rounded-2xl text-white shadow-xl backdrop-blur-md">
          <Briefcase size={28} />
        </div>

        <nav className="flex flex-col gap-8">
          {[
            { icon: LayoutDashboard, active: true },
            { icon: BookOpen },
            { icon: CalendarCheck },
            { icon: MessageSquare },
            { icon: Trophy },
            { icon: Briefcase },
            { icon: Settings },
          ].map((item, idx) => (
            <div
              key={idx}
              className={
                item.active
                  ? "text-white"
                  : "hover:text-white cursor-pointer transition-colors"
              }
            >
              <item.icon size={24} />
            </div>
          ))}
        </nav>

        <div className="mt-auto">
          <LogOut size={24} className="hover:text-white cursor-pointer" />
        </div>
      </aside>

      {/* --- MAIN CONTAINER --- */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden border-8 border-white/10">

        {/* --- LEFT SECTION --- */}
        <section className="flex-1 p-12 overflow-y-auto border-r border-slate-100">

          {/* HEADER + TABS */}
          <header className="mb-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-black text-slate-800 italic">
                  Hello, Dishant 👋
                </h1>
                <p className="text-slate-400 mt-2 font-medium">
                  B.Tech 3rd Year • Ghaziabad, UP
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  isClearable
                  radius="full"
                  placeholder="Search subject..."
                  startContent={<Search className="text-slate-400" size={18} />}
                  className="max-w-[250px]"
                />
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  className="text-slate-400 bg-slate-100"
                >
                  <BellDot size={20} />
                </Button>
              </div>
            </div>

            {/* 🔥 TABS */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              {[
                { label: "Dashboard", icon: LayoutDashboard, active: true },
                { label: "Timetable", icon: CalendarCheck },
                { label: "Homework", icon: BookOpen },
                { label: "Results", icon: Trophy },
                { label: "Messages", icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                      tab.active
                        ? "bg-white text-[#5D45FD] shadow"
                        : "text-slate-400 hover:bg-white/60"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </header>

          {/* CONTENT */}
          <div className="space-y-10">

            <h2 className="text-2xl font-black text-slate-800">
              Today's course
            </h2>

            {/* COURSE CARD */}
            <Card className={`${cardShadowClass} bg-slate-50/50 rounded-[2.5rem] p-2`}>
              <Card.Content className="flex items-center p-4 gap-6">
                <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center text-4xl">
                  🧬
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-700">
                    Biology Molecular
                  </h3>
                  <div className="text-sm text-slate-400 flex gap-4 mt-2">
                    <p>21 lesson</p>
                    <p>5 assignment</p>
                    <p>312 students</p>
                  </div>
                </div>

                <div className="w-40 px-4 text-right">
                  <span className="text-sm font-bold text-green-500">
                    79%
                  </span>
                  <ProgressBar value={79} radius="full" color="success" size="sm" />
                </div>

                <div className="flex gap-2">
                  <Button radius="full" variant="bordered">Skip</Button>
                  <Button radius="full" color="success">Continue</Button>
                </div>
              </Card.Content>
            </Card>

            {/* CLASS CARD */}
            <h2 className="text-2xl font-black text-slate-800">
              Your class
            </h2>

            <Card className={`${cardShadowClass} bg-amber-50 rounded-[2.5rem] p-4`}>
              <Card.Content className="flex items-center p-4 gap-6">
                <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center text-4xl">
                  🦠
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    Microbiology Society
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Ghaziabad Chapter • B.Tech Batch B1
                  </p>
                </div>

                <Chip color="warning" variant="shadow">
                  Active
                </Chip>
              </Card.Content>
            </Card>

          </div>
        </section>

        {/* --- RIGHT SECTION --- */}
        <section className="w-[420px] bg-slate-50/30 p-12 flex flex-col gap-10">

          {/* PROFILE */}
          <Card className={`${cardShadowClass} rounded-[3rem] p-6 text-center bg-white`}>
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dishant"
              className="w-28 h-28 mx-auto"
            />
            <h3 className="text-2xl font-black mt-4">
              Dishant Pandey
            </h3>
            <div className="text-slate-400 flex justify-center gap-1 mt-2">
              <MapPin size={16}/> Ghaziabad
            </div>
          </Card>

          {/* XP CARD */}
          <Card className={`${cardShadowClass} bg-white p-6 rounded-[2rem] flex items-center gap-4`}>
            <Trophy size={50} color="#fab005"/>
            <div>
              <p className="text-sm text-slate-400">Total XP</p>
              <h4 className="text-3xl font-black text-[#5D45FD]">
                2400 XP
              </h4>
            </div>
          </Card>

        </section>

      </main>
    </div>
  );
}