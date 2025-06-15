export type VisitorRow = {
  id: number;
  count: number;
  created_at?: string;
  updated_at?: string;
};

export type photoCapturedDataType = {
  image: string;
  filter: string;
  frame: {
    name: string;
    style: string;
  };
};
