import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { 
  UploadCloud, 
  Plus, 
  Trash2, 
  Film, 
  Star, 
  Clock, 
  Globe, 
  Type, 
  CheckCircle2,
  Youtube // Added Youtube icon
} from "lucide-react";
import toast from "react-hot-toast";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [voteAverage, setVoteAverage] = useState("");
  const [genres, setGenres] = useState("");
  const [tagline, setTagline] = useState("");
  const [language, setLanguage] = useState("en");
  const [trailer, setTrailer] = useState(""); // NEW STATE FOR TRAILER
  const [runtime, setRuntime] = useState({ hours: "", minutes: "", seconds: "" });

  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [backdrop, setBackdrop] = useState(null);
  const [backdropPreview, setBackdropPreview] = useState(null);

  const [casts, setCasts] = useState([{ name: "", picture: null, preview: null }]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (file, type, index = null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "poster") { setPoster(file); setPosterPreview(url); }
    else if (type === "backdrop") { setBackdrop(file); setBackdropPreview(url); }
    else if (type === "cast") {
      const newCasts = [...casts];
      newCasts[index].picture = file;
      newCasts[index].preview = url;
      setCasts(newCasts);
    }
  };

  const addCast = () => setCasts([...casts, { name: "", picture: null, preview: null }]);
  const removeCast = (index) => setCasts(casts.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!title || !overview || !poster || !backdrop) {
      return toast.error("Title, Overview, Poster, and Backdrop are required!");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("id", uuidv4());
    formData.append("title", title);
    formData.append("overview", overview);
    formData.append("release_date", releaseDate);
    formData.append("vote_average", voteAverage);
    formData.append("tagline", tagline);
    formData.append("original_language", language);
    formData.append("trailer", trailer); // ADDED TRAILER TO FORMDATA
    formData.append("runtime", Number(runtime.hours || 0) * 3600 + Number(runtime.minutes || 0) * 60);
    formData.append("poster", poster);
    formData.append("backdrop", backdrop);
    formData.append("genres", JSON.stringify(genres.split(",").map(g => g.trim())));
    formData.append("casts", JSON.stringify(casts.map(c => ({ name: c.name }))));
    casts.forEach(c => c.picture && formData.append("castImages", c.picture));

    try {
      const res = await axios.post("http://localhost:3000/api/movies/add", formData);
      toast.success("Movie Uploaded Successfully!");
      // Reset logic
      setTitle(""); setOverview(""); setTrailer(""); setPosterPreview(null); setBackdropPreview(null);
    } catch (err) {
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <Film className="text-red-600" size={32} />
          <h1 className="text-3xl font-bold tracking-tight">Add New <span className="text-red-600">Movie</span></h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: FORM FIELDS */}
          <div className="lg:col-span-2 space-y-6 bg-white/5 p-6 rounded-3xl border border-white/10">
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Type size={14}/> Movie Title</label>
                <input className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-red-600 outline-none transition" 
                  placeholder="e.g. Interstellar" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Star size={14}/> Vote Average</label>
                <input className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-red-600 outline-none transition" 
                  placeholder="8.6" value={voteAverage} onChange={e => setVoteAverage(e.target.value)} />
              </div>
            </div>

            {/* --- NEW TRAILER INPUT FIELD --- */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                <Youtube size={14} className="text-red-600"/> YouTube Trailer URL / Key
              </label>
              <input 
                className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-red-600 outline-none transition" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={trailer} 
                onChange={e => setTrailer(e.target.value)} 
              />
              <p className="text-[10px] text-gray-500">Paste the full link or just the 11-character video ID.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Overview</label>
              <textarea rows="4" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-red-600 outline-none transition" 
                placeholder="Write a brief description..." value={overview} onChange={e => setOverview(e.target.value)} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
               <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Clock size={14}/> Runtime (Min)</label>
                <input type="number" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none" 
                  placeholder="120" value={runtime.minutes} onChange={e => setRuntime({...runtime, minutes: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Globe size={14}/> Language</label>
                <select className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none" value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ne">Nepali</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Release Date</label>
                <input type="date" className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none" 
                  value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 mt-4"><Plus size={20} className="text-red-600"/> Cast & Crew</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {casts.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10">
                      {c.preview ? <img src={c.preview} className="w-full h-full object-cover" /> : <UploadCloud size={20} className="absolute inset-0 m-auto opacity-20"/>}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e.target.files[0], "cast", i)} />
                    </div>
                    <input className="bg-transparent border-b border-white/10 flex-1 outline-none text-sm" placeholder="Name" value={c.name} onChange={e => {
                      const n = [...casts]; n[i].name = e.target.value; setCasts(n);
                    }} />
                    <button onClick={() => removeCast(i)} className="text-gray-500 hover:text-red-500 transition"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
              <button onClick={addCast} className="text-xs font-bold text-red-600 hover:underline">+ ADD CAST MEMBER</button>
            </div>
          </div>

          {/* RIGHT: PREVIEWS & UPLOAD */}
          <div className="space-y-6">
            
            {/* POSTER UPLOAD */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Movie Poster</label>
              <div className="relative aspect-[2/3] rounded-3xl overflow-hidden border-2 border-dashed border-white/10 hover:border-red-600/50 transition group">
                {posterPreview ? (
                  <img src={posterPreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud size={48} strokeWidth={1} />
                    <p className="text-xs mt-2">Click to Upload</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e.target.files[0], "poster")} />
              </div>
            </div>

            {/* BACKDROP UPLOAD */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Backdrop Banner</label>
              <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-white/10 hover:border-red-600/50 transition">
                {backdropPreview ? (
                  <img src={backdropPreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud size={32} strokeWidth={1} />
                    <p className="text-xs mt-2">Upload Landscape Image</p>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e.target.files[0], "backdrop")} />
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={uploading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {uploading ? "UPLOADING..." : <><CheckCircle2 /> SAVE MOVIE</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddMovie;