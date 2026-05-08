import { useState } from "react";
import { Link } from "wouter";
import { Menu, Search, Settings, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/SettingsModal";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-gray-600 hover:text-primary hover:bg-green-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
              <Tv className="h-5 w-5 text-gray-800" />
              <span className="text-gray-800">Movie Khmer</span>
              <span className="text-primary"> TV</span>
            </Link>
          </div>
          
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search dramas..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="sm:hidden text-gray-600 hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-primary hover:bg-green-50"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
