import { Link } from "wouter";
import type { Drama } from "@workspace/api-client-react";

interface DramaCardProps {
  drama: Drama;
}

const gradients = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
  "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
];

export function DramaCard({ drama }: DramaCardProps) {
  const gradient = gradients[drama.id % gradients.length];
  
  return (
    <Link href={`/watch/${drama.id}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col border border-gray-100">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
          {drama.posterUrl ? (
            <img src={drama.posterUrl} alt={drama.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div 
              className="absolute inset-0 flex items-center justify-center p-4 text-center group-hover:scale-105 transition-transform duration-500"
              style={{ background: gradient }}
            >
              <span className="text-white/80 font-serif text-xl sm:text-2xl font-medium drop-shadow-md leading-relaxed">
                {drama.titleKh}
              </span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="text-white/80 font-bold text-xs tracking-wider drop-shadow-md bg-black/30 px-1.5 py-0.5 rounded">MKhmerTV</span>
          </div>
          
          {drama.status === "ONGOING" && (
            <div className="absolute top-4 -right-10 z-10 w-36 rotate-45 pointer-events-none text-center py-1 bg-primary text-white text-[10px] font-bold tracking-widest shadow-sm">
              ONGOING
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <div className="bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded shadow-sm font-medium">
              {drama.year}
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <div className="bg-primary text-white text-xs px-2 py-1 rounded shadow-sm font-bold tracking-wide">
              {drama.status === "END" ? `END.${drama.totalEpisodes}` : `EP.${drama.episodes}`}
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {drama.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 mt-auto pt-2">{drama.category}</p>
        </div>
      </div>
    </Link>
  );
}
