import Link from "next/link";
import { BiCamera, BiHeart } from "react-icons/bi";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-y-5">
        <h1 className="text-2xl font title">Photo Booth</h1>
        <div className="flex flex-row justify-center items-center gap-4">
          <Link href='/photo-booth' className="flex justify-center items-center gap-x-2 bg-white rounded-full px-9 py-3 font-semibold uppercase">
            Start <BiCamera className=""/>
          </Link>
          <button className="p-5 bg-white rounded-full">
            <BiHeart />
          </button>
        </div>
        <p className="text-sm text-slate-200">Version 1.1.0 Visitors last 30 days: <span className="text-white font-semibold">1.03M</span></p>
      </div>
    </div>
  );
}
