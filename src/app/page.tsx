"use client";

import GcashModal from "@/components/GcashModal";
import { Gift } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiCamera } from "react-icons/bi";
import { supabase } from "@/lib/supabase";
import type { VisitorRow } from "../types/types";
import { formatCount, formatDate, getRelativeVisitorTime } from "../utils/formatCount";
import Loader from "@/components/Loader";

export default function Home() {
  const [isOpenGcashModal, setIsOpenGcashModal] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [visitor, setVisitor] = useState<VisitorRow | null>(null);
  const [loading, setLoading] = useState(true);
  const hasIncremented = useRef(false);


  useEffect(() => {
    const fetchVisitorCount = async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('id', 1)
        .single<VisitorRow>();
      
      if (data) {
        setVisitor(data);

        if (!hasIncremented.current) {
          hasIncremented.current = true;
          await supabase
            .from('visitors')
            .update({ count: data.count + 1 })
            .eq('id', 1);
        }
      }
    };

    fetchVisitorCount();
  },[])

  // 2. Increment only ONCE
  useEffect(() => {
    const incrementVisitorCount = async () => {
      if (count !== null && !hasIncremented.current) {
        hasIncremented.current = true; // 👈 prevent re-run
        await supabase
          .from("visitors")
          .update({ count: count + 1 })
          .eq("id", 1);
      }
    };

    incrementVisitorCount();
  }, [count]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-visitors')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'visitors' },
        (payload) => {
          const updatedCount = payload.new.count;
          setCount(updatedCount);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false)
  }, 5000)

  return () => clearTimeout(timer)
},[])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen px-4">
      {
        isOpenGcashModal && (
          <GcashModal
            isOpen={isOpenGcashModal}
            onClose={() => setIsOpenGcashModal(false)}
          />
        )
      }
      <div className="flex flex-col justify-center items-center gap-y-5">
        <h1 className="text-center font title">Photo Booth</h1>
        <p className="text-sm text-slate-100 max-w-md border border-zinc-600 rounded-2xl p-5 bg-white/10">
          Your support means the world to me. Even <span className="font-semibold text-white">1 peso</span> is a big help toward continuing my studies.
          Thank you for your kindness! 🙏
        </p>
        <div className="flex flex-row justify-center items-center gap-4">
          <Link href='/photo-booth' className="flex justify-center items-center gap-x-2 bg-[#ACFA17] rounded-full px-9 py-3 font-semibold uppercase hover:bg-slate-200">
            Start <BiCamera className=""/>
          </Link>
          <button onClick={() => setIsOpenGcashModal(true)} className="p-5 cursor-pointer bg-white rounded-full hover:bg-slate-200">
            <Gift className="w-4 h-4 hover:scale-110" />
          </button>
        </div>
        <p className="text-sm text-zinc-400 text-center">
          Version 2.1.0 •{" "}
          <span className="text-white font-semibold">
            {(formatCount(visitor?.count ?? null) || '')
              .replace(/\.0(?=[kMB])/, '')} visitors
          </span>
          {visitor?.updated_at && (
            <span className="block text-xs text-zinc-500 mt-1">
              {getRelativeVisitorTime(visitor.updated_at)}
            </span>
          )}
        </p>

      </div>
    </div>
  );
}
