import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react"; 

export type Filter = {
  name: string;
  value: string;
  intensity: number;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  color: string;
}

export type VisitorRow = {
  id: number;
  count: number;
  created_at?: string;
  updated_at?: string;
};

export type photoCapturedDataType = {
  id: string;
  image: string;
  filter: string;
  loveWord: string | null;
  mirror: boolean,
  frame: {
    name: string;
    style: string;
    strokeColor: string;
  };
};
