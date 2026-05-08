import { Link } from "wouter";
import { X, Tv, Film, PlayCircle, CheckCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Hong Kong", href: "/category/Hong Kong", icon: Film },
  { name: "Chinese", href: "/category/Chinese", icon: Film },
  { name: "Korean", href: "/category/Korean", icon: Film },
  { name: "Thai", href: "/category/Thai", icon: Film },
  { name: "Ongoing", href: "/category/Ongoing", icon: PlayCircle },
  { name: "Completed", href: "/category/Completed", icon: CheckCircle },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between h-14 px-6 border-b border-gray-100">
              <Link href="/" className="flex items-center gap-1.5 font-bold text-lg tracking-tight" onClick={onClose}>
                <Tv className="h-5 w-5 text-gray-800" />
                <span className="text-gray-800">Movie Khmer</span>
                <span className="text-primary"> TV</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-500 hover:text-gray-900 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="mb-2 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Browse</div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} className="block" onClick={onClose}>
                    <div className="flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-green-50 text-gray-700 hover:text-primary group transition-colors">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
