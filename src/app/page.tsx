"use client";

import GcashModal from "@/components/GcashModal";
import { Gift } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiCamera } from "react-icons/bi";
import { supabase } from "@/lib/supabase";
import type { VisitorRow } from "../types/types";
import { formatCount, formatDate, getRelativeVisitorTime } from "../utils/formatCount";

export default function Home() {
  const [isOpenGcashModal, setIsOpenGcashModal] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [visitor, setVisitor] = useState<VisitorRow | null>(null);
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


  return (
    <div className="flex justify-center items-center h-screen">
      {
        isOpenGcashModal && (
          <GcashModal
            isOpen={isOpenGcashModal}
            onClose={() => setIsOpenGcashModal(false)}
          />
        )
      }
      <div className="flex flex-col justify-center items-center gap-y-5">
        <h1 className="text-2xl font title">Photo Booth</h1>
        <p className="text-sm text-slate-100 max-w-md border border-zinc-600 rounded-2xl p-5 bg-white/10">
          Your support means the world to me. Even <span className="font-semibold text-white">1 peso</span> is a big help toward continuing my studies.
          Thank you for your kindness! 🙏
        </p>
        <div className="flex flex-row justify-center items-center gap-4">
          <Link href='/photo-booth' className="flex justify-center items-center gap-x-2 bg-white rounded-full px-9 py-3 font-semibold uppercase">
            Start <BiCamera className=""/>
          </Link>
          <button onClick={() => setIsOpenGcashModal(true)} className="p-5 cursor-pointer bg-white rounded-full">
            <Gift className="w-4 h-4 hover:scale-110" />
          </button>
        </div>
        <p className="text-sm text-slate-200 text-center">
          Version 1.1.0 •{" "}
          <span className="text-white font-semibold">
            {formatCount(visitor?.count ?? null)} visitors
          </span>
          {visitor?.updated_at && (
            <span className="block text-xs text-slate-400 mt-1">
              {getRelativeVisitorTime(visitor.updated_at)}
            </span>
          )}
        </p>

      </div>
    </div>
  );
}
